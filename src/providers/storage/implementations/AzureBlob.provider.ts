import { BlobServiceClient } from "@azure/storage-blob";
import { IStorageProvider } from "../interfaces/IStorageProvider";

export class AzureStorageProvider implements IStorageProvider {
  private containerClient;

  constructor(connectionString: string, containerName: string) {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async save(key: string, value: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    await blockBlobClient.upload(value, value.length);
  }

  async retrieve(key: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(key);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const data = await streamToString(
      downloadBlockBlobResponse.readableStreamBody
    );
    return data;
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

async function streamToString(
  readableStream: NodeJS.ReadableStream | undefined
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    readableStream?.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream?.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream?.on("error", reject);
  });
}
