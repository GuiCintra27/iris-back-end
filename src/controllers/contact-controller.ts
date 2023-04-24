import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "../middlewares";
import contactService from "../services/contact-service";

export async function insertOnContact(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { name, email, telephone, message } = req.body;

  try {
    await contactService.insertOnContact({ name, email, telephone, message }, userId);

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === "LimitReachedError") return res.status(httpStatus.TOO_MANY_REQUESTS).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getContacts(req: Request, res: Response) {
  try {
    const messages = await contactService.getContacts();

    return res.send(messages);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function deleteContact(req: Request, res: Response) {
  const { id: contactId } = req.params;
  
  try {
    await contactService.deleteContact(Number(contactId));

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
