import type * as Azure from "@azure/storage-blob";
import { loadSdk, StorageProvider } from "./provider";

export class AzureStorageProvider implements StorageProvider {
  private constructor(private container: Azure.ContainerClient) {}

  static async create(connectionString: string, containerName: string): Promise<AzureStorageProvider> {
    const sdk = await loadSdk<typeof Azure>("@azure/storage-blob", "Azure Blob");
    return new AzureStorageProvider(
      sdk.BlobServiceClient.fromConnectionString(connectionString).getContainerClient(containerName),
    );
  }

  async save(key: string, value: Buffer): Promise<void> {
    await this.container.getBlockBlobClient(key).uploadData(value);
  }

  async retrieve(key: string): Promise<Buffer | undefined> {
    try {
      return await this.container.getBlockBlobClient(key).downloadToBuffer();
    } catch (err) {
      if ((err as { statusCode?: number }).statusCode === 404) return undefined;
      throw err;
    }
  }

  async list(): Promise<string[]> {
    const keys: string[] = [];
    for await (const blob of this.container.listBlobsFlat()) keys.push(blob.name);
    return keys;
  }

  async delete(key: string): Promise<void> {
    await this.container.getBlockBlobClient(key).deleteIfExists();
  }
}
