const Fs = require('fs');
const Path = require('path');

module.exports = {
    load() {
        var items = [{
            id: 0,
            name: '',
            shortname: '',
            description: ''
        }];

        var itemsLoaded = JSON.parse(Fs.readFileSync(
            Path.join(__dirname, '..', 'staticFiles', 'items.json'), 'utf8'));

        items = itemsLoaded;

        return items;
    }
}