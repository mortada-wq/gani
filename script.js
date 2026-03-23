const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const promptForms = Array.from(document.querySelectorAll("form[data-prompt-form]"));
const premiumPrompt = document.querySelector(".premium-prompt");
const premiumInput = document.querySelector(".premium-input");
const chatPromptInput = document.querySelector("#chat-prompt");
const trackList = document.querySelector(".chat-page .track-list");
const promptContext = document.querySelector("#prompt-context");
const waveformPatterns = [
  "0,14 8,14 12,7 18,25 24,9 30,20 38,10 46,18 52,8 60,22 67,10 74,16 81,6 88,19 94,12 100,12",
  "0,15 7,13 14,18 21,8 28,20 35,9 42,23 49,11 56,19 63,7 70,24 77,11 84,17 91,8 100,16",
  "0,16 6,10 12,22 18,9 24,18 30,7 36,21 42,10 48,18 54,8 60,20 66,11 72,17 78,9 84,19 90,12 100,14",
];

function activateFilterButton(button) {
  filterButtons.forEach((item) => {
    item.classList.remove("is-active");
    item.setAttribute("aria-selected", "false");
    item.setAttribute("tabindex", "-1");
  });

  button.classList.add("is-active");
  button.setAttribute("aria-selected", "true");
  button.setAttribute("tabindex", "0");
}

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateFilterButton(button);
    });

    if (button.classList.contains("is-active")) {
      button.setAttribute("tabindex", "0");
    } else {
      button.setAttribute("tabindex", "-1");
    }

    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      event.preventDefault();
      const currentIndex = filterButtons.indexOf(button);
      const delta = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + delta + filterButtons.length) % filterButtons.length;
      activateFilterButton(filterButtons[nextIndex]);
      filterButtons[nextIndex].focus();
    });
  });
}

function createGeneratedCard(promptText) {
  if (!trackList) {
    return;
  }

  const normalizedPrompt = promptText.trim().replace(/\s+/g, " ");
  if (!normalizedPrompt) {
    return;
  }

  const clippedTitle =
    normalizedPrompt.length > 30 ? `${normalizedPrompt.slice(0, 30).trim()}...` : normalizedPrompt;
  const readableTime = new Date().toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const randomPattern = waveformPatterns[Math.floor(Math.random() * waveformPatterns.length)];

  const card = document.createElement("article");
  card.className = "track-card";
  card.innerHTML = `
    <svg class="waveform" viewBox="0 0 100 30" aria-hidden="true">
      <polyline points="${randomPattern}" />
    </svg>
    <h2 class="track-title">${clippedTitle}</h2>
    <p class="track-meta">${readableTime} • تم التوليد بالذكاء الاصطناعي</p>
    <div class="inline-actions">
      <button class="text-btn text-btn-small" type="button">تشغيل</button>
      <button class="text-btn text-btn-small" type="button">حفظ</button>
      <button class="text-btn text-btn-small" type="button">مشاركة</button>
    </div>
  `;

  trackList.prepend(card);
}

function handlePromptSubmit(form) {
  const input = form.querySelector("input");
  const value = input ? input.value.trim() : "";
  if (!value) {
    if (input) {
      input.focus();
    }
    return;
  }

  const destination = form.dataset.destination;
  if (destination === "chat") {
    const target = `chat.html?prompt=${encodeURIComponent(value)}`;
    window.location.href = target;
    return;
  }

  createGeneratedCard(value);
  if (input) {
    input.value = "";
  }
}

if (promptForms.length > 0) {
  promptForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handlePromptSubmit(form);
    });
  });
}

if (chatPromptInput && trackList) {
  const params = new URLSearchParams(window.location.search);
  const incomingPrompt = params.get("prompt");

  if (incomingPrompt && incomingPrompt.trim()) {
    chatPromptInput.value = incomingPrompt;
    if (promptContext) {
      promptContext.hidden = false;
      promptContext.textContent = `تم توليد مقطع بناءً على الوصف: "${incomingPrompt.trim()}"`;
    }
    createGeneratedCard(incomingPrompt);
    window.history.replaceState({}, "", "chat.html");
  }
}

if (premiumPrompt && premiumInput) {
  const syncTypingState = () => {
    if (premiumInput.value.trim().length > 0) {
      premiumPrompt.classList.add("is-typing");
    } else {
      premiumPrompt.classList.remove("is-typing");
    }
  };

  premiumInput.addEventListener("input", syncTypingState);
  syncTypingState();
}
