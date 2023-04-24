import { ApplicationError } from "../protocols";

export function alreadyRegistered(email: string): ApplicationError {
  return {
    name: "AlreadyRegisteredError",
    message: `Email ${email} is already registered`,
  };
}
