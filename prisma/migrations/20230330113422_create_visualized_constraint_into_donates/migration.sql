/*
  Warnings:

  - Added the required column `visualized` to the `donates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donates" ADD COLUMN     "visualized" BOOLEAN NOT NULL;
