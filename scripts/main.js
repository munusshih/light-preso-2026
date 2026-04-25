// lazy-load heavy libs only when a page actually needs them
const _loadedScripts = new Set();
function loadScript(src) {
  if (_loadedScripts.has(src)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => {
      _loadedScripts.add(src);
      resolve();
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}
let _mermaidReady = false;
const SITE_NAME = "Preso";

function getEditBaseUrl() {
  const githubIoMatch = location.hostname.match(/^([^.]+)\.github\.io$/);
  if (githubIoMatch && location.pathname) {
    const repo = location.pathname.split("/").filter(Boolean)[0];
    if (repo) return `https://github.com/${githubIoMatch[1]}/${repo}`;
  }
  return "https://github.com/munusshih/light-preso-2026";
}

// configure marked with syntax highlighting and mermaid support
const renderer = new marked.Renderer();
let p5Queue = [];

renderer.code = ({ text, lang }) => {
  if (lang === "mermaid") return `<div class="mermaid">${text}</div>`;
  if (lang === "p5.js") {
    const id = `p5-sketch-${p5Queue.length}`;
    p5Queue.push({ id, code: text });
    return `<div class="p5-sketch" id="${id}"></div>`;
  }
  let detectedLang = (lang || "").trim();
  let html;

  if (detectedLang && hljs.getLanguage(detectedLang)) {
    html = hljs.highlight(text, {
      language: detectedLang,
      ignoreIllegals: true,
    }).value;
  } else {
    const auto = hljs.highlightAuto(text);
    html = auto.value;
    detectedLang = detectedLang || auto.language || "text";
  }

  const safeLang =
    detectedLang.toLowerCase().replace(/[^\w.+-]/g, "") || "text";
  return `<pre data-lang="${safeLang}"><span class="code-lang">${safeLang}</span><code class="hljs language-${safeLang}">${html}</code></pre>`;
};
renderer.heading = ({ text, depth }) => {
  const id = text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
  return `<h${depth} id="${id}">${text}</h${depth}>`;
};

marked.use({ renderer });

// add a "copy" button to each code block
function addCopyButtons(container) {
  container.querySelectorAll("pre").forEach((pre) => {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "copy";
    btn.onclick = () =>
      navigator.clipboard
        .writeText(pre.querySelector("code")?.innerText ?? pre.innerText)
        .then(() => {
          btn.textContent = "copied!";
          setTimeout(() => (btn.textContent = "copy"), 1500);
        });
    pre.appendChild(btn);
  });
}

// parse YAML-lite front matter (--- key: value --- blocks)
function parseFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return { data: {}, content: text };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    data[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return { data, content: text.slice(match[0].length) };
}

// mark the active nav link
function setNavActive(slug) {
  document.querySelectorAll("nav a").forEach((a) => {
    a.toggleAttribute("aria-current", a.getAttribute("href") === `#${slug}`);
  });
}

// inject or update a per-page <link> stylesheet
function applyPageCSS(href) {
  let link = document.getElementById("page-style");
  if (!link) {
    link = document.createElement("link");
    link.id = "page-style";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (href) {
    link.href = href;
    link.disabled = false;
  } else {
    link.disabled = true;
  }
}

// inject or update a per-page <script> file
function applyPageJS(src) {
  const existing = document.getElementById("page-script");
  if (existing) {
    existing.remove();
  }

  if (!src) {
    return;
  }

  const script = document.createElement("script");
  script.id = "page-script";
  script.src = src;
  script.defer = true;
  document.body.appendChild(script);
}

function basename(path) {
  const clean = path.split("?")[0].split("#")[0];
  const parts = clean.split("/");
  return parts[parts.length - 1] || "document.pdf";
}

function loadPDF(path) {
  const rawPath = (path || "").trim();
  if (!rawPath || !/\.pdf(?:$|[?#])/i.test(rawPath)) {
    main.innerHTML =
      "<p>Invalid PDF path. Use #assets/your-file.pdf (or #pdf=assets/your-file.pdf).</p>";
    return;
  }

  applyPageCSS(null);
  applyPageJS(null);
  main.classList.add("pdf-mode");
  setNavActive(rawPath);
  document.title = `${basename(rawPath)} — ${SITE_NAME}`;

  main.innerHTML = `<iframe class="pdf-viewer" src="${rawPath}" title="PDF viewer: ${basename(rawPath)}"></iframe>`;
  window.scrollTo(0, 0);
}

// load content/{slug}.md into <main>
const main = document.querySelector("main");

async function loadPage(slug) {
  p5Queue = [];
  main.classList.remove("pdf-mode");
  const res = await fetch(`content/${slug}.md`);
  if (!res.ok) {
    main.innerHTML = "<p>Page not found...or yet to be found.</p>";
    return;
  }

  const { data, content } = parseFrontMatter(await res.text());

  // detect which heavy libs this page needs and load them in parallel
  const needsHighlight = /^```/m.test(content);
  const needsMermaid = /^```mermaid/m.test(content);
  const needsP5 = /^```p5\.js/m.test(content);
  const libLoads = [];
  if (needsHighlight) libLoads.push(loadScript("lib/highlight.min.js"));
  if (needsMermaid) libLoads.push(loadScript("lib/mermaid.min.js"));
  if (needsP5) libLoads.push(loadScript("lib/p5.min.js"));
  await Promise.all(libLoads);
  if (needsMermaid && !_mermaidReady) {
    mermaid.initialize({ startOnLoad: false, theme: "neutral" });
    _mermaidReady = true;
  }

  applyPageCSS(data.css || null);
  applyPageJS(data.js || null);
  document.title = data.title ? `${data.title} — ${SITE_NAME}` : SITE_NAME;
  setNavActive(slug);

  const headerHtml = data.title ? `<h1>${data.title}</h1>` : "";
  const subHtml = [data.date, data.author].filter(Boolean).join(" · ");

  main.innerHTML =
    headerHtml + (subHtml ? `<p>${subHtml}</p>` : "") + marked.parse(content);
  addCopyButtons(main);
  await mermaid.run({ nodes: main.querySelectorAll(".mermaid") });
  p5Queue.forEach(({ id, code }) => new p5(new Function("p", code), id));

  // page footer meta
  const footerMeta = document.createElement("div");
  footerMeta.className = "page-meta";

  const editUrl = `${getEditBaseUrl()}/edit/main/content/${slug}.md`;
  const editEl = document.createElement("p");
  editEl.className = "edit-link";
  editEl.innerHTML = `<a href="${editUrl}" target="_blank">edit this page on github ↗</a>`;
  footerMeta.appendChild(editEl);

  // page size indicator
  const entries = performance.getEntriesByType("resource");
  const totalBytes = entries.reduce((sum, e) => sum + (e.transferSize || 0), 0);
  if (totalBytes > 0) {
    const kib = (totalBytes / 1024).toFixed(2);
    const sizeEl = document.createElement("p");
    sizeEl.className = "page-size";
    sizeEl.textContent = `Page size: ${kib} KiB`;
    footerMeta.appendChild(sizeEl);
  }

  main.appendChild(footerMeta);

  window.scrollTo(0, 0);
}

function navigate(hash) {
  if (hash && hash.startsWith("pdf=")) {
    loadPDF(decodeURIComponent(hash.slice(4)));
    return;
  }

  if (hash && /\.pdf(?:$|[?#])/i.test(hash)) {
    loadPDF(decodeURIComponent(hash));
    return;
  }

  const el = hash && document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else {
    loadPage(hash || "index");
  }
}

window.addEventListener("hashchange", () => navigate(location.hash.slice(1)));
navigate(location.hash.slice(1));
