const Fs = require('fs');
const Logger = require('./Logger');
const Path = require('path');
const Config = require('../../config');
const Groq = require("groq-sdk");
const Client = require('../../index.ts');
const Items = require('./Items');

class Ai {

    set items(value) {
        this._items = value;
    }

    get items() {
        return this._items;
    }

    constructor(guildId = null) {
        this.guildId = guildId;
        this.lastQuestion = null;
        this.lastAnswer = null;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/ai.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.openai = new Groq.Groq({ apiKey: Config.groq.token });


        this.instance = this.getInstance();
        this._items = new Items();
    }

    getInstance() {
        return Client.client.getInstance(this.guildId);
    }

    getItem(name) {
        let itemId = this.getTtemIdByName(name);
        if (itemId) {
            let item = this.items.getItem(itemId);
            return item;
        }
        return null;
    }

    getTtemIdByName(name) {
        return this.items.getClosestItemIdByName(name);
    }

    async create(body) {
        return await this.openai.chat.completions.create(body);
    }

    async askRaidQuestion() {

    }

    async askGamblingQuestion(question) {
        this.items.getItemByName('stone');
    }

    async askCostQuestion(question) {

    }

    async askAiBot(query) {
        try {
            this.lastQuestion = query;
            this.log('AI Question', query);
            return await this.askWithItemTokens(query);
        }
        catch (e) {
            this.log('askAitBot failed', e, 'Error');
            console.log(e);
            return e;
        }
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }


    escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Load items.json and build a tokenizer that replaces occurrences of item.Name
     * with a compact token containing the itemid (so you can send tokenized text
     * to Groq chat completions).
     *
     * Token format used: <ITEM:123456789>
     *
     * Exports:
     *  - createItemTokenizer(itemsJsonPath)
     *     -> { tokenize(text), detokenize(text), nameToId, idToName }
     */
    createItemTokenizer(itemsJsonPath) {
        const jsonPath = Path.resolve(itemsJsonPath);
        const raw = Fs.readFileSync(jsonPath, 'utf8');
        const items = JSON.parse(raw);

        const nameToId = new Map();
        const idToName = new Map();

        // Build mappings; prefer the "Name" field if present, fall back to shortname
        for (const [id, item] of Object.entries(items)) {
            const name = (item && (item.Name || item.Name === '') ? item.Name : item.shortname);
            if (!name) continue;
            const canonical = name.trim();
            nameToId.set(canonical.toLowerCase(), id);
            idToName.set(id, canonical);
        }

        // Build a regex that matches any item name. We sort by length desc to prefer longest match.
        const names = Array.from(nameToId.keys()).sort((a, b) => b.length - a.length);
        const escaped = names.map(this.escapeRegExp);
        // We do a case-insensitive global search without requiring \b since names include spaces/punctuation.
        const namesRegex = new RegExp(escaped.join('|'), 'gi');

        function tokenize(text) {
            if (!text || typeof text !== 'string') return text;
            return text.replace(namesRegex, (match) => {
                const id = nameToId.get(match.toLowerCase());
                if (!id) return match;
                return `<ITEM:${id}>`;
            });
        }

        function detokenize(text) {
            if (!text || typeof text !== 'string') return text;
            return text.replace(/<ITEM:(-?\d+)>/g, (_m, id) => {
                return idToName.get(String(id)) || `<ITEM:${id}>`;
            });
        }

        return {
            tokenize,
            detokenize,
            nameToId,
            idToName,
            rawItems: items
        };
    }

    async askWithItemTokens(userQuery) {
        const messages = [
            {
                role: "system",
                content: "You are my assistant for the survival game Rust.\n"
                    + "Assume Vanilla game settings when calculating item and building stats in calculations for damage, health, durability, decay, despawn, recycle.\n"
                    + "Assume all questions about Rust refer to the PC game developed by Facepunch (https://rust.facepunch.com/), not the programming language.\n"
                    + "Rust changes can be found at https://rust.facepunch.com/changes" + "\n"
                    + "The only exception is if the user asks a gambling question about Casino games in Rust (black jack, slot machine, big wheel).\n"
                    + "Provide a concise final answer.\n"
                    + "Use Plain Text in your output, do not use any special characters that require encoding.\n"
            },
            { role: 'user', content: userQuery }
        ];

        const resp = await this.create({
            model: "moonshotai/kimi-k2-instruct",
            messages,
            temperature: 0.2,
            max_completion_tokens: 4096,
        });

        // the model reply may contain item tokens; convert back to friendly names
        const modelText = (resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content) || '';
        this.log('AI Answer', modelText);
        return modelText;
    }

}

module.exports = Ai;