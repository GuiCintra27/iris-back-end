import { signInFacebookPost, singInGooglePost, singInPost } from "../controllers";
import { validateBody } from "../middlewares";
import { signInFacebookSchema, signInGoogleSchema, signInSchema } from "../schemas";
import { Router } from "express";

const authenticationRouter = Router();

authenticationRouter.post("/sign-in", validateBody(signInSchema), singInPost);
authenticationRouter.post("/sign-in/google", validateBody(signInGoogleSchema), singInGooglePost);
authenticationRouter.post("/sign-in/facebook", validateBody(signInFacebookSchema), signInFacebookPost);

export { authenticationRouter };
