import { NewsLetterParams } from "../services";
import Joi from "joi";

export const newsLetterSchema = Joi.object<NewsLetterParams>({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "edu", "br"] } }).required(),
});
