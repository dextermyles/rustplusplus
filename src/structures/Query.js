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

    getAllData(id) {
        return Promise.all([
            this.getUserProfile(id),
            this.getUserPlaytime(id),
            this.getUserAchievements(id)
        ]);
    }
    getUserBanned(id) {
        return this.request(this.GET_USER_BANNED(id))
            .then((resp) => {
                // parse
                if (typeof (resp) === 'string') {
                    resp = JSON.parse(resp);
                }
                return resp;
            })
            .catch((err) => { return err });
    }

    getUserProfile(id) {
        return this.request(this.GET_USER_PROFILE(id))
            .then((resp) => {
                // parse
                if (typeof (resp) === 'string') {
                    resp = JSON.parse(resp);
                }
                return resp;
            })
            .catch((err) => { return err });
    }

    getUserAchievements(id) {
        return this.request(this.GET_USER_ACHIEVEMENTS(id))
            .then((resp) => {
                // parse
                if (typeof (resp) === 'string') {
                    resp = JSON.parse(resp);
                }
                return resp;
            })
            .catch((err) => { return err });
    }

    getUserPlaytime(id) {
        return this.request(this.GET_USER_PLAYTIME(id))
            .then((resp) => {
                // parse
                if (typeof (resp) === 'string') {
                    resp = JSON.parse(resp);
                }
                return resp;
            })
            .catch((err) => { return err });
    }

    getUserStats(id) {
        return this.request(this.GET_USER_RUST_STATS(id))
            .then((resp) => {
                // parse
                if (typeof (resp) === 'string') {
                    resp = JSON.parse(resp);
                }
                return resp;
            })
            .catch((err) => { return err });
    }

    httpGet(url) {
        let requestUrl = url;
        let authKey = `ApiKey ${Config.ruststats.apiKey}`;
        let config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': url.indexOf(Config.ruststats.baseUrl) > -1 ? authKey : ''
            }
        };

        let ax = new Axios.Axios(config);
        return ax.get(requestUrl);
    }

    async request(api_call) {
        var response = await this.httpGet(api_call);
        var retries = 0;
        while (response.status === 429 || retries >= 10) {
            response = await this.httpGet(api_call);
            retries++;
        }

        if (response.status !== 200) {
            this.log(Client.client.intlGet(null, 'errorCap'), Client.client.intlGet(null, 'apiFailed', { api_call: api_call }), 'error');
            return { error: `Request failed: ${response.statusText}` }
        }

        this.log('HTTP RESPONSE', JSON.stringify(response.data));
        console.log(response.data);
        return response.data;
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Query;