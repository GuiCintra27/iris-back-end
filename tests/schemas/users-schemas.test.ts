import { createUserSchema } from "../../src/schemas";
import { faker } from "@faker-js/faker";
import { generateValidBodyUser } from "../factories";

describe("createUserSchema", () => {
  describe("When email is not valid", () => {
    it("should return error if email is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.email;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid email format", async () => {
      const input = await generateValidBodyUser();
      input.email = faker.lorem.word();

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe("When name is not valid", () => {
    it("should return error if name is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.name;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid name format", async () => {
      const input = await generateValidBodyUser();

      const { error } = createUserSchema.validate({ ...input, name: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  describe("When phone number is not valid", () => {
    it("should return error if phone number is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.phoneNumber;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if phone number does not follow valid phone number format", async () => {
      const input = await generateValidBodyUser();
      input.phoneNumber = faker.lorem.word();

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if phone number have more than 11 numbers", async () => {
      const input = await generateValidBodyUser();
      input.phoneNumber = faker.phone.number("2299286#####");

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if phone number have less than 11 numbers", async () => {
      const input = await generateValidBodyUser();
      input.phoneNumber = faker.phone.number("2299286###");

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe("When birthDay is not valid", () => {
    it("should return error if birthDay is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.birthDay;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid birthDay format", async () => {
      const input = await generateValidBodyUser();

      const { error } = createUserSchema.validate({ ...input, birthDay: "22/01/2003" });

      expect(error).toBeDefined();
    });
  });

  describe("when sexualityId is not valid", () => {
    it("should return error if sexualityId is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.sexualityId;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid sexualityId format", async () => {
      const input = await generateValidBodyUser();

      const { error } = createUserSchema.validate({ ...input, sexualityId: faker.lorem.word() });

      expect(error).toBeDefined();
    });
  });

  describe("when genderId is not valid", () => {
    it("should return error if genderId is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.genderId;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid genderId format", async () => {
      const input = await generateValidBodyUser();

      const { error } = createUserSchema.validate({ ...input, genderId: faker.lorem.word() });

      expect(error).toBeDefined();
    });
  });

  describe("when pronounsId is not valid", () => {
    it("should return error if pronounsId is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.pronounsId;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid pronounsId format", async () => {
      const input = await generateValidBodyUser();

      const { error } = createUserSchema.validate({ ...input, pronounsId: faker.lorem.word() });

      expect(error).toBeDefined();
    });
  });

  describe("when password is not valid", () => {
    it("should return error if password is not present", async () => {
      const input = await generateValidBodyUser();
      delete input.password;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if password is shorter than 6 characters", async () => {
      const input = await generateValidBodyUser();
      input.password = faker.lorem.word(5);

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  it("should return no error if input is valid", async () => {
    const input = await generateValidBodyUser();

    const { error } = createUserSchema.validate({ ...input, birthDay: input.birthDay.toISOString() });

    expect(error).toBeUndefined();
  });
});
