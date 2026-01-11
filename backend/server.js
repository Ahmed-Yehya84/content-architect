const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Ensure this matches package.json
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// FIXED INITIALIZATION: No 'new' and correct class name
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea } = req.body;

    // Using 1.5-flash as it's the most stable for API deployments
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

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
                                       "youtube": { "text": "..." }
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
    console.error("AI Error:", error);
    res
      .status(500)
      .json({ error: "Generation failed", details: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
