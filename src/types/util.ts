/**
 * This type is used to prettify the type of an object.
 * It takes a type as its argument and returns a new type that has the same properties as the original type,
 * but the properties are not intersected. This means that the new type is easier to read and understand.
 *
 * Source: {@link https://gist.github.com/palashmon/db68706d4f26d2dbf187e76409905399}
 */
export type Prettify<T> = {
    [K in keyof T]: T[K]
    // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export type KeyType<T, K extends keyof T> = T[K]

export type ObjectKeys<T> = keyof T

export type ObjectValues<T> = T[keyof T]
