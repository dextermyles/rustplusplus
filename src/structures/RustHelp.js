const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

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
    constructor() {
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

            console.log(`Extracted ${items.length} items → saved to ${this.directory}/rusthelp_itemlist.json`);
        } catch (error) {
            console.error("Error fetching or parsing data:", error);
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
            console.log(testStr);
            return $;
        } catch (error) {
            console.error("Error fetching or parsing data:", error);
        }
    }
}

module.exports = RustHelp;