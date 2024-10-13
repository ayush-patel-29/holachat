import Groq from "groq-sdk";

// Ensure the environment variable is defined
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  throw new Error("GROQ_API_KEY is not defined");
}

const groq = new Groq({ apiKey });

interface ChatCompletion {
  choices: {
    message: {
      content: string | null;
    };
  }[];
}

export async function main(content: string): Promise<string> {
  const chatCompletion = await getGroqChatCompletion(content);
  // Return the completion returned by the LLM, handling the possibility of null content.
  return chatCompletion.choices[0]?.message?.content ?? "";
}

export async function getGroqChatCompletion(content: string): Promise<ChatCompletion> {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    model: "llama3-8b-8192",
  });
}
