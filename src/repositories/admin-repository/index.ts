import { Prisma } from "@prisma/client";
import { prisma } from "../../config";

async function findByEmail(email: string) {
  return await prisma.admins.findFirst({
    where: { email },
  });
}

async function createSessionadmin(data: Prisma.admin_sessionsUncheckedCreateInput) {
  return await prisma.admin_sessions.create({
    data,
  });
}

async function createNewadmin(data: Prisma.adminsUncheckedCreateInput) {
  console.log("data service", data);
  const teste = await prisma.admins.create({
    data: data,
  });
  console.log("Teste saida Repository", teste);
  return teste;
}
/* 
  {
    "email": "teste@gmail.com",
    "password": "123456789",
    "name": "joao", 
    "cpf": "05121633165",
    "birthDay": "2008-11-11",
    "photo": "oi"
  } 
*/
const adminRepository = {
  findByEmail,
  createSessionadmin,
  createNewadmin,
};

export default adminRepository;
