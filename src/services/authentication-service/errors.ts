import { ApplicationError } from "../../protocols";

export function invalidCredentialsError(): ApplicationError {
  return {
    name: "InvalidCredentialsError",
    message: "email or password are incorrect",
  };
}

export function invalidGoogleCredentialError(): ApplicationError {
  return {
    name: "InvalidGoogleCredentialError",
    message: "google credential verification failed",
  };
}
