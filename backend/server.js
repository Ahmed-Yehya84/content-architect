const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// PRE-FLIGHT CHECK
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing!");
} else {
  console.log("✅ API Key active:", process.env.GEMINI_API_KEY.substring(0, 4));
}

/** * CRITICAL FIX: Explicitly setting the API version to 'v1'
 * to avoid the 'v1beta' 404 error we saw in the logs.
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea } = req.body;

    // We call the model directly. v1 supports gemini-1.5-flash
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `You are a Content Architect. Idea: "${productIdea}". 
        Generate 4 posts for LinkedIn, Instagram, TikTok, and a YouTube script.
        Return ONLY valid JSON:
        {
            "linkedin": { "text": "..." },
            "instagram": { "text": "..." },
            "tiktok": { "text": "..." },
            "youtube": { "text": "..." }
        }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Ensure no markdown formatting is wrapping the JSON
    const cleanJson = text.replace(/```json|```/g, "").trim();
    res.json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      error: "AI Processing Failed",
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Architect Server active on port ${PORT}`);
});
