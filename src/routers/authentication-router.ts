import { singInGooglePost, singInPost } from "../controllers";
import { validateBody } from "../middlewares";
import { signInGoogleSchema, signInSchema } from "../schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);
authenticationRouter.post("/sign-in/google", validateBody(signInGoogleSchema), singInGooglePost);

export { authenticationRouter };
