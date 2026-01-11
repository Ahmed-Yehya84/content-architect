const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// FIXED CORS: This handles all origins and avoids the "*" error
app.use(cors());
app.use(express.json());

// Keep your working model name
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea } = req.body;
    // Using your preferred 2.5-flash model
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent({
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
      generationConfig: { response_mime_type: "application/json" },
    });

    const response = await result.response;
    const text = response.text();
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Generation failed" });
  }
});

// DYNAMIC PORT: This allows Render to tell the app which port to use
const PORT = process.env.PORT || 5050;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
