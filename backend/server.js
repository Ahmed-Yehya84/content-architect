require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Content Architect API is LIVE");
});

// Main Generation Route
app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea, platforms } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server Error", details: "API Key missing." });
    }

    // The 2026 Stable Model URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // STRICT PROMPT: Logic fix for platform filtering + Preview optimization
    const prompt = `
            You are a professional Content Architect. 
            Product/Service: "${productIdea}". 
            
            TASK:
            Generate a social media strategy ONLY for these platforms: ${platforms.join(
              ", "
            )}.
            DO NOT generate content for any other platforms.
            
            CONTENT GUIDELINES:
            - For Instagram/TikTok: Keep captions punchy and visual (3-4 sentences max).
            - For LinkedIn: Professional and insightful.
            - For YouTube: Catchy video title and a 2-sentence hook.
            
            RESPONSE FORMAT:
            Return ONLY a valid JSON object. No markdown, no backticks.
            Structure:
            {
                ${platforms
                  .map((p) => `"${p}": { "text": "Content here..." }`)
                  .join(",\n                ")}
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

    if (!response.ok) {
      console.error("API Error:", data);
      return res.status(response.status).json({
        error: "AI Engine Error",
        details: data.error?.message,
      });
    }

    // Safe extraction of JSON response
    let aiResponseText = data.candidates[0].content.parts[0].text;

    // Final cleanup just in case Gemini adds markdown
    const cleanJsonString = aiResponseText.replace(/```json|```/g, "").trim();
    const parsedResponse = JSON.parse(cleanJsonString);

    res.json(parsedResponse);
  } catch (error) {
    console.error("System Crash:", error);
    res.status(500).json({ error: "Internal Error", message: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 ARCHITECT SERVER LIVE ON PORT ${PORT}`);
});
