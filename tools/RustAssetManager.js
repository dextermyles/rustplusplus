const fs = require("fs");
const path = require("path");

class RustAssetManager {
    constructor(directory) {
        this.directory = directory;
    }

    /***
     * Returns the path to the bundled Rust items directory.
     * "<drive>:\SteamLibrary\steamapps\common\Rust\Bundles\items\"
     * @return {string}
     */
    getBundleItemsDirectory() {
        return path.join(this.directory, "Bundles/items/");
    }

    /**
     * Returns a list of filenames for all of the item image files.
     * "<drive>:\SteamLibrary\steamapps\common\Rust\Bundles\items\*.png"
     */
    getImageFiles() {
        return fs
            .readdirSync(this.getBundleItemsDirectory())
            .filter((filename) => filename.includes(".png"));
    }

    /**
     * Returns a list of filenames for all of the item metadata files.
     * "<drive>:\SteamLibrary\steamapps\common\Rust\Bundles\items\*.json"
     */
    getMetadataFiles() {
        return fs
            .readdirSync(this.getBundleItemsDirectory())
            .filter((filename) => filename.includes(".json"));
    }

    /**
     * Combine all of the individual item metadata .json files from
     * the Rust game directory "<drive>:\SteamLibrary\steamapps\common\Rust\Bundles\items\"
     * into a single json payload.
     */
    compileItemsMetadata() {
        let items = new Array();
        let itemsNorm = new Object();
        const itemKeys = new Array();
        let itemsOld = new Array();

        // iterate metadata files
        this.getMetadataFiles().forEach((filename) => {
            // get filepath
            const filepath = path.join(this.getBundleItemsDirectory(), filename);

            // read item metadata
            let rawItem = JSON.parse(fs.readFileSync(filepath));
            let keys = Object.keys(rawItem);
            for (let k of keys) {
                if (!itemKeys.includes(k))
                    itemKeys.push(k);
            }
            items.push(rawItem);
        });

        console.log(itemKeys);

        items.forEach((x) => {
            let itemIdStr = new String(x.itemid);
            itemsNorm[itemIdStr] = RustAssetManager.copy(x);
        });

        console.log('itemsNorm: ', itemsNorm);
        return JSON.stringify(itemsNorm);
    }

    static copy(source) {
        let mutatedItem = new Object();
        return Object.assign(mutatedItem, source);
    }

    /**
     * Writes the compiled items metadata to the provided destination
     * @param destination
     */
    writeItemsMetadata(destination) {
        let metadata = this.compileItemsMetadata();
        fs.writeFileSync(destination, metadata);
    }

    /**
     * Copy all item images to the provided destination
     * @param destination
     */
    copyItemImages(destination) {
        this.getImageFiles().forEach((image) => {
            const source = path.join(this.getBundleItemsDirectory(), image);
            const dest = path.join(destination, image);
            fs.copyFileSync(source, dest);
        });
    }
}

module.exports = RustAssetManager;