CREATE TABLE IF NOT EXISTS 'user' (
    id INTEGER PRIMARY KEY NOT NULL,
    oid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT
);