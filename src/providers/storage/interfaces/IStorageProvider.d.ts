export interface IStorageProvider {
  save(key: string, value: Buffer): Promise<void>;
  retrieve(key: string): Promise<Buffer | undefined>;
  list(): Promise<(string | undefined)[] | undefined>;
  delete(key: string): Promise<void>;
}
