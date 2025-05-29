const Fs = require('fs');
const Path = require('path');

export const load = () => { 
    return JSON.parse(Fs.readFileSync(
            Path.join(__dirname, '..', 'staticFiles', 'items.json'), 'utf8'));
}