/**
 * @enum Provider
 * @description Represents the available providers for FileFlex.
 */
export type Provider = "AWS" | "Azure" | "LocalStorage";

/**
 * @interface IFileFlexClient
 */
export interface IFileFlexClient {
  /**
   * @method upload
   * @description Upload a file to a selected provider
   * @param {Buffer} fileContent
   * @param {string} key
   */
  async upload(provider: Provider, fileContent: Buffer, key: string): void;

  /**
   * @method download
   * @description Download a file from a selected provider
   * @param {string} key
   * @returns {Buffer}
   */
  async download(provider: Provider, key: string): Promise<Buffer>;

  /**
   * @method delete
   * @description Delete a file from a selected provider
   * @param {string} key
   */
  async delete(provider: Provider, key: string): Promise<void>;

  /**
   * @method list
   * @description List all files from a selected provider
   * @returns {string[]}
   */
  async list(provider: Provider): Promise<string[]>;
}


export type FileFlexClientConstructorDto = {
  AWS_BUCKET_NAME?: string;
  AWS_ACCESS_KEY?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AZURE_CONNECTION_STRING?: string;
  AZURE_CONTAINER_NAME?: string;
  IN_MEMORY?: boolean;
}