let currentTheme = "solid";
const tickerPhrases = [
  "Analyzing your product idea...",
  "Consulting Gemini 2.5 Intelligence...",
  "Architecting LinkedIn hooks...",
  "Drafting viral TikTok captions...",
  "Structuring YouTube scripts...",
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
    document.body.className =
      "bg-slate-950 text-white min-h-screen font-sans transition-all duration-500";
  } else {
    sBtn.classList.add("bg-slate-700", "text-white");
    sBtn.classList.remove("text-slate-500");
    gBtn.classList.remove("bg-slate-700", "text-white");
    gBtn.classList.add("text-slate-500");
    document.body.className =
      "bg-slate-50 text-slate-900 min-h-screen font-sans transition-all duration-500";
  }
}

async function generate() {
  const productIdea = document.getElementById("productIdea").value;
  const loading = document.getElementById("loading");
  const results = document.getElementById("results");
  const ticker = document.getElementById("tickerText");
  const genBtn = document.getElementById("genBtn");

  if (!productIdea) return alert("Please enter an idea first!");

  // CORRECTED CHECKBOX LOGIC
  const selectedPlatforms = [];
  document.querySelectorAll(".platform-checkbox").forEach((cb) => {
    if (cb.checked) {
      selectedPlatforms.push(cb.value);
    }
  });

  if (selectedPlatforms.length === 0)
    return alert("Please select at least one platform!");

  results.innerHTML = "";
  loading.classList.remove("hidden");
  genBtn.disabled = true;

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
    renderCards(data, productIdea); // Pass product idea for image search
  } catch (error) {
    alert("Construction failed! " + error.message);
  } finally {
    clearInterval(tickerInterval);
    loading.classList.add("hidden");
    genBtn.disabled = false;
  }
}

function renderCards(data, query) {
  const results = document.getElementById("results");
  const themeClass =
    currentTheme === "glass"
      ? "glass-card text-white"
      : "bg-white border-slate-200 shadow-sm text-slate-800";

  Object.entries(data).forEach(([platform, content]) => {
    const card = document.createElement("div");
    card.className = `${themeClass} p-6 rounded-2xl border fade-in flex flex-col`;

    card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="capitalize font-bold text-lg">${platform}</h3>
                <div class="flex gap-2">
                    <button onclick="copyText(this, \`${content.text.replace(
                      /`/g,
                      "\\`"
                    )}\`)" class="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                    <button onclick="openModal('${platform}', \`${content.text.replace(
      /`/g,
      "\\`"
    )}\`, '${query}')" class="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                        <i class="fa-solid fa-mobile-screen-button"></i>
                    </button>
                </div>
            </div>
            <p class="${
              currentTheme === "glass" ? "text-slate-300" : "text-slate-600"
            } text-sm whitespace-pre-wrap">${content.text}</p>
        `;
    results.appendChild(card);
  });
}

function openModal(platform, text, query) {
  const modal = document.getElementById("previewModal");
  const content = document.getElementById("modalContent");
  const keyword = query.split(" ")[0] || "business";

  // Create a "Phone Preview" Look
  content.innerHTML = `
        <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-0.5">
                <div class="w-full h-full rounded-full bg-slate-900 border-2 border-slate-900"></div>
            </div>
            <span class="font-bold text-white">Your Brand</span>
        </div>
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80" 
             class="w-full aspect-square object-cover rounded-lg mb-4 shadow-xl" 
             alt="Post Preview">
        <div class="flex gap-4 mb-3 text-white text-xl">
            <i class="fa-regular fa-heart"></i>
            <i class="fa-regular fa-comment"></i>
            <i class="fa-regular fa-paper-plane"></i>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">
            <span class="font-bold text-white mr-1">yourbrand</span>${text}
        </p>
    `;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

async function copyText(btn, text) {
  await navigator.clipboard.writeText(text);
  const icon = btn.querySelector("i");
  icon.className = "fa-solid fa-check text-emerald-500";
  setTimeout(() => (icon.className = "fa-regular fa-copy"), 2000);
}

function closeModal() {
  document.getElementById("previewModal").classList.add("hidden");
}

// Reset Function for the Configuration Icon
document
  .getElementById("configuration")
  .parentElement.addEventListener("click", () => {
    if (confirm("Clear all inputs and results?")) {
      document.getElementById("productIdea").value = "";
      document.getElementById("results").innerHTML = "";
      // Reset checkboxes to default
      document
        .querySelectorAll(".platform-checkbox")
        .forEach((cb) => (cb.checked = true));
    }
  });
