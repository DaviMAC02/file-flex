/**
 * @fileoverview This file is the entry point of the FileFlex SDK.
 * @description It exports all the public classes and functions of the SDK.
 */

import { AwsStorageProvider } from "./providers/storage/implementations/AwsS3.provider";
import { AzureStorageProvider } from "./providers/storage/implementations/AzureBlob.provider";
import { LocalStorageProvider } from "./providers/storage/implementations/LocalStorage.provider";
import { FileFlexClientConstructorDto, Provider } from "./types";

export class FileFlexClient {
  private AWS_BUCKET_NAME;

  private AWS_ACCESS_KEY;

  private AWS_SECRET_ACCESS_KEY;

  private AZURE_CONNECTION_STRING;

  private AZURE_CONTAINER_NAME;

  private IN_MEMORY;

  constructor(params: FileFlexClientConstructorDto) {
    this.AWS_BUCKET_NAME = params?.AWS_BUCKET_NAME;
    this.AWS_ACCESS_KEY = params?.AWS_ACCESS_KEY;
    this.AWS_SECRET_ACCESS_KEY = params?.AWS_SECRET_ACCESS_KEY;
    this.AZURE_CONNECTION_STRING = params?.AZURE_CONNECTION_STRING;
    this.AZURE_CONTAINER_NAME = params?.AZURE_CONTAINER_NAME;
    this.IN_MEMORY = params?.IN_MEMORY;
  }

  private _detectProvider(): Provider {
    if (this.IN_MEMORY) {
      return "LocalStorage";
    }

    if (this.AWS_BUCKET_NAME && this.AWS_ACCESS_KEY && this.AWS_SECRET_ACCESS_KEY) {
      return "AWS";
    }

    if (this.AZURE_CONNECTION_STRING && this.AZURE_CONTAINER_NAME) {
      return "Azure";
    }

    throw new Error("No provider found");
  }

  public async upload(fileContent: Buffer, key: string): Promise<void> {
    const provider = this._detectProvider();

    switch (provider) {
      case "AWS":
        if (!this.AWS_BUCKET_NAME) {
          throw new Error("AWS_BUCKET_NAME is required");
        }

        const awsProvider = new AwsStorageProvider(this.AWS_BUCKET_NAME!, this.AWS_ACCESS_KEY!, this.AWS_SECRET_ACCESS_KEY!);

        await awsProvider.save(key, fileContent.toString());
        break;
      case "Azure":
        if (!this.AZURE_CONNECTION_STRING || !this.AZURE_CONTAINER_NAME) {
          throw new Error(
            "AZURE_CONNECTION_STRING and AZURE_CONTAINER_NAME are required"
          );
        }

        const azureProvider = new AzureStorageProvider(
          this.AZURE_CONNECTION_STRING!,
          this.AZURE_CONTAINER_NAME!
        );

        await azureProvider.save(key, fileContent.toString());
        break;
      case "LocalStorage":
        if (!this.IN_MEMORY) {
          throw new Error("IN_MEMORY must be true");
        }

        const localStorageProvider = new LocalStorageProvider();
        await localStorageProvider.save(key, fileContent.toString());
        break;
    }
  }

  public async download(key: string): Promise<string | undefined> {
    const provider = this._detectProvider();

    switch (provider) {
      case "AWS":
        if (!this.AWS_BUCKET_NAME) {
          throw new Error("AWS_BUCKET_NAME is required");
        }

        const awsProvider = new AwsStorageProvider(this.AWS_BUCKET_NAME!, this.AWS_ACCESS_KEY!, this.AWS_SECRET_ACCESS_KEY!);

        return await awsProvider.retrieve(key);
      case "Azure":
        if (!this.AZURE_CONNECTION_STRING || !this.AZURE_CONTAINER_NAME) {
          throw new Error(
            "AZURE_CONNECTION_STRING and AZURE_CONTAINER_NAME are required"
          );
        }

        const azureProvider = new AzureStorageProvider(
          this.AZURE_CONNECTION_STRING!,
          this.AZURE_CONTAINER_NAME!
        );

        return await azureProvider.retrieve(key);
      case "LocalStorage":
        if (!this.IN_MEMORY) {
          throw new Error("IN_MEMORY must be true");
        }

        const localStorageProvider = new LocalStorageProvider();

        return await localStorageProvider.retrieve(key);
    }
  }

  public async delete(key: string): Promise<void> {
    const provider = this._detectProvider();

    switch (provider) {
      case "AWS":
        if (!this.AWS_BUCKET_NAME) {
          throw new Error("AWS_BUCKET_NAME is required");
        }

        const awsProvider = new AwsStorageProvider(this.AWS_BUCKET_NAME!, this.AWS_ACCESS_KEY!, this.AWS_SECRET_ACCESS_KEY!);

        await awsProvider.delete(key);
        break;
      case "Azure":
        if (!this.AZURE_CONNECTION_STRING || !this.AZURE_CONTAINER_NAME) {
          throw new Error(
            "AZURE_CONNECTION_STRING and AZURE_CONTAINER_NAME are required"
          );
        }

        const azureProvider = new AzureStorageProvider(
          this.AZURE_CONNECTION_STRING!,
          this.AZURE_CONTAINER_NAME!
        );

        await azureProvider.delete(key);
        break;
      case "LocalStorage":
        if (!this.IN_MEMORY) {
          throw new Error("IN_MEMORY must be true");
        }

        const localStorageProvider = new LocalStorageProvider();

        await localStorageProvider.delete(key);
        break;
    }
  }

  public async list(): Promise<(string | undefined)[] | undefined> {
    const provider = this._detectProvider();

    switch (provider) {
      case "AWS":
        if (!this.AWS_BUCKET_NAME) {
          throw new Error("AWS_BUCKET_NAME is required");
        }

        const awsProvider = new AwsStorageProvider(this.AWS_BUCKET_NAME!, this.AWS_ACCESS_KEY!, this.AWS_SECRET_ACCESS_KEY!);

        return await awsProvider.list();
      case "Azure":
        if (!this.AZURE_CONNECTION_STRING || !this.AZURE_CONTAINER_NAME) {
          throw new Error(
            "AZURE_CONNECTION_STRING and AZURE_CONTAINER_NAME are required"
          );
        }

        const azureProvider = new AzureStorageProvider(
          this.AZURE_CONNECTION_STRING!,
          this.AZURE_CONTAINER_NAME!
        );

        return await azureProvider.list();
      case "LocalStorage":
        if (!this.IN_MEMORY) {
          throw new Error("IN_MEMORY must be true");
        }

        const localStorageProvider = new LocalStorageProvider();

        return await localStorageProvider.list();
    }
  }
}
