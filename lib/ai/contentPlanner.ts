// lib/ai/contentPlanner.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function generateContentPlan() {
  const prompt = `
You are a viral social media strategist. Generate 1 video idea optimized for TikTok, Instagram Reels, and YouTube Shorts.
Format:
{
  "title": "Catchy title under 60 chars",
  "script": "60-second script, 3-5 scenes, energetic tone",
  "hashtags": ["#trending", "#viral"],
  "platforms": ["youtube", "tiktok", "instagram"]
}
`;

  const response = await openai.chat.completions.create({
    model: "meta-llama/llama-3.1-70b-instruct",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}
