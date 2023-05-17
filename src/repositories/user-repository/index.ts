import { prisma } from "../../config";
import { Prisma } from "@prisma/client";
import { users } from "@prisma/client";

async function findByEmail(email: string, select?: Prisma.usersSelect): Promise<users> {
  const params: Prisma.usersFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.users.findUnique(params);
}

async function findById(id: number): Promise<users> {
  return prisma.users.findUnique({
    where: {
      id
    }
  });
}

async function findByPhoneNumber(phoneNumber: string): Promise<users> {
  const params: Prisma.usersFindUniqueArgs = {
    where: {
      phoneNumber,
    },
  };

  return prisma.users.findUnique(params);
}

async function create(data: Prisma.usersUncheckedCreateInput) {
  return prisma.users.create({
    data,
  });
}

async function registerData() {
  const data = {sexualityId: {}, genderId: {}, pronounsId: {}};

  data.sexualityId = await prisma.sexualities.findMany({
    select:{
      id: true,
      name: true
    }
  });
  data.genderId = await prisma.genders.findMany({
    select:{
      id: true,
      name: true
    }
  });
  data.pronounsId = await prisma.pronouns.findMany({
    select:{
      id: true,
      name: true
    }
  });

  return data;
}

const userRepository = {
  findByEmail,
  findByPhoneNumber,
  create,
  registerData,
  findById,
  
};

export default userRepository;
