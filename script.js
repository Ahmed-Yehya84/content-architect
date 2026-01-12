let isDarkMode = true;
let cardStyle = "solid";

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  const body = document.getElementById("bodyTag");
  const icon = document.getElementById("themeIcon");
  body.className = isDarkMode
    ? "bg-slate-950 text-white min-h-screen font-sans"
    : "bg-slate-50 text-slate-900 min-h-screen font-sans";
  icon.className = isDarkMode
    ? "fa-solid fa-moon text-blue-400"
    : "fa-solid fa-sun text-yellow-500";
  // Refresh cards to apply new light/dark colors
  const lastData = JSON.parse(localStorage.getItem("lastResult") || "{}");
  if (Object.keys(lastData).length > 0) renderCards(lastData);
}

function setCardStyle(style) {
  cardStyle = style;
  document.getElementById("solidBtn").className =
    style === "solid"
      ? "px-4 py-1 rounded-md text-xs bg-slate-700 text-white"
      : "px-4 py-1 rounded-md text-xs text-slate-500";
  document.getElementById("glassBtn").className =
    style === "glass"
      ? "px-4 py-1 rounded-md text-xs bg-slate-700 text-white"
      : "px-4 py-1 rounded-md text-xs text-slate-500";
  const lastData = JSON.parse(localStorage.getItem("lastResult") || "{}");
  if (Object.keys(lastData).length > 0) renderCards(lastData);
}

async function generate() {
  const productIdea = document.getElementById("productIdea").value;
  const selectedPlatforms = Array.from(
    document.querySelectorAll(".platform-checkbox:checked")
  ).map((cb) => cb.value);

  if (!productIdea || selectedPlatforms.length === 0)
    return alert("Please provide an idea and select platforms!");

  document.getElementById("results").innerHTML = "";
  document.getElementById("loading").classList.remove("hidden");

  // Smart Ticker
  const ticker = document.getElementById("tickerText");
  const phrases = [
    `Analyzing ${productIdea}...`,
    ...selectedPlatforms.map((p) => `Designing ${p} content...`),
    "Finalizing...",
  ];
  let i = 0;
  const interval = setInterval(() => {
    ticker.innerText = phrases[i++ % phrases.length];
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
    localStorage.setItem("lastResult", JSON.stringify(data.platforms));
    renderCards(data.platforms);
    document.getElementById("resetBtn").classList.remove("hidden");
  } catch (e) {
    alert("Fail: " + e.message);
  } finally {
    clearInterval(interval);
    document.getElementById("loading").classList.add("hidden");
  }
}

function renderCards(platforms) {
  const grid = document.getElementById("results");
  grid.innerHTML = "";

  Object.entries(platforms).forEach(([name, content]) => {
    const card = document.createElement("div");

    // BETTER SOLID STYLE: White background, gray borders, dark text
    const baseStyle =
      cardStyle === "glass"
        ? "glass-card text-white"
        : isDarkMode
        ? "bg-slate-900 border-slate-800 text-white"
        : "bg-white border-slate-200 text-slate-900 shadow-sm";

    card.className = `${baseStyle} p-6 rounded-2xl border fade-in mb-4 transition-all hover:shadow-xl`;
    card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="capitalize font-bold text-lg">${name}</h3>
                <div class="flex gap-3">
                    <button onclick="copyText(this, \`${content.text}\`)" class="cursor-pointer hover:text-blue-500"><i class="fa-regular fa-copy"></i></button>
                    <button onclick="openModal('${name}', \`${content.text}\`, '${content.imageKeyword}')" class="cursor-pointer hover:text-blue-500"><i class="fa-solid fa-mobile-screen-button"></i></button>
                </div>
            </div>
            <p class="text-sm leading-relaxed opacity-90">${content.text}</p>
        `;
    grid.appendChild(card);
  });
}

function openModal(platform, text, keyword) {
  const content = document.getElementById("modalContent");
  // Using a reliable 2026-safe Unsplash URL with Gemini's custom keyword
  const imageUrl = `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80`; // Fallback
  const dynamicUrl = `https://loremflickr.com/400/400/${keyword.replace(
    / /g,
    ","
  )}`;

  content.innerHTML = `
        <div class="bg-black rounded-[2rem] overflow-hidden border border-slate-800">
            <div class="p-4 flex items-center gap-2">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600"></div>
                <span class="text-[10px] font-bold text-white">architect.ai</span>
            </div>
            <img src="${dynamicUrl}" class="w-full aspect-square object-cover">
            <div class="p-4">
                <div class="flex gap-3 mb-2 text-white text-sm"><i class="fa-regular fa-heart"></i><i class="fa-regular fa-comment"></i></div>
                <p class="text-[10px] text-slate-300"><span class="font-bold text-white">architect.ai</span> ${text}</p>
            </div>
        </div>
    `;
  document.getElementById("previewModal").classList.remove("hidden");
  document.getElementById("previewModal").classList.add("flex");
}

function resetApp() {
  if (confirm("Reset everything?")) {
    document.getElementById("productIdea").value = "";
    document.getElementById("results").innerHTML = "";
    document.getElementById("resetBtn").classList.add("hidden");
    localStorage.removeItem("lastResult");
  }
}

function closeModal() {
  document.getElementById("previewModal").classList.add("hidden");
}
