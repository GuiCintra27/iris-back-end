import { ApplicationError } from "../../protocols";

export function duplicatedEmailError(): ApplicationError {
  return {
    name: "DuplicatedEmailError",
    message: "There is already an user with given email",
  };
}

export function duplicatedPhoneNumberError(): ApplicationError {
  return {
    name: "DuplicatedPhoneNumberError",
    message: "There is already an user with given phone number",
  };
}

export function duplicatedCPFError(): ApplicationError {
  return {
    name: "DuplicatedCPFError",
    message: "There is already an user with given CPF number",
  };
}
