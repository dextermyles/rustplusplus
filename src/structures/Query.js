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
        return `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?appid=252490&key=${Config.steam.apiKey}&steamid=${id}`
    }

    GET_USER_BANNED(id) {
        return `${Config.ruststats.baseUrl}/public-api/user/banned?steam_id=${id}`
    }

    GET_USER_PROFILE(id) {
        return `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${Config.steam.apiKey}&steamids=${id}`
    }

    GET_USER_PLAYTIME(id) {
        return `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${Config.steam.apiKey}&steamid=${id}`
    }

    GET_USER_ACHIEVEMENTS(id) {
        return `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?appid=252490&key=${Config.steam.apiKey}&steamid=${id}&l=en`
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

    async httpGet(url) {
        let ax = new Axios.Axios({ headers: { 'Content-Type': 'application/json' } });
        var result = await ax.get(url);
        try {
            this.log('HTTP', JSON.stringify(result.data));
        }
        catch(e) {
            this.log('HTTP', e);
        }
        return result;
    }

    async request(api_call) {
        try {
            var response = await this.httpGet(api_call);
            var retries = 0;

            if (response.status !== 200) {
                while (response.status === 429 && retries < 10) {
                    response = await this.httpGet(api_call);
                    retries++;
                }
            }

            if (response.status !== 200) {
                this.log(Client.client.intlGet(null, 'errorCap'), Client.client.intlGet(null, 'apiFailed', { api_call: api_call }), 'error');
                var message = '';
                message = response.data;
                return { error: `Request failed [${response.status}]: ${message}` }
            }
            return response.data;
        }
        catch (ex) {
            return { error: `request error: ${ex}` }
        }
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Query;