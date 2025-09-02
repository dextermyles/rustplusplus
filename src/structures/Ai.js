const Fs = require('fs');
const Logger = require('./Logger');
const Path = require('path');
const Config = require('../../config');
const Groq = require("groq-sdk");
class Ai {

    constructor(guildId = null) {
        this.guildId = guildId;
        this.lastQuestion = null;
        this.lastAnswer = null;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/ai.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.openai = new Groq.Groq({ apiKey: Config.groq.token });
    }

    async create(params) {
        return await this.openai.chat.completions.create(params);
    }

    async askAiBot(query) {
        this.lastQuestion = query;

        this.log('AI Question', query);

        const sysMsg = {
            role: "system",
            content: "You are my assistant for the survival game Rust, developed by Face Punch.\n"
                + "Assume I play on official servers. \n"
                + "Any  mention of Rust refers to the PC game developed by Facepunch (https://rust.facepunch.com/)."
                + "Provide final answers for the user, keep conversations brief to prevent spam.\n"
        };

        const userMsg = {
            role: "user",
            content: this.lastQuestion
        }

        try {
            const resp = await this.openai.chat.completions.create({
                model: "moonshotai/kimi-k2-instruct",
                messages: [sysMsg, userMsg],
                // stream: false,
                // max_completion_tokens: 2048,
                // temperature: 1,
                // top_p: 0.77,
                // stop: null,
                // reasoning_format: 'hidden',
            });

            this.log('AI Answer', JSON.stringify(resp.choices));

            this.lastAnswer = resp.choices[0].message.content;

            return this.lastAnswer;
        }
        catch (e) {
            this.log('ai failed', e, 'error');
            return { error: e };
        }

    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Ai;