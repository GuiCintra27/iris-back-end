import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import volunteerService from "../services/volunteer-service";
import { AdminAuthenticatedRequest } from "../middlewares/admin-authentication-middleware";

export async function insertOnVolunteers(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { skinColorId, officeId } = req.body;

  const data = { userId, ...req.body, skinColorId: Number(skinColorId), officeId: Number(officeId) };

  try {
    await volunteerService.insertVolunteer(data);

    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "ConflictError") return res.status(httpStatus.CONFLICT).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getNewVolunteers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const newVolunteers = await volunteerService.getNewVolunteers();

    return res.send(newVolunteers);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getAllVolunteers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const volunteers = await volunteerService.getVolunteers();

    return res.send(volunteers);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function updateVolunteers(req: AdminAuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    await volunteerService.updateVolunteers(Number(id));

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    if (error.name === "ConflictError") return res.status(httpStatus.CONFLICT).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function registerData(req: Request, res: Response) {
  try {
    const registerData = await volunteerService.getVolunteerRegisterData();
    return res.send(registerData);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
