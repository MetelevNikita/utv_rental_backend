/*
  Warnings:

  - You are about to drop the column `Set` on the `PackProduct` table. All the data in the column will be lost.
  - You are about to drop the column `Set` on the `Product` table. All the data in the column will be lost.
  - Added the required column `set` to the `PackProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `set` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackProduct" DROP COLUMN "Set",
ADD COLUMN     "set" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "Set",
ADD COLUMN     "set" TEXT NOT NULL;
