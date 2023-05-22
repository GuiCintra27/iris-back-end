import Joi from "joi";

export const newAdminSchema = Joi.object({
  cpf: Joi.string().length(11).required(),
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "edu", "br"] } }).required(),
  photo: Joi.string().required(),
  birthDay: Joi.string().isoDate().required(),
  password: Joi.string().min(6).required(),
});
