import { FileFlexClient } from "../index";

test('FileFlexClient constructor', () => {
  const fileFlexClient = new FileFlexClient();
  expect(fileFlexClient).toBeInstanceOf(FileFlexClient);
});