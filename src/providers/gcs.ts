import type * as GCS from "@google-cloud/storage";
import { loadSdk, StorageProvider } from "./provider";

export class GoogleCloudStorageProvider implements StorageProvider {
  private constructor(private bucket: GCS.Bucket) {}

  static async create(
    projectId: string,
    bucketName: string,
    keyFilename?: string,
    apiEndpoint?: string,
  ): Promise<GoogleCloudStorageProvider> {
    const sdk = await loadSdk<typeof GCS>("@google-cloud/storage", "Google Cloud Storage");
    const storage = new sdk.Storage({
      projectId,
      ...(keyFilename && { keyFilename }),
      ...(apiEndpoint && { apiEndpoint }),
    });
    return new GoogleCloudStorageProvider(storage.bucket(bucketName));
  }

  async save(key: string, value: Buffer): Promise<void> {
    await this.bucket.file(key).save(value, { resumable: false });
  }

  async retrieve(key: string): Promise<Buffer | undefined> {
    try {
      const [data] = await this.bucket.file(key).download();
      return data;
    } catch (err) {
      if ((err as { code?: number }).code === 404) return undefined;
      throw err;
    }
  }

  async list(): Promise<string[]> {
    const [files] = await this.bucket.getFiles();
    return files.map((file) => file.name);
  }

  async delete(key: string): Promise<void> {
    await this.bucket.file(key).delete({ ignoreNotFound: true });
  }
}
