/**
 * Overlay tìm kiếm: Enter / nút Tìm / tag gợi ý → chuyển tới search.html?q=...
 * Import file này ở đầu module script trên mọi trang có #search-overlay.
 */
function goSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  const q = input.value.trim();
  if (!q) {
    input.focus();
    return;
  }
  window.location.href = "search.html?q=" + encodeURIComponent(q);
}

function initSearchNavigation() {
  const overlay = document.getElementById("search-overlay");
  const input = document.getElementById("search-input");
  const btnOpen = document.getElementById("btn-search");
  const btnClose = document.getElementById("search-close");
  const btnSubmit = document.getElementById("search-submit");

  if (!overlay || !input) return;

  btnOpen?.addEventListener("click", () => {
    overlay.classList.add("open");
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      try {
        input.value = decodeURIComponent(q.replace(/\+/g, " "));
      } catch {
        input.value = q;
      }
    }
    input.focus();
  });

  btnClose?.addEventListener("click", () => overlay.classList.remove("open"));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("open");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.classList.remove("open");
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch();
    }
  });

  btnSubmit?.addEventListener("click", () => goSearch());

  document.querySelectorAll(".search-tag").forEach((t) => {
    t.addEventListener("click", () => {
      input.value = t.textContent.trim();
      goSearch();
    });
  });
}

initSearchNavigation();
