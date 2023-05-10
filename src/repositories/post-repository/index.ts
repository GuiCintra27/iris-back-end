import { prisma } from "../../config";
import { likes, posts, Prisma } from "@prisma/client";

async function insert(data: PostParams): Promise<void> {
  await prisma.posts.create({
    data,
  });

  return;
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
    },
    take: 6,
  });
}

async function findById(id: number): Promise<posts> {
  return await prisma.posts.findUnique({
    where: {
      id,
    },
    include: {
      admins: true,
      topics: true
    }
  });
}

async function findManyLikes(postId: number): Promise<likes[]> {
  return await prisma.likes.findMany({
    where: {
      postId
    }
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
  findManyLikes
};

export default postRepository;
