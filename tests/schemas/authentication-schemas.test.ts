import { signInSchema } from "../../src/schemas";
import { faker } from "@faker-js/faker";
import { createBodyUser } from "../factories";

describe("signInSchema", () => {
  describe("when email is not valid", () => {
    it("should return error if email is not present", () => {
      const input = createBodyUser();
      delete input.email;

      const { error } = signInSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid email format", () => {
      const input = createBodyUser();
      input.email = faker.lorem.word();

      const { error } = signInSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe("when password is not valid", () => {
    it("should return error if password is not present", () => {
      const input = createBodyUser();
      delete input.password;

      const { error } = signInSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if password is not a string", () => {
      const input = createBodyUser();

      const { error } = signInSchema.validate({ ...input, password: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  it("should return no error if input is valid", () => {
    const input = createBodyUser();

    const { error } = signInSchema.validate(input);

    expect(error).toBeUndefined();
  });
});
