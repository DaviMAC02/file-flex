export interface StorageProvider {
  /** Writes `value` under `key`, replacing any existing file. */
  save(key: string, value: Buffer): Promise<void>;
  /** Returns the file's bytes, or `undefined` if `key` does not exist. */
  retrieve(key: string): Promise<Buffer | undefined>;
  /** Returns every key in the store. */
  list(): Promise<string[]>;
  /** Removes `key`. Does nothing if it does not exist. */
  delete(key: string): Promise<void>;
}

/**
 * Loads a cloud SDK on first use, so users only install the one they need.
 */
export async function loadSdk<T>(pkg: string, provider: string): Promise<T> {
  try {
    return (await import(pkg)) as T;
  } catch (err) {
    if (
      (err as NodeJS.ErrnoException).code === "MODULE_NOT_FOUND" ||
      (err as NodeJS.ErrnoException).code === "ERR_MODULE_NOT_FOUND"
    ) {
      throw new Error(`file-flex: the ${provider} provider needs "${pkg}". Install it with: npm install ${pkg}`);
    }
    throw err;
  }
}
