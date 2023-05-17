import { newsLetterSchema } from "../../src/schemas";
import { faker } from "@faker-js/faker";
import { generateValidNewsLetterInput } from "../factories";

describe("newsLetterSchema", () => {
  describe("when email is not valid", () => {
    it("should return error if email is not present", () => {
      const { error } = newsLetterSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid email format", () => {
      const input = { email: faker.lorem.word() };

      const { error } = newsLetterSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  it("should return no error if input is valid", () => {
    const input = generateValidNewsLetterInput();

    const { error } = newsLetterSchema.validate(input);

    expect(error).toBeUndefined();
  });
});
