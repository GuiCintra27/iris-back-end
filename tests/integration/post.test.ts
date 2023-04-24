
import app, {init} from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidAdminToken, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { createNewPost, createUser, getPostById, getPosts } from "../factories";
import { createAdmin } from "../factories/admin-factory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /posts", () => {
  const generateValidInput = () => ({
    text: faker.lorem.sentences(10),
    image: faker.internet.url(),
  });

  async function newPost() {
    const input = generateValidInput();

    return await createNewPost(input.text, input.image);
  }

  it("should return 404 when have no posts", async () => {
    await cleanDb();

    const response = await server.get("/posts");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 200 an list of posts when have posts created", async () => {
    await createAdmin();
    const post = await newPost();

    const response = await server.get("/posts");

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ text: post.text, image: post.image })]),
    );
  });
});

describe("POST /posts", () => {
  const generateValidInput = () => ({
    text: faker.lorem.sentences(10),
    image: faker.internet.url(),
  });

  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/posts");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/posts").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/posts").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 400 when body is not given", async () => {
      const admin = await createAdmin();
      const token = await generateValidAdminToken(admin);

      const response = await server.post("/posts").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    describe("when body is valid", () => {
      it("should return 400 when given text is not valid", async () => {
        const admin = await createAdmin();
        const token = await generateValidAdminToken(admin);
        const input = generateValidInput();

        const response = await server.post("/posts").set("Authorization", `Bearer ${token}`).send({...input, text: faker.datatype.number()});

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      describe("When input is valid", () => {
        const input = generateValidInput();

        it("Should return 201 and", async () => {
          await cleanDb();

          const admin = await createAdmin();
          const token = await generateValidAdminToken(admin);

          const response = await server.post("/posts").set("Authorization", `Bearer ${token}`).send(input);
          const posts = await getPosts();

          expect(response.status).toBe(httpStatus.CREATED);
          expect(response.body).toEqual({});
          expect(posts.length).toBe(1);
        });
      });
    });
  });
});

describe("PATCH /posts/:id", () => {
  const generatePostInput = () => ({
    text: faker.lorem.sentences(10),
    image: faker.internet.url(),
  });

  const generateValidInput = (value: number) => ({
    like: value,
  });

  async function newPost() {
    const input = generatePostInput();

    return await createNewPost(input.text, input.image);
  }

  it("should respond with status 401 if no token is given", async () => {
    const post = await newPost();

    const response = await server.patch(`/posts/${post.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const post = await newPost();

    const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const adminWithoutSession = await createAdmin();
    const token = jwt.sign({ userId: adminWithoutSession.id }, process.env.JWT_SECRET);

    const post = await newPost();

    const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("When token is valid", () => {
    it("should respond with status 404 when post not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const input = generateValidInput(1);
      const post = await newPost();

      const response = await server
        .patch(`/posts/${post.id + 1}`)
        .set("Authorization", `Bearer ${token}`)
        .send(input);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    describe("When given postId is valid", () => {
      it("should respond with status 400 when body is not given", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const post = await newPost();

        const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      describe("when body is valid", () => {
        it("should return 400 when given like number is not a number", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const input = generateValidInput(1);

          const post = await newPost();

          const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`).send({...input, like: faker.lorem.word()});

          expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should return 400 when given like number is more than allowed", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const input = generateValidInput(1);

          input.like = faker.datatype.number({ min: 2 });

          const post = await newPost();

          const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`).send(input);

          expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should return 400 when given like number is less than allowed", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const input = generateValidInput(-2);

          const post = await newPost();

          const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`).send(input);

          expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should return 400 when given like number is not valid", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const input = generateValidInput(0);

          const post = await newPost();

          const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`).send(input);

          expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });

        it("should return 422 when given like number will make likes be negative", async () => {
          const user = await createUser();
          const token = await generateValidToken(user);
          const input = generateValidInput(-1);

          const post = await newPost();

          const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`).send(input);
          const posts = await getPostById(post.id);

          expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);

          expect(posts.likes).toBe(0);
        });

        describe("When input is valid", () => {
          it("Should return 204 and likes number", async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const input = generateValidInput(1);

            const post = await newPost();

            const response = await server.patch(`/posts/${post.id}`).set("Authorization", `Bearer ${token}`).send(input);
            const posts = await getPostById(post.id);

            expect(response.status).toBe(httpStatus.NO_CONTENT);
            expect(response.body).toEqual({});
            expect(posts.likes).toBe(1);
          });
        });
      });
    });
  });
});
