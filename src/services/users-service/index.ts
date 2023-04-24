import userRepository from "../../repositories/user-repository";
import { users } from "@prisma/client";
import bcrypt from "bcrypt";
import { duplicatedEmailError, duplicatedPhoneNumberError } from "./errors";

export async function createUser({
  email,
  name,
  phoneNumber,
  birthDay,
  sexualityId,
  genderId,
  pronounsId,
  password,
}: CreateUserParams): Promise<users> {
  await validateUniqueEmailOrFail(email);

  await validateUniquePhoneNumberOrFail(phoneNumber);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userRepository.create({
    email,
    name,
    phoneNumber,
    birthDay,
    sexualityId: Number(sexualityId),
    genderId: Number(genderId),
    pronounsId: Number(pronounsId),
    password: hashedPassword,
  });

  return user;
}

async function validateUniqueEmailOrFail(email: string) {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

async function validateUniquePhoneNumberOrFail(phoneNumber: string) {
  const userWithSamePhoneNumber = await userRepository.findByPhoneNumber(phoneNumber);

  if (userWithSamePhoneNumber) {
    throw duplicatedPhoneNumberError();
  }
}

export async function getRegisterData() {
  return await userRepository.registerData();
}

export type CreateUserParams = Omit<users, "id" | "created_at" | "updated_at">;

const userService = {
  createUser,
  getRegisterData,
};

export * from "./errors";
export default userService;
