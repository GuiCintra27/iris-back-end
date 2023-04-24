import { VolunteerParams } from "../repositories/volunteer-repository";
import Joi from "joi";

export const insertVolunteerSchema = Joi.object<Omit<VolunteerParams, "userId">>({
  linkedIn: Joi.string().uri(),
  irisParticipant: Joi.boolean().required(),
  occupation: Joi.string().required(),
  skinColorId: Joi.number().required(),
  officeId: Joi.number().required(),
  applyingReason: Joi.string().min(100).max(200).required(),
  experience: Joi.string().max(1500),
});

export const updateVolunteerSchema = Joi.object<{id: number}>({
  id: Joi.number().positive().required(),
});
