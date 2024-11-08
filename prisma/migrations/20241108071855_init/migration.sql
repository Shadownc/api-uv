-- CreateTable
CREATE TABLE `Api` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `returnType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parameter` (
    `id` VARCHAR(191) NOT NULL,
    `apiId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `required` BOOLEAN NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    INDEX `Parameter_apiId_idx`(`apiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Response` (
    `id` VARCHAR(191) NOT NULL,
    `apiId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `required` BOOLEAN NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    INDEX `Response_apiId_idx`(`apiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Example` (
    `id` VARCHAR(191) NOT NULL,
    `apiId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,

    INDEX `Example_apiId_idx`(`apiId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiCall` (
    `id` VARCHAR(191) NOT NULL,
    `apiId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Parameter` ADD CONSTRAINT `Parameter_apiId_fkey` FOREIGN KEY (`apiId`) REFERENCES `Api`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Response` ADD CONSTRAINT `Response_apiId_fkey` FOREIGN KEY (`apiId`) REFERENCES `Api`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Example` ADD CONSTRAINT `Example_apiId_fkey` FOREIGN KEY (`apiId`) REFERENCES `Api`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiCall` ADD CONSTRAINT `ApiCall_apiId_fkey` FOREIGN KEY (`apiId`) REFERENCES `Api`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
