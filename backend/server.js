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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
            Product: "${productIdea}". 
            Task: Generate strategy for: ${platforms.join(", ")}.
            
            Format: Return ONLY JSON.
            Structure:
            {
                "platforms": {
                    "linkedin": { "text": "...", "imageKeyword": "professional office" },
                    "instagram": { "text": "...", "imageKeyword": "scenic egypt pyramids" }
                }
            }
            Note: "imageKeyword" should be 2-3 words describing a perfect photo for that post.
        `;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" },
      }),
    });

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    res.json(JSON.parse(aiText));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(10000, () => console.log("Server running on 10000"));
