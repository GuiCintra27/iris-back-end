import { init } from "../../src/app";
import { authenticationService, invalidCredentialsError } from "../../src/services/authentication-service";
import { createBodyUser, createUser } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("signIn", () => {
  it("should throw InvalidCredentialError if there is no user for given email", async () => {
    const params = createBodyUser();

    try {
      await authenticationService.signIn(params);
      fail("should throw InvalidCredentialError");
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  it("should throw InvalidCredentialError if given password is invalid", async () => {
    const params = createBodyUser();
    await createUser({
      email: params.email,
      password: "invalid-password",
    });

    try {
      await authenticationService.signIn(params);
      fail("should throw InvalidCredentialError");
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  describe("when email and password are valid", () => {
    it("should return user data if given email and password are valid", async () => {
      const params = createBodyUser();
      const user = await createUser(params);

      const { user: signInUser } = await authenticationService.signIn(params);
      
      expect(user).toEqual(
        expect.objectContaining({
          id: signInUser.id,
          email: signInUser.email,
        }),
      );
    });
  });
});
