import { donates } from "@prisma/client";
import { prisma } from "../../src/config";
import { faker } from "@faker-js/faker";

export function generateValidInputDonate() {
  return {
    id: faker.datatype.number(),
    amount: faker.datatype.number({ min: 5 }), 
  };
}

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
