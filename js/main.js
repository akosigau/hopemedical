(() => {
  const MIN_LOADER_MS = 2200;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const start = performance.now();

  /* ---------- Preloader ---------- */
  const loader = document.querySelector(".preloader");
  const bar = loader && loader.querySelector(".preloader__bar span");
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    if (bar) { bar.style.transitionDuration = "0.3s"; bar.style.transform = "scaleX(1)"; }
    setTimeout(() => {
      if (loader) loader.classList.add("is-done");
      body.classList.remove("is-loading");
      setTimeout(() => body.classList.add("is-ready"), 350);
    }, 300);
  };

  if (loader) {
    // bar creeps to 90% over the minimum time, then completes once the page has loaded
    if (bar) {
      bar.style.transition = `transform ${MIN_LOADER_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transform = "scaleX(0.9)"; }));
    }
    const loaded = new Promise((res) => {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", res, { once: true });
    });
    const minTime = new Promise((res) => setTimeout(res, MIN_LOADER_MS - (performance.now() - start)));
    Promise.all([loaded, minTime]).then(finish);
    // Safety net: never trap the visitor behind the loader
    setTimeout(finish, 8000);
  } else {
    body.classList.add("is-ready");
  }

  /* ---------- Header ---------- */
  const header = document.querySelector(".site-header");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 30);
    const menuOpen = body.classList.contains("menu-open");
    header.classList.toggle("is-hidden", !menuOpen && y > 400 && y > lastY + 2);
    if (y < lastY - 2) header.classList.remove("is-hidden");
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
      body.style.overflow = open ? "hidden" : "";
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-img");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Parallax images ---------- */
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  if (parallax.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      parallax.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1..1
        const amount = parseFloat(img.dataset.parallax) || 0.12;
        img.style.translate = `0 ${(-progress * amount * 100 - amount * 50).toFixed(2)}%`;
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- FAQ smooth open ---------- */
  document.querySelectorAll(".faq details").forEach((d) => {
    const summary = d.querySelector("summary");
    const answer = d.querySelector(".answer");
    summary.addEventListener("click", (ev) => {
      if (reduceMotion) return;
      ev.preventDefault();
      if (d.open) {
        const h = answer.scrollHeight;
        answer.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 450, easing: "cubic-bezier(0.22,1,0.36,1)" })
          .onfinish = () => { d.open = false; };
      } else {
        d.open = true;
        const h = answer.scrollHeight;
        answer.animate([{ height: "0px", opacity: 0 }, { height: h + "px", opacity: 1 }], { duration: 550, easing: "cubic-bezier(0.22,1,0.36,1)" });
      }
    });
  });

  /* ---------- Contact form (design only) ---------- */
  const form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      form.classList.add("is-sent");
      form.reset();
    });
  }

  /* ---------- Back to top ---------- */
  document.querySelectorAll(".to-top").forEach((b) =>
    b.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }))
  );

  /* ---------- Page transitions ---------- */
  const veil = document.querySelector(".veil");
  document.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    const internal = href && !href.startsWith("#") && !href.startsWith("http") &&
      !href.startsWith("mailto:") && !href.startsWith("tel:") && a.target !== "_blank";
    if (!internal || !veil || reduceMotion) return;
    a.addEventListener("click", (ev) => {
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return;
      ev.preventDefault();
      body.classList.remove("menu-open");
      veil.classList.add("is-active");
      setTimeout(() => { window.location.href = href; }, 650);
    });
  });
  // Coming back via the browser's back button: clear the veil
  window.addEventListener("pageshow", (e) => { if (e.persisted && veil) veil.classList.remove("is-active"); });

  /* ---------- Spinning badge: spread text evenly around the ring ---------- */
  const ring = document.querySelector(".hero__float text");
  if (ring) {
    const fit = () => {
      ring.style.letterSpacing = "0px";
      const chars = ring.textContent.length;
      const circumference = 2 * Math.PI * 38; // matches the r=38 path
      const natural = ring.getComputedTextLength();
      ring.style.letterSpacing = ((circumference - natural) / chars).toFixed(3) + "px";
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); else fit();
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
