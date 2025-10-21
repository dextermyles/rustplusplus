const Fs = require('fs');
const Path = require('path');

module.exports = {
    load() {
        var items = [{
            id: '',
            name: '',
            shortname: '',
            description: '',
            image: ''
        }];

        var itemsLoaded = JSON.parse(Fs.readFileSync(
            Path.join(__dirname, '..', 'staticFiles', 'items.json'), 'utf8'));

        items = itemsLoaded;

        items = items.map(x => {
            return {
                id: x.id.toString(),
                name: x.name,
                description: x.description,
                shortname: x.shortname,
                image: Path.join(__dirname, '..', `resources/images/items/${x.shortname}.png`)
            }
        });

        return items;
    }
}