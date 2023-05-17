import { insertDonateSchema, updateDonateSchema } from "../../src/schemas";
import { faker } from "@faker-js/faker";
import { generateValidInputDonate } from "../factories";

describe("insertDonateSchema", () => {
  it("should return no error if input is valid", () => {
    const input = generateValidInputDonate();
    delete input.id;

    const { error } = insertDonateSchema.validate(input);

    expect(error).toBeUndefined();
  });

  describe("when amount is not valid", () => {
    it("should return error if amount is not present", () => {
      const { error } = insertDonateSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if amount does not follow valid amount format", () => {
      const input = generateValidInputDonate();

      const { error } = insertDonateSchema.validate({ ...input, amount: faker.lorem.word() });

      expect(error).toBeDefined();
    });

    it("should return error if amount is less than expected", () => {
      const input = generateValidInputDonate();
      input.amount = faker.datatype.number({ min: -100, max: 4 });

      const { error } = insertDonateSchema.validate(input);

      expect(error).toBeDefined();
    });
  });
});

describe("updateDonateSchema", () => {
  it("should return no error if input is valid", () => {
    const input = generateValidInputDonate();
    delete input.amount;

    const { error } = updateDonateSchema.validate(input);

    expect(error).toBeUndefined();
  });

  describe("when id is not valid", () => {
    it("should return error if id is not present", () => {
      const { error } = updateDonateSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if id does not follow valid id format", () => {
      const input = generateValidInputDonate();

      const { error } = updateDonateSchema.validate({ ...input, id: faker.lorem.word() });

      expect(error).toBeDefined();
    });

    it("should return error if id is less than expected", () => {
      const input = generateValidInputDonate();
      input.id = faker.datatype.number({ min: -100, max: 1 });

      const { error } = updateDonateSchema.validate(input);

      expect(error).toBeDefined();
    });
  });
});
