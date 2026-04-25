(function () {
  function setupRevealAnimations(root) {
    const selector = [
      ".hero-moment",
      "h2",
      "h3",
      "p",
      "li",
      "img",
      ".two-col-pitch article",
      ".interactive-panel",
      ".mermaid",
      ".p5-sketch",
      "pre",
    ].join(", ");

    const nodes = [...root.querySelectorAll(selector)].filter(
      (node) => !node.classList.contains("page-meta")
    );

    nodes.forEach((node, index) => {
      node.classList.add("reveal-ready");
      node.style.transitionDelay = `${Math.min(index * 18, 360)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function setupProfileInteractive(root) {
    const panel = root.querySelector("#thesis-profile-panel");
    const output = root.querySelector("#thesis-profile-result");
    if (!panel || !output) return;

    const notes = {
      research:
        "We will map references and methods first, then translate your question into a concise weekly agenda.",
      experimentation:
        "We will test multiple formats quickly, then keep the most conceptually precise direction.",
      accountability:
        "You will get milestone check-ins and direct critique to maintain momentum.",
    };

    const update = () => {
      const active = [...panel.querySelectorAll("input:checked")].map(
        (input) => input.dataset.trait
      );
      if (!active.length) {
        output.textContent = "Select at least one option.";
        return;
      }
      output.textContent = active.map((k) => notes[k]).join(" ");
    };

    panel.addEventListener("change", update);
    update();
  }

  function init() {
    const root = document.querySelector("main");
    if (!root) return;
    setupRevealAnimations(root);
    setupProfileInteractive(root);
  }

  window.addEventListener("preso:page-loaded", (event) => {
    if (event.detail?.slug === "meet-thesis-advisor") {
      init();
    }
  });

  if (location.hash.replace(/^#/, "") === "meet-thesis-advisor") {
    init();
  }
})();
