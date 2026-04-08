import type { EmailResponse } from "@/types/email";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function analyzeEmail(emailText: string): Promise<EmailResponse> {
  const response = await fetch(`${API_URL}/analyze-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_text: emailText }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Analysis failed (${response.status}): ${errorText}`);
  }

  return response.json();
}
