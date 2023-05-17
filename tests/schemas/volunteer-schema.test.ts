import { insertVolunteerSchema, updateVolunteerSchema } from "../../src/schemas";
import { faker } from "@faker-js/faker";
import { generateValidInputVolunteer } from "../factories";

describe("insertVolunteerSchema", () => {
  describe("when LinkedIn is not valid", () => {
    it("should return no error if linkedIn is not present", () => {
      const input = generateValidInputVolunteer();
      delete input.linkedIn;

      const { error } = insertVolunteerSchema.validate(input);

      expect(error).toBeUndefined();
    });

    it("should return error if linkedIn does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, linkedIn: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  describe("when IrisParticipant is not valid", () => {
    it("should return error if irisParticipant is not present", () => {
      const input = generateValidInputVolunteer();
      delete input.irisParticipant;

      const { error } = insertVolunteerSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if irisParticipant does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, irisParticipant: faker.datatype.number() });

      expect(error).toBeDefined();
    });

    it("should return error if irisParticipant does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, irisParticipant: faker.lorem.word() });

      expect(error).toBeDefined();
    });
  });

  describe("when Occupation is not valid", () => {
    it("should return error if occupation is not present", () => {
      const input = generateValidInputVolunteer();
      delete input.occupation;

      const { error } = insertVolunteerSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if occupation does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, occupation: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  describe("when SkinColorId is not valid", () => {
    it("should return error if skinColorId is not present", () => {
      const input = generateValidInputVolunteer();
      delete input.skinColorId;

      const { error } = insertVolunteerSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if skinColorId does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, skinColorId: faker.lorem.word() });

      expect(error).toBeDefined();
    });
  });

  describe("when OfficeId is not valid", () => {
    it("should return error if officeId is not present", () => {
      const input = generateValidInputVolunteer();
      delete input.officeId;

      const { error } = insertVolunteerSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if officeId does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, officeId: faker.lorem.word() });

      expect(error).toBeDefined();
    });
  });

  describe("when ApplyingReason is not valid", () => {
    it("should return error if applyingReason is not present", () => {
      const input = generateValidInputVolunteer();
      delete input.applyingReason;

      const { error } = insertVolunteerSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if applyingReason does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, applyingReason: faker.datatype.number() });

      expect(error).toBeDefined();
    });

    it("should return error if applyingReason does not reach minimum length", () => {
      const input = generateValidInputVolunteer();
      input.applyingReason = faker.lorem.word();

      const { error } = insertVolunteerSchema.validate(input);

      expect(error).toBeDefined();
    });

    it("should return error if applyingReason has exceeded the maximum length", () => {
      const input = generateValidInputVolunteer();
      input.applyingReason = faker.lorem.paragraph(5);
      
      const { error } = insertVolunteerSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  describe("when Experience is not valid", () => {
    it("should return no error if experience is not present", () => {
      const input = generateValidInputVolunteer();
      delete input.experience;

      const { error } = insertVolunteerSchema.validate(input);

      expect(error).toBeUndefined();
    });

    it("should return error if experience does not follow valid format", () => {
      const input = generateValidInputVolunteer();

      const { error } = insertVolunteerSchema.validate({ ...input, experience: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  it("should return no error if input is valid", () => {
    const input = generateValidInputVolunteer();

    const { error } = insertVolunteerSchema.validate(input);

    expect(error).toBeUndefined();
  });
});

describe("updateVolunteerSchema", () => {
  const generateValidInputVolunteer = () => ({
    id: faker.datatype.number(),
  });

  describe("when id is not valid", () => {
    it("should return error if id is not present", () => {
      const { error } = updateVolunteerSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if id does not follow valid id format", () => {
      const input = generateValidInputVolunteer();

      const { error } = updateVolunteerSchema.validate({ ...input, id: faker.lorem.word() });

      expect(error).toBeDefined();
    });

    it("should return error if id is less than expected", () => {
      const input = generateValidInputVolunteer();
      input.id = faker.datatype.number({ min: -100, max: 1 });

      const { error } = updateVolunteerSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  it("should return no error if input is valid", () => {
    const input = generateValidInputVolunteer();

    const { error } = updateVolunteerSchema.validate(input);

    expect(error).toBeUndefined();
  });
});
