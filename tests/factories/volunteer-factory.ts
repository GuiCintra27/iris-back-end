import { volunteers } from "@prisma/client";
import { prisma } from "../../src/config";
import { VolunteerParams } from "../repositories/volunteer-repository";
import { faker } from "@faker-js/faker";

export function generateValidInputVolunteer() {
  return {
    linkedIn: faker.internet.url(),
    irisParticipant: faker.datatype.boolean(),
    occupation: faker.lorem.word(),
    skinColorId: 1,
    officeId: 1,
    applyingReason: faker.lorem.paragraphs().substring(100, 200),
    experience: faker.lorem.word(),
  };
}

export async function createVolunteer(data: VolunteerParams, visualized?: boolean): Promise<volunteers> {
  return await prisma.volunteers.create({
    data: {
      ...data,
      visualized,
    },
  });
}

export async function getVolunteerById(id: number): Promise<volunteers> {
  return await prisma.volunteers.findUnique({
    where: {
      id,
    },
  });
}
export async function getVolunteers(): Promise<volunteers[]> {
  return await prisma.volunteers.findMany({});
}
