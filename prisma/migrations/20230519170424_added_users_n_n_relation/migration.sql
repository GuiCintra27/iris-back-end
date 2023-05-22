/*
  Warnings:

  - You are about to drop the column `userId` on the `recentlyVisited` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "recentlyVisited" DROP CONSTRAINT "recentlyVisited_userId_fkey";

-- AlterTable
ALTER TABLE "recentlyVisited" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_recentlyVisitedTousers" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_recentlyVisitedTousers_AB_unique" ON "_recentlyVisitedTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_recentlyVisitedTousers_B_index" ON "_recentlyVisitedTousers"("B");

-- AddForeignKey
ALTER TABLE "_recentlyVisitedTousers" ADD CONSTRAINT "_recentlyVisitedTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "recentlyVisited"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recentlyVisitedTousers" ADD CONSTRAINT "_recentlyVisitedTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
