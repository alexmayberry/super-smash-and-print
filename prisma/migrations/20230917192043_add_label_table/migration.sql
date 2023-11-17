/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Label" (
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
