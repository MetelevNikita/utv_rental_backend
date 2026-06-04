/*
  Warnings:

  - You are about to drop the column `image` on the `Portfolio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "image",
ADD COLUMN     "image_one" TEXT,
ADD COLUMN     "image_three" TEXT,
ADD COLUMN     "image_two" TEXT;
