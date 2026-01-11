const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- PRE-FLIGHT CHECK ---
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "❌ CRITICAL ERROR: GEMINI_API_KEY is missing from the environment!"
  );
} else {
  console.log(
    "✅ API Key detected (First 4 chars):",
    process.env.GEMINI_API_KEY.substring(0, 4)
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea } = req.body;

    // Google has been picky lately. Let's use the most specific stable name.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a professional Content Architect. 
                           Idea: "${productIdea}"
                           Generate 4 posts for LinkedIn, Instagram, TikTok, and a YouTube script.
                           Return ONLY valid JSON:
                           {
                               "linkedin": { "text": "..." },
                               "instagram": { "text": "..." },
                               "tiktok": { "text": "..." },
                               "youtube": { "text": "..." }
                           }`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await result.response;
    const data = JSON.parse(response.text());
    res.json(data);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      error: "Generation failed",
      message: error.message,
      suggestion: "Check Render logs for the Pre-flight check result.",
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
