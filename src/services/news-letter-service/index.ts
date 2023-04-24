import { alreadyRegistered, notFoundError } from "../../errors";
import newsLetterRepository, { NewsLetterParticipants } from "../../repositories/news-letter-repository";
import { newsletter } from "@prisma/client";

export async function insertParticipant(email: string): Promise<void> {
  const registered = await newsLetterRepository.findUnique(email);

  if (registered) throw alreadyRegistered(email);

  await newsLetterRepository.insert(email);

  return;
}

export async function getParticipants(): Promise<NewsLetterParticipants> {
  const participants = await newsLetterRepository.findParticipants();
  
  if (participants.length === 0) throw notFoundError();
  
  return participants;
}

const newsLetterService = {
  insertParticipant,
  getParticipants,
};

export type NewsLetterParams = Pick<newsletter, "email">;

export default newsLetterService;
