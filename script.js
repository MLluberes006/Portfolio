document.getElementById("email-alert")?.addEventListener("click", () => {
  window.alert("Email: tuckerlluberes006@gmail.com");
});

const panels = [...document.querySelectorAll(".panel-window")];
let windowOrder = 10;
const lastOpener = new Map();

function closePanel(panel) {
  if (panel.hidden) return;
  panel.setAttribute("aria-hidden", "true");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    panel.hidden = true;
    panel.classList.remove("is-closing");
    return;
  }
  panel.classList.add("is-closing");
  window.setTimeout(() => {
    if (!panel.classList.contains("is-closing")) return;
    panel.hidden = true;
    panel.classList.remove("is-closing");
  }, 260);
}

document.querySelector("[data-view=\"home\"]")?.addEventListener("click", () => {
  panels.forEach(closePanel);
});

function raisePanel(panel) {
  panel.style.zIndex = String(++windowOrder);
}

document.querySelectorAll("[data-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.dialog);
    if (!panel) return;
    panel.classList.remove("is-closing");
    lastOpener.set(panel, button);
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    raisePanel(panel);
  });
});

panels.forEach((panel) => {
  const closeButton = panel.querySelector(".close");
  closeButton?.addEventListener("click", () => {
    closePanel(panel);
    lastOpener.get(panel)?.focus();
  });
  const resizeHandle = panel.querySelector("[data-resize-handle]");
  resizeHandle?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resizeHandle.setPointerCapture(event.pointerId);
    raisePanel(panel);
    const rect = panel.getBoundingClientRect();
    const startY = event.clientY;
    const startHeight = rect.height;
    const minHeight = 210;
    const maxHeight = Math.max(minHeight, window.innerHeight - rect.top - 12);
    panel.style.top = rect.top + "px";
    panel.style.bottom = "auto";
    panel.style.height = startHeight + "px";
    const move = (moveEvent) => {
      const height = Math.max(minHeight, Math.min(maxHeight, startHeight + moveEvent.clientY - startY));
      panel.style.height = height + "px";
    };
    const stop = () => {
      resizeHandle.removeEventListener("pointermove", move);
      resizeHandle.removeEventListener("pointerup", stop);
      resizeHandle.removeEventListener("pointercancel", stop);
    };
    resizeHandle.addEventListener("pointermove", move);
    resizeHandle.addEventListener("pointerup", stop);
    resizeHandle.addEventListener("pointercancel", stop);
  });

  panel.addEventListener("pointerdown", () => raisePanel(panel));

  const handle = panel.querySelector("[data-drag-handle]");
  handle?.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    raisePanel(panel);
    const rect = panel.getBoundingClientRect();
    const originX = event.clientX;
    const originY = event.clientY;
    const left = rect.left;
    const top = rect.top;
    const move = (moveEvent) => {
      const nextLeft = Math.max(0, Math.min(window.innerWidth - 100, left + moveEvent.clientX - originX));
      const nextTop = Math.max(0, Math.min(window.innerHeight - 44, top + moveEvent.clientY - originY));
      panel.style.left = nextLeft + "px";
      panel.style.top = nextTop + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
    };
    const stop = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", stop);
      handle.removeEventListener("pointercancel", stop);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const topPanel = panels.filter((panel) => !panel.hidden).sort((a, b) => Number(b.style.zIndex || 0) - Number(a.style.zIndex || 0))[0];
  if (topPanel) {
    closePanel(topPanel);
    lastOpener.get(topPanel)?.focus();
  }
});

const taglineText = document.getElementById("tagline-text");
if (taglineText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const message = taglineText.textContent;
  taglineText.textContent = "";
  let index = 0;
  const cursor = document.querySelector(".typing-cursor");
  const typeNextCharacter = () => {
    if (index < message.length) {
      taglineText.textContent += message[index++];
      window.setTimeout(typeNextCharacter, 42);
    } else {
      window.setTimeout(() => {
        cursor?.classList.add("is-fading");
        window.setTimeout(() => cursor?.classList.add("is-hidden"), 180);
      }, 3200);
    }
  };
  window.setTimeout(typeNextCharacter, 350);
}
