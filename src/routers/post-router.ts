import { createPost, decreaseLikes, getFilteredPosts, getPosts, incrementLikes } from "../controllers";
import { adminAuthenticateToken, authenticateToken, validateBody, validateParams } from "../middlewares";
import { createPostSchema, postIdSchema, updateLikeSchema } from "../schemas";
import { Router } from "express";

const postRouter = Router();

postRouter
  .get("/", getPosts)
  .post("/filter", getFilteredPosts)
  .post("/", adminAuthenticateToken, validateBody(createPostSchema), createPost)
  .post("/likes", authenticateToken, validateBody(updateLikeSchema), incrementLikes)
  .delete("/likes/:postId", authenticateToken, validateParams(postIdSchema), decreaseLikes);

export { postRouter };
