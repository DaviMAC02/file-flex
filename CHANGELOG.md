# Changelog

## 2.0.0

### Breaking

- `download()` returns a `Buffer` instead of a string.
- Cloud SDKs are optional peer dependencies. Install the one for your provider: `@aws-sdk/client-s3`, `@azure/storage-blob` or `@google-cloud/storage`.
- S3 moved from `aws-sdk` v2, which is end-of-life, to `@aws-sdk/client-s3` v3.
- The constructor throws when no provider is configured, instead of the first call.
- Google Cloud is picked only when both `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_CLOUD_BUCKET_NAME` are set.
- Local files default to `.file-flex/` in the working directory instead of `src/storage/localStorage`.
- Requires Node.js 20 or later.

### Fixed

- Binary files (images, PDFs) were corrupted on upload by every provider.
- Azure sized uploads by character count, truncating non-ASCII text.
- Local keys like `../../etc/passwd` could read and write outside the storage folder.
- A symlink inside the local storage folder could be used to read or write files outside it.
- Local keys with folders (`docs/a.txt`) failed to upload, and `list()` returned folder names.
- `list()` on S3 stopped at 1,000 files.
- Missing files threw on some providers and returned `undefined` on others. Now `download()` returns `undefined` and `delete()` is a no-op everywhere.
- ESM `import` loaded the CommonJS build. ESM users now get a real `.mjs` build through `exports`.
- A new cloud client was created on every call. It is now created once and reused.

### Added

- `AWS_ENDPOINT` for S3-compatible services such as MinIO, Cloudflare R2 and DigitalOcean Spaces.
- `AWS_REGION` option.
- `GOOGLE_CLOUD_API_ENDPOINT` for emulators and private endpoints.
- `LOCAL_PATH` to choose the local storage folder.
- `client.provider` to see which provider was picked.
- Exported `FileFlexOptions` and `Provider` types.
- Clear error messages for missing SDKs, empty keys and invalid local keys.
- CI runs every provider against local emulators on Node 20, 22 and 24.

## 1.0.1 (2024)

Initial public release with AWS S3, Azure Blob, Google Cloud Storage and local disk providers.
