import { admins, posts } from "@prisma/client";
import { prisma } from "../../src/config";
import { createAdmin } from "./admin-factory";

async function getAdmin(): Promise<admins> {
  const admin = await prisma.admins.findMany();

  if (!admin) return await createAdmin();

  return admin[0];
}

export async function createNewPost(text: string, image: string): Promise<posts> {
  const admin = await getAdmin();

  return await prisma.posts.create({
    data: {
      adminId: admin.id,
      text,
      image,
    },
  });
}

export async function getPosts(): Promise<posts[]> {
  return await prisma.posts.findMany({});
}

export async function getPostById(id: number): Promise<posts> {
  return await prisma.posts.findUnique({
    where: {
      id,
    },
  });
}
