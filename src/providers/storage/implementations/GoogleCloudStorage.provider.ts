import { Storage } from "@google-cloud/storage";
import { IStorageProvider } from "../interfaces/IStorageProvider";

export class GoogleCloudStorageProvider implements IStorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor(projectId: string, bucketName: string, keyFilename: string = "") {
    this.storage = new Storage({ projectId, ...keyFilename && { keyFilename } });
    this.bucketName = bucketName;
  }

  async save(key: string, value: string): Promise<void> {
    await this.storage
      .bucket(this.bucketName)
      .file(key)
      .save(value);
  }
  async retrieve(key: string): Promise<string> {
    const data = await this.storage
      .bucket(this.bucketName)
      .file(key)
      .download();
    return data.toString();
  }
  async list(): Promise<(string | undefined)[] | undefined> {
    const data = await this.storage
      .bucket(this.bucketName)
      .getFiles();

    return data[0].map((file) => file.name) || [];
  }
  async delete(key: string): Promise<void> {
    await this.storage
      .bucket(this.bucketName)
      .file(key)
      .delete();
  }
}