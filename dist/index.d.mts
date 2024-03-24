type FileFlexClientConstructorDto = {
  AWS_BUCKET_NAME?: string;
  AWS_ACCESS_KEY?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AZURE_CONNECTION_STRING?: string;
  AZURE_CONTAINER_NAME?: string;
  IN_MEMORY?: boolean;
}

/**
 * @fileoverview This file is the entry point of the FileFlex SDK.
 * @description It exports all the public classes and functions of the SDK.
 */

declare class FileFlexClient {
    private AWS_BUCKET_NAME;
    private AWS_ACCESS_KEY;
    private AWS_SECRET_ACCESS_KEY;
    private AZURE_CONNECTION_STRING;
    private AZURE_CONTAINER_NAME;
    private IN_MEMORY;
    constructor(params: FileFlexClientConstructorDto);
    private _detectProvider;
    upload(fileContent: Buffer, key: string): Promise<void>;
    download(key: string): Promise<string | undefined>;
    delete(key: string): Promise<void>;
    list(): Promise<(string | undefined)[] | undefined>;
}

export { FileFlexClient };
