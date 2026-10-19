/**
 * @fileoverview This file is the entry point of the FileFlex SDK.
 * @description It exports all the public classes and functions of the SDK.
 */

import { AwsStorageProvider } from "./providers/storage/implementations/AwsS3.provider";
import { AzureStorageProvider } from "./providers/storage/implementations/AzureBlob.provider";
import { GoogleCloudStorageProvider } from "./providers/storage/implementations/GoogleCloudStorage.provider";
import { LocalStorageProvider } from "./providers/storage/implementations/LocalStorage.provider";
import { IStorageProvider } from "./providers/storage/interfaces/IStorageProvider";
import { FileFlexClientConstructorDto, Provider } from "./types";

export class FileFlexClient {
  private params: FileFlexClientConstructorDto;

  constructor(params: FileFlexClientConstructorDto) {
    this.params = params ?? {};
  }

  private _detectProvider(): Provider {
    const p = this.params;

    if (p.LOCAL) {
      return "LocalStorage";
    }

    if (p.AWS_BUCKET_NAME && p.AWS_ACCESS_KEY && p.AWS_SECRET_ACCESS_KEY) {
      return "AWS";
    }

    if (p.AZURE_CONNECTION_STRING && p.AZURE_CONTAINER_NAME) {
      return "Azure";
    }

    if (p.GOOGLE_CLOUD_PROJECT_ID) {
      return "GoogleCloud";
    }

    throw new Error("No provider found");
  }

  private _provider(): IStorageProvider {
    const p = this.params;

    switch (this._detectProvider()) {
      case "AWS":
        return new AwsStorageProvider(p.AWS_BUCKET_NAME!, p.AWS_ACCESS_KEY!, p.AWS_SECRET_ACCESS_KEY!);
      case "Azure":
        return new AzureStorageProvider(p.AZURE_CONNECTION_STRING!, p.AZURE_CONTAINER_NAME!);
      case "GoogleCloud":
        if (!p.GOOGLE_CLOUD_BUCKET_NAME) {
          throw new Error("GOOGLE_CLOUD_BUCKET_NAME is required");
        }
        return new GoogleCloudStorageProvider(p.GOOGLE_CLOUD_PROJECT_ID!, p.GOOGLE_CLOUD_BUCKET_NAME, p.GOOGLE_CLOUD_KEY_FILENAME);
      case "LocalStorage":
        return new LocalStorageProvider(p.LOCAL_PATH);
    }
  }

  public async upload(fileContent: Buffer, key: string): Promise<void> {
    await this._provider().save(key, fileContent);
  }

  public async download(key: string): Promise<Buffer | undefined> {
    return this._provider().retrieve(key);
  }

  public async delete(key: string): Promise<void> {
    await this._provider().delete(key);
  }

  public async list(): Promise<(string | undefined)[] | undefined> {
    return this._provider().list();
  }
}
