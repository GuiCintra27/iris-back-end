import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";

import { unauthorizedError } from "../errors";
import { prisma } from "../config";

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = await checkSessionAndToken(req);

    req.userId = userId;
    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}

export async function optionalAuthenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = await checkSessionAndToken(req);

    req.userId = userId;
  } catch (err) {
  } finally {
    return next();
  }
}

async function checkSessionAndToken(req: AuthenticatedRequest) {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) throw new Error("Token not found");

    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await prisma.sessions.findFirst({
      where: {
        token,
      },
    });

    if (!session) throw new Error("Session not found");

    return userId;
  } catch (err) {
    return err;
  }
}

function generateUnauthorizedResponse(res: Response) {
  res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  userId: number;
};
