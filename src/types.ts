export type UserConfig = {
    username?: string,
    ladderIdentifier?: string,
    skin?: string,
    logo?: string,
    positionX: number|undefined,
    positionY: number|undefined
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