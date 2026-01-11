const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// PRE-FLIGHT CHECK
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from Render!");
} else {
  console.log("✅ API Key loaded:", process.env.GEMINI_API_KEY.substring(0, 4));
}

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Using the v1 stable endpoint with the 'flash-latest' model identifier
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a Content Architect. Idea: "${productIdea}". 
                        Generate 4 posts for LinkedIn, Instagram, TikTok, and a YouTube script.
                        Return ONLY valid JSON in this format:
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
      }),
    });

    const data = await response.json();

    // Detailed error logging if Google rejects the request
    if (!response.ok) {
      console.error("Google API Full Error:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({
        error: "Google API Error",
        details:
          data.error?.message || "Check Render logs for full JSON error body.",
      });
    }

    // Logic to extract and clean AI response
    const aiResponseText = data.candidates[0].content.parts[0].text;
    const cleanJson = aiResponseText.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Server Side Error:", error);
    res.status(500).json({
      error: "Failed to process content",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ARCHITECT SERVER LIVE ON PORT ${PORT}`);
});
