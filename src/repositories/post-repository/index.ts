import { createPrismaTopicFilter } from "@/utils/prisma-utils";
import { prisma } from "../../config";
import { likes, posts } from "@prisma/client";

async function insert(data: PostParams): Promise<void> {
  await prisma.posts.create({
    data,
  });

  return;
}

async function findManyByFilters(
  topicIdsFilters: TopicIdFilter,
  inputValueFilter: string,
  MAX_LIMIT: number,
  pageNumber: number,
): Promise<GetPost[]> {
  const filter = createPrismaTopicFilter(topicIdsFilters, inputValueFilter);

  return prisma.posts.findMany({
    ...filter,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      title: true,
      topics: true,
      text: true,
      image: true,
      postCover: true,
      likes: true,
      created_at: true,
      admins: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
    skip: (pageNumber - 1) * MAX_LIMIT,
    take: MAX_LIMIT,
  });
}

function findManyForSearchLastVisited(
  topicIdsFilters: TopicIdFilter,
  inputValueFilter: string,
  MAX_LIMIT: number,
  userId: number,
) {
  const filter = createPrismaTopicFilter(topicIdsFilters, inputValueFilter);

  filter.where.AND = {
    ...filter.where.AND,
    recentlyVisited: {
      some: {
        userId:{
          equals: userId
        }
      }
    },
  };

  return prisma.posts.findMany({
    ...filter,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      title: true,
    },
    take: MAX_LIMIT,
  });
}

function findManyForNormalSearch(
  topicIdsFilters: TopicIdFilter,
  inputValueFilter: string,
  take: number,
  userId:number
) {
  const filter = createPrismaTopicFilter(topicIdsFilters, inputValueFilter);

  filter.where.AND = {
    ...filter.where.AND,
    recentlyVisited: {
        every: {
          userId:{
            not: userId
          }
        }
    },
  };

  return prisma.posts.findMany({
    ...filter,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      title: true,
    },
    take,
  });
}

async function findById(id: number): Promise<posts> {
  return await prisma.posts.findUnique({
    where: {
      id,
    },
    include: {
      admins: true,
      topics: true,
    },
  });
}

async function findManyLikes(postId: number): Promise<likes[]> {
  return await prisma.likes.findMany({
    where: {
      postId,
    },
  });
}

async function addLikes(postId: number, userId: number): Promise<likes> {
  return await prisma.likes.create({
    data: {
      postId,
      userId,
    },
  });
}

async function deleteLikes(id: number): Promise<likes> {
  return await prisma.likes.delete({
    where: {
      id,
    },
  });
}

async function findLike(postId: number, userId: number): Promise<likes> {
  return await prisma.likes.findFirst({
    where: {
      postId,
      userId,
    },
  });
}

export type TopicIdFilter = {
  topicId: number[];
};

export type GetPost = Omit<PostParams, "adminId" | "topicId"> & { admins: { name: string; photo: string } };

export type PostParams = Omit<posts, "id" | "updated_at">;

const postRepository = {
  insert,
  findById,
  findManyByFilters,
  addLikes,
  deleteLikes,
  findLike,
  findManyLikes,
  findManyForSearchLastVisited,
  findManyForNormalSearch
};

export default postRepository;
