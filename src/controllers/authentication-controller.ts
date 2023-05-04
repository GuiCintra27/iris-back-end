import { SignInGoogleParams } from "@/schemas";
import authenticationService, { SignInParams } from "../services/authentication-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function singInPost(req: Request, res: Response) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if(error.name === "InvalidCredentialsError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function singInGooglePost(req: Request, res: Response) {
  const { credential } = req.body as SignInGoogleParams;

  try {
    const result = await authenticationService.signInGoogle({ credential });
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if(error.name === "InvalidGoogleCredentialError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "InvalidCredentialsError") {
      return res.status(httpStatus.NOT_FOUND).send(error.data);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
