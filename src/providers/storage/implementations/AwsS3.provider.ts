import * as AWS from "aws-sdk";
import { S3 } from "aws-sdk";
import { IStorageProvider } from "../interfaces/IStorageProvider";

export class AwsStorageProvider implements IStorageProvider {
  private s3: S3;
  private bucketName: string;

  constructor(bucketName: string, accessKey: string, secretAccessKey: string) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey,
      },
    })
    this.bucketName = bucketName;
  }

  async save(key: string, value: string): Promise<void> {
    await this.s3
      .putObject({
        Bucket: this.bucketName,
        Key: key,
        Body: value,
      })
      .promise();
  }

  async retrieve(key: string): Promise<string | undefined> {
    const data = await this.s3
      .getObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise();

    return data?.Body?.toString();
  }

  async list(): Promise<(string | undefined)[] | undefined> {
    const data = await this.s3
      .listObjectsV2({
        Bucket: this.bucketName,
      })
      .promise();

    return data.Contents?.map((content) => content.Key) || [];
  }

  async delete(key: string): Promise<void> {
    await this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: key,
      })
      .promise();
  }
}
