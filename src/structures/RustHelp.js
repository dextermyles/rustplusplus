const cheerio = require('cheerio');
const Fs = require('fs');
const Path = require('path');
const Logger = require('./Logger');
const Axios = require('axios');
const { setupCache } = require('axios-cache-interceptor');
const { default: puppeteer } = require('puppeteer');
const Jimp = require('jimp');



class RustHelp {

    // Target URL
    url = "https://rusthelp.com/downloads/admin-item-list-public.json";
    itemUrl = `https://rusthelp.com/items/`;

    directory = './src/staticFiles/';

    /**
     *  Constructor for the RustLabs Class.
     */
    constructor(guidId = null) {
        this.guildId = guildId;
        this.logger = new Logger(Path.join(__dirname, '..', '..', 'logs/rusthelp.log'), 'default');
        this.logger.setGuildId(this.guildId);
    }

    getItemUrl(name) {
        name = name.replace(' ', '-');
        let newName = '';
        newName = name;
        return `${this.itemUrl}/${newName.toLowerCase()}`;
    }

    async fetch() {
        try {
            // Fetch page
            let ax = new Axios.Axios();
            const { data } = await ax.get(this.url, {responseType: 'json'});


            // Load HTML
            const items = JSON.parse(data);

            // Save to JSON file
            fs.writeFileSync(`${this.directory}/rusthelp_itemlist.json`, JSON.stringify(items, null, 2), "utf-8");
            this.log(`Extracted ${items.length} items → saved to ${this.directory}/rusthelp_itemlist.json`);
        } catch (error) {
            this.logError("Error fetching or parsing data:", error);
        }
    }

    async fetchItem(name) {
        try {
            // Fetch page
            // Launch the browser and open a new blank page
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            
            await page.goto(this.getItemUrl(name), { waitUntil: 'networkidle2'});
            var pageHtml = await page.content();
            await page.screenshot({fullPage: true, path: `${this.directory}/test.png`});
            await browser.close();
            const $ = cheerio.load(pageHtml);
            const testStr = $.html();
            this.log(testStr);
            return $;
        } catch (error) {
            this.logError("Error fetching or parsing data: " + error);
        }
    }

    log(text, title = 'RustHelp', level = 'info') {
        this.logger.log(title, message, level);
    }

    logError(text, title = 'RustHelp Error') {
        this.logger.log(title, message, 'error');
    }
}

module.exports = RustHelp;