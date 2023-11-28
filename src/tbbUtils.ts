import fs from 'fs';
import path from 'path';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";

const RESOURCE_DIR = path.resolve(__dirname, '../resource');
const FILE_NAME = "vector_store.faiss";

const embedder = new OpenAIEmbeddings(
  {
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME,
    azureOpenAIBasePath: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/`,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,
  }
);

export function readNoteFromFile(): aiBotConfig {
  const notePath = path.resolve(__dirname, '../note', 'note.json');
  const noteContent = fs.readFileSync(notePath, 'utf8');
  return JSON.parse(noteContent);
}

export async function getRagInfo(query: string) {
  const vectorStore = await FaissStore.load(path.join(RESOURCE_DIR, FILE_NAME), embedder);
  const result = await vectorStore.similaritySearch(query, 1);
  console.log(result);
  return result[0].pageContent;
}

interface aiBotConfig {
  name: string;
  description: string;
  instructions: string[];
}