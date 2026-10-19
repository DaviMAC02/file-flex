import { FileFlexClient } from "../index";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

describe("FileFlexClient", () => {
  describe("localStorage", () => {
    it("should detect LocalStorage provider", () => {
      const client = new FileFlexClient({ LOCAL: true });
      expect(client["_detectProvider"]()).toBe("LocalStorage");
    });

    it("should upload a file", async () => {
      const client = new FileFlexClient({ LOCAL: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
    });

    it("should download a file", async () => {
      const client = new FileFlexClient({ LOCAL: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      const fileContent = await client.download("file.txt");
      expect(fileContent?.toString()).toBe("hello");
      await client.delete("file.txt");
    });

    it("should round-trip binary content unchanged", async () => {
      const client = new FileFlexClient({ LOCAL: true });
      const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff, 0xfe, 0x80]);
      await client.upload(bytes, "image.png");
      expect((await client.download("image.png"))?.equals(bytes)).toBe(true);
      await client.delete("image.png");
    });

    it("should list files", async () => {
      const client = new FileFlexClient({ LOCAL: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      const files = await client.list();
      expect(files).toContain("file.txt");
      await client.delete("file.txt");
    });

    it("should delete a file", async () => {
      const client = new FileFlexClient({ LOCAL: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
      const files = await client.list();
      expect(files).not.toContain("file.txt");
    });
  });

  (process.env.AZURE_CONNECTION_STRING ? describe : describe.skip)("AZURE", () => {
    it("should detect Azure provider", () => {
      const client = new FileFlexClient({
        AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
        AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
      });
      expect(client["_detectProvider"]()).toBe("Azure");
    });

    it("should upload a file", async () => {
      const client = new FileFlexClient({
        AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
        AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
    });

    it("should download a file", async () => {
      const client = new FileFlexClient({
        AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
        AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      const fileContent = await client.download("file.txt");
      expect(fileContent?.toString()).toBe("hello");
      await client.delete("file.txt");
    });

    it("should list files", async () => {
      const client = new FileFlexClient({
        AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
        AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      const files = await client.list();
      expect(files).toContain("file.txt");
      await client.delete("file.txt");
    });

    it("should delete a file", async () => {
      const client = new FileFlexClient({
        AZURE_CONNECTION_STRING: process.env.AZURE_CONNECTION_STRING,
        AZURE_CONTAINER_NAME: process.env.AZURE_CONTAINER_NAME,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
      const files = await client.list();
      expect(files).not.toContain("file.txt");
    });
  });

  (process.env.AWS_BUCKET_NAME ? describe : describe.skip)("AWS", () => {
    it("should detect AWS provider", () => {
      const client = new FileFlexClient({
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      });
      expect(client["_detectProvider"]()).toBe("AWS");
    });

    it("should upload a file", async () => {
      const client = new FileFlexClient({
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
    });

    it("should download a file", async () => {
      const client = new FileFlexClient({
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      const fileContent = await client.download("file.txt");
      expect(fileContent?.toString()).toBe("hello");
      await client.delete("file.txt");
    });

    it("should list files", async () => {
      const client = new FileFlexClient({
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      const files = await client.list();
      expect(files).toContain("file.txt");
      await client.delete("file.txt");
    });

    it("should delete a file", async () => {
      const client = new FileFlexClient({
        AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
      const files = await client.list();
      expect(files).not.toContain("file.txt");
    });
  });
});
