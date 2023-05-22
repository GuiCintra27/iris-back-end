import { Prisma } from "@prisma/client";
import { prisma } from "../../config";

async function findByEmail(email: string) {
  return await prisma.admins.findFirst({
    where: { email },
  });
}

async function findByCpf(cpf: string) {
  return await prisma.admins.findFirst({
    where: { cpf },
  });
}

async function createSessionadmin(data: Prisma.admin_sessionsUncheckedCreateInput) {
  return await prisma.admin_sessions.create({
    data,
  });
}

async function createNewadmin(data: Prisma.adminsUncheckedCreateInput) {
  return await prisma.admins.create({
    data,
  });
}

const adminRepository = {
  findByEmail,
  findByCpf,
  createSessionadmin,
  createNewadmin,
};

export default adminRepository;
