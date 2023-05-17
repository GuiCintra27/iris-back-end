
import app, { init } from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createNewsLetterParticipant, generateValidNewsLetterInput } from "../factories/news-letter-factory.";
import { cleanDb, generateValidAdminToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { createAdmin } from "../factories/admin-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /news-letter", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/news-letter");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/news-letter").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/news-letter").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 404 when have no participants subscribed in newsLetter", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);

      const response = await server.get("/news-letter").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 and an list of participants when have participants subscribed in newsLetter", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);
      const input = generateValidNewsLetterInput();

      const participant = await createNewsLetterParticipant(input.email);

      const response = await server.get("/news-letter").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(expect.arrayContaining([{ id: participant.id, email: participant.email }]));
    });
  });
});

describe("POST /news-letter", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/news-letter");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should return 400 when given email is not valid", async () => {
      const input = { email: faker.internet.email("eu", "teste", "gmail.toast") };

      const response = await server.post("/news-letter").send(input);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 409 when email is already registered", async () => {
      const input = generateValidNewsLetterInput();
      await createNewsLetterParticipant(input.email);

      const response = await server.post("/news-letter").send(input);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    describe("When input is valid", () => {   
      it("Should return 204", async () => {
        const input = generateValidNewsLetterInput();
        const response = await server.post("/news-letter").send(input);

        expect(response.status).toBe(httpStatus.NO_CONTENT);
        expect(response.body).toEqual({});
      });
    });
  });
});
