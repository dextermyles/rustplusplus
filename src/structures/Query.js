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
                try {
                    if (typeof (resp) === 'string') {
                        resp = JSON.parse(resp);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
                return resp;
            })
    }

    getUserProfile(id) {
        return this.request(this.GET_USER_PROFILE(id))
            .then((resp) => {
                // parse
                try {
                    if (typeof (resp) === 'string') {
                        resp = JSON.parse(resp);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
                return resp;
            })
    }

    getUserAchievements(id) {
        return this.request(this.GET_USER_ACHIEVEMENTS(id))
            .then((resp) => {
                // parse
                try {
                    if (typeof (resp) === 'string') {
                        resp = JSON.parse(resp);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
                return resp;
            })
    }

    getUserPlaytime(id) {
        return this.request(this.GET_USER_PLAYTIME(id))
            .then((resp) => {
                // parse
                try {
                    if (typeof (resp) === 'string') {
                        resp = JSON.parse(resp);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
                return resp;
            })
    }

    getUserStats(id) {
        return this.request(this.GET_USER_RUST_STATS(id))
            .then((resp) => {
                // parse
                try {
                    if (typeof (resp) === 'string') {
                        resp = JSON.parse(resp);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
                return resp;
            })
    }

    async getServerBattleMetrics(serverId) {
        let bmResponse = await this.#get(`https://api.battlemetrics.com/servers/27286944?include=player`);
        var data = bmResponse.data;
        var status = bmResponse.status;
        var text = bmResponse.statusText;
        console.log(`getServerBattleMetrics [${serverId}] status [{${status}}] text [${text}] data: `)
        console.log(data);
        console.log('-----------------\n')
        return data;
    }

    async getRusticatedStats(id, type = 0) {
        let url = type === 0
            ? this.GET_RUSTICATED_KILL_HISTORY(id)
            : this.GET_RUSTICATED_DEATH_HISTORY(id);

        let response = await this.#get(url);
        var data = response.data;

        try {
            if (typeof data === 'string')
                data = JSON.parse(data);
        }

        catch (e) {
            return 'failed to parse response: ' + e;
        }

        this.log('RUSTICATED', JSON.stringify(data));

        return data;
    }

    async httpGet(url) {
        let ax = new Axios.Axios({ headers: { 'Accept': 'application/json' } });
        return ax.get(url, { responseType: 'json ' });
    }

    /**
     *  Request a get call from the Axios library.
     *  @param {string} api_call The request api call string.
     *  @return {object} The response from Axios library.
     */
    async #get(api_call) {
        try {
            let ax = new Axios.Axios();
            return await ax.get(api_call);
        }
        catch (e) {
            return { error: e };
        }
    }

    async request(api_call) {
        try {
            var response = await this.httpGet(api_call);
            var retries = 0;

            try {
                var responseStr = JSON.stringify(response);
                this.log('HTTP RESP', responseStr);
            }
            catch (ex) {
                
            }

            if (response.status !== 200) {
                while (response.status === 429 && retries < 10) {
                    response = await this.httpGet(api_call);
                    retries++;
                }
            }

            if (response.status !== 200) {
                var message = '';
                message = response.data;
                return { error: `Request failed [${response.status}]: ${message}` }
            }
            return response.data;
        }
        catch (ex) {
            return { error: `request error [${response.status}]: ${ex}` }
        }
    }

    log(title, text, level = 'info') {
        this.logger.log(title, text, level);
    }

}

module.exports = Query;