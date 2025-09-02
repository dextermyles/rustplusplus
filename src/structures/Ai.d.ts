export = Ai;
declare class Ai {
    constructor(guildId?: any);
    guildId: any;
    lastQuestion: any;
    lastAnswer: string;
    logger: Logger;
    openai: Groq.Groq;
    create(body: ChatCompletionCreateParamsNonStreaming): Promise<ChatCompletion>;
    askAiBot(query: any): Promise<string | {
        error: any;
    }>;
    log(title: any, text: any, level?: string): void;
}
import { ChatCompletionCreateParamsNonStreaming, ChatCompletion } from "groq-sdk/resources/chat/completions";
import Logger = require("./Logger");
import Groq = require("groq-sdk");
