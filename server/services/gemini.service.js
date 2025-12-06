import { OpenAI } from "openai";

/**
 * Gemini Service using OpenAI-compatible API
 * Provides modular, reusable functions for AI interactions
 */
class GeminiService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
    this.defaultModel = "gemini-2.5-flash";
  }

  /**
   * Generate chat completion
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} - AI response text
   */
  async generateChatCompletion(messages, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || this.defaultModel,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error in Gemini chat completion:", error);
      throw error;
    }
  }

  /**
   * Generate JSON response
   * @param {string} systemPrompt - System instructions
   * @param {string} userPrompt - User query
   * @param {Object} options - Optional configuration
   * @returns {Promise<Object> } - Parsed JSON response
   */
  async generateJSON(systemPrompt, userPrompt, options = {}) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];

      const response = await this.generateChatCompletion(messages, options);
      console.log("Generated response in service:", response);
      // Clean up markdown code blocks if present
      const cleanedResponse = response.replace(/```json\n?|```\n?/g, "").trim();
      console.log("Cleaned response in service:", cleanedResponse);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error generating JSON from Gemini:", error);
      throw error;
    }
  }

  /**
   * Generate conversational response with context
   * @param {string} systemContext - System role and instructions
   * @param {Array} conversationHistory - Previous messages
   * @param {string} currentMessage - Current user message
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} - AI response
   */
  async generateContextualResponse(
    systemContext,
    conversationHistory,
    currentMessage,
    options = {}
  ) {
    try {
      const messages = [
        { role: "system", content: systemContext },
        ...conversationHistory,
        { role: "user", content: currentMessage },
      ];
      console.log("Messages in service:", currentMessage);

      return await this.generateChatCompletion(messages, options);
    } catch (error) {
      console.error("Error generating contextual response:", error);
      throw error;
    }
  }

  /**
   * Generate simple text completion
   * @param {string} prompt - The prompt
   * @param {Object} options - Optional configuration  
   * @returns {Promise<string>} - AI response
   */
  async generateText(prompt, options = {}) {
    try {
      const messages = [{ role: "user", content: prompt }];
      return await this.generateChatCompletion(messages, options);
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }
}

// Export singleton instance
export default new GeminiService();