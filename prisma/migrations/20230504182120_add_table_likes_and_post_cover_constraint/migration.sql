/*
  Warnings:

  - You are about to drop the column `likes` on the `posts` table. All the data in the column will be lost.
  - Added the required column `postCover` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admin-sessions" DROP CONSTRAINT "admin-sessions_fk0";

-- DropForeignKey
ALTER TABLE "contact" DROP CONSTRAINT "contact_fk0";

-- DropForeignKey
ALTER TABLE "donates" DROP CONSTRAINT "donates_fk0";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_fk0";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_fk0";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_fk1";

-- DropForeignKey
ALTER TABLE "volunteers" DROP CONSTRAINT "volunteers_fk0";

-- DropForeignKey
ALTER TABLE "volunteers" DROP CONSTRAINT "volunteers_fk1";

-- DropForeignKey
ALTER TABLE "volunteers" DROP CONSTRAINT "volunteers_fk2";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "likes",
ADD COLUMN     "postCover" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "admin-sessions" ADD CONSTRAINT "admin-sessions_fk0" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donates" ADD CONSTRAINT "donates_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("sexualityId") REFERENCES "sexualities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("genderId") REFERENCES "genders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_fk1" FOREIGN KEY ("skinColorId") REFERENCES "skincolor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_fk2" FOREIGN KEY ("officeId") REFERENCES "offices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
