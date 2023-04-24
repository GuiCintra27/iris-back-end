import { prisma } from "../../config";
import { Prisma } from "@prisma/client";

async function create(data: Prisma.sessionsUncheckedCreateInput) {
  return await prisma.sessions.create({
    data,
  });
}

const sessionRepository = {
  create,
};

export default sessionRepository;
