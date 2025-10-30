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
const Assets = require('./Assets')

const staticItemsList = Assets.load();
class Items {

    constructor() {
        this._items = Assets.load();
        const names = new Array();
        const keys = Object.keys(this.items);
        for (let k of keys) {
            names.push(this.items[k].Name);
        }
        this._itemNames = [
            ...names
        ]
    }

    /* Getters */
    get items() { return this._items; }
    get itemNames() { return this._itemNames; }

    addItem(id, content) {
        if (this.itemExist(id))
            return;
        this.items[id] = content;
    }

    removeItem(id) {
        if (typeof id === 'number')
            id = id.toString();
        delete this.items[id];
    }

    itemExist(id) {
        if (typeof id === 'number')
            id = id.toString();

        return this.items[id] !== undefined;
    }

    getItem(id) {
        if (typeof id === 'number')
            id = id.toString();

        return this.items[id];
    }

    getShortName(id) {
        if (!this.itemExist(id))
            return undefined;
        let item = this.getItem(id);
        return item !== undefined ? item.shortname : '';
    }

    getName(id) {
        if (!this.itemExist(id))
            return undefined;
        let item = this.getItem(id);
        return item !== undefined ? item.Name : '';
    }

    getDescription(id) {
        if (!this.itemExist(id)) return undefined;
        let item = this.getItem(id);
        return item !== undefined ? item.Description : '';
    }

    getIdByName(name) {
        let keys = Object.keys(this.items);
        for (let k of keys) {
            let item = this.items[k];
            if (item.Name === name)
                return k;
        }
    }

    getClosestItemIdByName(name) {
        const closestString = Utils.findClosestString(name, this.itemNames);
        if (closestString !== null) {
            return this.getIdByName(closestString);
        }
        return undefined;
    }
}

module.exports = Items;