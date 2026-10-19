# file-flex

[![npm](https://img.shields.io/npm/v/file-flex)](https://www.npmjs.com/package/file-flex)
[![CI](https://github.com/DaviMAC02/file-flex/actions/workflows/ci.yml/badge.svg)](https://github.com/DaviMAC02/file-flex/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/DaviMAC02/file-flex)](LICENSE)

One file storage API for Node.js across **AWS S3**, **Azure Blob Storage**, **Google Cloud Storage** and **local disk**. Switch providers by changing config, not code.

- **Four methods:** `upload`, `download`, `list`, `delete`. They behave the same on every provider.
- **Binary-safe:** images, PDFs and any other bytes round-trip unchanged.
- **Light:** cloud SDKs are optional, so you install only the one you use.
- **S3-compatible services** like MinIO, Cloudflare R2 and DigitalOcean Spaces work through `AWS_ENDPOINT`.
- **Typed:** ships ESM and CommonJS builds with TypeScript types.

## Install

```bash
npm install file-flex
```

Then add the SDK for the provider you use. The local provider needs nothing extra.

| Provider | Install |
|---|---|
| AWS S3 (and S3-compatible) | `npm install @aws-sdk/client-s3` |
| Azure Blob Storage | `npm install @azure/storage-blob` |
| Google Cloud Storage | `npm install @google-cloud/storage` |

If the SDK is missing, the first call fails with a message telling you which package to install.

Requires Node.js 20 or later.

## Usage

```ts
import { FileFlexClient } from "file-flex";

const storage = new FileFlexClient({ LOCAL: true });

await storage.upload(Buffer.from("hello"), "docs/greeting.txt");

const file = await storage.download("docs/greeting.txt"); // Buffer, or undefined if missing
console.log(file?.toString()); // "hello"

await storage.list(); // ["docs/greeting.txt"]
await storage.delete("docs/greeting.txt");
```

`require("file-flex")` works too.

A typical setup uses local disk in development and a bucket in production:

```ts
const storage = new FileFlexClient(
  process.env.NODE_ENV === "production"
    ? {
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : { LOCAL: true },
);
```

## Configuration

The provider is picked from the options you pass, checked in this order.

| Provider | Required | Optional |
|---|---|---|
| Local disk | `LOCAL: true` | `LOCAL_PATH` (default `.file-flex`) |
| AWS S3 | `AWS_BUCKET_NAME`, `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY` | `AWS_REGION` (default: the `AWS_REGION` env var, then `us-east-1`), `AWS_ENDPOINT` |
| Azure Blob | `AZURE_CONNECTION_STRING`, `AZURE_CONTAINER_NAME` | |
| Google Cloud | `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_BUCKET_NAME` | `GOOGLE_CLOUD_KEY_FILENAME`, `GOOGLE_CLOUD_API_ENDPOINT` |

If none match, the constructor throws. `client.provider` tells you which one was picked.

**S3-compatible services:** set `AWS_ENDPOINT`, for example `https://<account>.r2.cloudflarestorage.com` for Cloudflare R2 or `http://localhost:9000` for MinIO. Path-style URLs are turned on automatically.

**Google Cloud credentials:** without `GOOGLE_CLOUD_KEY_FILENAME`, the SDK uses Application Default Credentials.

## API

| Method | Returns | Notes |
|---|---|---|
| `upload(content: Buffer, key: string)` | `Promise<void>` | Replaces any existing file at `key`. |
| `download(key: string)` | `Promise<Buffer \| undefined>` | `undefined` when `key` does not exist. |
| `list()` | `Promise<string[]>` | Every key in the store. Nested keys use `/`. |
| `delete(key: string)` | `Promise<void>` | Does nothing when `key` does not exist. |

Keys can contain `/` to group files into folders. Empty keys are rejected. With the local provider, keys that would point outside `LOCAL_PATH` (such as `../secret`) are rejected too.

## Upgrading from 1.x

- **`download()` returns a `Buffer`**, not a string. Call `.toString()` where you need text.
- **Install your provider's SDK** yourself. They are optional peer dependencies now, and S3 moved from the end-of-life `aws-sdk` v2 to `@aws-sdk/client-s3` v3.
- **Re-upload binary files** stored with 1.x. They were corrupted on upload.
- **Missing files** now return `undefined` and deleting them is a no-op, on every provider.
- **Configuration errors** are thrown by the constructor instead of on the first call. Google Cloud now also needs `GOOGLE_CLOUD_BUCKET_NAME` to be picked.
- **Local files** default to `.file-flex/` in the working directory, not `src/storage/localStorage`.

See [CHANGELOG.md](CHANGELOG.md) for the full list.

## How it works

Each backend is one class in [`src/providers/`](src/providers) implementing a four-method `StorageProvider` interface. `FileFlexClient` picks the provider from its options, loads that provider's SDK on first use and reuses the same client for every call. Adding a provider means adding one class and one line in `createProvider`.

## Development

```bash
npm install
npm test                  # build, then run the local-disk suite
npm run typecheck
```

Every provider runs the same test suite. To run the cloud suites without real accounts, start local emulators (needs Docker):

```bash
npm run emulators:start   # S3Mock, Azurite and fake-gcs-server
npm run test:emulators
npm run emulators:stop
```

To test against real accounts, copy `.env.test.example` to `.env.test` and fill in the providers you want. CI runs all four suites against the emulators on Node 20, 22 and 24.

Issues and pull requests are welcome.

## License

[MIT](LICENSE)
