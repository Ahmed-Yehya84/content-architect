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
            Product: "${productIdea}". 
            Task: Generate a social media strategy ONLY for these platforms: ${platforms.join(
              ", "
            )}.
            
            Format: Return ONLY valid JSON.
            Structure:
            {
                "platforms": {
                    ${platforms
                      .map(
                        (p) =>
                          `"${p}": { "text": "Content here...", "imageKeyword": "2-3 word visual description" }`
                      )
                      .join(",\n                    ")}
                }
            }
            Important: Do not include markdown formatting or backticks. Ensure text is punchy and optimized for each platform.
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
      throw new Error("AI failed to generate a response. Please try again.");
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

// Render requires process.env.PORT
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`🚀 Architect Server running on port ${PORT}`)
);
