import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";


dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatSessions = new Map();

// System prompt defining AI behavior
//const SYSTEM_PROMPT = ``;


export default async function handler(userMsg) {
    try {
        //const { userId } = req.user;
        const userId = "6807346ff80c058e582ebe55";
        let chat;
        if (!chatSessions.has(userId)) {
            chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: `${userMsg}` }],
                    },
                    {
                        role: "model",
                        parts: [{
                            text: `YOu are alon musk. so behave like him`
                        }],
                    },
                ],
            });
            chatSessions.set(userId, chat);
        } else {
            chat = chatSessions.get(userId);
        }

        // ✅ Send user message & wait for full response
        const result = await chat.sendMessage(userMsg);
        // console.log(result);

        const fullResponse = result?.response?.text() || "No response from AI";
        console.log(fullResponse);
        const clearResponseString = (text) => {
            return text.replace(/```json/g, "")
                .replace(/```/g, "")
                .replace(/\n/g, "");
        }
        // const response = JSON.parse(clearResponseString(fullResponse));
        // console.log(response);


        return fullResponse;

    } catch (error) {
        console.error("Error processing request:", error);
        return {
            error: "Error processing request",
            message: error.message,
        }
    }
}


