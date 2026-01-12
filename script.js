let currentTheme = "solid";
const tickerPhrases = [
  "Analyzing your product idea...",
  "Consulting Gemini 2.5 Intelligence...",
  "Architecting LinkedIn hooks...",
  "Drafting viral TikTok captions...",
  "Structuring YouTube scripts...",
  "Polishing for conversion...",
  "Finalizing your strategy...",
];

// Theme Toggling
document
  .getElementById("solidBtn")
  .addEventListener("click", () => setTheme("solid"));
document
  .getElementById("glassBtn")
  .addEventListener("click", () => setTheme("glass"));

function setTheme(theme) {
  currentTheme = theme;
  const sBtn = document.getElementById("solidBtn");
  const gBtn = document.getElementById("glassBtn");

  if (theme === "glass") {
    gBtn.classList.add("bg-slate-700", "text-white");
    gBtn.classList.remove("text-slate-500");
    sBtn.classList.remove("bg-slate-700", "text-white");
    sBtn.classList.add("text-slate-500");
  } else {
    sBtn.classList.add("bg-slate-700", "text-white");
    sBtn.classList.remove("text-slate-500");
    gBtn.classList.remove("bg-slate-700", "text-white");
    gBtn.classList.add("text-slate-500");
  }
  // Refresh results if they exist to apply theme
}

async function generate() {
  const productIdea = document.getElementById("productIdea").value;
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");
  const ticker = document.getElementById("tickerText");
  const genBtn = document.getElementById("genBtn");

  if (!productIdea) return alert("Please enter an idea first!");

  // Get selected platforms
  const selectedPlatforms = Array.from(
    document.querySelectorAll(".platform-checkbox:checked")
  ).map((cb) => cb.value);
  if (selectedPlatforms.length === 0)
    return alert("Please select at least one platform!");

  // UI Reset
  results.innerHTML = "";
  loading.classList.remove("hidden");
  genBtn.disabled = true;
  genBtn.classList.add("opacity-50", "cursor-not-allowed");

  // Agentic Ticker Start
  let tickerIdx = 0;
  const tickerInterval = setInterval(() => {
    tickerIdx = (tickerIdx + 1) % tickerPhrases.length;
    ticker.innerText = tickerPhrases[tickerIdx];
  }, 1500);

  try {
    const response = await fetch(
      "https://content-architect-api.onrender.com/api/generate-content",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIdea, platforms: selectedPlatforms }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.details || data.error);

    renderCards(data);
  } catch (error) {
    console.error("Architect Error:", error);
    alert("Construction failed! " + error.message);
  } finally {
    clearInterval(tickerInterval);
    loading.classList.add("hidden");
    genBtn.disabled = false;
    genBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function renderCards(data) {
  const results = document.getElementById("results");
  const themeClass =
    currentTheme === "glass" ? "glass-card" : "bg-slate-900 border-slate-800";

  Object.entries(data).forEach(([platform, content]) => {
    const card = document.createElement("div");
    card.className = `${themeClass} p-6 rounded-2xl border fade-in flex flex-col h-full`;

    const platformIcons = {
      linkedin: "fa-linkedin text-blue-400",
      instagram: "fa-instagram text-pink-500",
      tiktok: "fa-tiktok text-cyan-400",
      youtube: "fa-youtube text-red-500",
    };

    card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="capitalize font-bold flex items-center gap-2">
                    <i class="fa-brands ${
                      platformIcons[platform]
                    }"></i> ${platform}
                </h3>
                <div class="flex gap-2">
                    <button onclick="copyText(this, \`${content.text.replace(
                      /`/g,
                      "\\`"
                    )}\`)" class="p-2 hover:bg-slate-800 rounded-lg transition-all" title="Copy">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                    <button onclick="openModal(\`${content.text.replace(
                      /`/g,
                      "\\`"
                    )}\`)" class="p-2 hover:bg-slate-800 rounded-lg transition-all" title="Preview">
                        <i class="fa-solid fa-mobile-screen-button"></i>
                    </button>
                </div>
            </div>
            <p class="text-slate-400 text-sm flex-grow whitespace-pre-wrap">${
              content.text
            }</p>
        `;
    results.appendChild(card);
  });
}

async function copyText(btn, text) {
  await navigator.clipboard.writeText(text);
  const icon = btn.querySelector("i");
  icon.className =
    "fa-solid fa-check text-emerald-400 scale-125 transition-all";
  setTimeout(() => {
    icon.className = "fa-regular fa-copy";
  }, 2000);
}

function openModal(text) {
  const modal = document.getElementById("previewModal");
  const content = document.getElementById("modalContent");
  content.innerText = text;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  const modal = document.getElementById("previewModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}
