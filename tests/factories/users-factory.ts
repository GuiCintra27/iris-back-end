import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { users as User } from "@prisma/client";
import { prisma } from "../../src/config";

export async function createUser(params: Partial<User> = {}): Promise<User> {
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return await prisma.users.create({
    data: {
      name: faker.name.fullName(),
      email: params.email || faker.internet.email(),
      phoneNumber: params.phoneNumber || faker.phone.number("2299286####"),
      birthDay: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString(),
      sexualityId: 1,
      genderId: 1,
      pronounsId: 1,
      password: hashedPassword,
    },
  });
}
