/*
  Warnings:

  - Made the column `set` on table `Portfolio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "set" SET NOT NULL;
