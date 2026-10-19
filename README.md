# file-flex

[![npm](https://img.shields.io/npm/v/file-flex)](https://www.npmjs.com/package/file-flex)
[![CI](https://github.com/DaviMAC02/file-flex/actions/workflows/ci.yml/badge.svg)](https://github.com/DaviMAC02/file-flex/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/DaviMAC02/file-flex)](LICENSE)

One file storage API for Node.js across **AWS S3**, **Azure Blob Storage**, **Google Cloud Storage** and **local disk**. Switch providers by changing config, not code.

```bash
npm install file-flex
```

## Usage

```ts
import { FileFlexClient } from "file-flex";

const storage = new FileFlexClient({ LOCAL: true });

await storage.upload(Buffer.from("hello"), "greeting.txt");
await storage.download("greeting.txt"); // <Buffer 68 65 6c 6c 6f>
await storage.list();                   // ["greeting.txt"]
await storage.delete("greeting.txt");
```

The provider is picked from the options you pass:

| Provider | Options |
|---|---|
| Local disk | `LOCAL: true`, optional `LOCAL_PATH` (default `.file-flex`) |
| AWS S3 | `AWS_BUCKET_NAME`, `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY` |
| Azure Blob | `AZURE_CONNECTION_STRING`, `AZURE_CONTAINER_NAME` |
| Google Cloud | `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_BUCKET_NAME`, optional `GOOGLE_CLOUD_KEY_FILENAME` |

A typical setup uses local disk in development and a cloud bucket in production:

```ts
const storage = new FileFlexClient(
  process.env.NODE_ENV === "production"
    ? { AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME, AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY }
    : { LOCAL: true },
);
```

## How it works

Every backend implements the same four-method `IStorageProvider` interface (`save`, `retrieve`, `list`, `delete`), and `FileFlexClient` picks the implementation from its options. Adding a provider means adding one class in `src/providers/storage/implementations/`.

Files are stored as raw bytes, so images, PDFs and any other binary content round-trip unchanged.

## Upgrading from 1.x

`download()` now returns a `Buffer` instead of a string. Call `.toString()` on the result where you need text. In 1.x, binary files were corrupted on upload, so re-upload any binary files stored with 1.x.

## Development

```bash
npm install
npm test        # local provider tests; cloud suites run when their env vars are set
npm run build
```

Copy `.env.test.example` to `.env.test` and fill in credentials to run the cloud suites. Contributions are welcome.

## License

[MIT](LICENSE)
