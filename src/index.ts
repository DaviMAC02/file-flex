/**
 * @fileoverview This file is the entry point of the FileFlex SDK.
 * @description It exports all the public classes and functions of the SDK.
 */

import { AwsStorageProvider } from "./providers/storage/implementations/AwsS3.provider";
import { AzureStorageProvider } from "./providers/storage/implementations/AzureBlob.provider";
import { GcpStorageProvider } from "./providers/storage/implementations/GCP.provider";
import { InMemoryStorageProvider } from "./providers/storage/implementations/InMemory.provider";
import { FileFlexClientConstructorDto, Provider } from "./types";

export default class FileFlexClient {
  private AWS_BUCKET_NAME;

  private AZURE_CONNECTION_STRING;

  private AZURE_CONTAINER_NAME;

  private GCP_BUCKET_NAME;

  private IN_MEMORY;

  constructor(params: FileFlexClientConstructorDto) {
    this.AWS_BUCKET_NAME = params?.AWS_BUCKET_NAME;
    this.AZURE_CONNECTION_STRING = params?.AZURE_CONNECTION_STRING;
    this.AZURE_CONTAINER_NAME = params?.AZURE_CONTAINER_NAME;
    this.GCP_BUCKET_NAME = params?.GCP_BUCKET_NAME;
    this.IN_MEMORY = params?.IN_MEMORY;
  }

  private _detectProvider(): Provider {

    if(this.IN_MEMORY) {
      return "InMemory"
    }

    if (this.AWS_BUCKET_NAME) {
      return "AWS"
    }

    if (this.AZURE_CONNECTION_STRING && this.AZURE_CONTAINER_NAME) {
      return "Azure"
    }

    if (this.GCP_BUCKET_NAME) {
      return "GCP"
    }


    throw new Error("No provider found");
  }

  public async upload(fileContent: Buffer, key: string): Promise<void> {
    const provider = this._detectProvider();

    switch (provider) {
      case "AWS":
        if(!this.AWS_BUCKET_NAME) {
          throw new Error("AWS_BUCKET_NAME is required");
        }

        const awsProvider = new AwsStorageProvider(this.AWS_BUCKET_NAME!);

        await awsProvider.save(key, fileContent.toString());
        break;
      case "Azure":
        if(!this.AZURE_CONNECTION_STRING || !this.AZURE_CONTAINER_NAME) {
          throw new Error("AZURE_CONNECTION_STRING and AZURE_CONTAINER_NAME are required");
        }

        const azureProvider = new AzureStorageProvider(this.AZURE_CONNECTION_STRING!, this.AZURE_CONTAINER_NAME!);

        await azureProvider.save(key, fileContent.toString());
        break;
      case "GCP":
        if(!this.GCP_BUCKET_NAME) {
          throw new Error("GCP_BUCKET_NAME is required");
        }

        const gcpProvider = new GcpStorageProvider(this.GCP_BUCKET_NAME!);

        await gcpProvider.save(key, fileContent.toString());
        break;
      case "InMemory":
        if(!this.IN_MEMORY) {
          throw new Error("IN_MEMORY must be true");
        }

        const inMemoryProvider = new InMemoryStorageProvider();

        await inMemoryProvider.save(key, fileContent.toString());
        break;
    }
  }

}
