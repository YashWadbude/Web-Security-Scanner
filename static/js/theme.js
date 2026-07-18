// =========================
// 🌙 APPLY DARK MODE ON LOAD (ALL PAGES)
// =========================
// 🌙 GLOBAL DARK MODE (ALL PAGES)
(function () {
    const isDark = localStorage.getItem("darkMode") === "true";

    if (isDark) {
        document.documentElement.classList.add("dark");
    }
})();