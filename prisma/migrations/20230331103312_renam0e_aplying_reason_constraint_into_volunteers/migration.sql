/*
  Warnings:

  - You are about to drop the column `aplyingReason` on the `volunteers` table. All the data in the column will be lost.
  - Added the required column `applyingReason` to the `volunteers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "volunteers" DROP COLUMN "aplyingReason",
ADD COLUMN     "applyingReason" TEXT NOT NULL;
