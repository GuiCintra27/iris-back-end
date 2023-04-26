/*
  Warnings:

  - Added the required column `title` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topicId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "topicId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "topics_pk" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "topics_fk0" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
