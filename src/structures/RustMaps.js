import { Axios } from "axios";

export const RustMapsAuthKey = `a038a17f90c542e786f29738d84ec699`
const searchUrl = `https://api.rustmaps.com/internal/v1/servers/search?input=185.248.134.85%3A28010&onlyServersWithPlayers=true`

module.exports = RustMaps;

class RustMaps {

    constructor(guildId = null) {
        this.guildId = guildId;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/query.log'), 'default');
        this.logger.setGuildId(this.guildId);
        this.rustStatsURL = Config.ruststats.baseUrl;
    }

    async httpGet(url) {
        let ax = new Axios(
            {
                headers:
                {
                    'Content-Type': 'application/json',
                    'X-API-Key': RustMapsAuthKey
                }
            })            ;
        return await ax.get(url);
    }
}