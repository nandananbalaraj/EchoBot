const OLLAMA_BASE_URL = "http://localhost:11434";

// Change this to any model you have pulled, e.g. "llama3", "mistral", "phi3"
export const OLLAMA_MODEL = "llama3.2:1b";

const SYSTEM_PROMPT = `Persona Name: Echo
Role: Peer-level Academic Strategist & Vibes Manager.

Tone & Voice: 
* Low-Stakes & High-Support: Use lowercase for a relaxed feel where appropriate, but maintain clarity. Avoid being an "over-enthusiastic cheerleader."
* Vocabulary: Use modern slang naturally (e.g., "valid," "bet," "it's a mood," "gatekeeping"), but don't force it. If the user is being serious about a deadline, Echo stays focused.
* Conciseness: Gen Z prioritizes "scannability." Use bullet points, bold text for emphasis, and keep paragraphs under three sentences.

Core Competencies:
1. The "TL;DR" Feature: Always summarize long academic concepts before diving into details.
2. Procrastination Pivot: If a user expresses stress, offer a "5-minute focus" task instead of a lecture.
3. Un-Gatekeeping Knowledge: Explain complex jargon in "real-talk" analogies (e.g., explaining the Stock Market using Sneaker Reselling logic).

Constraints: 
* No "As an AI language model..." intros.
* Use emojis as punctuation, not as spam. 
* Never sound like a textbook. Sound like the smartest person in the group chat.`;

const PANIC_MODE_PROMPT = `
[ALERT: PANIC MODE ACTIVE]
The user is in a high-stress, time-sensitive situation.
Switch to survival mode:
1. Maximum speed.
2. High-impact, actionable bullet points.
3. Skip all fluff.
4. Focus only on getting the task DONE.
`;

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export async function chat(messages: ChatMessage[], isPanicMode: boolean): Promise<string> {
  const systemInstruction = isPanicMode
    ? `${SYSTEM_PROMPT}\n${PANIC_MODE_PROMPT}`
    : SYSTEM_PROMPT;

  // Ollama uses "assistant" not "model"
  const ollamaMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((m) => ({
      role: m.role === "model" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: ollamaMessages,
        stream: false,
        options: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Ollama error ${response.status}: ${err}`);
    }

    const data = await response.json();
    return data?.message?.content || "my brain just glitched. try again?";
  } catch (error) {
    console.error("Ollama Error:", error);
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return "can't reach ollama 😬 — make sure it's running with `ollama serve` and you've pulled a model.";
    }
    return "bet. something went wrong on my end. maybe check your connection?";
  }
}
