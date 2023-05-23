import { Response, Request } from "express";
import httpStatus from "http-status";
import adminService from "../services/admin-service";

export async function singInAdmin(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const result = await adminService.singInAdmin({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.name === "InvalidCredentialsError") return res.sendStatus(httpStatus.UNAUTHORIZED);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function createNewAdmin(req: Request, res: Response) {
  try {
    const newAdmin = await adminService.createNewAdmin(req.body);

    return res.status(httpStatus.CREATED).send(newAdmin);
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    if (error.name === "DuplicatedCPFError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
