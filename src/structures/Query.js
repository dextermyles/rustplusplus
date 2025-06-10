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

    GET_USER_PROFILE(id) {
        return `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${Config.steam.apiKey}&steamids=${id}`
    }

    GET_USER_PLAYTIME(id) {
        return `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${Config.steam.apiKey}&steamid=${id}&include_appinfo=true&appids_filter[0]=252490`
    }

    GET_USER_ACHIEVEMENTS(id) {
        return `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=252490&key=${Config.steam.apiKey}&steamid=${id}`
    }

    async getUserBanned(id) {
        return await this.request(this.GET_USER_BANNED(id));
    }

    async getUserProfile(id) {
        return await this.request(this.GET_USER_PROFILE(id));
    }
    
    async getUserAchievements(id) {
        return await this.request(this.GET_USER_ACHIEVEMENTS(id));
    }

    async getUserPlaytime(id) {
        return await this.request(this.GET_USER_PLAYTIME(id));
    }

    async getUserStats(id) {
        var p1 = this.request(this.GET_USER_STATISTICS(id))
            .then((resp) => {
                // parse
                if (typeof (resp) === 'string') {
                    resp = JSON.parse(resp);
                }

                return resp;
            })
            .catch((err) => { return err });

        var p2 = this.request(this.GET_USER_RUST_STATS(id))
            .then((resp) => {
                // parse
                if (typeof (resp) === 'string') {
                    resp = JSON.parse(resp);
                }
                return resp;
            })
            .catch((err) => { return err });

        return Promise.all([p1, p2])
            .then((results) => {
                var p1result = results[0];
                var p2result = results[1];

                var finalResponse = {
                    ruststats: {
                        ...p1result
                    },
                    steam: {
                        ...p2result
                    }
                }

                return finalResponse;
            });
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
            this.log(Client.client.intlGet(null, 'errorCap'), Client.client.intlGet(null, 'apiFailed', { api_call: api_call }), 'error');
            throw new Error(response.error);
        }
        return response.data;
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Query;