export type UserConfig = {
    username?: string,
    ladderIdentifier?: string,
    skin?: string,
    logo?: string
}

export type ConfigValues = {

    Ladders: Array<Ladder>;
    Skins: Array<Skin>;
}

type Skin = {
    label: string,
    value: string    
}

type Ladder = {
    identifier: string,
    name: string
}