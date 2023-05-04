import { prisma } from "../../config";
import { likes, posts } from "@prisma/client";

async function insert(data: PostParams): Promise<void> {
  await prisma.posts.create({
    data,
  });

  return;
}

async function findMany(): Promise<GetPost[]> {
  return await prisma.posts.findMany({
    select: {
      id: true,
      title: true,
      topics: true,
      text: true,
      image: true,
      postCover: true,
      created_at: true,
      admins: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
  });
}

async function findManyByFilteredIds(postFilters: PostFilters): Promise<GetPost[]> {
  let filter = {
    where: {}
  };

  if (postFilters.topicId.length !== 0) {
      filter.where = {...filter.where, topicId: { in: postFilters.topicId }}
  }

  return prisma.posts.findMany({
      ...filter,
      orderBy:{
          id: 'desc'
      },
      select: {
        id: true,
        title: true,
        topics: true,
        text: true,
        image: true,
        postCover: true,
        created_at: true,
        admins: {
          select: {
            name: true,
            photo: true,
          },
        },
      },
    });
}

async function findById(id: number): Promise<posts> {
  return await prisma.posts.findUnique({
    where: {
      id,
    },
  });
}

async function addLikes(postId: number, userId: number): Promise<likes> {
  return await prisma.likes.create({
    data: {
      postId,
      userId
    },
  });
}

async function deleteLikes(id: number): Promise<likes> {
  return await prisma.likes.delete({
    where: {
      id
    },
  });
}

async function findLike(postId: number, userId: number): Promise<likes> {
  return await prisma.likes.findFirst({
    where: {
      postId,
      userId
    },
  });
}

export type PostFilters = {
  topicId: number[]
}

export type GetPost = Omit<PostParams, "adminId" | "topicId"> & { admins: { name: string; photo: string } };

export type PostParams = Omit<posts, "id" | "updated_at">;

const postRepository = {
  insert,
  findMany,
  findById,
  addLikes,
  deleteLikes,
  findLike,
  findManyByFilteredIds
};

export default postRepository;
