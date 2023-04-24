import { prisma } from "../../config";
import { donates, users } from "@prisma/client";

async function insert(data: DonateParams): Promise<void> {
  await prisma.donates.create({
    data,
  });

  return;
}

async function findMany(): Promise<GetDonates[]> {
  return await prisma.donates.findMany({
    select: {
      id: true,
      amount: true,
      users: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          sexualities: {
            select: {
              name: true,
            },
          },
          genders: {
            select: {
              name: true,
            },
          },
          pronouns: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

async function findNew(): Promise<GetDonates[]> {
  return await prisma.donates.findMany({
    where: {
      visualized: false,
    },
    select: {
      id: true,
      amount: true,
      users: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          sexualities: {
            select: {
              name: true,
            },
          },
          genders: {
            select: {
              name: true,
            },
          },
          pronouns: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

async function findById(id: number): Promise<donates> {
  return await prisma.donates.findUnique({
    where: {
      id,
    },
  });
}

async function updateDonates(id: number) {
  await prisma.donates.update({
    where: {
      id,
    },
    data: {
      visualized: true,
    },
  });

  return;
}

export type GetDonates = Omit<donates, "visualized" | "userId" | "created_at" | "updated_at"> & {
  users: Pick<users, "name" | "email" | "phoneNumber"> & { genders: { name: string } } & {
    sexualities: { name: string };
  } & { pronouns: { name: string } };
};

export type DonateParams = Omit<donates, "id" | "created_at" | "updated_at" | "visualized">;

const donateRepository = {
  insert,
  findMany,
  findNew,
  findById,
  updateDonates,
};

export default donateRepository;
