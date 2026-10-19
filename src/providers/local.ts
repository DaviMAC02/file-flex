import { promises as fs } from "fs";
import path from "path";
import { StorageProvider } from "./provider";

export class LocalStorageProvider implements StorageProvider {
  private root: string;

  constructor(root = ".file-flex") {
    this.root = path.resolve(root);
  }

  async save(key: string, value: Buffer): Promise<void> {
    const file = await this.resolve(key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, value);
  }

  async retrieve(key: string): Promise<Buffer | undefined> {
    try {
      return await fs.readFile(await this.resolve(key));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw err;
    }
  }

  async list(): Promise<string[]> {
    const keys: string[] = [];
    const walk = async (dir: string): Promise<void> => {
      for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else keys.push(path.relative(this.root, full).split(path.sep).join("/"));
      }
    };
    try {
      await walk(this.root);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
    return keys;
  }

  async delete(key: string): Promise<void> {
    await fs.rm(await this.resolve(key), { force: true });
  }

  /**
   * Maps a key to a path inside the root, rejecting keys that would escape it,
   * including through a symlink placed inside the root.
   */
  private async resolve(key: string): Promise<string> {
    const file = path.resolve(this.root, key);
    const realRoot = await realpathOfExisting(this.root);
    const realFile = await realpathOfExisting(file);
    if (!file.startsWith(this.root + path.sep) || !realFile.startsWith(realRoot + path.sep)) {
      throw new Error(`file-flex: invalid key "${key}"`);
    }
    return file;
  }
}

/** Resolves symlinks in the part of `p` that exists, keeping the not-yet-created rest as is. */
async function realpathOfExisting(p: string): Promise<string> {
  const missing: string[] = [];
  let current = p;
  for (;;) {
    try {
      return path.join(await fs.realpath(current), ...missing);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      const parent = path.dirname(current);
      if (parent === current) return p;
      missing.unshift(path.basename(current));
      current = parent;
    }
  }
}
