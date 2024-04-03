import { FileFlexClient } from "./src/index";

const client = new FileFlexClient({
  GOOGLE_CLOUD_PROJECT_ID: 'augmented-web-335805'
});

async function test() {
  await client.upload(Buffer.from('Hello World'), 'test.txt');
}

test().then(() => console.log('done')).catch(console.error);
