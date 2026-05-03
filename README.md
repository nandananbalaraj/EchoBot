# EchoBot — Setup & Installation Guide

## Prerequisites

Before running EchoBot, make sure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | v18+ (v22 recommended) | Runs the frontend dev server |
| **npm** | v9+ | Package manager |
| **macOS** | 12 Monterey+ | Required for Ollama.app |

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/nandananbalaraj/EchoBot.git
cd EchoBot
```

---

## Step 2 — Install Node Dependencies

```bash
npm install
```

This installs React, Vite, Tailwind, Framer Motion, and all other frontend dependencies.

---

## Step 3 — Install Ollama (Local AI Engine)

Ollama runs the LLM locally on your machine — no API key needed.

### Option A — Download the Mac App (Recommended)

1. Go to **https://ollama.com/download**
2. Download **Ollama for macOS** and drag it to `/Applications`
3. Open **Ollama.app** from your Applications folder — it will appear in your menu bar

### Option B — Install via the install script (Terminal)

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

> If the CLI isn't in your PATH after install, add this to `~/.zshrc` or `~/.zprofile`:
> ```bash
> export PATH="$HOME/.local/bin:$PATH"
> ```
> Then run `source ~/.zshrc`

---

## Step 4 — Pull the AI Model

Open a terminal and run:

```bash
ollama pull llama3.2:1b
```

This downloads the **Llama 3.2 1B** model (~1.3 GB). This is a one-time download.

> Want a smarter (but slower) model? Try `ollama pull llama3.2` (3B) or `ollama pull mistral`.
> Then update `OLLAMA_MODEL` in `src/services/ollamaService.ts`.

---

## Step 5 — Run the App

```bash
npm run start
```

This single command:
1. Starts the **Ollama server** in the background (with CORS enabled)
2. Starts the **Vite dev server**

The app will be available at **http://localhost:3000**

> If port 3000 is busy, Vite will auto-select the next free port (3001, 3002, etc.) — check your terminal for the exact URL.

---

## Troubleshooting

### `zsh: command not found: ollama`
The Ollama CLI is not in your shell's PATH. Fix:
```bash
# Add this to ~/.zshrc AND ~/.zprofile
export PATH="$HOME/.local/bin:$PATH"
source ~/.zshrc
```
Or just open **Ollama.app** from `/Applications` — it registers the CLI automatically on next launch.

### Chat shows "something went wrong"
Ollama server may not be running. Start it manually:
```bash
OLLAMA_ORIGINS='*' /Applications/Ollama.app/Contents/Resources/ollama serve
```

### Port already in use
Kill the process occupying the port:
```bash
lsof -ti :3000 | xargs kill -9
```

---

## Project Structure

```
EchoBot/
├── src/
│   ├── App.tsx              # Main chat interface
│   ├── SignIn.tsx            # Sign-in page
│   ├── main.tsx              # React entry point
│   ├── index.css             # Design system (Tailwind v4 + custom tokens)
│   └── services/
│       └── ollamaService.ts  # Ollama API integration
├── index.html
├── vite.config.ts            # Vite config with Ollama proxy
├── package.json
└── tsconfig.json
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion (motion/react) |
| Icons | Lucide React |
| AI Backend | Ollama (local LLM runtime) |
| Default Model | Llama 3.2 1B (Meta) |
