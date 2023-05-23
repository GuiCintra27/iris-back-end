/*
  Warnings:

  - Made the column `usersId` on table `recentlySearchedByUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "recentlySearchedByUser" DROP CONSTRAINT "recentlySearchedByUser_usersId_fkey";

-- AlterTable
ALTER TABLE "recentlySearchedByUser" ALTER COLUMN "usersId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "recentlySearchedByUser" ADD CONSTRAINT "recentlySearchedByUser_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
