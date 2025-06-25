require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { createClient, LiveTranscriptionEvents } = require('@deepgram/sdk');

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const PORT = 6009;

if (!DEEPGRAM_API_KEY) {
  console.error('[FATAL] Deepgram API Key not found. Please set DEEPGRAM_API_KEY in .env');
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get('/', (req, res) => res.send('🎙️ Deepgram Proxy Server Running'));

wss.on('connection', (clientSocket) => {
  console.log('[INFO] New WebSocket client connected');

  const deepgram = createClient(DEEPGRAM_API_KEY);
  const dgSocket = deepgram.listen.live({
    language: 'en-US',
    model: 'nova-2',
    smart_format: true,
    punctuate: true,
    encoding: 'linear16',
    sample_rate: 16000,
  });

  dgSocket.on(LiveTranscriptionEvents.Open, () => {
    console.log('[INFO] Deepgram connection established ');
  });

  dgSocket.on(LiveTranscriptionEvents.Transcript, (data) => {
    console.log('[TRANSCRIPT]', JSON.stringify(data, null, 2));
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(JSON.stringify(data));
    } else {
      console.warn('[WARN] Tried sending to closed client socket');
    }
  });

  dgSocket.on(LiveTranscriptionEvents.Metadata, (data) => {
    console.log('[INFO] Deepgram metadata:', data);
  });

  dgSocket.on(LiveTranscriptionEvents.Close, () => {
    console.log('[INFO] Deepgram connection closed ');
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.close();
    }
  });

  dgSocket.on(LiveTranscriptionEvents.Error, (err) => {
    console.error('[ERROR] Deepgram error :', err);
    if (clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.close();
    }
  });

  clientSocket.on('message', (msg) => {
    console.log(`[DEBUG] Received audio buffer from client: ${msg.byteLength} bytes`);
    if (dgSocket.getReadyState() === 1) {
      dgSocket.send(msg);
    } else {
      console.warn('[WARN] Dropping message, Deepgram socket not open');
    }
  });

  clientSocket.on('close', () => {
    console.log('[INFO] WebSocket client disconnected');
    dgSocket.finish();
  });

  clientSocket.on('error', (err) => {
    console.error('[ERROR] WebSocket client error:', err);
    dgSocket.finish();
  });
});

server.listen(PORT, () => {
  console.log(`[INFO] Deepgram Proxy server running at http://localhost:${PORT}`);
});
