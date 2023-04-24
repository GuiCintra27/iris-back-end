/*
  Warnings:

  - You are about to drop the column `genderIdentity` on the `donates` table. All the data in the column will be lost.
  - You are about to drop the column `pronouns` on the `donates` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `donates` table. All the data in the column will be lost.
  - You are about to drop the column `pronouns` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the column `telephone` on the `volunteers` table. All the data in the column will be lost.
  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usergender` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `genderId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pronounsId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexualityId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_fk0";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_fk1";

-- DropIndex
DROP INDEX "donates_telephone_key";

-- DropIndex
DROP INDEX "volunteers_telephone_key";

-- AlterTable
ALTER TABLE "donates" DROP COLUMN "genderIdentity",
DROP COLUMN "pronouns",
DROP COLUMN "telephone";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "genderId" INTEGER NOT NULL,
ADD COLUMN     "phoneNumber" VARCHAR(11) NOT NULL,
ADD COLUMN     "pronounsId" INTEGER NOT NULL,
ADD COLUMN     "sexualityId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "volunteers" DROP COLUMN "pronouns",
DROP COLUMN "telephone",
ALTER COLUMN "experience" DROP NOT NULL;

-- DropTable
DROP TABLE "likes";

-- DropTable
DROP TABLE "usergender";

-- CreateTable
CREATE TABLE "pronouns" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pronouns_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sexualities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sexualities_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pronouns_name_key" ON "pronouns"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sexualities_name_key" ON "sexualities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("sexualityId") REFERENCES "sexualities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("genderId") REFERENCES "genders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pronounsId_fkey" FOREIGN KEY ("pronounsId") REFERENCES "pronouns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
