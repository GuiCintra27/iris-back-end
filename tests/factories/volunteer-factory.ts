import { volunteers } from "@prisma/client";
import { prisma } from "../../src/config";
import { VolunteerParams } from "../repositories/volunteer-repository";

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
