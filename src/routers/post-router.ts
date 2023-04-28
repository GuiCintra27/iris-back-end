import { createPost, getFilteredPosts, getPosts, updateLikes } from "../controllers";
import { adminAuthenticateToken, authenticateToken, validateBody, validateParams } from "../middlewares";
import { createPostSchema, postIdSchema, updateLikeSchema } from "../schemas";
import { Router } from "express";

const postRouter = Router();

postRouter
  .get("/", getPosts)
  .post("/filter", getFilteredPosts)
  .post("/", adminAuthenticateToken, validateBody(createPostSchema), createPost)
  .patch("/:id", authenticateToken, validateParams(postIdSchema), validateBody(updateLikeSchema), updateLikes);

export { postRouter };
