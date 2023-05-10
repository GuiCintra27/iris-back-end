import { newsletter } from "@prisma/client";
import { prisma } from "../../src/config";
import { faker } from "@faker-js/faker";

export function generateValidNewsLetterInput() {
  return { email: faker.internet.email() };
}

export async function createNewsLetterParticipant(email: string): Promise<newsletter> {
  return await prisma.newsletter.create({
    data: {
      email,
    },
  });
}

export async function getNewsLetterParticipant(email: string): Promise<newsletter> {
  return await prisma.newsletter.findUnique({
    where: {
      email,
    },
  });
}
