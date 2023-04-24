import userService from "../services/users-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function usersPost(req: Request, res: Response) {
  const { name, email, phoneNumber, birthDay, sexualityId, genderId, pronounsId, password } = req.body;

  const userData = { name, email, phoneNumber, birthDay, sexualityId, genderId, pronounsId, password };

  try {
    await userService.createUser(userData);
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }

    if (error.name === "DuplicatedPhoneNumberError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

export async function getData(req: Request, res: Response) {
  try {
    const registerData = await userService.getRegisterData();
    return res.send(registerData);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
