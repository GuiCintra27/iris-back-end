import { createPostSchema } from "../../src/schemas";
import { faker } from "@faker-js/faker";

const generateValidInput = () => ({
  title: faker.lorem.sentences(10),
  topicId: 1,
  text: faker.lorem.sentences(10),
  image: faker.internet.url(),
});

describe("createPostSchema", () => {
  describe("when text is not valid", () => {
    it("should return error if text is not present", () => {
      const { error } = createPostSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if text does not follow valid text format", () => {
      const input = generateValidInput();

      const { error } = createPostSchema.validate({ ...input, text: faker.datatype.number() });

      expect(error).toBeDefined();
    });
  });

  describe("when image is not valid", () => {
    it("should return error if image is not present", () => {
      const { error } = createPostSchema.validate({});

      expect(error).toBeDefined();
    });

    it("should return error if image does not follow valid image format", () => {
      const input = generateValidInput();
      input.image = faker.lorem.word();

      const { error } = createPostSchema.validate(input);

      expect(error).toBeDefined();
    });
  });

  it("should return no error if input is valid", () => {
    const input = generateValidInput();

    const { error } = createPostSchema.validate(input);

    expect(error).toBeUndefined();
  });
});
