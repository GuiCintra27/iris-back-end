import { ApplicationError } from "../protocols";

export function limitReachedError(message: string): ApplicationError {
  return {
    name: "LimitReachedError",
    message,
  };
}
