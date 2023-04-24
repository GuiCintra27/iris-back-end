import { CreateUserParams } from "../services/users-service";
import Joi from "joi";

export const createUserSchema = Joi.object<CreateUserParams>({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "edu", "br"] } }).required(),
  phoneNumber: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
  birthDay: Joi.string().isoDate().required(),
  sexualityId: Joi.number().required(),
  genderId: Joi.number().required(),
  pronounsId: Joi.number().required(),
  password: Joi.string().min(6).required(),
});
