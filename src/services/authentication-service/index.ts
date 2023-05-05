import sessionRepository from "../../repositories/session-repository";
import userRepository from "../../repositories/user-repository";
import { users as User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError, invalidGoogleCredentialError } from "./errors";
import { SignInGoogleParams } from "@/schemas";
import { googleClient } from "@/app";

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: {id: user.id, email: user.email},
    token,
  };
}

async function signInGoogle(params: SignInGoogleParams): Promise<SignInResult> {
  const { credential } = params;
  let name, email, user;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    email = payload.email;
    name = payload.name;
  } catch (err) {
    console.log(err);
    throw invalidGoogleCredentialError();
  }

  try {
    user = await getUserOrFail(email);
  } catch (error) {
    error.data = { name, email };
    throw error;
  }

  const token = await createSession(user.id);

  return {
    user: {id: user.id, email: user.email},
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

const authenticationService = {
  signIn,
  signInGoogle,
};

export default authenticationService;
export * from "./errors";
