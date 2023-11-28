import { MemoryStorage } from "botbuilder";
import * as path from "path";

// See https://aka.ms/teams-ai-library to learn more about the Teams AI library.
import {
  Application,
  AzureOpenAIPlanner,
  DefaultPromptManager,
  DefaultTurnState,
  DefaultUserState,
  DefaultTempState,
  DefaultConversationState,
} from "@microsoft/teams-ai";

import config from "./config";
import * as tbbUtils from "./tbbUtils";

type ConversationState = DefaultConversationState;

type UserState = DefaultUserState;

interface TempState extends DefaultTempState {
  name: string;
  description: string;
  instructions: string;
  ragInfo: string;
}

type ApplicationTurnState = DefaultTurnState<ConversationState, UserState, TempState>;

// Create AI components
// Use OpenAI
// const planner = new OpenAIPlanner({
//   apiKey: config.openAIKey,
//   defaultModel: "gpt-3.5-turbo",
//   useSystemMessage: true,
//   logRequests: true,
// });
// Uncomment the following lines to use Azure OpenAI
const planner = new AzureOpenAIPlanner<ApplicationTurnState>({
  apiKey: config.azureOpenAIKey,
  endpoint: config.azureOpenAIEndpoint,
  defaultModel: "gpt-4-zihch",
  useSystemMessage: true,
  logRequests: true,
});

const promptManager = new DefaultPromptManager<ApplicationTurnState>(path.join(__dirname, "../src/prompts"));

promptManager.addFunction("name", async (context: any) => {
  return tbbUtils.readNoteFromFile().name;
});

promptManager.addFunction("description", async (context: any) => {
  return tbbUtils.readNoteFromFile().description;
});

promptManager.addFunction("instructions", async (context: any) => {
  return tbbUtils.readNoteFromFile().instructions?.join("\n");
});

promptManager.addFunction("ragInfo", async (context: any) => {
  return tbbUtils.getRagInfo(context.activity.text);
});

// Define storage and application
const storage = new MemoryStorage();
const app = new Application<ApplicationTurnState>({
  storage,
  ai: {
    planner,
    promptManager,
    prompt: "chat",
    history: {
      assistantHistoryType: "text",
    },
  },
});

app.conversationUpdate("membersAdded", async (context) => {
  await context.sendActivity("How can I help you today?");
});

export default app;
