import { conflictError, notFoundError } from "../../errors";
import volunteerRepository, { VolunteerParams, GetVolunteers } from "../../repositories/volunteer-repository";

export async function insertVolunteer(data: VolunteerParams): Promise<void> {
  const alreadyRegistered = await volunteerRepository.findByUserId(data.userId);

  if (alreadyRegistered) throw conflictError("Usuário já registrado");

  await volunteerRepository.insert(data);

  return;
}

export async function getVolunteers(): Promise<GetVolunteers[]> {
  const volunteers = await volunteerRepository.findMany();

  if (volunteers.length === 0) throw notFoundError();

  return volunteers;
}

export async function getNewVolunteers(): Promise<GetVolunteers[]> {
  const volunteers = await volunteerRepository.findNew();

  if (volunteers.length === 0) throw notFoundError();

  return volunteers;
}

export async function updateVolunteers(id: number): Promise<void> {
  const volunteers = await volunteerRepository.findById(id);

  if (!volunteers) throw notFoundError();

  if (volunteers?.visualized) throw conflictError("This volunteer is already updated");

  await volunteerRepository.updateVolunteers(id);

  return;
}

export async function getVolunteerRegisterData() {
  return await volunteerRepository.registerData();
}

const volunteerService = {
  insertVolunteer,
  getVolunteers,
  getNewVolunteers,
  updateVolunteers,
  getVolunteerRegisterData
};

export default volunteerService;
