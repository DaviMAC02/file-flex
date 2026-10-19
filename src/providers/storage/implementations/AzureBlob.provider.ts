import { BlobServiceClient } from "@azure/storage-blob";
import { IStorageProvider } from "../interfaces/IStorageProvider";

export class AzureStorageProvider implements IStorageProvider {
  private containerClient;

  constructor(connectionString: string, containerName: string) {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async save(key: string, value: Buffer): Promise<void> {
    await this.containerClient.getBlockBlobClient(key).uploadData(value);
  }

  async retrieve(key: string): Promise<Buffer> {
    return this.containerClient.getBlockBlobClient(key).downloadToBuffer();
  }

  async list(): Promise<(string | undefined)[] | undefined> {
    const blobItems = this.containerClient.listBlobsFlat();
    const keys: string[] = [];
    for await (const blobItem of blobItems) {
      keys.push(blobItem.name);
    }
    return keys;
  }

  async delete(key: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    await blockBlobClient.delete();
  }
}
