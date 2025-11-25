import express from "express";
import dotenv from "dotenv";
import { initDatabase } from "./database/databaseInit.ts";
import path from "path";
import apiRoutes from "./routes/api.ts";
import cors from 'cors';

dotenv.config()


const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
app.use("/api", apiRoutes);

const startServer = async () => {
  try {
    await initDatabase(path.join(import.meta.dirname, "../dados_produtos.csv"));
    app.listen(PORT, () => {
      console.log(`Servidor Bolota rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
  }
};

startServer();
