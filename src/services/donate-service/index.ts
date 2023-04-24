import { conflictError, notFoundError } from "../../errors";
import donateRepository, { DonateParams, GetDonates } from "../../repositories/donate-repository";

export async function insertDonate(data: DonateParams): Promise<void> {
  await donateRepository.insert(data);

  return;
}

export async function getDonates(): Promise<GetDonates[]> {
  const donates = await donateRepository.findMany();

  if (donates.length === 0) throw notFoundError();

  return donates;
}

export async function getNewDonates(): Promise<GetDonates[]> {
  const donates = await donateRepository.findNew();

  if (donates.length === 0) throw notFoundError();

  return donates;
}

export async function updateDonates(id: number): Promise<void> {
  const donates = await donateRepository.findById(id);

  if (!donates) throw notFoundError();

  if(donates?.visualized) throw conflictError("This donate is already updated");

  await donateRepository.updateDonates(id);

  return;
}

const donateService = {
  insertDonate,
  getDonates,
  getNewDonates,
  updateDonates,
};

export default donateService;
