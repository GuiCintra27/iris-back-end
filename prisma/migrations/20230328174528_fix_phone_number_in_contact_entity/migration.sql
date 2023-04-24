/*
  Warnings:

  - You are about to alter the column `telephone` on the `contact` table. The data in that column could be lost. The data in that column will be cast from `VarChar(15)` to `VarChar(11)`.

*/
-- AlterTable
ALTER TABLE "contact" ALTER COLUMN "telephone" SET DATA TYPE VARCHAR(11);
