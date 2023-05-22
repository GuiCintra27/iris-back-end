/*
  Warnings:

  - You are about to drop the `_recentlyVisitedTousers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recentlyVisited` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_recentlyVisitedTousers" DROP CONSTRAINT "_recentlyVisitedTousers_A_fkey";

-- DropForeignKey
ALTER TABLE "_recentlyVisitedTousers" DROP CONSTRAINT "_recentlyVisitedTousers_B_fkey";

-- DropTable
DROP TABLE "_recentlyVisitedTousers";

-- DropTable
DROP TABLE "recentlyVisited";

-- CreateTable
CREATE TABLE "recentlySearchedByUser" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recentlySearchedId" TEXT NOT NULL,
    "usersId" INTEGER,

    CONSTRAINT "recentlySearchedByUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recentlySearched" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "recentlySearched_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recentlySearchedByUser" ADD CONSTRAINT "recentlySearchedByUser_recentlySearchedId_fkey" FOREIGN KEY ("recentlySearchedId") REFERENCES "recentlySearched"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recentlySearchedByUser" ADD CONSTRAINT "recentlySearchedByUser_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
