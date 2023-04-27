import { prisma } from "../../config";
import { posts } from "@prisma/client";

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

export type GetPost = Omit<PostParams, "adminId" | "topicId"> & { admins: { name: string; photo: string } };

export type PostParams = Omit<posts, "id" | "created_at" | "updated_at">;

const postRepository = {
  insert,
  findMany,
  findById,
  updateLikes,
};

export default postRepository;
