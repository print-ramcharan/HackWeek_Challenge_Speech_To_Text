#Live Speech Transcription with Deepgram + WebSockets

This project allows you to transcribe microphone input in real-time using Deepgram's streaming API and WebSockets. No frontend frameworks needed — just plain HTML, JS, and a single `server.js`.

## Requirements

- Node.js (v16 or above)
- A Deepgram API key

## Setup Instructions

### 1. Clone this Repository

```bash
git clone https://github.com/print-ramcharan/HackWeek_Challenge_Speech_To_Text.git
cd live-transcriber
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Your Deepgram API Key

Create a `.env` file in the root of the project and add:

```env
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

You can get your key by signing up at [https://deepgram.com](https://deepgram.com).

### 4. Start the WebSocket Server

```bash
node server.js
```

This will start a WebSocket server on `ws://localhost:6009`.

### 5. Open the Frontend

Simply open the `index.html` file in your browser:

```bash
# No need for a dev server. Just open directly:
open index.html  # (macOS)
# or double-click index.html in your file explorer
```

You should see:

- A **start button** 🎛️  
- A **canvas waveform visualizer** 📈  
- A **transcript output area** 📝

## 🛠 How it Works

- Microphone audio is captured using the Web Audio API.
- It’s visualized in real-time on a canvas.
- The audio is processed and sent as `Int16` buffers to the backend WebSocket.
- The backend relays this to Deepgram's live transcription API.
- Transcripts are returned and rendered live in the browser.

---


