import { insertContactSchema, deleteContactSchema } from "../../src/schemas";
import { generateValidDeleteInput, generateValidInsertInput } from "../factories";
import { faker } from "@faker-js/faker";

describe("contactSchema", () => {
  describe("Insert contact message schema", () => {
    it("should return no error if input is valid", () => {
      const input = generateValidInsertInput();

      const { error } = insertContactSchema.validate(input);

      expect(error).toBeUndefined();
    });

    describe("when email is not valid", () => {
      it("should return error if email is not present", () => {
        const input = generateValidInsertInput();
        delete input.email;

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });

      it("should return error if email does not follow valid email format", () => {
        const input = generateValidInsertInput();
        input.email = faker.lorem.word();

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    describe("When name is not valid", () => {
      it("should return error if name is not present", () => {
        const input = generateValidInsertInput();
        delete input.name;

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });

      it("should return error if name does not follow valid name format", () => {
        const input = generateValidInsertInput();

        const { error } = insertContactSchema.validate({ ...input, name: faker.datatype.number() });

        expect(error).toBeDefined();
      });
    });

    describe("When phone number is not valid", () => {
      it("should return error if phone number is not present", () => {
        const input = generateValidInsertInput();
        delete input.telephone;

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });

      it("should return error if phone number does not follow valid phone number format", () => {
        const input = generateValidInsertInput();
        input.telephone = faker.lorem.word();

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });

      it("should return error if phone number have more than 11 numbers", () => {
        const input = generateValidInsertInput();
        input.telephone = faker.phone.number("2299286#####");

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });

      it("should return error if phone number have less than 11 numbers", () => {
        const input = generateValidInsertInput();
        input.telephone = faker.phone.number("2299286###");

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });
    });

    describe("when message is not valid", () => {
      it("should return error if message is not present", () => {
        const input = generateValidInsertInput();
        delete input.message;

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });

      it("should return error if message does not follow valid message format", () => {
        const input = generateValidInsertInput();

        const { error } = insertContactSchema.validate({ ...input, message: faker.lorem.word() });

        expect(error).toBeDefined();
      });

      it("should return error if message does not have length equal to 15 characters or more", () => {
        const input = generateValidInsertInput();
        input.message = faker.lorem.word({ length: { min: 5, max: 7 } });

        const { error } = insertContactSchema.validate(input);

        expect(error).toBeDefined();
      });
    });
  });

  describe("Delete contact message schema", () => {
    it("should return no error if input is valid", () => {
      const input = generateValidDeleteInput();

      const { error } = deleteContactSchema.validate(input);

      expect(error).toBeUndefined();
    });

    describe("when id is not valid", () => {
      it("should return error if id is not present", () => {
        const input = generateValidDeleteInput();
        delete input.id;

        const { error } = deleteContactSchema.validate(input);

        expect(error).toBeDefined();
      });

      it("should return error if id does not follow valid id format", () => {
        const input = generateValidDeleteInput();

        const { error } = insertContactSchema.validate({ ...input, id: faker.lorem.word() });

        expect(error).toBeDefined();
      });
    });
  });
});
