import type * as S3 from "@aws-sdk/client-s3";
import { loadSdk, StorageProvider } from "./provider";

export class S3StorageProvider implements StorageProvider {
  private constructor(
    private sdk: typeof S3,
    private client: S3.S3Client,
    private bucket: string,
  ) {}

  static async create(
    bucket: string,
    accessKeyId: string,
    secretAccessKey: string,
    region?: string,
    endpoint?: string,
  ): Promise<S3StorageProvider> {
    const sdk = await loadSdk<typeof S3>("@aws-sdk/client-s3", "AWS S3");
    const client = new sdk.S3Client({
      region: region ?? process.env.AWS_REGION ?? "us-east-1",
      credentials: { accessKeyId, secretAccessKey },
      followRegionRedirects: true,
      // S3-compatible services (MinIO, Cloudflare R2, DigitalOcean Spaces) need a custom endpoint and path-style URLs.
      ...(endpoint && { endpoint, forcePathStyle: true }),
    });
    return new S3StorageProvider(sdk, client, bucket);
  }

  async save(key: string, value: Buffer): Promise<void> {
    await this.client.send(new this.sdk.PutObjectCommand({ Bucket: this.bucket, Key: key, Body: value }));
  }

  async retrieve(key: string): Promise<Buffer | undefined> {
    try {
      const res = await this.client.send(new this.sdk.GetObjectCommand({ Bucket: this.bucket, Key: key }));
      return res.Body ? Buffer.from(await res.Body.transformToByteArray()) : Buffer.alloc(0);
    } catch (err) {
      if (err instanceof this.sdk.NoSuchKey) return undefined;
      throw err;
    }
  }

  async list(): Promise<string[]> {
    const keys: string[] = [];
    for await (const page of this.sdk.paginateListObjectsV2({ client: this.client }, { Bucket: this.bucket })) {
      for (const obj of page.Contents ?? []) if (obj.Key) keys.push(obj.Key);
    }
    return keys;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new this.sdk.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
