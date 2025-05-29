declare namespace Assets {
    function load(): Assets.Item[];

    interface Item {
        id: number;
        name: string;
        shortname: string;
        description: string;
    }
}

export = Assets;
