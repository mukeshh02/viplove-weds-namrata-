/** Reference-style element reveals from the WooowInvites demo. */
function initReferenceReveals() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const content = document.querySelector("[data-invitation-phone-frame='true']");
  if (!content) return;

  const targets = content.querySelectorAll(
    "[data-demo-block] h1, [data-demo-block] h2, [data-demo-block] h3, " +
    "[data-demo-block] p, [data-demo-block] img, [data-demo-block] a, " +
    "[data-demo-block] button, [data-demo-block] form, " +
    "[data-demo-block] .rounded-xl, [data-demo-block] .rounded-2xl"
  );

  targets.forEach((element, index) => {
    if (element.closest("#envelope-cover") || element.closest(".pdf-wedding-section")) return;
    element.classList.add("reference-reveal");
    element.style.setProperty("--reveal-delay", `${(index % 4) * 0.08}s`);

    if (element.matches("img, svg") || element.querySelector(":scope > svg")) {
      element.classList.add("reference-reveal-scale");
      element.style.setProperty("transform", "scale(0.8)", "important");
    } else {
      element.style.setProperty("transform", "translateY(24px)", "important");
    }

    if (element.closest("[data-demo-block='timeline']") &&
        element.matches(".relative.flex, .rounded-xl, .rounded-2xl")) {
      element.classList.add(index % 2 ? "reference-reveal-right" : "reference-reveal-left");
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.style.setProperty("opacity", "1", "important");
      entry.target.style.setProperty("transform", "none", "important");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  document.querySelectorAll(".reference-reveal").forEach((element) => observer.observe(element));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReferenceReveals, { once: true });
} else {
  initReferenceReveals();
}
