export = Query;
declare class Query {
    constructor(guildId?: null);
    guildId: any;
    logger: Logger;
    rustStatsURL: string;
    GET_USER_RUST_STATS(id: any): string;
    GET_USER_STATISTICS(id: any): string;
    GET_USER_BANNED(id: any): string;
    GET_USER_PROFILE(id: any): string;
    GET_USER_PLAYTIME(id: any): string;
    GET_USER_ACHIEVEMENTS(id: any): string;
    getAllData(id: any): Promise<any>;
    getUserBanned(id: any): Promise<any>;
    getUserProfile(id: string): Promise<GetUserProfileDto>;
    getUserAchievements(id: any): Promise<any>;
    getUserPlaytime(id: any): Promise<GetUserPlaytimeDto>;
    getUserStats(id: any): Promise<GetPlayerStatsDto>;
    httpGet(url: any): Promise<Axios.AxiosResponse<any, any> | {
        error: unknown;
    }>;
    request(api_call: any): Promise<any>;
    log(title: any, text: any, level?: string): void;
}

export interface GetUserProfileDto {
  response: Response;
}

export interface Response {
  players: Player[];
}

export interface Player {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  commentpermission: number;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff: number;
  personastate: number;
  realname: string;
  primaryclanid: string;
  timecreated: number;
  personastateflags: number;
  gameserverip: string;
  gameserversteamid: string;
  gameextrainfo: string;
  gameid: string;
  loccountrycode: string;
  locstatecode: string;
}

export interface GetPlayerStatsDto {
  playerstats: Playerstats;
}

export interface Playerstats {
  steamID: string;
  gameName: string;
  stats: Stat[];
  achievements: Achievement[];
}

export interface Achievement {
  name: string;
  achieved: number;
}

export interface Stat {
  name: string;
  value: number;
}

export interface GetUserPlaytimeDto {
  response: GetUserPlaytimeResponse;
}

export interface GetUserPlaytimeResponse {
  game_count: number;
  games: Game[];
}

export interface Game {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
  rtime_last_played: number;
  content_descriptorids: number[];
  playtime_disconnected: number;
}