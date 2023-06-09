import { Request, Response } from "express";
import postService from "../services/post-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import { AdminAuthenticatedRequest } from "../middlewares/admin-authentication-middleware";
import { orderByFilter, TopicIdFilter } from "../repositories/post-repository";
import { createPrismaTopicFilter } from "@/utils/prisma-utils";

export async function createPost(req: AdminAuthenticatedRequest, res: Response) {
  const { adminId } = req;

  try {
    await postService.createPost({ ...req.body, adminId });

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getPostsById(req: Request, res: Response) {
  const { postId } = req.params;

  try {
    const post = await postService.getPosts(Number(postId));

    return res.status(httpStatus.OK).send(post);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getPostsByTopicId(req: Request, res: Response) {
  const { topicId, postId } = req.query;

  try {
    const posts = await postService.findByTopic(Number(topicId), Number(postId));

    return res.status(httpStatus.OK).send(posts);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    console.log(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getLikesByPostId(req: Request, res: Response) {
  const { postId } = req.params;

  try {
    const likes = await postService.getLikes(Number(postId));

    return res.status(httpStatus.OK).send(likes);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getFilteredPosts(req: Request, res: Response) {
  const { topicFilterIds, postOrder, inputFilterValue } = req.body;
  const { page } = req.headers as { page: string };
  const pageNumber = Number(page) || 1;
  const topicFilter = topicFilterIds as TopicIdFilter;
  const orderBy = postOrder as orderByFilter;

  try {
    const filteredPosts = await postService.getManyFilteredPosts(topicFilter, orderBy, inputFilterValue, pageNumber);

    return res.status(httpStatus.OK).send(filteredPosts);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getSearchFilteredSuggestions(req: AuthenticatedRequest, res: Response) {
  const { topicFilterIds, inputFilterValue } = req.body;
  const { userId } = req;

  const topicFilter = topicFilterIds as TopicIdFilter;
  try {
    const filteredPosts = await postService.getManyFilteredSuggestions(topicFilter, inputFilterValue, userId);

    return res.status(httpStatus.OK).send(filteredPosts);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function incrementLikes(req: AuthenticatedRequest, res: Response) {
  const { postId } = req.body;
  const { userId } = req;

  try {
    await postService.updateLikes(Number(postId), userId);

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    if (error.name === "UnauthorizedError") return res.status(httpStatus.UNAUTHORIZED).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function decreaseLikes(req: AuthenticatedRequest, res: Response) {
  const { postId } = req.params;
  const { userId } = req;

  try {
    await postService.excludeLikes(Number(postId), userId);

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
export async function upsertRecentPost(req: AuthenticatedRequest, res: Response) {
  const { inputValue } = req.body;
  const { userId } = req;

  try {
    await postService.upsertRecentSearch(inputValue, userId);
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

// Comments ===

export async function getComments(req: Request, res: Response) {
  const { postId } = req.params;

  try {
    const comments = await postService.getComments(+postId);
    return res.send(comments);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function postComment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { postId, text } = req.body;

  try {
    await postService.createComment(userId, +postId, text);
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteComment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { commentId } = req.params;

  try {
    await postService.excludeComment(userId, +commentId);
    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
