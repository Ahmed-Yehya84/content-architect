let isDarkMode = true;
let cardStyle = "solid";

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  const body = document.getElementById("bodyTag");
  const icon = document.getElementById("themeIcon");

  if (isDarkMode) {
    body.className =
      "bg-slate-950 text-white min-h-screen font-sans transition-colors duration-300";
    icon.className = "fa-solid fa-moon text-blue-400";
  } else {
    body.className =
      "bg-slate-50 text-slate-900 min-h-screen font-sans transition-colors duration-300";
    icon.className = "fa-solid fa-sun text-yellow-500";
  }

  // Ghosting fix: Only refresh view if results are present
  if (document.getElementById("results").innerHTML !== "") {
    refreshCurrentView();
  }
}

function setCardStyle(style) {
  cardStyle = style;
  document.getElementById("solidBtn").className =
    style === "solid"
      ? "px-4 py-1 rounded-md text-xs bg-slate-700 text-white font-bold"
      : "px-4 py-1 rounded-md text-xs text-slate-500 font-bold";
  document.getElementById("glassBtn").className =
    style === "glass"
      ? "px-4 py-1 rounded-md text-xs bg-slate-700 text-white font-bold"
      : "px-4 py-1 rounded-md text-xs text-slate-500 font-bold";

  if (document.getElementById("results").innerHTML !== "") {
    refreshCurrentView();
  }
}

function refreshCurrentView() {
  const lastData = JSON.parse(localStorage.getItem("lastResult") || "{}");
  if (Object.keys(lastData).length > 0) renderCards(lastData);
}

async function generate() {
  const productIdea = document.getElementById("productIdea").value;
  const selectedPlatforms = Array.from(
    document.querySelectorAll(".platform-checkbox:checked")
  ).map((cb) => cb.value);

  if (!productIdea || selectedPlatforms.length === 0)
    return alert("Please provide an idea and select at least one platform!");

  document.getElementById("results").innerHTML = "";
  localStorage.removeItem("lastResult");
  document.getElementById("resetBtn").classList.add("hidden");

  document.getElementById("loading").classList.remove("hidden");
  const ticker = document.getElementById("tickerText");
  const phrases = [
    `Analyzing ${productIdea}...`,
    ...selectedPlatforms.map((p) => `Designing ${p} content...`),
    "Architecting...",
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

    if (data.platforms) {
      localStorage.setItem("lastResult", JSON.stringify(data.platforms));
      renderCards(data.platforms);
      document.getElementById("resetBtn").classList.remove("hidden");
    }
  } catch (e) {
    alert("Construction failed: " + e.message);
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

    const baseStyle =
      cardStyle === "glass"
        ? "glass-card text-white"
        : isDarkMode
        ? "bg-slate-900 border-slate-800 text-white shadow-xl"
        : "bg-white border-slate-200 text-slate-800 shadow-md";

    card.className = `${baseStyle} p-6 rounded-2xl border fade-in mb-4 transition-all`;
    card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="capitalize font-bold text-lg">${name}</h3>
                <div class="flex gap-3">
                    <button onclick="copyText(this, \`${content.text.replace(
                      /`/g,
                      "\\`"
                    )}\`)" class="cursor-pointer hover:text-blue-500 transition-colors"><i class="fa-regular fa-copy"></i></button>
                    <button onclick="openModal('${name}', \`${content.text.replace(
      /`/g,
      "\\`"
    )}\`, '${
      content.imageKeyword
    }')" class="cursor-pointer hover:text-blue-500 transition-colors"><i class="fa-solid fa-mobile-screen-button"></i></button>
                </div>
            </div>
            <p class="text-sm leading-relaxed opacity-90">${content.text}</p>
        `;
    grid.appendChild(card);
  });
}

function openModal(platform, text, keyword) {
  const content = document.getElementById("modalContent");
  const dynamicUrl = `https://loremflickr.com/400/400/${keyword.replace(
    / /g,
    ","
  )}`;

  content.innerHTML = `
        <div class="bg-black rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl mb-4">
            <div class="p-4 flex items-center gap-2 border-b border-slate-900">
                <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600"></div>
                <span class="text-[10px] font-bold text-white tracking-tight capitalize">${platform}.preview</span>
            </div>
            <div id="modalImgContainer" class="relative w-full aspect-square bg-slate-900 flex items-center justify-center">
                <div id="imgSpinner" class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                <img src="${dynamicUrl}" id="previewImg" class="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500" onload="imageLoaded()">
            </div>
            <div class="p-5">
                <div class="flex gap-4 mb-3 text-white text-lg"><i class="fa-regular fa-heart"></i><i class="fa-regular fa-comment"></i></div>
                <p class="text-[11px] text-slate-300 leading-normal"><span class="font-bold text-white mr-1 underline">${platform}.ai</span> ${text}</p>
            </div>
        </div>
    `;
  document.getElementById("previewModal").classList.remove("hidden");
  document.getElementById("previewModal").classList.add("flex");
}

function imageLoaded() {
  const spinner = document.getElementById("imgSpinner");
  if (spinner) spinner.remove();
  document.getElementById("previewImg").classList.remove("opacity-0");
}

function resetApp() {
  if (confirm("Discard all progress and reset configuration?")) {
    document.getElementById("productIdea").value = "";
    document.getElementById("results").innerHTML = "";
    document
      .querySelectorAll(".platform-checkbox")
      .forEach((cb) => (cb.checked = true));
    localStorage.removeItem("lastResult");
    document.getElementById("resetBtn").classList.add("hidden");
  }
}

function closeModal() {
  document.getElementById("previewModal").classList.add("hidden");
}

async function copyText(btn, text) {
  await navigator.clipboard.writeText(text);
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check text-emerald-500"></i>';
  setTimeout(() => {
    btn.innerHTML = original;
  }, 2000);
}
