import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";

import { unauthorizedError } from "../errors";
import { prisma } from "../config";

export async function adminAuthenticateToken(req: AdminAuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return generateUnauthorizedResponse(res);

  const token = authHeader.split(" ")[1];
  if (!token) return generateUnauthorizedResponse(res);

  try {
    const { adminId } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    const session = await prisma.admin_sessions.findFirst({
      where: {
        token,
      },
    });
    if (!session) return generateUnauthorizedResponse(res);

    req.adminId = adminId;
    //TODO mudar aqui
    return next();
  } catch (err) {
    return generateUnauthorizedResponse(res);
  }
}

function generateUnauthorizedResponse(res: Response) {
  res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
}

export type AdminAuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  adminId: number;
};
