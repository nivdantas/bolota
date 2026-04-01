
# Bolota AI – Veterinary Assistant

Customer service assistant for pet shops/veterinary pharmacies that uses AI (Gemini) to:

- Check prices, stock, and medication items from a local database (SQLite).
- Respond in natural language via a web chat interface.

The project consists of:

- **Node.js + TypeScript backend** with Express, SQLite, and Gemini integration.
- **Simple frontend for demonstration, using React + Vite + TypeScript + Tailwind CSS** (`bolota-web` folder).
- **Docker Compose** to compose the project.

---

## Requirements

- Docker.
- Node.js 20+.
- Gemini API key (Google AI Studio).

---

## Environment variables

Create a `.env` file in the **backend root** with:
GEMINI_API_KEY=key


## Run with the command:
docker-compose up –build
