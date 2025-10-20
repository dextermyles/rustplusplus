import DiscordBot from './src/structures/DiscordBot.js';

import Discord from 'discord.js';
import Fs from 'fs';
import Path from 'path';


/**
 * RppServer
 *
 * Manages the lifecycle of the application's Discord client and ensures required
 * filesystem layout is present before the client is used.
 *
 * Responsibilities:
 * - Instantiate and configure the DiscordBot client with the required gateway
 *   intents and REST options (retries and timeout).
 * - Ensure that the following directories exist (created synchronously if missing):
 *   - logs
 *   - instances
 *   - credentials
 *   - maps
 * - Expose the configured DiscordBot instance via a getter/setter pair.
 * - Provide a build() method that delegates to the underlying client's build routine.
 *
 * Usage example:
 * ```ts
 * const server = new RppServer();
 * server.build();
 * ```
 *
 * Notes:
 * - Directory creation is performed synchronously and may throw if the process
 *   lacks filesystem permissions or the parent path is invalid.
 * - The class expects a DiscordBot type for the client; concrete behavior and
 *   lifecycle are implemented by that client.
 *
 * @public
 */
export class RppServer {
    private _client!: DiscordBot;

    public get client(): DiscordBot {
        return this._client;
    }
    public set client(value: DiscordBot) {
        this._client = value;
    }

    constructor() {
        this.client = new DiscordBot({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildMembers,
                Discord.GatewayIntentBits.GuildVoiceStates],
            rest: {
                retries: 2,
                timeout: 60000
            }
        });

        this.createMissingDirectories();

        process.on('unhandledRejection', error => {
            this.client.log(this.client.intlGet(null, 'errorCap'), this.client.intlGet(null, 'unhandledRejection', {
                error: error
            }), 'error');
            console.log(typeof error);
            console.log(error);
            console.error(error);
        });
    }


    private createMissingDirectories(): void {
        if (!Fs.existsSync(Path.join(__dirname, 'logs'))) {
            Fs.mkdirSync(Path.join(__dirname, 'logs'));
        }

        if (!Fs.existsSync(Path.join(__dirname, 'instances'))) {
            Fs.mkdirSync(Path.join(__dirname, 'instances'));
        }

        if (!Fs.existsSync(Path.join(__dirname, 'credentials'))) {
            Fs.mkdirSync(Path.join(__dirname, 'credentials'));
        }

        if (!Fs.existsSync(Path.join(__dirname, 'maps'))) {
            Fs.mkdirSync(Path.join(__dirname, 'maps'));
        }
    }

    build() {
        this.client.build();
    }
}

exports.RppServer = RppServer;

export default RppServer;