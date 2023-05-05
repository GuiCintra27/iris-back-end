import { Request, Response } from "express";
import postService from "../services/post-service";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import { AdminAuthenticatedRequest } from "../middlewares/admin-authentication-middleware";
import { TopicIdFilter } from "@/repositories/post-repository";

export async function createPost(req: AdminAuthenticatedRequest, res: Response) {
  const { adminId } = req;

  try {
    await postService.createPost({ ...req.body, adminId });

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getPosts(req: Request, res: Response) {
  try {
    const posts = await postService.getPosts();

    return res.status(httpStatus.OK).send(posts);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getFilteredPosts(req: Request, res: Response) {
  const { topicFilterIds, inputFilterValue } = req.body;
  const topicFilter = topicFilterIds as TopicIdFilter;

  try {
    const filteredPosts = await postService.getManyFilteredPosts(topicFilter, inputFilterValue);

    return res.status(httpStatus.OK).send(filteredPosts);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function updateLikes(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { like } = req.body;

  try {
    await postService.updateLikes(Number(id), like);

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    if (error.name === "UnprocessableContent") return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
