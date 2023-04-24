import { limitReachedError, notFoundError } from "../../errors";
import contactRepository, { ContactParams, GetContacts } from "../../repositories/contact-repository";

export async function insertOnContact(data: ContactParams, userId: number): Promise<void> {
  const messages = await contactRepository.findByUserId(userId);

  if (messages.length === 3) throw limitReachedError("Number of messages has rechead the limit");

  await contactRepository.insert({ ...data, userId });

  return;
}

export async function getContacts(): Promise<GetContacts[]> {
  const messages = await contactRepository.findMany();

  if (messages.length === 0) throw notFoundError();

  return messages;
}

export async function deleteContact(contactId: number): Promise<void> {
  const contact = await contactRepository.findById(contactId);

  if (!contact) throw notFoundError();

  await contactRepository.deleteContact(contactId);

  return;
}

const contactService = {
  insertOnContact,
  getContacts,
  deleteContact,
};

export default contactService;
