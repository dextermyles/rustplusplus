const Fs = require('fs');
const Logger = require('./Logger');
const Path = require('path');
const Groq = require("groq-sdk");
const Config = require('../../config');

class Ai {

    constructor(guildId = null) {
        this.guildId = guildId;
        this.lastQuestion = null;
        this.lastAnswer = null;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/ai.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.groq = new Groq.Groq({ apiKey: Config.groq.token });
    }

    async askAiBot(query) {
        this.lastQuestion = query;

        this.log('AI Question', query);

        try {
            const resp = await this.groq.chat.completions.create({
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant for the PC game Rust.\n"
                        + "You reply with short answers."
                        + "If the question is not related to Rust, you reply with 'Your question is not related to rust.'."
                    },
                    {
                        role: "user",
                        content: "Summarize " + this.lastQuestion
                    }
                ],
                stream: false,
                include_domains: [ "rusthelp.com" ],
                max_completion_tokens: 1024
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