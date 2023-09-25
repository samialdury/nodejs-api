CREATE TABLE IF NOT EXISTS `user` (
    `id` CHAR(31) NOT NULL,
    `accountProviderId` TINYINT NOT NULL,
    `externalId` VARCHAR(255),
    `email` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `displayName` VARCHAR(255),
    `profileImageUrl` TEXT,
    `lastLoginAt` TIMESTAMP,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deletedAt` TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `email_unique` UNIQUE (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;