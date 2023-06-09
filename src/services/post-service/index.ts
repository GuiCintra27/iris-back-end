import postRepository, { GetPost, TopicIdFilter, PostParams, orderByFilter } from "../../repositories/post-repository";
import userRepository from "../../repositories/user-repository";
import { likes, posts, postsComments } from "@prisma/client";
import { notFoundError, unauthorizedError } from "../../errors";
import { PostsFilter } from "../../utils/prisma-utils";

export async function createPost(postData: PostParams): Promise<void> {
  await postRepository.insert(postData);

  return;
}

export async function getPosts(postId: number): Promise<posts> {
  const post = await postRepository.findById(postId);
  if (!post) throw notFoundError();

  return post;
}

export async function findByTopic(topicId: number, postId: number): Promise<posts[]> {
  const posts = await postRepository.findByTopicId(postId, topicId);
  if (posts.length === 0) throw notFoundError();

  const mixedPosts = posts.sort(() => Math.random() - 0.5);

  return mixedPosts.slice(0, 4);
}

export async function getLikes(postId: number): Promise<likes[]> {
  const likes = await postRepository.findManyLikes(postId);
  if (!likes) throw notFoundError();

  return likes;
}

export async function getManyFilteredPosts(
  topicIdFilter: TopicIdFilter,
  orderBy: orderByFilter,
  inputFilterValue: string,
  pageNumber: number,
): Promise<GetPost[]> {
  const MAX_LIMIT = 6;
  const posts = await postRepository.findManyByFilters(topicIdFilter, orderBy, inputFilterValue, MAX_LIMIT, pageNumber);

  if (posts.length === 0) throw notFoundError();

  return posts;
}

export async function updateLikes(postId: number, userId: number): Promise<void> {
  const post = await postRepository.findById(postId);
  if (!post) throw notFoundError();

  const user = await userRepository.findById(userId);
  if (!user) throw unauthorizedError();

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

export async function upsertRecentSearch(inputValue: string, userId: number): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user) throw notFoundError();
  let recentlySearchId: string;
  try {
    const response = await postRepository.getRecentlySearchId(inputValue);
    recentlySearchId = response.id;
  } catch (err) {
    const response = await postRepository.createRecentlySearchId(inputValue);
    recentlySearchId = response.id;
  }
  const idOfRecentlySearchedByUser = await postRepository.getIdOfRecentlySearchedByUser(inputValue, userId);
  await postRepository.upsertRecentSearch(recentlySearchId, userId, idOfRecentlySearchedByUser?.id);

  return;
}

export async function getManyFilteredSuggestions(
  topicIdFilter: TopicIdFilter,
  inputFilterValue: string,
  userId?: number,
) {
  const MAX_LIMIT = 6;
  let posts: PostsFilter[] = [];
  if (userId) {
    const recentlySearchedArray = await postRepository.findManyForSearchLastSearched(
      inputFilterValue,
      MAX_LIMIT,
      userId,
    );
    const parseRecentPosts: PostsFilter[] = recentlySearchedArray.map(({ recentlySearched }) => ({
      id: recentlySearched.id,
      title: recentlySearched.value,
      type: "recent",
    }));

    posts = [...parseRecentPosts];
  }

  const quantityToTake = MAX_LIMIT - posts.length;

  const newPosts = await postRepository.findManyForNormalSearch(topicIdFilter, inputFilterValue, quantityToTake);

  const parseNewPosts: PostsFilter[] = newPosts.map((post) => ({ ...post, type: "new" }));
  posts = [...posts, ...parseNewPosts];

  if (posts.length === 0) throw notFoundError();

  return posts;
}

// Comments ==

export async function getComments(postId: number): Promise<postsComments[]> {
  return await postRepository.findManyComments(postId);
}

export async function createComment(userId: number, postId: number, text: string): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user) throw notFoundError();

  const post = await postRepository.findById(postId);
  if (!post) throw notFoundError();

  await postRepository.insertComment({ userId, postId, text });
}

export async function excludeComment(userId: number, commentId: number): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user) throw notFoundError();

  const comment = await postRepository.findComment(commentId);
  if (!comment) throw notFoundError();

  await postRepository.deleteComment(commentId);
}

// Export ==

const postService = {
  createPost,
  getPosts,
  findByTopic,
  updateLikes,
  getManyFilteredPosts,
  excludeLikes,
  getLikes,
  getManyFilteredSuggestions,
  upsertRecentSearch,
  getComments,
  createComment,
  excludeComment,
};

export default postService;
