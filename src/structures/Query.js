const Fs = require('fs');
const Path = require('path');
const Logger = require('./Logger');

const Axios = require('axios');
const Client = require('../..');
const Config = require('../../config');

class Query {

    constructor(guildId = null) {
        this.guildId = guildId;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/query.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.rustStatsURL = Config.ruststats.baseUrl;
    }

    GET_USER_STATISTICS(id) {
        return `public-api/user/statistics?steam_id=${id}`
    }

    GET_USER_BANNED(id) {
        return `public-api/user/banned?steam_id=${id}`
    }

    async getUserBanned(id) {
        return await this.request(this.GET_USER_BANNED(id));
    }

    async getUserStats(id) {
        return await this.request(this.GET_USER_STATISTICS(id));
    }

    async httpGet(url) {
        let requestUrl = `${Config.ruststats.baseUrl}/${url}`;
        let authKey = `ApiKey ${Config.ruststats.apiKey}`;
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authKey
            }
        };

        try {
            let ax = new Axios.Axios(config);
            this.log('httpGet', ax);

            return await ax.get(requestUrl);
        }
        catch (e) {
            this.log('httpGet', e, 'error');
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

module.exports = Query;