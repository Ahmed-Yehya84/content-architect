const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// PRE-FLIGHT CHECK
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing from Render Environment!");
} else {
  console.log("✅ API Key loaded:", process.env.GEMINI_API_KEY.substring(0, 4));
}

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // FORCE STABLE V1 URL - No more v1beta!
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Error Details:", data);
      return res.status(response.status).json({
        error: "Google API rejected the request",
        details: data.error?.message || "Unknown error",
      });
    }

    // Extract the text from the response
    const aiResponseText = data.candidates[0].content.parts[0].text;

    // Clean up markdown code blocks if the AI includes them
    const cleanJson = aiResponseText.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Server Crash Error:", error);
    res
      .status(500)
      .json({
        error: "Server failed to process content",
        message: error.message,
      });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 NUCLEAR OPTION: Server live on port ${PORT}`);
});
