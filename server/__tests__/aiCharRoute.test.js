import request from "supertest";
import app from "../app.js";
import aiChar from "../models/aiChar.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

describe("AI Character Routes", () => {
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

  describe("GET /api/aiChar", () => {
    it("should return all AI characters", async () => {
      await aiChar.create([
        {
          charId: "char1",
          name: "Character 1",
          description: "Test character 1",
          personality: "friendly",
          createdBy: user._id,
        },
        {
          charId: "char2",
          name: "Character 2",
          description: "Test character 2",
          personality: "serious",
          createdBy: user._id,
        },
      ]);

      const response = await request(app)
        .get("/api/aiChar")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.allCharacters).toHaveLength(2);
      expect(response.body.allCharacters[0]).toHaveProperty("name");
      expect(response.body.allCharacters[0]).toHaveProperty("personality");
    });

    it("should return empty array when no characters exist", async () => {
      const response = await request(app)
        .get("/api/aiChar")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.allCharacters).toHaveLength(0);
    });

    it("should return error without authentication", async () => {
      const response = await request(app).get("/api/aiChar").expect(401);

      expect(response.body.error).toBe("Unauthorized User");
    });
  });

  describe("POST /api/aiChar", () => {
    it("should create a new AI character", async () => {
      const response = await request(app)
        .post("/api/aiChar")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "New Character")
        .field("description", "A test character")
        .field("personality", "adventurous")
        .attach("aiCharImg", Buffer.from("fake-image"), "test.jpg")
        .expect(201);

      expect(response.body.message).toContain("generated successfully");
      expect(response.body.character).toHaveProperty("charId");
      expect(response.body.character.name).toBe("New Character");

      const character = await aiChar.findOne({ name: "New Character" });
      expect(character).toBeTruthy();
      expect(character.createdBy.toString()).toBe(user._id.toString());
    });

    it("should return error for missing required fields", async () => {
      const response = await request(app)
        .post("/api/aiChar")
        .set("Authorization", `Bearer ${token}`)
        .field("name", "Incomplete Character")
        .expect(400);

      expect(response.body.error).toBe("Please fill all the fields");
    });

    it("should return error without authentication", async () => {
      const response = await request(app)
        .post("/api/aiChar")
        .field("name", "New Character")
        .field("description", "A test character")
        .field("personality", "adventurous")
        .expect(401);

      expect(response.body.error).toBe("Unauthorized User");
    });
  });
});
