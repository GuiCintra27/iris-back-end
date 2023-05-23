import app, { init } from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb, generateValidAdminToken, generateValidToken } from "../helpers";
import * as jwt from "jsonwebtoken";
import { createNewLike, createUser, generateValidInputPost, getPosts, getTopics, newPost } from "../factories";
import { createAdmin } from "../factories/admin-factory";
import { createNewTopic } from "../factories/topics-factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

afterEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /posts", () => {
  it("should return 404 when have no posts", async () => {
    const response = await server.post("/posts/filter").send(
      {
        topicFilterIds: {
          topicId: []
        },
        postOrder: {
          id: "desc"
        },
        inputFilterValue: ""
      }
    );

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 200 an list of posts when have posts created", async () => {
    await createNewTopic();
    await createAdmin();
    const post = await newPost();

    const response = await server.post("/posts/filter").send(
      {
        topicFilterIds: {
          topicId: []
        },
        postOrder: {
          id: "desc"
        },
        inputFilterValue: ""
      }
    );

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ text: post.text, image: post.image, postCover: post.postCover, title: post.title })]),
    );
  });
});

describe("POST /posts", () => {
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
        const topic = await getTopics();
        const input = generateValidInputPost(topic);

        const response = await server.post("/posts").set("Authorization", `Bearer ${token}`).send({ ...input, text: faker.datatype.number() });

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      describe("When input is valid", () => {
        it("Should return 201 and", async () => {
          const topic = await getTopics();
          const input = generateValidInputPost(topic);
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

describe("POST /posts/likes", () => {
  it("should return 401 when you isn't signed", async () => {
    const token = faker.lorem.word();
    const post = await newPost();

    const response = await server.post("/posts/likes").set("Authorization", `Bearer ${token}`).send({ postId: post.id });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 404 when posts no exist", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const post = await newPost();

    const response = await server.post("/posts/likes").set("Authorization", `Bearer ${token}`).send({ postId: post.id + 1 });
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 201 if all its ok", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const post = await newPost();

    const response = await server.post("/posts/likes").set("Authorization", `Bearer ${token}`).send({ postId: post.id });

    expect(response.status).toBe(httpStatus.CREATED);
  });
});

describe("DELETE /posts/likes/:postId", () => {
  it("should return 401 when you isn't signed", async () => {
    const token = faker.lorem.word();
    const post = await newPost();

    const response = await server.delete(`/posts/likes/${post.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should return 404 when like no exist", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const post = await newPost();

    const response = await server.delete(`/posts/likes/${post.id}`).set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 200 if all its ok", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const post = await newPost();
    await createNewLike(post.id, user.id);

    const response = await server.delete(`/posts/likes/${post.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
  });
});
