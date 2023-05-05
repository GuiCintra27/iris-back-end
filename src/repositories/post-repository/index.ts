import { prisma } from "../../config";
import { posts, Prisma } from "@prisma/client";

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
      likes: true,
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

async function findManyByFilters(topicIdsFilters: TopicIdFilter, inputValueFilter: string): Promise<GetPost[]> {
  const andClause: Prisma.Enumerable<Prisma.postsWhereInput> = [];

  const filter: { where: Prisma.postsWhereInput } = {
    where: {
      AND: andClause,
    },
  };

  if (topicIdsFilters.topicId?.length !== 0) {
    andClause.push({ topicId: { in: topicIdsFilters.topicId } });
  }

  if (inputValueFilter !== "") {
    andClause.push({
      OR: [
        { title: { contains: inputValueFilter, mode: "insensitive" } },
        { text: { contains: inputValueFilter, mode: "insensitive" } },
      ],
    });
  }

  return prisma.posts.findMany({
    ...filter,
    orderBy: {
      id: "desc",
    },
    select: {
      id: true,
      title: true,
      topics: true,
      text: true,
      image: true,
      likes: true,
      created_at: true,
      admins: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
    take: 6,
  });
}

async function findById(id: number): Promise<posts> {
  return await prisma.posts.findUnique({
    where: {
      id,
    },
  });
}

async function updateLikes(id: number, value: number) {
  return await prisma.posts.update({
    where: {
      id,
    },
    data: {
      likes: {
        increment: value,
      },
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
  findMany,
  findById,
  updateLikes,
  findManyByFilters,
};

export default postRepository;
