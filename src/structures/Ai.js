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
                model: "compound-beta",
                messages: [
                    {
                        role: "system",
                        content: "You are an expedious assistant for the PC game Rust.\n"
                            + "You assume the player is on a Vanilla game server.\n"
                            + "You reply with short answers, including the website source for your answer at the end.\n"
                            + "If the question is NOT a mathematical or Rust related, you reply with: Your question is not related to Rust.\n"
                    },
                    {
                        role: "user",
                        content: this.lastQuestion
                    },
                ],
                stream: false,
                max_completion_tokens: 8192,
                include_domains: ["rusthelp.com", "https://rust.fandom.com", "https://wiki.rustclash.com/"]
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