/*
  Warnings:

  - Added the required column `Set` to the `PackProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Set` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackProduct" ADD COLUMN     "Set" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "Set" TEXT NOT NULL;
