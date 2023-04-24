import { prisma } from "../../config";
import { volunteers, users } from "@prisma/client";

async function insert(data: VolunteerParams): Promise<void> {
  await prisma.volunteers.create({
    data,
  });

  return;
}

async function findMany(): Promise<GetVolunteers[]> {
  return await prisma.volunteers.findMany({
    select: {
      id: true,
      linkedIn: true,
      irisParticipant: true,
      occupation: true,
      applyingReason: true,
      experience: true,
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
      skincolor: {
        select: {
          name: true,
        },
      },
      offices: {
        select: {
          name: true,
        },
      },
    },
  });
}

async function findNew(): Promise<GetVolunteers[]> {
  return await prisma.volunteers.findMany({
    where: {
      visualized: false,
    },
    select: {
      id: true,
      linkedIn: true,
      irisParticipant: true,
      occupation: true,
      applyingReason: true,
      experience: true,
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
      skincolor: {
        select: {
          name: true,
        },
      },
      offices: {
        select: {
          name: true,
        },
      },
    },
  });
}

async function findById(id: number): Promise<volunteers> {
  return await prisma.volunteers.findUnique({
    where: {
      id,
    },
  });
}

async function findByUserId(userId: number): Promise<volunteers> {
  return await prisma.volunteers.findUnique({
    where: {
      userId,
    },
  });
}

async function updateVolunteers(id: number) {
  await prisma.volunteers.update({
    where: {
      id,
    },
    data: {
      visualized: true,
    },
  });

  return;
}

async function registerData() {
  const data = {offices: {}, skinColors: {}};

  data.offices = await prisma.offices.findMany({
    select:{
      id: true,
      name: true
    }
  });
  data.skinColors = await prisma.skincolor.findMany({
    select:{
      id: true,
      name: true
    }
  });

  return data;
}

export type GetVolunteers = Omit<
  volunteers,
  "visualized" | "userId" | "created_at" | "updated_at" | "skinColorId" | "officeId"
> & {
  users: Pick<users, "name" | "email" | "phoneNumber"> & { genders: { name: string } } & {
    sexualities: { name: string };
  } & { pronouns: { name: string } };
} & {skincolor: {name: string}} & {offices: {name: string}};

export type VolunteerParams = Omit<volunteers, "id" | "created_at" | "updated_at" | "visualized">;

const volunteerRepository = {
  insert,
  findMany,
  findNew,
  findById,
  findByUserId,
  updateVolunteers,
  registerData
};

export default volunteerRepository;
