CREATE TABLE IF NOT EXISTS 'project' (
    id INTEGER PRIMARY KEY NOT NULL,
    oid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deletedAt TEXT,
    authorOid TEXT NOT NULL,
    FOREIGN KEY (authorOid) REFERENCES user(oid)
);