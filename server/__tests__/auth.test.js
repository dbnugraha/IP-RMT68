const app = require("../app");
const supertest = require("supertest");
const sequelize = require("../models/index").sequelize;
const request = supertest(app);

const userData = {
  email: "test@example.com",
  password: "password123",
};

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, { truncate: true, cascade: true, restartIdentity: true });
});

describe("Auth Routes Test", () => {
  describe("POST /register - create new user", () => {
    //success register
    test("201 Success register - should create new User", async () => {
      const response = await request.post("/auth/register").send(userData);
      console.log(response);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "User registered successfully");
    });

    //failed register
    test("400 Failed register - should return validation error when email is missing", async () => {
      const response = await request.post("/auth/register").send({ password: "password123" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email", message: "Email is required" })]),
      );
    });

    test("400 Failed register - should return validation error when password is missing", async () => {
      const response = await request.post("/auth/register").send({ email: "test@example.com" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password", message: "Password is required" })]),
      );
    });

    test("409 Failed register - should return conflict error when email already exists", async () => {
      const response = await request.post("/auth/register").send(userData);
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("message", "Email address already in use!");
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email", message: "Email address already in use!" })]),
      );
    });
  });

  describe("POST /login - user login", () => {
    //success login
    test("200 Success login - should return access token", async () => {
      const response = await request.post("/auth/login").send(userData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body.access_token).not.toBe("");
      const payload = require("../helpers/jwt").verifyToken(response.body.access_token);
      expect(payload).toHaveProperty("id", expect.any(Number));
      expect(payload).toHaveProperty("email", userData.email);
    });

    //failed login
    test("400 Failed login - should return validation error when email is missing", async () => {
      const response = await request.post("/auth/login").send({ password: "password123" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "email", message: "Email is required" })]),
      );
    });

    test("400 Failed login - should return validation error when password is missing", async () => {
      const response = await request.post("/auth/login").send({ email: "test@example.com" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "password", message: "Password is required" })]),
      );
    });
    test("401 Failed login - should return unauthorized error when credentials are invalid", async () => {
      const response = await request.post("/auth/login").send({ email: "test@example.com", password: "wrongpassword" });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthorized");
    });
  });

  describe("POST /google-login - google login", () => {
    //success google login
    test("200 Success google login - should return access token", async () => {
      const { verifyGoogleToken } = require("../helpers/googleOauth");
      const mockPayload = {
        email: "test@example.com",
        given_name: "Test",
        family_name: "User",
        picture: "https://placehold.co/64x64",
      };
      jest.spyOn(require("../helpers/googleOauth"), "verifyGoogleToken").mockResolvedValue(mockPayload);

      const response = await request.post("/auth/google-login").send({ credential: "valid_google_token" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body.access_token).not.toBe("");
      const payload = require("../helpers/jwt").verifyToken(response.body.access_token);
      expect(payload).toHaveProperty("id", expect.any(Number));
      expect(payload).toHaveProperty("email", mockPayload.email);
    });

    //failed google login
    test("400 Failed google login - should return validation error when credential is missing", async () => {
      const response = await request.post("/auth/google-login").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Validation Error");
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: "credential", message: "Credential is required" })]),
      );
    });
  });
});
