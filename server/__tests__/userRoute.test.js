import request from "supertest";
import app from "../app.js";
import User from "../models/user.js";
import PassReset from "../models/passReset.js";
import Otp from "../models/otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

describe("User Routes", () => {
  describe("POST /api/user/gen-otp", () => {
    it("should generate OTP for new user", async () => {
      const response = await request(app)
        .post("/api/user/gen-otp")
        .send({ email: "test@example.com" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("OTP sent");
    });

    it("should return error for existing user", async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        username: "test",
      });

      const response = await request(app)
        .post("/api/user/gen-otp")
        .send({ email: "test@example.com" })
        .expect(400);

      expect(response.body.error).toContain("already exists");
    });
  });

  describe("POST /api/user/verify-otp", () => {
    it("should verify OTP and create user", async () => {
      await Otp.create({ email: "test@example.com", otp: 1234 });

      const response = await request(app)
        .post("/api/user/verify-otp")
        .send({
          email: "test@example.com",
          otp: 1234,
          password: "password123",
          name: "Test User",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("registered successfully");
    });

    it("should return error for invalid OTP", async () => {
      await Otp.create({ email: "test@example.com", otp: 1234 });

      const response = await request(app)
        .post("/api/user/verify-otp")
        .send({
          email: "test@example.com",
          otp: 9999,
          password: "password123",
          name: "Test User",
        })
        .expect(400);

      expect(response.body.error).toBe("Invalid OTP");
    });
  });

  describe("POST /api/user/login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        username: "testuser",
      });
    });

    it("should login user with correct credentials", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.message).toContain("signed in successfully");
    });

    it("should return error for incorrect password", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should return error for non-existent user", async () => {
      const response = await request(app)
        .post("/api/user/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(404);

      expect(response.body.error).toBe("User not found");
    });
  });

  describe("POST /api/user/forgot-password", () => {
    beforeEach(async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        username: "testuser",
      });
    });

    it("should send reset link for valid email", async () => {
      const response = await request(app)
        .post("/api/user/forgot-password")
        .send({ email: "test@example.com" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("Reset link sent");
    });

    it("should return error for missing email", async () => {
      const response = await request(app)
        .post("/api/user/forgot-password")
        .send({})
        .expect(400);

      expect(response.body.error).toBe("Email is required");
    });

    it("should return error for non-existent user", async () => {
      const response = await request(app)
        .post("/api/user/forgot-password")
        .send({ email: "nonexistent@example.com" })
        .expect(404);

      expect(response.body.error).toBe("User not found");
    });
  });

  describe("POST /api/user/verify-reset-token", () => {
    it("should verify valid token", async () => {
      const token = "valid-token-123";
      await PassReset.create({
        email: "test@example.com",
        token,
        resetLink: "http://example.com/reset",
        emailSent: true,
      });

      const response = await request(app)
        .post("/api/user/verify-reset-token")
        .send({ token })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should return error for invalid token", async () => {
      const response = await request(app)
        .post("/api/user/verify-reset-token")
        .send({ token: "invalid-token" })
        .expect(400);

      expect(response.body.error).toContain("Invalid or expired");
    });
  });

  describe("POST /api/user/reset-password/:token", () => {
    let user, token;

    beforeEach(async () => {
      user = await User.create({
        name: "Test User",
        email: "test@example.com",
        password: await bcrypt.hash("oldpassword", 10),
        username: "testuser",
      });

      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "test-secret",
        {
          expiresIn: "15m",
        }
      );
    });

    it("should reset password with valid token", async () => {
      const response = await request(app)
        .post(`/api/user/reset-password/${token}`)
        .send({ newPassword: "newpassword123" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("Password reset successful");

      const updatedUser = await User.findById(user._id);
      const isMatch = await bcrypt.compare(
        "newpassword123",
        updatedUser.password
      );
      expect(isMatch).toBe(true);
    });

    it("should return error for invalid token", async () => {
      const response = await request(app)
        .post("/api/user/reset-password/invalid-token")
        .send({ newPassword: "newpassword123" })
        .expect(400);

      expect(response.body.error).toContain("Invalid or expired");
    });
  });
});
