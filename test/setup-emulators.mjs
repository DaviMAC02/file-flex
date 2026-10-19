// Creates the test bucket in each local emulator. Used by CI, and locally via `npm run test:emulators`.
import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { BlobServiceClient } from "@azure/storage-blob";

const bucket = "file-flex-test";

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: process.env.AWS_ENDPOINT,
  forcePathStyle: true,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
});
await s3.send(new CreateBucketCommand({ Bucket: bucket })).catch((err) => {
  if (err.name !== "BucketAlreadyOwnedByYou") throw err;
});

await BlobServiceClient.fromConnectionString(process.env.AZURE_CONNECTION_STRING)
  .getContainerClient(bucket)
  .createIfNotExists();

const res = await fetch(
  `${process.env.GOOGLE_CLOUD_API_ENDPOINT}/storage/v1/b?project=${process.env.GOOGLE_CLOUD_PROJECT_ID}`,
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: bucket }),
  },
);
if (!res.ok && res.status !== 409) throw new Error(`GCS emulator: ${res.status} ${await res.text()}`);

console.log("Emulator buckets ready");
