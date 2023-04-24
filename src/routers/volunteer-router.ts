import { getAllVolunteers, getNewVolunteers, insertOnVolunteers, registerData, updateVolunteers } from "../controllers";
import { adminAuthenticateToken, authenticateToken, validateBody, validateParams } from "../middlewares";
import { insertVolunteerSchema, updateVolunteerSchema } from "../schemas";
import { Router } from "express";

const volunteerRouter = Router();

volunteerRouter
  .get("/data", registerData)
  .post("/", authenticateToken, validateBody(insertVolunteerSchema), insertOnVolunteers)
  .all("/*", adminAuthenticateToken)
  .get("/", getNewVolunteers)
  .get("/all", getAllVolunteers)
  .patch("/:id", validateParams(updateVolunteerSchema), updateVolunteers);

export { volunteerRouter };
