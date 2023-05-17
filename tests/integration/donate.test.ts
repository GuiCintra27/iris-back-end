import app, { init } from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidAdminToken, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { createAdmin } from "../factories/admin-factory";
import { createUser, createDonate, getDonates, generateValidInputDonate } from "../factories";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /donate", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/donate");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/donate").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/donate").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 404 when have no donates registered", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);

      const response = await server.get("/donate").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 and an list of new donates when have registered donates", async () => {
      const admin = await createAdmin();
      const user = await createUser();
      const token = await generateValidAdminToken(admin);
      const input = generateValidInputDonate();

      await createDonate(user.id, input.amount);
      await createDonate(user.id, input.amount);
      await createDonate(user.id, input.amount, true);
      await createDonate(user.id, input.amount, true);

      const response = await server.get("/donate").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.length).toEqual(2);
    });
  });

  describe("/all", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/donate/all");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/donate/all").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const adminWithoutSession = await createAdmin();
      const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/donate/all").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("When token is valid", () => {
      it("should return 404 when have no donates registered", async () => {
        const admin = await createAdmin();
        const token = await generateValidAdminToken(admin);

        const response = await server.get("/donate/all").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it("should return 200 and an list only all donates when have registered donates", async () => {
        const admin = await createAdmin();
        const user = await createUser();
        const token = await generateValidAdminToken(admin);
        const input = generateValidInputDonate();

        await createDonate(user.id, input.amount);
        await createDonate(user.id, input.amount);
        await createDonate(user.id, input.amount, true);
        await createDonate(user.id, input.amount, true);

        const response = await server.get("/donate/all").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body.length).toEqual(4);
      });
    });
  });
});

describe("POST /donate", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/donate");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/donate").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/donate").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 400 when body is not given", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post("/donate").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 400 when given amount does not follow valid amount format", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const input = generateValidInputDonate();

      const response = await server.post("/donate").set("Authorization", `Bearer ${token}`).send({ ...input, amount: faker.lorem.word() });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("Should return 201 and register donate in database", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const input = generateValidInputDonate();
        delete input.id;

        const response = await server.post("/donate").set("Authorization", `Bearer ${token}`).send(input);
        const donates = await getDonates();

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({});
        expect(donates.length).toBe(1);
      });
    });
  });
});

describe("PATCH /donate", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.patch("/donate");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.patch("/donate").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.patch("/donate").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 400 when given id does not follow valid id format", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);
      const input = { id: faker.lorem.word() };

      const response = await server.patch(`/donate/${input.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should return 404 when donate with given id is not found", async () => {
        const admin = await createAdmin();
        const token = await generateValidAdminToken(admin);
        const user = await createUser();
        const donate = await createDonate(user.id, 500);

        const response = await server.patch(`/donate/${donate.id + 1}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      describe("When input is valid", () => {
        it("Should return 204 and update donate in database", async () => {
          const admin = await createAdmin();
          const token = await generateValidAdminToken(admin);
          const user = await createUser();
          const donate = await createDonate(user.id, 500);

          const response = await server.patch(`/donate/${donate.id}`).set("Authorization", `Bearer ${token}`);
          const donates = await getDonates();

          expect(response.status).toBe(httpStatus.NO_CONTENT);
          expect(response.body).toEqual({});
          expect(donates[0].visualized).toBe(true);
        });
      });
    });
  });
});
