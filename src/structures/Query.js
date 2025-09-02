const Fs = require('fs');
const Path = require('path');
const Logger = require('./Logger');

const Axios = require('axios');
const Client = require('../..');
const Config = require('../../config');
const Steam = require('steamapi');

class Query {
    

    constructor(guildId = null) {
        this.guildId = guildId;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/query.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.rustStatsURL = Config.ruststats.baseUrl;
        this.steam = new Steam.default(Config.steam.apiKey);
    }


    GET_USER_RUST_STATS(id) {
        return `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2/?appid=252490&key=${Config.steam.apiKey}&steamid=${id}`
    }

    GET_USER_GAMBLING_STATS(id) {
        return `https://rusticated.com/api/v3/leaderboard?hidden=false&limit=10&offset=0&group=gambling&sortBy=gambling_pokerwon&sortDir=desc&type=player&eventType=kill_player&filter=${id}&serverId=uslong&serverWipeId=3623&attackerSteamId=&orgId=1`
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

    async getUserSummary(id) {
        try {
            if (typeof id !== 'string' || !id)
                throw new Error('Invalid Steam ID');

            const resp = await this.steam.getUserSummary(id);
            console.log('user summary', JSON.stringify(resp));
            return resp;
        }
        catch (e) {
            console.error(e);
            this.log('STEAMAPI', e, 'error');
            return Promise.reject(e);
        }
    }

    async getUserStatsV2(id) {
        try {
            if (typeof id !== 'string' || !id)
                throw new Error('Invalid Steam ID');

            const resp = await this.steam.getUserStats(id, Config.general.rustAppId);
            console.log('user stats v2', JSON.stringify(resp));
            return resp;
        }
        catch (e) {
            console.error(e);
            this.log('STEAMAPI', e, 'error');
            return Promise.reject(e );
        }

    }

    async getGamblingStats(id) {
        let statsResponse = await this.request(this.GET_USER_GAMBLING_STATS(id));
        console.log(statsResponse);
        let data, entries = [{
            rank: 0, steamId: '', username: '', stats: {
                gambling_pokerwon: 0,
                gambling_pokerdeposited: 0,
                gambling_slotwon: 0,
                gambling_slotdeposited: 0,
                gambling_wheelwon: 0,
                gambling_wheeldeposited: 0,
                gambling_blackjackdeposited: 0,
                gambling_blackjackwon: 0
            }
        }];
        data = statsResponse.data;
        entries = data.entries;

        let firstEntry = entries.find(X => X.steamId === id);
        let slotsNet = firstEntry.stats.gambling_slotwon - firstEntry.stats.gambling_slotdeposited;
        let bjNet = firstEntry.stats.gambling_blackjackwon - firstEntry.stats.gambling_blackjackdeposited;
        let wheelNet = firstEntry.stats.gambling_wheelwon - firstEntry.stats.gambling_wheeldeposited;
        let netProfits = slotsNet + bjNet + wheelNet;

        let slotsStr = `Slots: W [${firstEntry.stats.gambling_slotwon}] NET [${slotsNet}]`
        let bjStr = `BJ: W [${firstEntry.stats.gambling_blackjackwon}] NET [${bjNet}]`;
        let wheelStr = `Wheel: W [${firstEntry.stats.gambling_wheeldeposited}] NET [${wheelNet}]`;
        let finalStr = `Profits: ${netProfits}`;

        return [slotsStr, bjStr, wheelStr, finalStr];
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
        const response = await this.#request(url);

        if (response.status !== 200) {
            Client.client.log(Client.client.intlGet(null, 'errorCap'),
                Client.client.intlGet(null, 'apiRequestFailed', { api_call: url }), 'error');

            if (response.status === 401)
                throw new Error('Access denied');

            return null;
        }

        try {
            if (typeof (response.data) === 'string')
                return JSON.parse(response.data);
        }
        catch (e) { }

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