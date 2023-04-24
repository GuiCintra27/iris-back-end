import { ContactParams } from "../repositories/contact-repository";
import Joi from "joi";

export const insertContactSchema = Joi.object<ContactParams>({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "edu", "br"] } }).required(),
  telephone: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
  message: Joi.string().min(15).required()
});

export const deleteContactSchema = Joi.object<{id: number}>({
  id: Joi.number().required()
});
