import { PostParams } from "../repositories/post-repository";
import Joi from "joi";

export const createPostSchema = Joi.object<Omit<PostParams, "adminId" | "likes">>({
  text: Joi.string().required(),
  image: Joi.string().uri().required(),
});

export const updateLikeSchema = Joi.object<{ like: number }>({
  like: Joi.number().min(-1).max(1).invalid(0).required(),
});

export const postIdSchema = Joi.object<{ id: number }>({
  id: Joi.number().required(),
});
