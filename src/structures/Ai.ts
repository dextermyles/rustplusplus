import Logger from "./Logger";
import Path from 'path';
import Config from '../../config';
import Groq from "groq-sdk";
import Items from "./Items";

import client from '../../index';
import { ChatCompletionCreateParamsNonStreaming, ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from "groq-sdk/resources/chat/completions";

class Ai {

    _items: any;
    guildId = 0;
    lastQuestion = '';
    lastAnswer = '';
    logger = new Logger(Path.join(__dirname, '..', '..', 'logs/ai.log'), 'default');
    openai = new Groq({ apiKey: Config.groq.token });
    instance: any;

    set items(value) {
        this._items = value;
    }

    get items() {
        return this._items;
    }

    constructor(guildId = null) {
        if (guildId) {
            this.guildId = guildId;
        }
        this.logger.setGuildId(this.guildId);
        this.instance = this.getInstance();
        this._items = new Items();
    }

    getInstance() {
        return client.getInstance(this.guildId);
    }

    getItem(name: string) {
        let itemId = this.getTtemIdByName(name);
        if (itemId) {
            let item = this.items.getItem(itemId);
            return item;
        }
        return null;
    }

    getTtemIdByName(name: string) {
        return this.items.getClosestItemIdByName(name);
    }

    async create(body: ChatCompletionCreateParamsNonStreaming) {
        return await this.openai.chat.completions.create(body);
    }

    askRaidQuestion(question: string) {
        return this.askAiBot(question);
    }

    askGamblingQuestion(question: string) {
        return this.askAiBot(question);
    }

    async askCostQuestion(question: string) {
        return this.askAiBot(question);
    }

    async askAiBot(query: string) {
        this.lastQuestion = query;

        this.log('AI Question', query);

        const sysMsg: ChatCompletionSystemMessageParam = {
            role: "system",
            content: "You are my assistant for the survival game Rust.\n"
                + "Assume Vanilla game settings when calculating item and building stats in calculations for damage, health, durability, decay, despawn, recycle.\n"
                + "Assume all questions about Rust refer to the PC game developed by Facepunch (https://rust.facepunch.com/), not the programming language.\n"
                + "The only exception is if the user asks a gambling question about Casino games in Rust (black jack, slot machine, big wheel).\n"
                + "Provide concise, but imformative answers.\n"
                + "Use Plain Text in your output, do not use any special characters (including apostrophes or bullet points) that require encoding.\n"
                + "Comma speparate your lists instead of using new lines."
        };

        const userMsg: ChatCompletionMessageParam = {
            role: "user",
            content: this.lastQuestion
        }

        const tools = [
            {
                "type": "function",
                "function": {
                    "name": "getItem",
                    "description": "Get item by name",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string",
                                "description": "The name of item",
                            }
                        },
                        "required": ["name"],
                    },
                },
            }
        ];

        const messages: ChatCompletionMessageParam[] = [sysMsg, userMsg];

        try {
            const resp = await this.create({
                model: "moonshotai/kimi-k2-instruct",
                messages,
                temperature: 0.3,
                max_completion_tokens: 4096,
                search_settings: {
                    include_domains: ["rusthelp.com", "wiki.rustclash.com", "rust.facepunch.com"],

                }
            });

            this.log('AI Response', JSON.stringify(resp));

            const responseMessage = resp.choices[0].message;
            const toolCalls = responseMessage.tool_calls || [];

            // Process tool calls
            messages.push(responseMessage);

            const availableFunctions = {
                getItem: this.getItem
            };

            let content = responseMessage.content != null ? responseMessage.content.trim(): '';
            const strings = content.match(new RegExp(`.{1,80}(\\s|$)`, 'gm'));

            this.log('AI RESPONSE', JSON.stringify(responseMessage));
            this.log('AI STR', strings ? strings.join('\n') : content);
            this.lastAnswer = content;

            return this.lastAnswer;
        }
        catch (e) {
            console.log(typeof e);
            console.log(e);
            console.error(e);
            this.log('AI ERROR', JSON.stringify(e), 'error');
            return e;
        }

    }

    log(title: string, text: string, level: 'info' | 'error' | 'warn' = 'info'): void {
        this.logger.log(title, text, level);
    }
}

exports.Ai = Ai;

export default Ai;