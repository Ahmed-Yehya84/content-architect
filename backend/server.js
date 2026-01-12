require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea, platforms } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) throw new Error("API Key is missing from environment.");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
            Product/Idea: "${productIdea}". 
            Task: Generate high-converting content for: ${platforms.join(", ")}.
            
            STRICT GUIDELINES:
            1. For Instagram, LinkedIn, and TikTok: Provide engaging captions/posts with hashtags.
            2. For YOUTUBE: Provide a structured VIDEO SCRIPT (including Hook, Body, and Call to Action).
            3. For all platforms: Provide a 2-3 word "imageKeyword" for visual representation.

            Format: Return ONLY valid JSON.
            Structure:
            {
                "platforms": {
                    ${platforms
                      .map(
                        (p) =>
                          `"${p}": { "text": "...", "imageKeyword": "..." }`
                      )
                      .join(",\n                    ")}
                }
            }
        `;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.7,
        },
      }),
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      throw new Error("AI failed to generate a response.");
    }

    const aiText = data.candidates[0].content.parts[0].text;
    res.json(JSON.parse(aiText));
  } catch (error) {
    console.error("Server Error:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Architect Server running on port ${PORT}`)
);
