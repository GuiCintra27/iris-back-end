import { donates } from "@prisma/client";
import { prisma } from "../../src/config";

export async function createDonate(userId: number, amount: number, visualized?: boolean): Promise<donates> {
  return await prisma.donates.create({
    data: {
      userId,
      amount,
      visualized,
    },
  });
}

export async function getDonateById(id: number): Promise<donates> {
  return await prisma.donates.findUnique({
    where: {
      id,
    },
  });
}
export async function getDonates(): Promise<donates[]> {
  return await prisma.donates.findMany({});
}
