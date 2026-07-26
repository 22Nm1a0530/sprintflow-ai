export interface GeneratedTask {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export async function generateTasksFromDescription(
  projectDescription: string
): Promise<GeneratedTask[]> {
  if (!projectDescription.trim()) {
    throw new Error("Please enter a project description.");
  }

  if (!apiKey) {
    throw new Error("AI service is not configured. Please add your API key.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a project management assistant. Given a project description, generate exactly 5 realistic software development tasks needed to build it. Respond ONLY with a valid JSON array, no markdown, no code blocks, no extra text. Format: [{\"title\": \"short task title\", \"description\": \"one sentence description\", \"priority\": \"low\" | \"medium\" | \"high\"}]",
        },
        {
          role: "user",
          content: `Project description: "${projectDescription}"`,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI request failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return parsed as GeneratedTask[];
  } catch {
    throw new Error("AI returned an unexpected response. Please try again.");
  }
}