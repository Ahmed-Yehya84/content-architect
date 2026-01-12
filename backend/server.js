require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // In production, replace with your frontend URL for better security
  })
);
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send("🚀 Content Architect API is running...");
});

// Main Generation Route
app.post("/api/generate-content", async (req, res) => {
  try {
    const { productIdea, platforms } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server Error", details: "API Key missing on server." });
    }

    // The 2026 Stable Model URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // Construct a strict prompt to ensure JSON output and platform filtering
    const prompt = `
            You are a professional Content Architect. 
            Product Idea: "${productIdea}". 
            
            TASK:
            Generate a social media content strategy ONLY for these platforms: ${platforms.join(
              ", "
            )}.
            
            FORMATTING RULES:
            - Return ONLY a valid JSON object.
            - Do not include markdown formatting like \`\`\`json.
            - Each platform object must contain a "text" field with the post content.
            
            REQUIRED JSON STRUCTURE:
            {
                ${platforms
                  .map(
                    (p) => `"${p}": { "text": "Crafted content for ${p}..." }`
                  )
                  .join(",\n                ")}
            }
        `;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API Full Error:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({
        error: "Google API Error",
        details: data.error?.message || "Check quota or model availability.",
      });
    }

    // Extract the text from the response
    let aiResponseText = data.candidates[0].content.parts[0].text;

    // Final safety cleanup of the string before parsing
    const cleanJsonString = aiResponseText.replace(/```json|```/g, "").trim();
    const parsedResponse = JSON.parse(cleanJsonString);

    res.json(parsedResponse);
  } catch (error) {
    console.error("Server Crash Log:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// Start the Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(
    `✅ API Key loaded: ${
      process.env.GEMINI_API_KEY
        ? "Yes (Starts with " + process.env.GEMINI_API_KEY.substring(0, 4) + ")"
        : "NO"
    }`
  );
  console.log(`🚀 ARCHITECT SERVER LIVE ON PORT ${PORT}`);
});
