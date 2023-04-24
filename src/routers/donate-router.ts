import { getAllDonates, getNewDonates, insertOnDonates, updateDonates } from "../controllers";
import { adminAuthenticateToken, authenticateToken, validateBody, validateParams } from "../middlewares";
import { insertDonateSchema, updateDonateSchema } from "../schemas";
import { Router } from "express";

const donateRouter = Router();

donateRouter
  .post("/", authenticateToken, validateBody(insertDonateSchema), insertOnDonates)
  .all("/*", adminAuthenticateToken)
  .get("/", getNewDonates)
  .get("/all", getAllDonates)
  .patch("/:id", validateParams(updateDonateSchema), updateDonates);

export { donateRouter };
