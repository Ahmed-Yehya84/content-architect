function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.theme = isDark ? "dark" : "light";
  document.getElementById("themeIcon").innerText = isDark ? "☀️" : "🌙";
}

function toggleOverlay(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (show) {
    overlay.classList.remove("hidden");
    setTimeout(() => (overlay.style.opacity = "1"), 10);
  } else {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.classList.add("hidden"), 500);
  }
}

async function generate() {
  const idea = document.getElementById("productInput").value;
  if (!idea) return alert("Please describe your vision first!");

  document
    .querySelectorAll(".reveal-card")
    .forEach((c) => c.classList.remove("active"));
  toggleOverlay(true);

  try {
    const response = await fetch(
      "https://content-architect-api.onrender.com/api/generate-content",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIdea: idea }),
      }
    );

    if (!response.ok) throw new Error("Server communication failed.");

    const data = await response.json();

    document.getElementById("linkedinText").innerText =
      data.linkedin?.text || "Empty";
    document.getElementById("instagramText").innerText =
      data.instagram?.text || "Empty";
    document.getElementById("tiktokText").innerText =
      data.tiktok?.text || "Empty";
    document.getElementById("youtubeText").innerText =
      data.youtube?.text || "Empty";

    toggleOverlay(false);

    document.querySelectorAll(".reveal-card").forEach((card, i) => {
      setTimeout(() => card.classList.add("active"), 150 * i);
    });

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4f46e5", "#06b6d4", "#ec4899"],
    });

    document.getElementById("clearBtn").classList.remove("hidden");
  } catch (err) {
    toggleOverlay(false);
    console.error("Architect Error:", err);
    alert("The Architect is unavailable. Ensure server.js is running.");
  }
}

function clearAll() {
  document.getElementById("productInput").value = "";
  document
    .querySelectorAll(".reveal-card")
    .forEach((c) => c.classList.remove("active"));
  setTimeout(() => {
    ["linkedinText", "instagramText", "tiktokText", "youtubeText"].forEach(
      (id) => {
        document.getElementById(id).innerText = "Waiting...";
      }
    );
    document.getElementById("clearBtn").classList.add("hidden");
  }, 400);
}

function copyText(id) {
  const text = document.getElementById(id).innerText;
  if (text.includes("Waiting")) return;

  navigator.clipboard.writeText(text);

  const btn = event.target;
  const originalText = btn.innerText;
  btn.innerText = "Copied!";
  btn.classList.add("text-indigo-600");
  setTimeout(() => {
    btn.innerText = originalText;
    btn.classList.remove("text-indigo-600");
  }, 2000);
}

function exportPlatform(platform, textId) {
  const idea =
    document.getElementById("productInput").value || "Creative Campaign";
  const text = document.getElementById(textId).innerText;

  if (text.includes("Waiting...")) return;

  let printSection = document.getElementById("printSection");
  if (!printSection) {
    printSection = document.createElement("div");
    printSection.id = "printSection";
    document.body.appendChild(printSection);
  }

  printSection.innerHTML = `
        <div style="font-family: 'Helvetica', sans-serif; padding: 40px; color: #1a1a1a;">
            <div style="border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h1 style="margin: 0; color: #4f46e5; font-size: 28px; letter-spacing: -1px;">CONTENT ARCHITECT</h1>
                    <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Platform Strategy • Gemini 2.5 Flash</p>
                </div>
                <div style="text-align: right; color: #94a3b8; font-size: 10px;">
                    Date: ${new Date().toLocaleDateString()}<br>
                    ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </div>

            <div style="margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #4f46e5;">
                <h3 style="margin: 0 0 10px 0; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Project Concept</h3>
                <p style="margin: 0; font-size: 20px; font-weight: bold; color: #1e293b;">${idea}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; font-size: 12px; color: #4f46e5; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    ${platform} Content
                </h3>
                <div style="white-space: pre-wrap; line-height: 1.8; color: #334155; font-size: 14px; background: #ffffff;">${text}</div>
            </div>

            <div style="position: fixed; bottom: 40px; left: 40px; right: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #cbd5e1; font-size: 9px;">
                This document was architected by AI for professional distribution. 
                All rights reserved to the Project Lead.
            </div>
        </div>
    `;

  window.print();
}

// Final Version 2.0 - Forced Update
