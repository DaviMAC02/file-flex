import { IStorageProvider } from "../interfaces/IStorageProvider";
import fs from 'fs';

export class LocalStorageProvider implements IStorageProvider {
  constructor(private localStorage: string = '.file-flex') {}

  async save(key: string, value: Buffer): Promise<void> {
    await this._writeFile(key, value);
  }

  async retrieve(key: string): Promise<Buffer | undefined> {
    try {
      return await this._readFile(key);
    } catch (err) {
      return undefined;
    }
  }

  async list(): Promise<string[]> {
    await fs.promises.mkdir(this.localStorage, { recursive: true });
    return fs.promises.readdir(this.localStorage);
  }

  async delete(key: string): Promise<void> {
    await this._deleteFile(key);
  }

  private async _writeFile(key: string, value: Buffer): Promise<void> {
    await fs.promises.mkdir(this.localStorage, { recursive: true });
    await fs.promises.writeFile(`${this.localStorage}/${key}`, value);
  }

  private async _readFile(key: string): Promise<Buffer> {
    return await fs.promises.readFile(`${this.localStorage}/${key}`);
  }

  private async _deleteFile(key: string): Promise<void> {
    await fs.promises.unlink(`${this.localStorage}/${key}`);
  }
}
