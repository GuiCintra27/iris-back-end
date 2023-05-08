import userRepository from "@/repositories/user-repository";
import { likes, posts } from "@prisma/client";
import { notFoundError } from "../../errors";
import postRepository, { GetPost, PostFilters, PostParams } from "../../repositories/post-repository";

export async function createPost(postData: PostParams): Promise<void> {
  await postRepository.insert(postData);

  return;
}

export async function getPosts(postId: number): Promise<posts> {
  const post = await postRepository.findById(postId);
  if (!post) throw notFoundError();

  return post;
}

export async function getLikes(postId: number): Promise<likes[]> {
  const likes = await postRepository.findManyLikes(postId);
  if (!likes) throw notFoundError();

  return likes;
}

export async function getManyFilteredPosts(postFilters: PostFilters): Promise<GetPost[]> {
  const posts = await postRepository.findManyByFilteredIds(postFilters);

  if (posts.length === 0) throw notFoundError();

  return posts;
}

export async function updateLikes(postId: number, userId: number): Promise<void> {
  const post = await postRepository.findById(postId);
  if (!post) throw notFoundError();

  const user = await userRepository.findById(userId);
  if (!user) throw notFoundError();

  await postRepository.addLikes(postId, userId);

  return;
}

export async function excludeLikes(postId: number, userId: number): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user) throw notFoundError();

  const like = await postRepository.findLike(postId, userId);
  if (!like) throw notFoundError();

  await postRepository.deleteLikes(like.id);

  return;
}

const postService = {
  createPost,
  getPosts,
  updateLikes,
  getManyFilteredPosts,
  excludeLikes,
  getLikes
};

export default postService;
