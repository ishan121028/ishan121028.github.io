const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#site-nav");
const mobile = window.matchMedia("(max-width: 700px)");
document.documentElement.classList.add("js");

function setMenu(open, restoreFocus = false) {
  const expanded = open && mobile.matches;
  navigation.classList.toggle("is-open", expanded);
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.querySelector("span").textContent = expanded ? "−" : "+";
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});
mobile.addEventListener("change", () => setMenu(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    setMenu(false, true);
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".header-inner") && navigation.classList.contains("is-open")) {
    setMenu(false);
  }
  if (event.target.closest('a[href]:not([href^="#"])')?.closest("#site-nav")) {
    setMenu(false);
  }
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.getElementById(anchor.hash.slice(1));
  if (!target) return;
  const fromMobileMenu = mobile.matches && navigation.contains(anchor);
  setMenu(false);
  if (target.id === "main-content") {
    event.preventDefault();
    target.focus();
  } else if (fromMobileMenu) {
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
});

const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
function markSection(id) {
  for (const link of sectionLinks) {
    if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) markSection(entry.target.id);
    }
  }, { rootMargin: "-15% 0px -60% 0px" });
  document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
}

const legacyAnchors = {
  overview: "top",
  projects: "work",
  "research/grace": "grace",
  "research/qanta": "qanta",
  "research/alphacross": "alphacross",
  "projects/patrol": "patrol",
  "projects/unitrain": "unitrain",
  "projects/rover": "rover",
  "projects/lyrics": "lyrics",
};

function migrateLegacyAnchor() {
  const destination = legacyAnchors[window.location.hash.slice(1)];
  if (!destination) return;
  const target = document.getElementById(destination);
  if (!target) return;
  history.replaceState(null, "", `#${destination}`);
  target.scrollIntoView({ behavior: "instant" });
}
window.addEventListener("hashchange", migrateLegacyAnchor);
migrateLegacyAnchor();

const citationToggle = document.querySelector("#citation-toggle");
const citation = document.querySelector("#grace-citation");
citationToggle.hidden = false;
citationToggle.addEventListener("click", () => {
  const expanded = citationToggle.getAttribute("aria-expanded") !== "true";
  citationToggle.setAttribute("aria-expanded", String(expanded));
  citation.hidden = !expanded;
});
document.querySelector("#copyright-year").textContent = new Date().getFullYear();
