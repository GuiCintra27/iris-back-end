import { Router } from "express";
import { getTopics } from "../controllers";

const topicsRouter = Router();

topicsRouter.get("/", getTopics);

export { topicsRouter };