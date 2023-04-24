-- AddForeignKey
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_fk1" FOREIGN KEY ("skinColorId") REFERENCES "skincolor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
