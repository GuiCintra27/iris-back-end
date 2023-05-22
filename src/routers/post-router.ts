import {
  createPost,
  decreaseLikes,
  deleteComment,
  getComments,
  getFilteredPosts,
  getLikesByPostId,
  getPostsById,
  getSearchFilteredSuggestions,
  incrementLikes,
  postComment,
  upsertRecentPost,
} from "../controllers";
import {
  adminAuthenticateToken,
  authenticateToken,
  optionalAuthenticateToken,
  validateBody,
  validateParams,
} from "../middlewares";
import {
  commentIdSchema,
  createPostSchema,
  postCommentSchema,
  postFilterSchema,
  postIdSchema,
  postSuggestionSchema,
  updateLikeSchema,
  recentSearchSchema,
} from "../schemas";
import { Router } from "express";

const postRouter = Router();

postRouter
  .get("/:postId", getPostsById)
  .get("/likes/:postId", getLikesByPostId)
  .get("/comments/:postId", getComments)
  .post("/filter", validateBody(postFilterSchema), getFilteredPosts)
  .post("/", adminAuthenticateToken, validateBody(createPostSchema), createPost)
  .post("/search", validateBody(postFilterSchema), optionalAuthenticateToken, getSearchFilteredSuggestions)
  .use(authenticateToken)
  .put("/recent", validateBody(recentSearchSchema), upsertRecentPost)
  .post("/likes", validateBody(updateLikeSchema), incrementLikes)
  .delete("/likes/:postId", validateParams(postIdSchema), decreaseLikes)
  .post("/comments", validateBody(postCommentSchema), postComment)
  .delete("/comments/:commentId", deleteComment);

export { postRouter };
