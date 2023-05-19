/*
  Warnings:

  - You are about to drop the column `postId` on the `recentlyVisited` table. All the data in the column will be lost.
  - Added the required column `value` to the `recentlyVisited` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "recentlyVisited" DROP CONSTRAINT "recentlyVisited_postId_fkey";

-- AlterTable
ALTER TABLE "recentlyVisited" DROP COLUMN "postId",
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "posts_id_idx" ON "posts"("id");
