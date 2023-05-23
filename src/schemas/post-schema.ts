import { PostParams } from "../repositories/post-repository";
import Joi from "joi";

export const createPostSchema = Joi.object<Omit<PostParams, "adminId" | "likes">>({
  title: Joi.string().required(),
  topicId: Joi.number().required(),
  text: Joi.string().required(),
  image: Joi.string().uri().required(),
  postCover: Joi.string().uri().required(),
});

export const updateLikeSchema = Joi.object<{ postId: number }>({
  postId: Joi.number().invalid(0).required(),
});

export const postIdSchema = Joi.object<{ postId: number }>({
  postId: Joi.number().required(),
});

export const recentSearchSchema = Joi.object<{ inputValue: string }>({
  inputValue: Joi.string().required(),
});

export const postSuggestionSchema = Joi.object({
  inputFilterValue: Joi.string().required(),
  topicFilterIdsArray: Joi.array().items(Joi.number()).required(),
});

export const postFilterSchema = Joi.object({
  topicFilterIds: Joi.object({
    topicId: Joi.array().items(Joi.number()).required(),
  }).required(),
  postOrder: Joi.object({
    id: Joi.string().required(),
  }),
  inputFilterValue: Joi.string().allow("").required(),
});

// Comment ==

export const postCommentSchema = Joi.object<{ postId: number, text: string }>({
  postId: Joi.number().required(),
  text: Joi.string().required()
});

export const commentIdSchema = Joi.object<{ commentId: number }>({
  commentId: Joi.number().required(),
});
