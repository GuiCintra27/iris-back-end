-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_fk0";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "topics_fk0";

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "topics_fk0" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
