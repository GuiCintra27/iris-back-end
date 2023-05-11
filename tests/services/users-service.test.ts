import { init } from "../../src/app";
import { prisma } from "../../src/config";
import userService, { duplicatedEmailError } from "../../src/services/users-service";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { createUser, generateValidBodyUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("createUser", () => {
  it("should throw duplicatedUserError if there is a user with given email", async () => {
    const existingUser = await createUser();

    try {
      await userService.createUser({
        email: existingUser.email,
        name: faker.name.fullName(),
        phoneNumber: faker.phone.number("2299286####"),
        birthDay: new Date(faker.date.birthdate({ min: 18, max: 65, mode: "age" })),
        sexualityId: 1,
        genderId: 1,
        pronounsId: 1,
        password: faker.internet.password(6),
      });
      fail("should throw duplicatedUserError");
    } catch (error) {
      expect(error).toEqual(duplicatedEmailError());
    }
  });

  it("should create user when given email is unique", async () => {
    const validBody = await generateValidBodyUser(true);
    const user = await userService.createUser(validBody);

    const dbUser = await prisma.users.findUnique({
      where: {
        email: validBody.email,
      },
    });

    expect(user).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        email: dbUser.email,
      }),
    );
  });

  it("should hash user password", async () => {
    const user = await generateValidBodyUser();
    const validBody = await createUser(user);
    const dbUser = await prisma.users.findUnique({
      where: {
        email: validBody.email,
      },
    });

    expect(dbUser.password).not.toBe(user.password);
    expect(await bcrypt.compare(user.password, dbUser.password)).toBe(true);
  });
});
