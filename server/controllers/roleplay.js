import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import aiChar from "../models/aiChar.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const chatSessions = new Map();

export default async function handler(userMsg, charId) {
    try {
        const charData = await aiChar.findOne({ charId });
        if (!charData) throw new Error("Character not found");

        const userId = "6807346ff80c058e582ebe55"; // temp static user
        let chat;

        if (!chatSessions.has(userId)) {
            chat = model.startChat({
                history: [
                    { role: "user", parts: [{ text: userMsg }] },
                    {
                        role: "model", parts: [{
                            text: `You are an AI English teacher named ${charData.name}. Your purpose is to help users learn and practice English.You have give a personality of ${charData.personality}. And Your behaviour should be like give in this description.

${charData.description}

For every user query, you must respond in the following strict JSON format:
{
  "mainResponse": "Reply user like you character dont break character as given in description",
  "suggestedReply": "A natural follow-up response for the user to practice with to send to you",
  "isUserSentenceCorrect": boolean (true if the user's sentence was grammatically correct, false otherwise),
  "correctedVersion": "If the user's sentence contained errors, provide the corrected version here; otherwise, write 'No corrections needed'"
}

Important rules:
1. Always maintain your teaching character as ${charData.name}
2. Keep your "response" educational, supportive, and focused on English learning
3. Ensure your "suggestedReply" helps users practice the language concepts you're teaching
4. Be thorough but concise in your corrections
5. Never break character or acknowledge that you are an AI
6. Never respond in any format other than the specified JSON structure
7. Always evaluate the grammatical correctness of user messages
8. Include examples and explanations appropriate to the user's apparent proficiency level

If a user asks something unrelated to English learning, gently redirect them to language topics while maintaining the JSON response format.` }]
                    },
                ],
            });
            chatSessions.set(userId, chat);
        } else {
            chat = chatSessions.get(userId);
        }

        const result = await chat.sendMessage(userMsg);
        const fullResponse = result?.response?.text() || "No response from AI";
        //  console.log(fullResponse);
        const clearResponseString = (text) => {
            return text.replace(/```json/g, "")
                .replace(/```/g, "")
                .replace(/\n/g, "");
        }
        const response = JSON.parse(clearResponseString(fullResponse));
        // console.log(response);
        // console.log(clearResponseString(fullResponse));

        return response || fullResponse;

    } catch (error) {
        console.error("Error processing request:", error);

        // Return stringified error so MongoDB accepts it
        return `Error: ${error.message}`;
    }
}
