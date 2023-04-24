import { newsletter } from "@prisma/client";
import { prisma } from "../../src/config";

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
