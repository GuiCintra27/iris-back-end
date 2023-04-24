import { createUserSchema } from "../../src/schemas";
import { faker } from "@faker-js/faker";

describe("createUserSchema", () => {
  const generateValidInput = () => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number("2299286####"),
    birthDay: (faker.date.birthdate({ min: 18, max: 65, mode: "age" })).toISOString(),
    sexualityId: 1,
    genderId: 1,
    pronounsId: 1,
    password: faker.internet.password(6),
  });

  describe("When email is not valid", () => {
    it("should return error if email is not present", () => {
      const input = generateValidInput();
      delete input.email;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid email format", () => {
      const input = generateValidInput();
      input.email = faker.lorem.word();

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe("When name is not valid", () => {
    it("should return error if name is not present", () => {
      const input = generateValidInput();
      delete input.name;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid name format", () => {
      const input = generateValidInput();

      const { error } = createUserSchema.validate({...input, name: faker.datatype.number()});

      expect(error).toBeDefined();
    });
  });

  describe("When phone number is not valid", () => {
    it("should return error if phone number is not present", () => {
      const input = generateValidInput();
      delete input.phoneNumber;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if phone number does not follow valid phone number format", () => {
      const input = generateValidInput();
      input.phoneNumber = faker.lorem.word();

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if phone number have more than 11 numbers", () => {
      const input = generateValidInput();
      input.phoneNumber = faker.phone.number("2299286#####");

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if phone number have less than 11 numbers", () => {
      const input = generateValidInput();
      input.phoneNumber = faker.phone.number("2299286###");

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe("When birthDay is not valid", () => {
    it("should return error if birthDay is not present", () => {
      const input = generateValidInput();
      delete input.birthDay;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid birthDay format", () => {
      const input = generateValidInput();
      input.birthDay = "22/01/2003";

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe("when sexualityId is not valid", () => {
    it("should return error if sexualityId is not present", () => {
      const input = generateValidInput();
      delete input.sexualityId;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid sexualityId format", () => {
      const input = generateValidInput();

      const { error } = createUserSchema.validate({...input, sexualityId: faker.lorem.word()});

      expect(error).toBeDefined();
    });
  });

  describe("when genderId is not valid", () => {
    it("should return error if genderId is not present", () => {
      const input = generateValidInput();
      delete input.genderId;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid genderId format", () => {
      const input = generateValidInput();

      const { error } = createUserSchema.validate({...input, genderId: faker.lorem.word()});

      expect(error).toBeDefined();
    });
  });

  describe("when pronounsId is not valid", () => {
    it("should return error if pronounsId is not present", () => {
      const input = generateValidInput();
      delete input.pronounsId;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if email does not follow valid pronounsId format", () => {
      const input = generateValidInput();

      const { error } = createUserSchema.validate({...input, pronounsId: faker.lorem.word()});

      expect(error).toBeDefined();
    });
  });

  describe("when password is not valid", () => {
    it("should return error if password is not present", () => {
      const input = generateValidInput();
      delete input.password;

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if password is shorter than 6 characters", () => {
      const input = generateValidInput();
      input.password = faker.lorem.word(5);

      const { error } = createUserSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  it("should return no error if input is valid", () => {
    const input = generateValidInput();

    const { error } = createUserSchema.validate(input);

    expect(error).toBeUndefined();
  });
});
