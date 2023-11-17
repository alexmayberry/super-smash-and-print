/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `accessToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `isOnline` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'test_title',
    "shop" TEXT NOT NULL DEFAULT 'test_shop',
    "productId" TEXT NOT NULL DEFAULT 'test_product_id',
    "productHandle" TEXT NOT NULL DEFAULT 'test_product_handle',
    "productVariantId" TEXT NOT NULL DEFAULT 'test_product_vaitent_id',
    "destination" TEXT NOT NULL DEFAULT 'test_home',
    "scans" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Session" ("id", "shop") SELECT "id", "shop" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
