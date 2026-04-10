import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { Connection } from "mongoose";
import { getConnectionToken } from "@nestjs/mongoose";

process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "e2e-test-refresh-secret";
process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mentorix.com";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234";

describe("Auth (e2e)", () => {
  let app: INestApplication;
  let connection: Connection;

  const testUser = {
    email: "e2e-test@mentorix.com",
    name: "Test",
    lastname: "User",
    password: "T3st!Pass",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    if (connection) {
      const collections = await connection.db!.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }
    await app.close();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user and return tokens", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send(testUser)
        .expect(201);

      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body.user).toMatchObject({
        email: testUser.email,
        name: testUser.name,
        lastname: testUser.lastname,
      });
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).toHaveProperty("roles");
    });

    it("should reject duplicate email", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send(testUser)
        .expect(409);
    });

    it("should reject invalid email", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({ ...testUser, email: "not-an-email" })
        .expect(400);
    });

    it("should reject weak password", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/register")
        .send({ ...testUser, email: "weak@test.com", password: "short" })
        .expect(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials and return tokens", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("should reject invalid password", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email: testUser.email, password: "WrongP@ss1" })
        .expect(401);
    });

    it("should reject non-existent email", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email: "unknown@test.com", password: "T3st!Pass" })
        .expect(401);
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    let refreshToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      refreshToken = res.body.refreshToken;
    });

    it("should refresh tokens with a valid refresh token", async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("should reject an invalid refresh token", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "invalid.token.value" })
        .expect(401);
    });
  });

  describe("GET /api/v1/auth/profile", () => {
    let accessToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post("/api/v1/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      accessToken = res.body.accessToken;
    });

    it("should return user profile with valid token", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/v1/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body).toMatchObject({
        email: testUser.email,
        name: testUser.name,
        lastname: testUser.lastname,
      });
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("roles");
    });

    it("should reject request without token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/auth/profile")
        .expect(401);
    });

    it("should reject request with invalid token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/auth/profile")
        .set("Authorization", "Bearer invalid.token.here")
        .expect(401);
    });
  });
});
