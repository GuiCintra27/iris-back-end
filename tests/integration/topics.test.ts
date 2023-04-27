import app, { init } from "../../src/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";
import { createNewTopic } from "../factories/topics-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /volunteer", () => {
  it("should respond with status 400 if response array is empty", async () => {
    const response = await server.get("/topics");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should respond with status 200 and all topics on the site", async () => {
    await createNewTopic();

    const response = await server.get("/topics");

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: expect.any(Number), name: expect.any(String) })]),
    );
    expect(response.body.length).toBe(6);
  });
});
