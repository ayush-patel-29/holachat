import Groq from "groq-sdk";

const groq = new Groq({ apiKey:import.meta.env.VITE_GROQ_API_KEY! ,dangerouslyAllowBrowser:true });

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
    model: "llama-3.1-8b-instant",
  });
}
