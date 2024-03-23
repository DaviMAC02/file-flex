export interface IStorageProvider {
  save(key: string, value: string): Promise<void>;
  retrieve(key: string): Promise<string | undefined>;
  list(): Promise<(string | undefined)[] | undefined>;
  delete(key: string): Promise<void>;
}
