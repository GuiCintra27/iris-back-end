
import app, { init } from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createBodyUser, createUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /auth/sign-in", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/auth/sign-in");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/auth/sign-in").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should respond with status 401 if there is no user for given email", async () => {
      console.log("oi");
      const body = createBodyUser();
      console.log("oi 2");
      const response = await server.post("/auth/sign-in").send(body);
      console.log("oi 3");
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is a user for given email but password is not correct", async () => {
      const body = createBodyUser();
      await createUser(body);

      const response = await server.post("/auth/sign-in").send({
        ...body,
        password: faker.lorem.word({ length: { min: 6, max: 12 } }),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should respond with status 200", async () => {
        const body = createBodyUser();
        await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.status).toBe(httpStatus.OK);
      });

      it("should respond with session token", async () => {
        const body = createBodyUser();
        await createUser(body);

        const response = await server.post("/auth/sign-in").send(body);

        expect(response.body.token).toBeDefined();
      });
    });
  });
});
