import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { findDrug } from "../services/databaseService.ts";
import { searchPubMed } from "../services/pubMedService.ts";
import type { Request, Response } from "express";
import type { Tool } from "@google/generative-ai";
import type { Part } from "@google/generative-ai";

const functionsMap: Record<string, Function> = {
  get_drug_stock_price: ({ drugName }: { drugName: string }) => {
    const drug = findDrug(drugName);
    if (!drug) return { error: "Medicamento não encontrado" };
    return drug;
  },
  search_scientific_articles: async ({ query }: { query: string }) => {
    const articles = await searchPubMed(query);
    return { articles };
  },
};

export const handleChatWebhook = async (req: Request, res: Response) => {
  const getGenAI = () =>
    new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const tools: Tool[] = [
    {
      functionDeclarations: [
        {
          name: "get_drug_stock_price",
          description:
            "Busca preço e estoque de medicamento no banco de dados.",
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              drugName: {
                type: SchemaType.STRING,
                description: "Nome do medicamento (ex: Simparic, Apoquel).",
              },
            },
            required: ["drugName"],
          },
        },
        {
          name: "search_scientific_articles",
          description: "Busca artigos científicos no PubMed.",
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              query: {
                type: SchemaType.STRING,
                description: "Termo de busca científica.",
              },
            },
            required: ["query"],
          },
        },
      ],
    },
  ];
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    console.log(`Bolota pensando sobre: "${message}"`);
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: tools,
      systemInstruction: `Você é o Bolota, um assistente veterinário especialista.
                    REGRAS OBRIGATÓRIAS:
                    1. Sempre que informar preço ou estoque de um remédio, Você DEVE avisar o usuário do uso somente com prescrição veterinária!.
                    2. Seja cordial, prestativo e SEMPRE responsável.
                    3. Responda em português do Brasil.
                    `,
    });
    const chat = model.startChat();

    const result = await chat.sendMessage(message);
    const response = result.response;
    const calls = response.functionCalls();
    if (calls && calls.length > 0) {
      console.log(`Gemini pediu ${calls.length} ferramentas!`);
      const functionResponses: Part[] = [];

      for (const call of calls) {
        const fnName = call.name;
        const fnArgs = call.args as any;

        const fnExecutor = functionsMap[fnName];
        if (fnExecutor) {
          const functionResult = await fnExecutor(fnArgs);

          functionResponses.push({
            functionResponse: {
              name: fnName,
              response: { result: functionResult },
            },
          });
        }
      }

      const finalResult = await chat.sendMessage(functionResponses);

      return res.json({ reply: finalResult.response.text() });
    }

    return res.json({ reply: response.text() });
  } catch (error) {
    console.error("Erro no Gemini:", error);
    return res.status(500).json({ error: "Erro interno no Bolota AI" });
  }
};
