import { IStorageProvider } from "../interfaces/IStorageProvider";

export class InMemoryStorageProvider implements IStorageProvider {
  private storage: Record<string, string> = {};

  async save(key: string, value: string): Promise<void> {
    this.storage[key] = value;
  }

  async retrieve(key: string): Promise<string | undefined> {
    return this.storage[key];
  }

  async list(): Promise<string[]> {
    return Object.keys(this.storage);
  }

  async delete(key: string): Promise<void> {
    delete this.storage[key];
  }
}
