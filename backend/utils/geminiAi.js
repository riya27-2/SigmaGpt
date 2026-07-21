import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const getGeminiAPIResponse = async (message) => {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error(err);
    throw new Error("Groq API request failed");
  }
};

export default getGeminiAPIResponse;