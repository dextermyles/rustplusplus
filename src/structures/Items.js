/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustplusplus

*/

const Fs = require('fs');
const Path = require('path');

const Utils = require('../util/utils.js');
const Assets = require('./Assets.js')

class Items {
    
    constructor() {
        this._items = Assets.load();
        this._itemNames = Object.values(this.items).map(item => item.name);
    }

    /* Getters */
    get items() { return this._items; }
    get itemNames() { return this._itemNames; }

    addItem(id, content) { 
        if (this.itemExist(id))
            return;
        this.items.push(content);
    }

    removeItem(id) { 
        let index = this.items.findIndex(x => x.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    itemExist(id) { 
        for(let x = 0; x < this.items.length; x++) {
            let item = this.items[x];
            if (item.id === id) {
                return true;
            }    
        }
        return false;
    }

    getItem(id) {
        for(let x = 0; x < this.items.length; x++) {
            let item = this.items[x];
            if (item.id === id) {
                return item;
            }    
        }
        return undefined;
    }

    getShortName(id) {
        if (!this.itemExist(id)) return undefined;
        let item = this.getItem(id);
        return item !== undefined ? item.shortname : '';
    }

    getName(id) {
        if (!this.itemExist(id)) return undefined;
        let item = this.getItem(id);
        return item !== undefined ? item.name : '';
    }

    getDescription(id) {
        if (!this.itemExist(id)) return undefined;
        let item = this.getItem(id);
        return item !== undefined ? item.description : '';
    }

    getIdByName(name) {
        let itemByName = this.items.find(x => x.name === name);
        if (itemByName !== undefined) {
            return itemByName.id;
        }
        return undefined;
    }

    getClosestItemIdByName(name) {
        const closestString = Utils.findClosestString(name, this.itemNames);
        if (closestString !== null) {
            const item = this.items.find(x => x.name ===  closestString);
            if (item !== undefined) {
                return item.id;
            }
            return null;
        }
        return null;
    }
}

module.exports = Items;