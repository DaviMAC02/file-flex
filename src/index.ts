/**
 * @fileoverview This file is the entry point of the FileFlex SDK.
 * @description It exports all the public classes and functions of the SDK.
 */

export default class FileFlexClient {
  private AWS_ACCESS_KEY_ID;

  private AWS_SECRET_ACCESS_KEY;

  constructor(AWS_ACCESS_KEY_ID: string, AWS_SECRET_ACCESS_KEY: string) {
    this.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
    this.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;
  }
}
