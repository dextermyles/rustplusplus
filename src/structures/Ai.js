const Fs = require('fs');
const Logger = require('./Logger');
const Path = require('path');
const Config = require('../../config');
const Groq = require("groq-sdk");
const Client = require('../../index.ts');

class Ai {

    constructor(guildId = null) {
        this.guildId = guildId;
        this.lastQuestion = null;
        this.lastAnswer = null;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/ai.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.openai = new Groq.Groq({ apiKey: Config.groq.token });


        this.instance = this.getInstance();
        this.items = Client.client.items;
    }

    getInstance() {
        return Client.client.getInstance(this.guildId);
    }

    getItem(name) {
        let itemId = Client.client.items.getClosestItemIdByName(name);
        if (itemId) {
            let item = Client.client.items.getItem(itemId);
            return item;
        }
        return null;
    }

    async create(body) {
        return await this.openai.chat.completions.create(body);
    }

    async askAiBot(query) {
        this.lastQuestion = query;

        this.log('AI Question', query);

        const sysMsg = {
            role: "system",
            content: "You are my assistant for the survival game Rust.\n"
                + "Assume Vanilla game settings when calculating item and building stats in calculations for damage, health, durability, decay, despawn, recycle.\n"
                + "Assume all questions about Rust refer to the PC game developed by Facepunch (https://rust.facepunch.com/), not the programming language.\n"
                + "The only exception is if the user asks a gambling question about Casino games in Rust (black jack, slot machine, big wheel).\n"
                + "Provide a concise, brief, final answer only, without any additional commentary or preamble.\n"
                + "Use Plain Text format only, no Markdown, no code blocks.\n"
        };

        const userMsg = {
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

        const messages = [sysMsg, userMsg];

        try {
            const resp = await this.create({
                model: "moonshotai/kimi-k2-instruct",
                messages,
                temperature: 0.5,
                max_completion_tokens: 4096,
                search_settings:{
                    include_domains: ["rusthelp.com", "wiki.rustclash.com"]
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

            let content = responseMessage.content.trim();
            const strings = content.match(new RegExp(`.{1,80}(\\s|$)`, 'g'));

            this.lastAnswer = strings;

            return this.lastAnswer;
        }
        catch (e) {
            console.error(e);
            return e;
        }

    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Ai;