import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { users as User } from "@prisma/client";
import { prisma } from "../../src/config";

export function createBodyUser() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(6),
  };
}

export async function createUser(params: Partial<User> = {}): Promise<User> {
  const incomingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  const genderArr = await prisma.genders.findMany();
  let genderId: number;
  if (genderArr.length === 0) {
    genderId = (await prisma.genders.create({ data: { name: faker.lorem.word(5) } })).id;
  } else {
    genderId = genderArr[0].id;
  }

  const sexualitiesArr = await prisma.sexualities.findMany();
  let sexualityId: number;
  if (sexualitiesArr.length === 0) {
    sexualityId = (await prisma.sexualities.create({ data: { name: faker.lorem.word(5) } })).id;
  } else {
    sexualityId = sexualitiesArr[0].id;
  }

  const pronounsArr = await prisma.pronouns.findMany();
  let pronounsId: number;
  if (pronounsArr.length === 0) {
    pronounsId = (await prisma.pronouns.create({ data: { name: faker.lorem.word(5) } })).id;
  } else {
    pronounsId = pronounsArr[0].id;
  }

  return await prisma.users.create({
    data: {
      name: faker.name.fullName(),
      email: params.email || faker.internet.email(),
      phoneNumber: params.phoneNumber || faker.phone.number("2299286####"),
      birthDay: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString(),
      sexualityId: sexualityId,
      genderId: genderId,
      pronounsId: pronounsId,
      password: hashedPassword,
    },
  });
}
