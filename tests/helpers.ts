import * as jwt from "jsonwebtoken";
import { admins, users as User } from "@prisma/client";
import { createUser } from "./factories";
import { createAdminSession, createSession } from "./factories/sessions-factory";
import { prisma } from "../src/config";
import { createAdmin } from "./factories/admin-factory";

export async function cleanDb() {
  await prisma.volunteers.deleteMany({});
  await prisma.donates.deleteMany({});
  await prisma.posts.deleteMany({});
  await prisma.topics.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.newsletter.deleteMany({});
  await prisma.sessions.deleteMany({});
  await prisma.admin_sessions.deleteMany({});
  await prisma.genders.deleteMany({});
  await prisma.sexualities.deleteMany({});
  await prisma.pronouns.deleteMany({});
  await prisma.users.deleteMany({});
  await prisma.admins.deleteMany({});
  await prisma.likes.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}

export async function generateValidAdminToken(admin?: admins) {
  const incomingAdmin = admin || (await createAdmin());
  const token = jwt.sign({ adminId: incomingAdmin.id }, process.env.JWT_SECRET);

  await createAdminSession(token);

  return token;
}
