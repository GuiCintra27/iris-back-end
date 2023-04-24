import { prisma } from "../../config";
import { contact } from "@prisma/client";

export async function insert(data: ContactParamsWithUserId): Promise<contact> {
  return await prisma.contact.create({
    data,
  });
}

export async function findMany(): Promise<GetContacts[]> {
  return await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      telephone: true,
      message: true,
    },
  });
}

export async function findById(id: number): Promise<contact> {
  return await prisma.contact.findUnique({
    where: {
      id,
    },
  });
}

export async function findByUserId(userId: number): Promise<contact[]> {
  return await prisma.contact.findMany({
    where: {
      userId,
    },
  });
}

export async function deleteContact(id: number) {
  return await prisma.contact.delete({
    where: {
      id,
    },
  });
}

export type ContactParams = Omit<contact, "created_at" | "updated_at" | "id" | "userId">;

export type ContactParamsWithUserId = Omit<contact, "created_at" | "updated_at" | "id">;

export type GetContacts = Omit<contact, "created_at" | "updated_at" | "userId">;

const contactRepository = {
  insert,
  findMany,
  findById,
  findByUserId,
  deleteContact,
};

export default contactRepository;
