import sessionRepository from "../../repositories/session-repository";
import userRepository from "../../repositories/user-repository";
import { users as User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { invalidCredentialsError, invalidGoogleCredentialError } from "./errors";
import { SignInGoogleParams } from "../../schemas";
import axios from "axios";

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await getUserOrFail(email);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    user: { id: user.id, name: user.name, email: user.email },
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
    user: { id: user.id, name: user.name, email: user.email },
    token,
  };
}

async function signInFacebook({ accessToken: userToken }: SignInGoogleParams): Promise<SignInFacebookResult> {
  const app_id = process.env.FACEBOOK_APP_ID;
  const app_secret = process.env.FACEBOOK_APP_SECRET;
  const access_token = `${app_id}|${app_secret}`;
  let user, token;
  try {
    const validateToken = await axios.get(
      `https://graph.facebook.com/debug_token?input_token=${userToken}&access_token=${access_token}`,
    );
    if (!validateToken.data.data.is_valid) throw invalidGoogleCredentialError();
    const {
      data: { email: userEmail },
    } = await axios.get(`https://graph.facebook.com/me?fields=email&access_token=${userToken}`);

    user = await getUserOrFail(userEmail);

    token = await createSession(user.id);
  } catch (err) {
    err.status = 404;
    throw err;
  }

  return {
    user: { id: user.id, email: user.email },
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, name: true, email: true, password: true });
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
  user: Pick<User, "id" | "name" | "email">;
  token: string;
};

type SignInFacebookResult = {
  user: Pick<User, "id" | "email">;
  token: string;
}

type GetUserOrFailResult = Pick<User, "id" | "name" | "email" | "password">;

export const authenticationService = {
  signIn,
  signInGoogle,
  signInFacebook,
};

export * from "./errors";
