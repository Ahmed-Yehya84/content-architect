const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("*", cors());
app.use(express.json());

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea } = req.body;
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a Content Architect & Video Director. Idea: "${productIdea}". 
                    Generate 4 distinct posts. For YouTube, provide a "Director's Script" with visual scenes and dialogue.
                    Return ONLY this JSON structure:
                    {
                        "linkedin": { "text": "..." },
                        "instagram": { "text": "..." },
                        "tiktok": { "text": "..." },
                        "youtube": { "text": "[SCENE 1: Visual description]\\nDIALOGUE: '...'\\n\\n[SCENE 2: Visual description]\\nDIALOGUE: '...'" }
                    }`,
            },
          ],
        },
      ],
      config: { response_mime_type: "application/json" },
    });

    const cleanJson = result.text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.listen(5050, () =>
  console.log("🚀 Server running on http://localhost:5050")
);
