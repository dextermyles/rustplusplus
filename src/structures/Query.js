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

    GET_RUSTICATED_KILL_HISTORY(id) {
        return `https://rusticated.com/api/v3/events/kills-minimal?attackerSteamId=${id}&offset=0&orgId=1&serverId=uslong`
    }

    GET_RUSTICATED_DEATH_HISTORY(id) {
        return `https://rusticated.com/api/v3/events/kills-minimal?victimSteamId=${id}&offset=0&orgId=1&serverId=uslong`
    }

    GET_VANITY_URL(username) {
        return `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${Config.steam.apiKey}&vanityurl=${username}`
    }

    getVanityUrl(username) {
        return this.#get(this.GET_VANITY_URL(username));
    }

    getAllData(id) {
        return Promise.all([
            this.getUserProfile(id),
            this.getUserPlaytime(id),
            this.getUserAchievements(id)
        ]);
    }
    getUserBanned(id) {
        return this.request(this.GET_USER_BANNED(id));
    }

    getUserProfile(id) {
        return this.request(this.GET_USER_PROFILE(id));
    }

    getUserAchievements(id) {
        return this.request(this.GET_USER_ACHIEVEMENTS(id));
    }

    getUserPlaytime(id) {
        return this.request(this.GET_USER_PLAYTIME(id));
    }

    getUserStats(id) {
        return this.request(this.GET_USER_RUST_STATS(id));
    }

    getServerBattleMetrics(serverId) {
        return this.request(`https://api.battlemetrics.com/servers/27286944?include=player`);
    }

    getRusticatedStats(id, type = 0) {
        let url = type === 0
            ? this.GET_RUSTICATED_KILL_HISTORY(id)
            : this.GET_RUSTICATED_DEATH_HISTORY(id);

        return this.request(url);
    }

    httpGet(url) {
        let ax = new Axios.Axios();
        return ax.get(url)
            .then((response) => {
                console.log(response);
                this.log('HTTP RESPONSE', JSON.stringify(response));
                return response;
            });
    }

    async request(url) {
        const response = await this.#request(url, { responseType: 'json', headers: { "Content-Type": "application/json", "User-Agent": "BigRaidHunter Mozilla/5.0" } });

        if (response.status !== 200) {
            Client.client.log(Client.client.intlGet(null, 'errorCap'),
                Client.client.intlGet(null, 'apiRequestFailed', { api_call: api_call }), 'error');
            return null;
        }

        return response.data;
    }

    async #request(url, config) {
        let ax = new Axios.Axios(config);
        return await ax.get(url)
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    this.log('HTTP.DATA', error.response.data);
                    this.log('HTTP.STATUS', error.response.status);
                    this.log('HTTP.HEADESR', error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
                return Promise.reject(error);
            });
    }

    /**
     * http get request
     * @param {*} api_call 
     * @returns 
     */
    #get(api_call) {
        let ax = new Axios.Axios();
        return ax.get(api_call)
            .then((response) => {
                if (response.status >= 400)
                    return Promise.reject(response.data);

                var data = response?.data;
                try {
                    if (typeof (data) === 'string')
                        data = JSON.parse(data);
                }
                catch (ex) { }
                return data;
            });
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Query;