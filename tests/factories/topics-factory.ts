import { prisma } from "../../src/config";
import { faker } from "@faker-js/faker";

export async function createNewTopic(): Promise<{count: number}> {
  const data = generateTopic();

  return await prisma.topics.createMany({
    data: data
  });
}

function generateTopic() {
  const data = [
    { name: faker.lorem.word() },
    { name: faker.lorem.word() },
    { name: faker.lorem.word() },
    { name: faker.lorem.word() },
    { name: faker.lorem.word() },
    { name: faker.lorem.word() },
  ];

  return data;
}
