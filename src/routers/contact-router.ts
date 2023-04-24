import { deleteContact, getContacts, insertOnContact } from "../controllers";
import { authenticateToken, validateBody, validateParams, adminAuthenticateToken } from "../middlewares";
import { deleteContactSchema, insertContactSchema } from "../schemas/contact-schema";
import { Router } from "express";

const contactRouter = Router();

contactRouter
  .post("/", authenticateToken, validateBody(insertContactSchema), insertOnContact)
  .all("/*", adminAuthenticateToken)
  .get("/", getContacts)
  .delete("/:id", validateParams(deleteContactSchema), deleteContact);

export { contactRouter };
