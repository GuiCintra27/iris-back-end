import { Request, Response } from "express";
import postService from "../services/post-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import { AdminAuthenticatedRequest } from "../middlewares/admin-authentication-middleware";
import { PostFilters } from "@/repositories/post-repository";

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
  const { filterIds } = req.body;
  const filter = filterIds as PostFilters;

  try {
    const filteredPosts = await postService.getManyFilteredPosts(filter);

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
