import { contact } from "@prisma/client";
import { prisma } from "../../src/config";
import { faker } from "@faker-js/faker";
import { createUser } from "./users-factory";

export async function createContact(data: Partial<contact> = {}): Promise<contact> {
  let userId: number;

  if (data.userId) userId = data.userId;
  else {
    const user = await createUser();
    userId = user.id;
  }
  return await prisma.contact.create({
    data: {
      name: data?.name || faker.lorem.word(),
      email: data?.email || faker.internet.email(),
      telephone: data?.telephone || faker.phone.number("2299286####"),
      message: data?.message || faker.lorem.word(),
      userId,
    },
  });
}

export async function getContactByEmail(email: string): Promise<contact[]> {
  return await prisma.contact.findMany({
    where: {
      email,
    },
  });
}

export async function getContact(): Promise<contact[]> {
  return await prisma.contact.findMany({});
}
