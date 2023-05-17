import app, { init } from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser, createContact, getContactByEmail, generateValidInsertInput, newContact } from "../factories";
import { cleanDb, generateValidAdminToken, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { createAdmin } from "../factories/admin-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /contact", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/contact");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/contact").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/contact").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 400 when body is not given", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.post("/contact").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should return 400 when given email is not valid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const input = generateValidInsertInput();

        input.email = faker.internet.email("eu", "teste", "gmail.toast");

        const response = await server.post("/contact").set("Authorization", `Bearer ${token}`).send(input);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it("should return 429 when message limit was reached", async () => {
        const input = generateValidInsertInput();
        const user = await createUser({ email: input.email });
        const token = await generateValidToken(user);

        await createContact({ ...input, userId: user.id });
        await createContact({ ...input, userId: user.id });
        await createContact({ ...input, userId: user.id });

        const response = await server.post("/contact").set("Authorization", `Bearer ${token}`).send(input);

        expect(response.status).toBe(httpStatus.TOO_MANY_REQUESTS);
      });

      describe("When input is valid", () => {
        const input = generateValidInsertInput();

        it("Should return 204", async () => {
          const user = await createUser({ email: input.email });
          const token = await generateValidToken(user);

          const response = await server.post("/contact").set("Authorization", `Bearer ${token}`).send(input);
          const message = await getContactByEmail(input.email);

          expect(response.status).toBe(httpStatus.NO_CONTENT);
          expect(response.body).toEqual({});
          expect(message[0]).toEqual(expect.objectContaining(input));
        });
      });
    });
  });
});

describe("GET /contact", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/contact");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/contact").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/contact").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 404 when have no contacts", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);

      const response = await server.get("/contact").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 200 an list of contacts messages when have contacts", async () => {
      const user = await createUser();
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);
      const input = generateValidInsertInput();

      const contact = await createContact({ ...input, userId: user.id });

      const response = await server.get("/contact").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            telephone: contact.telephone,
            message: contact.message,
          },
        ]),
      );
    });
  });
});

describe("DELETE /contact", () => {
  it("should respond with status 401 if no token is given", async () => {
    const contactData = await newContact();
    const response = await server.delete(`/contact/${contactData.contact.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const contactData = await newContact();
    const token = faker.lorem.word();

    const response = await server.delete(`/contact/${contactData.contact.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const contactData = await newContact();
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete(`/contact/${contactData.contact.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should return 404 when have no contacts for given id", async () => {
      const contactData = await newContact();

      const response = await server
        .delete(`/contact/${contactData.contact.id + 1}`)
        .set("Authorization", `Bearer ${contactData.token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 204 when have deleted an contact", async () => {
      const contactData = await newContact();
      const response = await server
        .delete(`/contact/${contactData.contact.id}`)
        .set("Authorization", `Bearer ${contactData.token}`);

      expect(response.status).toBe(httpStatus.NO_CONTENT);
      expect(response.body).toEqual({});
    });
  });
});
