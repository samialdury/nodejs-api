export type FirstProperty<T> = T extends { [K in keyof T]: infer U } ? U : never

export type PropertyType<T, K extends keyof T> = T[K]

export type ObjectKeys<T> = keyof T

export type ObjectValues<T> = T[keyof T]
