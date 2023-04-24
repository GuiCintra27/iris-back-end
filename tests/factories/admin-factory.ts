import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { admins } from "@prisma/client";
import { prisma } from "../../src/config";
import { generateCPF } from "@brazilian-utils/brazilian-utils";

export async function createAdmin(params: Partial<admins> = {}): Promise<admins> {
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return await prisma.admins.create({
    data: {
      name: faker.name.fullName(),
      cpf: generateCPF(),
      email: params.email || faker.internet.email(),
      photo: faker.internet.url(),
      birthDay: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString(),
      password: hashedPassword,
    },
  });
}
