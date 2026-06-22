/*
  Warnings:

  - Added the required column `titleForm` to the `bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bid" ADD COLUMN     "titleForm" TEXT NOT NULL;
