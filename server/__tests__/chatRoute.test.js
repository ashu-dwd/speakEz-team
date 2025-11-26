import request from "supertest";
import app from "../app.js";
import Room from "../models/room.js";
import Chat from "../models/chat.js";
import aiChar from "../models/aiChar.js";
import User from "../models/user.js";

describe("Chat Routes", () => {
  let user;

  beforeEach(async () => {
    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "hashedpassword",
      username: "testuser",
    });
  });

  describe("POST /api/chat", () => {
    it("should generate a chat room ID", async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({
          charId: "char123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("roomId");
      expect(response.body.success).toBe(true);

      const room = await Room.findOne({ roomId: response.body.roomId });
      expect(room).toBeTruthy();
    });

    it("should return error without charId", async () => {
      const response = await request(app)
        .post("/api/chat")
        .send({})
        .expect(400);

      expect(response.body.error).toBe("Character ID is required");
    });
  });

  describe("POST /api/chat/ai", () => {
    let roomId;

    beforeEach(async () => {
      const room = await Room.create({
        roomId: "test-room-123",
        userId: user._id,
        charId: "char123",
      });
      roomId = room.roomId;

      await aiChar.create({
        charId: "char123",
        name: "Test Character",
        description: "Test",
        personality: "friendly",
      });
    });

    it("should handle user conversation", async () => {
      const response = await request(app)
        .post("/api/chat/ai")
        .send({
          roomId,
          charId: "char123",
          userMsg: "Hello AI",
        })
        .expect(200);

      expect(response.body).toHaveProperty("charResponse");
      expect(response.body.success).toBe(true);

      const chat = await Chat.findOne({ roomId });
      expect(chat).toBeTruthy();
      expect(chat.userMsg).toBe("Hello AI");
    });

    it("should return error for non-existent room", async () => {
      const response = await request(app)
        .post("/api/chat/ai")
        .send({
          roomId: "non-existent-room",
          charId: "char123",
          userMsg: "Hello",
        })
        .expect(400);

      expect(response.body.error).toBe("Room not found");
    });

    it("should return error for non-existent character", async () => {
      const response = await request(app)
        .post("/api/chat/ai")
        .send({
          roomId,
          charId: "non-existent-char",
          userMsg: "Hello",
        })
        .expect(400);

      expect(response.body.error).toBe("Character not found");
    });
  });
});
