
# Bolota AI  – Assistente Veterinário

Assistente de atendimento para pet shop/farmácia veterinária que usa IA (Gemini) para:

- Consultar preço, estoque e artigos de medicamentos a partir de um banco local (SQLite).
- Responder em linguagem natural via uma interface de chat web.

O projeto é composto por:

- **Backend Node.js + TypeScript** com Express, SQLite e integração com Gemini.
- **Frontend Simples para demonstração, utilizando React + Vite + TypeScript + Tailwind CSS** (pasta `bolota-web`).
- **Docker Compose** para compor o projeto.

---

## Requisitos

- Docker.
- Node.js 20+.
- Chave de API do Gemini (Google AI Studio).

---

## Variáveis de ambiente

Crie um arquivo `.env` na **raiz do backend** com:
GEMINI_API_KEY=chave


## Executar com o comando:
docker-compose up –build

