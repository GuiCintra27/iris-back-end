import { Router } from "express";
import { createUserSchema } from "../schemas";
import { validateBody } from "../middlewares";
import { getData, usersPost } from "../controllers";

const usersRouter = Router();

usersRouter.get("/data", getData);
usersRouter.post("/", validateBody(createUserSchema), usersPost);

export { usersRouter };
