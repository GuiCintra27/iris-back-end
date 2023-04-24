import { prisma } from "../../config";
import { newsletter } from "@prisma/client";

async function insert(email: string): Promise<void> {
  await prisma.newsletter.create({
    data: { email }
  });

  return;
}

async function findUnique(email: string): Promise<newsletter> {
  return await prisma.newsletter.findUnique({
    where: {
      email
    }
  });
}

async function findParticipants(): Promise<NewsLetterParticipants> {
  return await prisma.newsletter.findMany({
    select: {
      id: true,
      email: true
    }
  });
}

export type NewsLetterParticipants = Omit<newsletter, "created_at" | "updated_at">[];

const newsLetterRepository = {
  insert,
  findUnique,
  findParticipants
};

export default newsLetterRepository;
