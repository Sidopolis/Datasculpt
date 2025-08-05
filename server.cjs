require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const app = express();
app.use(cors());
app.use(express.json());

// AWS Bedrock client setup
const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Health check endpoint for debugging
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', bedrockRegion: process.env.AWS_REGION });
});
// Bedrock SQL generation endpoint
app.post('/api/bedrock/generate-sql', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query in request body' });
    }
    const input = {
      modelId: 'anthropic.claude-v2', // or your preferred model
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: query,
        max_tokens_to_sample: 256,
        temperature: 0.7,
      }),
    };
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const responseBody = await response.body.transformToString();
    // Log Bedrock response for debugging
    console.log('Bedrock response:', responseBody);
    res.json(JSON.parse(responseBody));
  } catch (err) {
    // Log full error object for debugging
    console.error('Bedrock error:', err);
    res.status(500).json({ error: 'Bedrock invocation failed', details: err && err.message ? err.message : err });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));