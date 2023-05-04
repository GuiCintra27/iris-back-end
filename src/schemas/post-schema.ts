import { PostParams } from "../repositories/post-repository";
import Joi from "joi";

export const createPostSchema = Joi.object<Omit<PostParams, "adminId" | "likes">>({
  title: Joi.string().required(),
  topicId: Joi.number().required(),
  text: Joi.string().required(),
  image: Joi.string().uri().required(),
});

export const updateLikeSchema = Joi.object<{ postId: number }>({
  postId: Joi.number().invalid(0).required(),
});

export const postIdSchema = Joi.object<{ postId: number }>({
  postId: Joi.number().required(),
});
