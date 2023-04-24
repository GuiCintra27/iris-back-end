import { ApplicationError } from "../protocols";

export function unprocessableContent(): ApplicationError {
  return {
    name: "UnprocessableContent",
    message: "This request is not valid. The client should not repeat this request without modification.",
  };
}
