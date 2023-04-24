import { insertOnNewsLetter, NewsLetterParticipants } from "../controllers";
import { validateBody, adminAuthenticateToken } from "../middlewares";
import { newsLetterSchema } from "../schemas";
import { Router } from "express";

const newsLetterRouter = Router();

newsLetterRouter
  .post("/", validateBody(newsLetterSchema), insertOnNewsLetter)
  .all("/*", adminAuthenticateToken)
  .get("/", NewsLetterParticipants);

export { newsLetterRouter };
