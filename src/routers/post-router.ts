import {
  createPost,
  decreaseLikes,
  getFilteredPosts,
  getLikesByPostId,
  getPostsById,
  getSearchFilteredSuggestions,
  incrementLikes,
  upsertRecentPost,
} from "../controllers";
import { adminAuthenticateToken, authenticateToken, optionalAuthenticateToken, validateBody, validateParams } from "../middlewares";
import { createPostSchema, postFilterSchema, postIdSchema, recentSearchSchema, updateLikeSchema } from "../schemas";
import { Router } from "express";

const postRouter = Router();

postRouter
  .get("/:postId", getPostsById)
  .get("/likes/:postId", getLikesByPostId)
  .post("/filter", validateBody(postFilterSchema), getFilteredPosts)
  .post("/", adminAuthenticateToken, validateBody(createPostSchema), createPost)
  .post("/search", validateBody(postFilterSchema), optionalAuthenticateToken, getSearchFilteredSuggestions)
  .use(authenticateToken)
  .put("/recent",validateBody(recentSearchSchema), upsertRecentPost)
  .post("/likes", validateBody(updateLikeSchema), incrementLikes)
  .delete("/likes/:postId", validateParams(postIdSchema), decreaseLikes);

export { postRouter };
