import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const REGION = process.env.AWS_REGION;
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const client = new BedrockRuntimeClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
});

export async function callBedrock(prompt: string) {
  const input = {
    modelId: 'anthropic.claude-v2', // Change to your preferred model
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      prompt,
      max_tokens_to_sample: 256,
      temperature: 0.7,
    }),
  };

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);
  const responseBody = await response.body.transformToString();
  return JSON.parse(responseBody);
}
