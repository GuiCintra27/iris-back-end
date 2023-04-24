import { DonateParams } from "../repositories/donate-repository";
import Joi from "joi";

export const insertDonateSchema = Joi.object<Omit<DonateParams, "userId">>({
  amount: Joi.number().min(5).required(),
});

export const updateDonateSchema = Joi.object<{id: number}>({
  id: Joi.number().positive().required(),
});

