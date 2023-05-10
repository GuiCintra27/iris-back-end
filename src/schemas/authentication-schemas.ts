import { SignInParams } from "../services";
import Joi from "joi";

export const signInSchema = Joi.object<SignInParams>({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "edu", "br"] } }).required(),
  password: Joi.string().min(6).required(),
});

export const signInGoogleSchema = Joi.object<SignInGoogleParams>({
  accessToken: Joi.string().required()
});

export type SignInGoogleParams = { accessToken: string };
