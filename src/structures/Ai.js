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

        this.log('askAiBot', query);

        try {
            const resp = await this.groq.chat.completions.create({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "user",
                        content: "In Rust, " + this.lastQuestion
                    }
                ],
                max_completion_tokens: 1024,
                stream: false,
                reasoning_format: "hidden",
                
            });
    
            this.log('askAiBot response', JSON.stringify(resp.choices));
    
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