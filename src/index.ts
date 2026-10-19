/**
 * @fileoverview Entry point of the FileFlex SDK.
 */

import { AzureStorageProvider } from "./providers/azure";
import { GoogleCloudStorageProvider } from "./providers/gcs";
import { LocalStorageProvider } from "./providers/local";
import { StorageProvider } from "./providers/provider";
import { S3StorageProvider } from "./providers/s3";

export type Provider = "AWS" | "Azure" | "GoogleCloud" | "LocalStorage";

export type FileFlexOptions = {
  LOCAL?: boolean;
  /** Folder used by the local provider. Defaults to `.file-flex`. */
  LOCAL_PATH?: string;
  AWS_BUCKET_NAME?: string;
  AWS_ACCESS_KEY?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  /** Defaults to the AWS_REGION environment variable, then `us-east-1`. */
  AWS_REGION?: string;
  /** For S3-compatible services such as MinIO, Cloudflare R2 or DigitalOcean Spaces. */
  AWS_ENDPOINT?: string;
  AZURE_CONNECTION_STRING?: string;
  AZURE_CONTAINER_NAME?: string;
  GOOGLE_CLOUD_PROJECT_ID?: string;
  GOOGLE_CLOUD_BUCKET_NAME?: string;
  GOOGLE_CLOUD_KEY_FILENAME?: string;
  /** For emulators or private endpoints, e.g. `http://localhost:4443`. */
  GOOGLE_CLOUD_API_ENDPOINT?: string;
};

/** @deprecated Use `FileFlexOptions`. */
export type FileFlexClientConstructorDto = FileFlexOptions;

export class FileFlexClient {
  readonly provider: Provider;

  private options: FileFlexOptions;

  private instance?: Promise<StorageProvider>;

  constructor(options: FileFlexOptions) {
    this.options = options ?? {};
    this.provider = detectProvider(this.options);
  }

  /** Stores `content` under `key`, replacing any existing file. */
  async upload(content: Buffer, key: string): Promise<void> {
    await (await this.storage()).save(checkKey(key), content);
  }

  /** Returns the file's bytes, or `undefined` if `key` does not exist. */
  async download(key: string): Promise<Buffer | undefined> {
    return (await this.storage()).retrieve(checkKey(key));
  }

  /** Removes `key`. Does nothing if it does not exist. */
  async delete(key: string): Promise<void> {
    await (await this.storage()).delete(checkKey(key));
  }

  /** Returns every key in the store. */
  async list(): Promise<string[]> {
    return (await this.storage()).list();
  }

  private storage(): Promise<StorageProvider> {
    if (!this.instance) {
      this.instance = createProvider(this.provider, this.options);
      // Let a failed setup (e.g. a missing SDK) be retried on the next call.
      this.instance.catch(() => {
        this.instance = undefined;
      });
    }
    return this.instance;
  }
}

function detectProvider(o: FileFlexOptions): Provider {
  if (o.LOCAL) return "LocalStorage";
  if (o.AWS_BUCKET_NAME && o.AWS_ACCESS_KEY && o.AWS_SECRET_ACCESS_KEY) return "AWS";
  if (o.AZURE_CONNECTION_STRING && o.AZURE_CONTAINER_NAME) return "Azure";
  if (o.GOOGLE_CLOUD_PROJECT_ID && o.GOOGLE_CLOUD_BUCKET_NAME) return "GoogleCloud";
  throw new Error(
    "file-flex: no provider configured. Pass LOCAL, the AWS_* options, the AZURE_* options or the GOOGLE_CLOUD_* options.",
  );
}

function createProvider(provider: Provider, o: FileFlexOptions): Promise<StorageProvider> {
  switch (provider) {
    case "AWS":
      return S3StorageProvider.create(
        o.AWS_BUCKET_NAME!,
        o.AWS_ACCESS_KEY!,
        o.AWS_SECRET_ACCESS_KEY!,
        o.AWS_REGION,
        o.AWS_ENDPOINT,
      );
    case "Azure":
      return AzureStorageProvider.create(o.AZURE_CONNECTION_STRING!, o.AZURE_CONTAINER_NAME!);
    case "GoogleCloud":
      return GoogleCloudStorageProvider.create(
        o.GOOGLE_CLOUD_PROJECT_ID!,
        o.GOOGLE_CLOUD_BUCKET_NAME!,
        o.GOOGLE_CLOUD_KEY_FILENAME,
        o.GOOGLE_CLOUD_API_ENDPOINT,
      );
    case "LocalStorage":
      return Promise.resolve(new LocalStorageProvider(o.LOCAL_PATH));
  }
}

function checkKey(key: string): string {
  if (typeof key !== "string" || key.length === 0) {
    throw new Error("file-flex: key must be a non-empty string");
  }
  return key;
}
