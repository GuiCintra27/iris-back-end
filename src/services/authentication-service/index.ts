import sessionRepository from "../../repositories/session-repository";
import userRepository from "../../repositories/user-repository";
import { users as User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError, invalidGoogleCredentialError } from "./errors";
import { SignInGoogleParams } from "@/schemas";
import axios from "axios";

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: { id: user.id, email: user.email },
    token,
  };
}

async function signInGoogle(params: SignInGoogleParams): Promise<SignInResult> {
  const { accessToken } = params;
  let name, email, birthday, user;
  let testdata;
  
  try {
    const url = `https://people.googleapis.com/v1/people/me?key=${process.env.GOOGLE_API_KEY}&personFields=names,emailAddresses,birthdays,phoneNumbers,`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    const { data } = await axios.get(url, { headers });
    testdata = data;

    name = data.names[0].displayName;
    email = data.emailAddresses[0].value;
    birthday = data.birthdays[0].date;
  } catch (err) {
    console.log(err);
    throw invalidGoogleCredentialError();
  }

  try {
    user = await getUserOrFail(email);
  } catch (error) {
    error.data = { name, email, birthday };
    throw error;
  }

  const token = await createSession(user.id);

  return {
    user: { id: user.id, email: user.email },
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId,
  });

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw invalidCredentialsError();
}

export type SignInParams = Pick<User, "email" | "password">;

type SignInResult = {
  user: Pick<User, "id" | "email">;
  token: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email" | "password">;

export const authenticationService = {
  signIn,
  signInGoogle,
};

export * from "./errors";
