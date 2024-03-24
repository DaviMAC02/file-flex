import { FileFlexClient } from "../index";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.test",
});

describe("FileFlexClient", () => {
  describe("localStorage", () => {
    it("should detect LocalStorage provider", () => {
      const client = new FileFlexClient({ IN_MEMORY: true });
      expect(client["_detectProvider"]()).toBe("LocalStorage");
    });

    it("should upload a file", async () => {
      const client = new FileFlexClient({ IN_MEMORY: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
    });

    it("should download a file", async () => {
      const client = new FileFlexClient({ IN_MEMORY: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      const fileContent = await client.download("file.txt");
      expect(fileContent).toBe("hello");
      await client.delete("file.txt");
    });

    it("should list files", async () => {
      const client = new FileFlexClient({ IN_MEMORY: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      const files = await client.list();
      expect(files).toContain("file.txt");
      await client.delete("file.txt");
    });

    it("should delete a file", async () => {
      const client = new FileFlexClient({ IN_MEMORY: true });
      await client.upload(Buffer.from("hello"), "file.txt");
      await client.delete("file.txt");
      const files = await client.list();
      expect(files).not.toContain("file.txt");
    });
  });

  describe("AZURE", () => {
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
      expect(fileContent).toBe("hello");
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

  describe("AWS", () => {
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
      expect(fileContent).toBe("hello");
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
