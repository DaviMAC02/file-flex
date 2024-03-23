import { Storage } from "@google-cloud/storage";
import { IStorageProvider } from "../interfaces/IStorageProvider";

export class GcpStorageProvider implements IStorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor(bucketName: string) {
    this.storage = new Storage();
    this.bucketName = bucketName;
  }

  async save(key: string, value: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(key);
    await file.save(value);
  }

  async retrieve(key: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(key);
    const data = await file.download();
    return data.toString();
  }

  async list(): Promise<(string | undefined)[] | undefined> {
    const bucket = this.storage.bucket(this.bucketName);
    const [files] = await bucket.getFiles();
    return files.map((file) => file.name);
  }

  async delete(key: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(key);
    await file.delete();
  }
}
