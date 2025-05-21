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

    async askAiBot(query) {
        this.lastQuestion = query;

        this.log('AI Question', query);

        try {
            const resp = await this.openai.chat.completions.create({
                model: "compound-beta",
                messages: [
                    {
                        role: "system",
                        content: "You are my assistant for the survival game Rust. "
                            + "Assume I play on official servers. "
                            + "Provide clear, concise, advice based on current Rust data, and only provide the final answer.\n"
                            + `You should:\n
                            - "Stay up to date with changes to weapons, building rules, or monument layouts as much as possible.\n"`
                    },
                    {
                        role: "user",
                        content: this.lastQuestion
                    },
                ],
                stream: false,
                max_completion_tokens: 1024,
                temperature: 1,
                top_p: 0.8,
                stop: null
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