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

    GET_USER_RUST_STATS(id) {
        return `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=252490&key=${Config.steam.apiKey}&steamid=${id}&include_appinfo=1`
    }

    GET_USER_STATISTICS(id) {
        return `${Config.ruststats.baseUrl}/public-api/user/statistics?steam_id=${id}`
    }

    GET_USER_BANNED(id) {
        return `${Config.ruststats.baseUrl}/public-api/user/banned?steam_id=${id}`
    }

    async getUserBanned(id) {
        return await this.request(this.GET_USER_BANNED(id));
    }

    async getUserStats(id) {
        var promise = new Promise(async (resolve, reject) => {
            await this.request(this.GET_USER_STATISTICS(id))
                .then(async (resp) => {
                    // parse
                    if (typeof (resp) === 'string') {
                        resp = JSON.parse(resp);
                    }
                    await this.request(this.GET_USER_RUST_STATS(id))
                        .then((stats) => {
                            // parse
                            if (typeof (stats) === 'string') {
                                stats = JSON.parse(stats);
                            }
                            // return from steam api
                            var finalResponse = {
                                ruststats: {
                                    ...resp
                                },
                                steam: {
                                    ...stats
                                }
                            }
                            // return final response
                            resolve(finalResponse);
                        })
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });

        return promise;
    }

    async httpGet(url) {
        let requestUrl = url;
        let authKey = `ApiKey ${Config.ruststats.apiKey}`;
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': url.indexOf(Config.ruststats.baseUrl) > -1 ? authKey : ''
            }
        };

        try {
            let ax = new Axios.Axios(config);
            this.log('HTTP OUT CONFIG', JSON.stringify(config));
            this.log('HTTP OUT URL', requestUrl);
            return await ax.get(requestUrl);
        }
        catch (e) {
            this.log('HTTP ERROR', e, 'error');
            return { error: e };
        }
    }

    async request(api_call) {
        const response = await this.httpGet(api_call);
        if (response.status !== 200) {
            Client.client.log(Client.client.intlGet(null, 'errorCap'), Client.client.intlGet(null, 'apiFailed', { api_call: api_call }), 'error');
            console.error('RESPONSE FAILED: ', response);
            return null;
        }
        return response.data;
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Query;