const Fs = require('fs');
const Path = require('path');
const Logger = require('./Logger');

const Axios = require('axios');
const Client = require('../../index.ts');
const Config = require('../../config');

class RustStats {

    constructor(guildId = null) {
        this.guildId = guildId;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/ruststats.log'), 'default');
        this.logger.setGuildId(this.guildId);
    }

    GET_USER_STATISTICS(id) {
        return `public-api/user/statistics?steam_id=${id}`
    }

    GET_USER_BANNED(id) {
        return `public-api/user/banned?steam_id=${id}`
    }

    async getUserStats(id) {
        return await this.request(this.GET_USER_STATISTICS(id));
    }

    async httpGet(api_call) {
        try {
            let ax = new Axios.Axios({ headers: { Authorization: Config.ruststats.apiKey}});
            var url = `https://ruststats.io/${api_call}`;
            console.log('http get: ' , url);
            console.log(JSON.stringify(url))
            return await ax.get(url);
        }
        catch (e) {
            console.log(e);
            return { error: e };
        }
    }

    async request(api_call) {
        const response = await this.httpGet(api_call);
        if (response.status !== 200) {
            Client.client.log(Client.client.intlGet(null, 'errorCap'), Client.client.intlGet(null, 'rustStatsApiFailed', { api_call: api_call }), 'error');
            return null;
        }

        return response.data;
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = RustStats;