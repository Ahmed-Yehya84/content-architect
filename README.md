# 🏛️ Content Architect | AI Strategy Engine

A premium, full-stack AI application that transforms a single content concept into a multi-platform social media strategy. Powered by Google Gemini 2.5 Flash, it generates platform-specific content, from professional LinkedIn posts to structured YouTube video scripts.

![Social Media Automation](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue)
![Frontend](https://img.shields.io/badge/UI-Tailwind%20CSS-38bdf8)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933)

## 🚀 Key Features

- **Multi-Platform Intelligence**: Generates tailored content for LinkedIn, Instagram, TikTok, and YouTube.
- **Specialized YouTube Scripting**: Unlike standard captions, the engine architects full video scripts including Hooks, Body Content, and CTAs.
- **Quad-Style UI Engine**: Features a seamless transition between:
  - **Themes**: Light & Dark mode.
  - **Visual Styles**: Solid & Glassmorphism (Glass-card) interfaces.
- **Smart Visual Keywords**: AI suggests "imageKeywords" for every post, integrated with dynamic image fetching for realistic previews.
- **Robust Backend Architecture**: Implemented custom retry logic to handle API cold starts, ensuring high reliability for end-users.
- **Responsive Preview Modal**: A mobile-first previewer with scrollable content support and asynchronous image loading.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS (JIT), JavaScript (ES6+).
- **Backend**: Node.js, Express.
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash API).
- **Deployment**: Render (Backend) & Vercel/GitHub Pages (Frontend).

## 📸 Usage Example

1.  **Enter a Concept**: "A 7-day road trip from Moscow to St. Petersburg."
2.  **Select Channels**: Choose YouTube and Instagram.
3.  **Architect**: The AI generates a 10-minute video script for YouTube and a high-engagement carousel caption for Instagram.
4.  **Preview**: Use the 'Mobile Preview' icon to see how the content looks in a real-world social feed.

## ⚙️ Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/Ahmed-Yehya84/content-architect.git](https://github.com/Ahmed-Yehya84/content-architect.git)
    ```
2.  **Backend Setup**:
    - Navigate to `/backend`.
    - Run `npm install`.
    - Create a `.env` file and add: `GEMINI_API_KEY=your_key_here`.
    - Start server: `npm start`.
3.  **Frontend Setup**:
    - Open `index.html` in your browser or serve via Live Server.

## 📄 License

MIT License - Created for Professional Portfolio Use.

2️⃣ Environment Setup 🔑
Create a .env file in the backend folder:

Code snippet

GEMINI_API_KEY=your_key_here
PORT=10000
3️⃣ Launch the Architect 🚀
Bash

node server.js
☁️ Deployment (Render.com)
To get this live, use these settings in your Render dashboard:

Build Command: npm install --prefix backend

Start Command: node backend/server.js

Env Vars: Add GEMINI_API_KEY in the Environment tab.

⚠️ Troubleshooting the "Brutal" Errors
If you encounter issues, here is the hard-won knowledge from development:

🧩 404 Not Found: Google retired the 1.5 series in 2025. Always use gemini-2.5-flash in the URL.

🚦 429 Rate Limit: The Free Tier is strict! If you get this, wait 60 seconds without clicking "Generate" to reset your quota.

🔒 CORS/API Key: Ensure your API key is restricted to the "Generative Language API" in the Google Cloud Console.

```

📜 License
Distributed under the MIT License. See LICENSE for more information.

<p align="center"> Built with ❤️ and a lot of caffeine. </p>
```
