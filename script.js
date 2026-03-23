const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const promptForms = Array.from(document.querySelectorAll("form"));

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
        item.setAttribute("tabindex", "-1");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-selected", "true");
      button.setAttribute("tabindex", "0");
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
      filterButtons[nextIndex].click();
      filterButtons[nextIndex].focus();
    });
  });
}

if (promptForms.length > 0) {
  promptForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  });
}
