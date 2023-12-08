/**
 * @enum Provider
 * @description Represents the available providers for FileFlex.
 */
export enum Provider {
  AWS,
  Azure,
}

/**
 * @interface IFileFlexClient
 */
export interface IFileFlexClient {
  /**
   * @method upload
   * @description Upload a file to a selected provider
   * @param {Provider} provider
   * @param {Buffer} fileContent
   */
  upload(provider: Provider, fileContent: Buffer): Promise<string>;
}
