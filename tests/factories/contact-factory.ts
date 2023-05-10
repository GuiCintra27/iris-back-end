import { contact } from "@prisma/client";
import { prisma } from "../../src/config";
import { faker } from "@faker-js/faker";
import { createUser } from "./users-factory";
import { createAdmin } from "./admin-factory";
import { generateValidAdminToken } from "../helpers";

export function generateValidInsertInput() {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    telephone: faker.phone.number("2299286####"),
    message: faker.lorem.sentences(4),
  };
}

export function generateValidDeleteInput() {
  return {
    id: faker.datatype.number(),
  };
}

export async function newContact() {
  const user = await createUser();
  const admin = await createAdmin();
  const token = await generateValidAdminToken(admin);
  const input = generateValidInsertInput();

  const contact = await createContact({ ...input, userId: user.id });

  return { token, input, contact };
}

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
