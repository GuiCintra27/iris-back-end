import { notFoundError, unprocessableContent } from "../../errors";
import postRepository, { GetPost, PostFilters, PostParams } from "../../repositories/post-repository";

export async function createPost(postData: PostParams): Promise<void> {
  await postRepository.insert(postData);

  return;
}

export async function getPosts(): Promise<GetPost[]> {
  const posts = await postRepository.findMany();

  if (posts.length === 0) throw notFoundError();

  return posts;
}

export async function getManyFilteredPosts(postFilters: PostFilters): Promise<GetPost[]> {
  const posts = await postRepository.findManyByFilteredIds(postFilters);

  if (posts.length === 0) throw notFoundError();

  return posts;
}

export async function updateLikes(postId: number, value: number): Promise<void> {
  const post = await postRepository.findById(postId);

  if (!post) throw notFoundError();

  if (post.likes < 1 && value < 1) throw unprocessableContent();

  await postRepository.updateLikes(postId, value);

  return;
}

const postService = {
  createPost,
  getPosts,
  updateLikes,
  getManyFilteredPosts
};

export default postService;
