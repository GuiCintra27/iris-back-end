import { createPrismaTopicFilter } from "../../utils/prisma-utils";
import { prisma } from "../../config";
import { likes, posts, postsComments } from "@prisma/client";

async function insert(data: PostParams): Promise<void> {
  await prisma.posts.create({
    data,
  });

  return;
}

async function findManyByFilters(
  topicIdsFilters: TopicIdFilter,
  orderBy: orderByFilter,
  inputValueFilter: string,
  MAX_LIMIT: number,
  pageNumber: number,
): Promise<GetPost[]> {
  const filter = createPrismaTopicFilter(topicIdsFilters, inputValueFilter);

  return prisma.posts.findMany({
    ...filter,
    orderBy,
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

function findManyForSearchLastSearched(inputValueFilter: string, MAX_LIMIT: number, userId: number) {
  return prisma.recentlySearchedByUser.findMany({
    where: {
      AND: {
        recentlySearched: {
          value: {
            contains: inputValueFilter,
          },
        },
        usersId: {
          equals: userId,
        },
      },
    },
    select: {
      recentlySearched: {
        select: {
          id: true,
          value: true,
        },
      },
    },
    take: MAX_LIMIT,
  });
}

function findManyForNormalSearch(
  topicIdsFilters: TopicIdFilter,
  inputValueFilter: string,
  take: number,
) {
  const filter = createPrismaTopicFilter(topicIdsFilters, inputValueFilter);

  return prisma.posts.findMany({
    ...filter,
    orderBy: {
      updated_at: "desc",
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

async function findByTopicId(postId: number, topicId: number): Promise<posts[]> {
  return await prisma.posts.findMany({
    where: {
      topicId,
      NOT: {
        id: postId
      }
    },
    include: {
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

function getIdOfRecentlySearchedByUser(searchValue: string, userId: number) {
  return prisma.recentlySearchedByUser.findFirst({
    where: {
      AND: {
        recentlySearched: { value: searchValue },
        users: { id: userId },
      },
    },
    select: {
      id: true,
    },
  });
}

function getRecentlySearchId(searchValue: string) {
  return prisma.recentlySearched.findFirst({
    where: {
      value: searchValue,
    },
    select: {
      id: true,
    },
  });
}
function createRecentlySearchId(searchValue: string) {
  return prisma.recentlySearched.create({
    data: {
      value: searchValue,
    },
  });
}

function upsertRecentSearch(recentSearchId: string, userId: number, recentId: string = "new") {
  return prisma.recentlySearchedByUser.upsert({
    where: {
      id: recentId,
    },
    update: {
      updatedAt: new Date(),
    },
    create: {
      usersId: userId,
      recentlySearchedId: recentSearchId,
    },
  });
}

// Comments ==

async function findComment(id: number): Promise<postsComments> {
  return await prisma.postsComments.findUnique({
    where: { id }
  });
}

async function findManyComments(postId: number): Promise<any> {
  return await prisma.postsComments.findMany({
    where: { postId },
    select: {
      id: true,
      text: true,
      createdAt: true,
      users: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

async function insertComment(data: CommentParams): Promise<void> {
  await prisma.postsComments.create({ data });
}

async function deleteComment(id: number): Promise<void> {
  await prisma.postsComments.delete({
    where: { id }
  });
}

// Types ==

export type TopicIdFilter = {
  topicId: number[];
};

export type orderByFilter = {
  id: "asc" | "desc";
};

export type GetPost = Omit<PostParams, "adminId" | "topicId"> & { admins: { name: string; photo: string } };

export type PostParams = Omit<posts, "id" | "updated_at">;

export type CommentParams = Pick<postsComments, "userId" | "postId" | "text">;

// Export ==

const postRepository = {
  insert,
  findById,
  findByTopicId,
  findManyByFilters,
  addLikes,
  deleteLikes,
  findLike,
  findManyLikes,
  findManyForSearchLastSearched,
  findManyForNormalSearch,
  getIdOfRecentlySearchedByUser,
  upsertRecentSearch,
  getRecentlySearchId,
  createRecentlySearchId,
  findComment,
  findManyComments,
  insertComment,
  deleteComment
};

export default postRepository;
