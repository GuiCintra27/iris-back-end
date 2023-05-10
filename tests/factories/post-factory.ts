import { faker } from "@faker-js/faker";
import { admins, likes, posts, topics } from "@prisma/client";
import { prisma } from "../../src/config";
import { createAdmin } from "./admin-factory";
import { createNewTopic } from "./topics-factory";

export function generateValidInputPost(topic?: topics) {
  const newTopic = topic === undefined ? 1 : topic.id;

  return {
    title: faker.lorem.sentences(10),
    topicId: newTopic,
    text: faker.lorem.sentences(10),
    image: faker.internet.url(),
    postCover: faker.image.imageUrl(),
  };
}

export async function newPost( ) {
  const topic = await getTopics();
  const input = generateValidInputPost(topic);

  return await createNewPost(input.text, input.image, input.title);
}

async function getAdmin(): Promise<admins> {
  const admin = await prisma.admins.findMany();

  if (admin.length === 0) return await createAdmin();

  return admin[0];
}

export async function getTopics(): Promise<topics> {
  const topic = await prisma.topics.findFirst();

  if (!topic) {
    await createNewTopic();
    return await prisma.topics.findFirst();
  }

  return topic;
}

export async function createNewPost(text: string, image: string, title: string): Promise<posts> {
  const admin = await getAdmin();
  const topic = await getTopics();

  return await prisma.posts.create({
    data: {
      adminId: admin.id,
      title,
      topicId: topic.id,
      text,
      image,
      postCover: faker.image.imageUrl()
    },
  });
}

export async function createNewLike(postId: number, userId: number): Promise<likes> {
  return await prisma.likes.create({
    data: {
      userId,
      postId
    }
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
