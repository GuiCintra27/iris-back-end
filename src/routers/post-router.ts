import { createPost, decreaseLikes, getFilteredPosts, getLikesByPostId, getPostsById, incrementLikes } from "../controllers";
import { adminAuthenticateToken, authenticateToken, validateBody, validateParams } from "../middlewares";
import { createPostSchema, postIdSchema, updateLikeSchema } from "../schemas";
import { Router } from "express";

const postRouter = Router();

postRouter
  .get("/:postId", getPostsById)
  .get("/likes/:postId", getLikesByPostId)
  .post("/filter", getFilteredPosts)
  .post("/", adminAuthenticateToken, validateBody(createPostSchema), createPost)
  .post("/likes", authenticateToken, validateBody(updateLikeSchema), incrementLikes)
  .delete("/likes/:postId", authenticateToken, validateParams(postIdSchema), decreaseLikes);

export { postRouter };
