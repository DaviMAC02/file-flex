import { Storage } from "@google-cloud/storage";
import { IStorageProvider } from "../interfaces/IStorageProvider";

export class GoogleCloudStorageProvider implements IStorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor(projectId: string, bucketName: string) {
    this.storage = new Storage({ projectId });
    this.bucketName = bucketName;
  }

  async save(key: string, value: string): Promise<void> {
    await this.storage
      .bucket(this.bucketName)
      .file(key)
      .save(value);
  }
  async retrieve(key: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async list(): Promise<(string | undefined)[] | undefined> {
    throw new Error("Method not implemented.");
  }
  async delete(key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}