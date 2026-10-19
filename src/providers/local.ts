import { promises as fs } from "fs";
import path from "path";
import { StorageProvider } from "./provider";

export class LocalStorageProvider implements StorageProvider {
  private root: string;

  constructor(root = ".file-flex") {
    this.root = path.resolve(root);
  }

  async save(key: string, value: Buffer): Promise<void> {
    const file = this.resolve(key);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, value);
  }

  async retrieve(key: string): Promise<Buffer | undefined> {
    try {
      return await fs.readFile(this.resolve(key));
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
    await fs.rm(this.resolve(key), { force: true });
  }

  /** Maps a key to a path inside the root, rejecting keys that would escape it. */
  private resolve(key: string): string {
    const file = path.resolve(this.root, key);
    if (!file.startsWith(this.root + path.sep)) {
      throw new Error(`file-flex: invalid key "${key}"`);
    }
    return file;
  }
}
