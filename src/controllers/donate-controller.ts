import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import donateService from "../services/donate-service";
import { AdminAuthenticatedRequest } from "../middlewares/admin-authentication-middleware";

export async function insertOnDonates(req: AuthenticatedRequest, res: Response) {
  const { amount } = req.body;
  const { userId } = req;

  try {
    await donateService.insertDonate({ userId, amount: Number(amount) });

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getNewDonates(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const newDonates = await donateService.getNewDonates();

    return res.send(newDonates);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getAllDonates(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const donates = await donateService.getDonates();

    return res.send(donates);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function updateDonates(req: AdminAuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    await donateService.updateDonates(Number(id));

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    if (error.name === "ConflictError") return res.status(httpStatus.CONFLICT).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
