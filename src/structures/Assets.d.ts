export = Assets;
declare namespace Assets {
    declare function load(): IItemCollection;
}

export interface IItemCollection {
    [name: string]: Item
}

export interface Item {
    itemid: number;
    shortname: string;
    Name: string;
    Description: null | string;
    Category: Category;
    maxDraggable: number;
    ItemType: ItemType;
    AmountType: AmountType;
    stackable: number;
    quickDespawn: boolean;
    rarity: Rarity;
    condition: Condition;
    Parent: number;
    isWearable: boolean;
    isHoldable: boolean;
    isUsable: boolean;
    HasSkins: boolean;
}

export enum AmountType {
    BagLimit = "BagLimit",
    ContentCount = "ContentCount",
    Count = "Count",
    Feet = "Feet",
    Frequency = "Frequency",
    Generic = "Generic",
    Genetics = "Genetics",
    Millilitre = "Millilitre",
    NucleusGrades = "NucleusGrades",
    OxygenSeconds = "OxygenSeconds",
    ShelterLimit = "ShelterLimit",
    TurretLimit = "TurretLimit",
}

export enum Category {
    Ammunition = "Ammunition",
    Attire = "Attire",
    Component = "Component",
    Construction = "Construction",
    Electrical = "Electrical",
    Food = "Food",
    Fun = "Fun",
    Items = "Items",
    Medical = "Medical",
    Misc = "Misc",
    Resources = "Resources",
    Tool = "Tool",
    Traps = "Traps",
    Weapon = "Weapon",
}

export enum ItemType {
    Generic = "Generic",
    Liquid = "Liquid",
}

export interface Condition {
    enabled: boolean;
    max: number;
    repairable: boolean;
}

export enum Rarity {
    Common = "Common",
    None = "None",
    Rare = "Rare",
    Uncommon = "Uncommon",
    VeryRare = "VeryRare",
}
