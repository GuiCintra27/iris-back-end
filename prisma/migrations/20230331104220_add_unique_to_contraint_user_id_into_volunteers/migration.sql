/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `volunteers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "volunteers_userId_key" ON "volunteers"("userId");
