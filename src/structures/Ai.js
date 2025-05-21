const Fs = require('fs');
const Logger = require('./Logger');
const Path = require('path');
const Config = require('../../config');
const OpenAI = require("openai");
class Ai {

    constructor(guildId = null) {
        this.guildId = guildId;
        this.lastQuestion = null;
        this.lastAnswer = null;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/ai.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.openai = new OpenAI.OpenAI({ apiKey: Config.groq.token });
    }

    async askAiBot(query) {
        this.lastQuestion = query;

        this.log('AI Question', query);

        try {
            const resp = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: "You are my assistant for the survival game Rust. "
                            + "Assume I play on official servers, solo or in teams, "
                            + "with goals that vary between PvP dominance, efficient raiding, farming, "
                            + "and base defense. Provide clear, concise, and tactical advice based on "
                            + "current Rust meta and best practices."
                            + `You should:\n
                            - Offer strategies for early, mid, and late-game progression.\n
                            - Help with base design (solo, duo, clan, bunker bases, trap bases).\n
                            - Suggest efficient loot routes, monument progression, and safe zones.\n
                            - Explain weapons, recoil control, and gear tier usage.\n
                            - Recommend farming strategies (sulfur, HQM, scrap) and tech tree paths.\n
                            - Support raiding techniques, including explosive usage and base breach planning.\n
                            - Analyze images like maps, base layouts, or monuments for strategy suggestions.\n
                            - Stay up to date with changes to weapons, building rules, or monument layouts as much as possible. Offer tactical and practical insight like a veteran Rust player would.`
                    },
                    {
                        role: "user",
                        content: this.lastQuestion
                    },
                ],
                stream: false,
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