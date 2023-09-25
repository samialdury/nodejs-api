export type KeyType<T, K extends keyof T> = T[K]

export type ObjectKeys<T> = keyof T

export type ObjectValues<T> = T[keyof T]
