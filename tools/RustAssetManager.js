const fs = require('fs');
const path = require('path');

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
        return path.join(this.directory, 'Bundles/items/');
    }

    /**
     * Returns a list of filenames for all of the item image files.
     * "<drive>:\SteamLibrary\steamapps\common\Rust\Bundles\items\*.png"
     */
    getImageFiles() {
        return fs.readdirSync(this.getBundleItemsDirectory()).filter(filename => filename.includes('.png'));
    }

    /**
     * Returns a list of filenames for all of the item metadata files.
     * "<drive>:\SteamLibrary\steamapps\common\Rust\Bundles\items\*.json"
     */
    getMetadataFiles() {
        return fs.readdirSync(this.getBundleItemsDirectory()).filter(filename => filename.includes('.json'));
    }

    /**
     * Combine all of the individual item metadata .json files from
     * the Rust game directory "<drive>:\SteamLibrary\steamapps\common\Rust\Bundles\items\"
     * into a single json payload.
     */
    compileItemsMetadata() {

        const items = new Array();
        const itemsNorm = new Object();
        const itemKeys = new Array();
        const itemsOld = new Array();

        // iterate metadata files
        this.getMetadataFiles().forEach(filename => {

            // get filepath
            const filepath = path.join(this.getBundleItemsDirectory(), filename);

            // read item metadata
            let rawItem = JSON.parse(fs.readFileSync(filepath));
            let keys = Object.keys(rawItem);
            
            for(let k of keys) {
                if (!itemKeys.includes(k))
                    itemKeys.push(k);
            }

            // push item meta we want to keep
            items.push(rawItem);
        });

        console.log(typeof itemKeys);
        console.log(itemKeys);

        console.log(typeof items);
        console.log(items);

        items.forEach(x => {
            let itemIdStr = new String(x.itemid);
            let itemid = parseInt(itemIdStr);

            itemsNorm[itemid] = {
                ...x,
                image: path.join(__dirname, '..', `src/resources/images/items/${x.shortname}.png`)
            }

            itemsOld.push({
                id: x.itemid,
                shortname: x.shortname,
                name: x.Name,
                description: x.Description,
                image: path.join(__dirname, '..', `src/resources/images/items/${x.shortname}.png`)
            });

        });

        console.log(typeof itemsNorm);
        console.log(itemsNorm);

        return JSON.stringify(itemsOld, null, 4);
    }

    /**
     * Writes the compiled items metadata to the provided destination
     * @param destination
     */
    writeItemsMetadata(destination) {
        let metadata = this.compileItemsMetadata();
        console.log(typeof metadata);
        console.log(metadata);
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