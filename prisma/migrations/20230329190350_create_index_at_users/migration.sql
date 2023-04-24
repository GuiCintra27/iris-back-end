/*
  Warnings:

  - Added the required column `amount` to the `donates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "donates" ADD COLUMN     "amount" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");
