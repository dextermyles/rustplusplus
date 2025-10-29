const Fs = require('fs');
const Path = require('path');

module.exports = {
    load() {
        var items = JSON.parse(Fs.readFileSync(
            Path.join(__dirname, '..', 'staticFiles', 'items.json'), 'utf8'));

        return items.map(x => {
            return {
                id: x.itemid.toString(),
                name: x.name,
                description: x.description,
                shortname: x.shortname,
                image: Path.join(__dirname, '..', `resources/images/items/${x.shortname}.png`)
            }
        });
    }
}