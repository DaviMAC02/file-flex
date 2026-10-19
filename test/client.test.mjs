// Runs against the built package (`npm test` builds first), so it checks exactly what gets published.
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { FileFlexClient } from "../dist/index.mjs";

try {
  process.loadEnvFile(".env.test");
} catch {}

const env = process.env;
const localRoot = mkdtempSync(path.join(tmpdir(), "file-flex-"));
after(() => rmSync(localRoot, { recursive: true, force: true }));

const providers = [
  ["LocalStorage", { LOCAL: true, LOCAL_PATH: localRoot }],
  [
    "AWS",
    env.AWS_BUCKET_NAME && {
      AWS_BUCKET_NAME: env.AWS_BUCKET_NAME,
      AWS_ACCESS_KEY: env.AWS_ACCESS_KEY,
      AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
      AWS_REGION: env.AWS_REGION,
      AWS_ENDPOINT: env.AWS_ENDPOINT,
    },
  ],
  [
    "Azure",
    env.AZURE_CONNECTION_STRING && {
      AZURE_CONNECTION_STRING: env.AZURE_CONNECTION_STRING,
      AZURE_CONTAINER_NAME: env.AZURE_CONTAINER_NAME,
    },
  ],
  [
    "GoogleCloud",
    env.GOOGLE_CLOUD_PROJECT_ID && {
      GOOGLE_CLOUD_PROJECT_ID: env.GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_CLOUD_BUCKET_NAME: env.GOOGLE_CLOUD_BUCKET_NAME,
      GOOGLE_CLOUD_KEY_FILENAME: env.GOOGLE_CLOUD_KEY_FILENAME,
      GOOGLE_CLOUD_API_ENDPOINT: env.GOOGLE_CLOUD_API_ENDPOINT,
    },
  ],
];

// Every provider must behave the same way. Cloud suites run only when their credentials are set.
for (const [name, options] of providers) {
  describe(`${name} provider`, { skip: !options && "credentials not set" }, () => {
    const client = options && new FileFlexClient(options);
    const key = (k) => `file-flex-test-${process.pid}/${k}`;

    it("is detected from its options", () => {
      assert.equal(client.provider, name);
    });

    it("round-trips text", async () => {
      await client.upload(Buffer.from("hello"), key("hello.txt"));
      assert.equal((await client.download(key("hello.txt")))?.toString(), "hello");
      await client.delete(key("hello.txt"));
    });

    it("round-trips binary content unchanged", async () => {
      const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff, 0xfe, 0x80]);
      await client.upload(bytes, key("image.png"));
      assert.deepEqual(await client.download(key("image.png")), bytes);
      await client.delete(key("image.png"));
    });

    it("keeps non-ASCII text intact", async () => {
      await client.upload(Buffer.from("olá, 世界"), key("utf8.txt"));
      assert.equal((await client.download(key("utf8.txt")))?.toString(), "olá, 世界");
      await client.delete(key("utf8.txt"));
    });

    it("lists nested keys with forward slashes", async () => {
      await client.upload(Buffer.from("a"), key("docs/2024/a.txt"));
      assert.ok((await client.list()).includes(key("docs/2024/a.txt")));
      await client.delete(key("docs/2024/a.txt"));
    });

    it("returns undefined for a missing key", async () => {
      assert.equal(await client.download(key("missing.txt")), undefined);
    });

    it("deletes, and ignores deleting a missing key", async () => {
      await client.upload(Buffer.from("x"), key("gone.txt"));
      await client.delete(key("gone.txt"));
      assert.ok(!(await client.list()).includes(key("gone.txt")));
      await client.delete(key("gone.txt"));
    });
  });
}

describe("FileFlexClient", () => {
  const local = () => new FileFlexClient({ LOCAL: true, LOCAL_PATH: localRoot });

  it("throws when no provider is configured", () => {
    assert.throws(() => new FileFlexClient({}), /no provider configured/);
  });

  it("rejects empty keys", async () => {
    await assert.rejects(local().upload(Buffer.from("x"), ""), /non-empty/);
  });

  it("does not let local keys escape the storage folder", async () => {
    await assert.rejects(local().upload(Buffer.from("x"), "../escape.txt"), /invalid key/);
    await assert.rejects(local().download("../../etc/passwd"), /invalid key/);
    await assert.rejects(local().delete("/etc/hosts"), /invalid key/);
  });

  it("lists nothing for a folder that does not exist yet", async () => {
    const client = new FileFlexClient({ LOCAL: true, LOCAL_PATH: path.join(localRoot, "never-created") });
    assert.deepEqual(await client.list(), []);
  });

  it("is also loadable with require()", () => {
    const cjs = createRequire(import.meta.url)("../dist/index.js");
    assert.equal(new cjs.FileFlexClient({ LOCAL: true }).provider, "LocalStorage");
  });
});
