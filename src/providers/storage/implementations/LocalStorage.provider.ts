import { IStorageProvider } from "../interfaces/IStorageProvider";
import fs from 'fs';

export class LocalStorageProvider implements IStorageProvider {
  private localStorage = 'src/storage/localStorage';
  async save(key: string, value: string): Promise<void> {
    await this._writeFile(key, value);
  }

  async retrieve(key: string): Promise<string | undefined> {
    try {
      return await this._readFile(key);
    } catch (err) {
      return undefined;
    }
  }

  async list(): Promise<string[]> {
    const files = await fs.promises.readdir(this.localStorage);
    return files;
  }

  async delete(key: string): Promise<void> {
    await this._deleteFile(key);
  }

  private async _writeFile(key: string, value: string): Promise<void> {
    await fs.promises.writeFile(`${this.localStorage}/${key}`, value);
  }

  private async _readFile(key: string): Promise<string> {
    return await fs.promises.readFile(`${this.localStorage}/${key}`, 'utf-8');
  }

  private async _deleteFile(key: string): Promise<void> {
    await fs.promises.unlink(`${this.localStorage}/${key}`);
  }
}
