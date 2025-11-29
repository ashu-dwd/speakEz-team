import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { jest } from "@jest/globals";

let mongoServer;

// Mock emailSender to avoid actual email sending
jest.unstable_mockModule("../controllers/email-sender.js", () => ({
  default: jest.fn().mockResolvedValue(true),
}));

// Mock roleplay handler to avoid AI API calls
jest.unstable_mockModule("../controllers/roleplay.js", () => ({
  default: jest.fn().mockResolvedValue({ text: "Mocked AI response" }),
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
