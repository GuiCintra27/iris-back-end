import { admin_sessions, sessions as Session } from "@prisma/client";
import { createUser } from "./users-factory";
import { prisma } from "../../src/config";
import { createAdmin } from "./admin-factory";

export async function createSession(token: string): Promise<Session> {
  const user = await createUser();

  return prisma.sessions.create({
    data: {
      token: token,
      userId: user.id,
    },
  });
}

export async function createAdminSession(token: string): Promise<admin_sessions> {
  const admin = await createAdmin();

  return prisma.admin_sessions.create({
    data: {
      token: token,
      adminId: admin.id,
    },
  });
}
