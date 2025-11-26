import request from "supertest";
import app from "../app.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

describe("User Data Routes", () => {
  let user, token;

  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      username: "testuser",
    });

    token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "test-secret"
    );
  });

  describe("GET /api/userData", () => {
    it("should return user data with valid token", async () => {
      const response = await request(app)
        .get("/api/userData")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty("email", user.email);
      expect(response.body.user).toHaveProperty("username", user.username);
    });

    it("should return error without token", async () => {
      const response = await request(app).get("/api/userData").expect(401);

      expect(response.body.error).toBe("Unauthorized User");
    });

    it("should return error with invalid token", async () => {
      const response = await request(app)
        .get("/api/userData")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.error).toBe("Unauthorized");
    });
  });
});
