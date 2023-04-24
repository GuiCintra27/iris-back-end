import { Request, Response } from "express";
import newsLetterService from "../services/news-letter-service";
import httpStatus from "http-status";

export async function insertOnNewsLetter(req: Request, res: Response) {
  const { email } = req.body;

  try {
    await newsLetterService.insertParticipant(email);

    return res.sendStatus(httpStatus.NO_CONTENT);
  } catch (error) {
    if (error.name === "AlreadyRegisteredError") return res.status(httpStatus.CONFLICT).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function NewsLetterParticipants(req: Request, res: Response) {
  try {
    const participants = await newsLetterService.getParticipants();

    return res.send(participants);
  } catch (error) {
    if (error.name === "NotFoundError") return res.status(httpStatus.NOT_FOUND).send(error);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
