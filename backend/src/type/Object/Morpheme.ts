/**
 * 词素
 */
export class Morpheme {
    text!: string
    types: MorphemeType[] = []
}

/**
 * 词素的类型
 */
export enum MorphemeType {
    NOUN = "NOUN"
}
