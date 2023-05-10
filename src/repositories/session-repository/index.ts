import { prisma } from "../../config";
import { Prisma, sessions } from "@prisma/client";

async function create(data: Prisma.sessionsUncheckedCreateInput) {
  return await prisma.sessions.create({
    data,
  });
}

async function findByToken(token: string): Promise<sessions> {
  return await prisma.sessions.findFirst({
    where: {
      token
    },
  });
}

const sessionRepository = {
  create,
  findByToken
};

export default sessionRepository;
