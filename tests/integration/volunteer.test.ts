
import app, {init} from "../../src/app"
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidAdminToken, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { createAdmin } from "../factories/admin-factory";
import { createVolunteer, getVolunteers } from "../factories";
import { createUser } from "../factories";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /volunteer", () => {
  const generateValidInput = () => ({
    linkedIn: String(faker.internet.url()),
    irisParticipant: Boolean(faker.datatype.boolean()),
    occupation: String(faker.lorem.word()),
    skinColorId: 1,
    officeId: 1,
    applyingReason: String(faker.lorem.sentences(3)),
    experience: String(faker.lorem.word()),
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/volunteer");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/volunteer").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/volunteer").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 404 when have no volunteers registered", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);

      const response = await server.get("/volunteer").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 and an list of new volunteers when have registered volunteers", async () => {
      const admin = await createAdmin();
      const user = await createUser();
      const user2 = await createUser();
      const user3 = await createUser();
      const user4 = await createUser();
      const token = await generateValidAdminToken(admin);
      const input = generateValidInput();

      await createVolunteer({ userId: user.id, ...input });
      await createVolunteer({ userId: user2.id, ...input });
      await createVolunteer({ userId: user3.id, ...input }, true);
      await createVolunteer({ userId: user4.id, ...input }, true);

      const response = await server.get("/volunteer").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.length).toEqual(2);
    });
  });

  describe("/all", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/volunteer/all");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/volunteer/all").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const adminWithoutSession = await createAdmin();
      const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/volunteer/all").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When token is valid", () => {
      it("should return 404 when have no volunteers registered", async () => {
        const admin = await createAdmin();
        const token = await generateValidAdminToken(admin);

        const response = await server.get("/volunteer/all").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should return 200 and an list only all volunteers when have registered volunteers", async () => {
        const admin = await createAdmin();
        const user = await createUser();
        const user2 = await createUser();
        const user3 = await createUser();
        const user4 = await createUser();
        const token = await generateValidAdminToken(admin);
        const input = generateValidInput();

        await createVolunteer({ userId: user.id, ...input });
        await createVolunteer({ userId: user2.id, ...input });
        await createVolunteer({ userId: user3.id, ...input }, true);
        await createVolunteer({ userId: user4.id, ...input }, true);

        const response = await server.get("/volunteer/all").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.length).toEqual(4);
      });
    });
  });
});

describe("POST /volunteer", () => {
  const generateValidInput = () => ({
    linkedIn: faker.internet.url(),
    irisParticipant: faker.datatype.boolean(),
    occupation: faker.lorem.word(),
    skinColorId: 1,
    officeId: 1,
    applyingReason: faker.lorem.sentences(3),
    experience: faker.lorem.word(),
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/volunteer");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/volunteer").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/volunteer").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 400 when body is not given", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post("/volunteer").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 400 when given IrisParticipant does not follow valid IrisParticipant format", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const input = generateValidInput();

      const response = await server.post("/volunteer").set("Authorization", `Bearer ${token}`).send({...input, irisParticipant: faker.datatype.number()});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      const input = generateValidInput();

      it("Should return 201 and register volunteer in database", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.post("/volunteer").set("Authorization", `Bearer ${token}`).send(input);
        const volunteers = await getVolunteers();

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({});
        expect(volunteers.length).toBe(1);
      });
    });
  });
});

describe("PATCH /volunteer", () => {
  const generateValidInput = () => ({
    linkedIn: faker.internet.url(),
    irisParticipant: faker.datatype.boolean(),
    occupation: faker.lorem.word(),
    skinColorId: 1,
    officeId: 1,
    applyingReason: faker.lorem.sentences(3),
    experience: faker.lorem.word(),
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await server.patch("/volunteer");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.patch("/volunteer").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.patch("/volunteer").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 400 when given id does not follow valid id format", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);
      const input = { id: faker.lorem.word() };

      const response = await server.patch(`/volunteer/${input.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should return 404 when volunteer with given id is not found", async () => {
        const admin = await createAdmin();
        const token = await generateValidAdminToken(admin);
        const user = await createUser();
        const input = generateValidInput();
        const volunteer = await createVolunteer({ userId: user.id, ...input });

        const response = await server.patch(`/volunteer/${volunteer.id + 1}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      describe("When input is valid", () => {
        it("Should return 204 and update volunteer in database", async () => {
          const admin = await createAdmin();
          const token = await generateValidAdminToken(admin);
          const user = await createUser();
          const input = generateValidInput();
          const volunteer = await createVolunteer({ userId: user.id, ...input });

          const response = await server.patch(`/volunteer/${volunteer.id}`).set("Authorization", `Bearer ${token}`);
          const volunteers = await getVolunteers();

          expect(response.status).toBe(httpStatus.NO_CONTENT);
          expect(response.body).toEqual({});
          expect(volunteers[0].visualized).toBe(true);
        });
      });
    });
  });
});
