export = Logger;
declare class Logger {
    constructor(logFilePath: any, type: any);
    logger: Winston.Logger;
    type: any;
    guildId: any;
    serverName: any;
    setGuildId(guildId: any): void;
    getTime(): string;
    log(title: any, text: any, level: any): void;
}
import Winston = require("winston");
