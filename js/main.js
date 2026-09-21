/* =========================================================
   JUVENTA · Brückenmühle Gernsbach – Interaktionen
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Zurück nach oben ---------- */
  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Zurück nach oben");
  backToTop.setAttribute("aria-hidden", "true");
  backToTop.tabIndex = -1;
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(backToTop);

  function updateBackToTop() {
    const isVisible = window.scrollY > 500;
    backToTop.classList.toggle("is-visible", isVisible);
    backToTop.setAttribute("aria-hidden", String(!isVisible));
    backToTop.tabIndex = isVisible ? 0 : -1;
  }

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });

  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });

  /* ---------- Aktuelles Jahr ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Header (BSP-Stil) ---------- */
  const header = document.querySelector("[data-header]");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navClose = document.getElementById("navClose");
  const navOverlay = document.getElementById("navOverlay");
  const navLinks = document.querySelectorAll(".nav__link, .nav__cta, .nav__sub a, .nav__drawer-sub a");
  const drawerGroups = nav ? Array.from(nav.querySelectorAll(".nav__drawer-group")) : [];

  function setDrawerGroup(group, isOpen) {
    const button = group.querySelector(":scope > .nav__drawer-toggle");
    const submenu = group.querySelector(":scope > .nav__drawer-sub");
    const label = group.querySelector(":scope > .nav__link")?.textContent.trim() || "Menü";
    if (!button || !submenu) return;
    group.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", `${label} alt menüsünü ${isOpen ? "kapat" : "aç"}`);
    submenu.hidden = !isOpen;
  }

  if (nav && drawerGroups.length) {
    nav.classList.add("nav-drawer-ready");
    drawerGroups.forEach((group, index) => {
      const link = group.querySelector(":scope > .nav__link");
      const submenu = group.querySelector(":scope > .nav__drawer-sub");
      if (!link || !submenu) return;

      if (!submenu.id) submenu.id = `mobile-submenu-${index + 1}`;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "nav__drawer-toggle";
      button.setAttribute("aria-controls", submenu.id);
      button.innerHTML = '<span class="nav__drawer-arrow" aria-hidden="true"></span>';
      link.insertAdjacentElement("afterend", button);
      setDrawerGroup(group, false);

      button.addEventListener("click", () => {
        const shouldOpen = button.getAttribute("aria-expanded") !== "true";
        drawerGroups.forEach((item) => setDrawerGroup(item, false));
        if (shouldOpen) setDrawerGroup(group, true);
      });
    });
  }

  function setHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
    setHeaderHeight();
  }

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("open");
    drawerGroups.forEach((group) => setDrawerGroup(group, false));
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");
    document.body.style.overflow = "";
    if (navOverlay) {
      navOverlay.classList.remove("show");
      setTimeout(() => { if (!nav.classList.contains("open")) navOverlay.hidden = true; }, 300);
    }
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add("open");
    if (navOverlay) {
      navOverlay.hidden = false;
      requestAnimationFrame(() => navOverlay.classList.add("show"));
    }
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Menü schließen");
    document.body.style.overflow = "hidden";
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      nav.classList.contains("open") ? closeNav() : openNav();
    });
  }
  if (navClose) navClose.addEventListener("click", closeNav);
  if (navOverlay) navOverlay.addEventListener("click", closeNav);
  navLinks.forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", setHeaderHeight, { passive: true });

  /* ---------- Hero-Hintergrund-Slider (BSP-Stil) ---------- */
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    const heroSlides = heroSlider.querySelectorAll(".hero__slide");
    let heroIndex = 0;
    let heroTimer;

    function showHeroSlide(index) {
      heroIndex = (index + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === heroIndex);
      });
    }

    function startHeroAuto() {
      if (prefersReduced || heroSlides.length < 2) return;
      clearInterval(heroTimer);
      heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 5500);
    }

    showHeroSlide(0);
    startHeroAuto();
  }

  /* ---------- Horizontales Bereiche-Akkordeon ---------- */
  const areasPanels = document.querySelectorAll(".areas-panel");
  areasPanels.forEach((panel) => {
    const trigger = panel.querySelector(".areas-panel__trigger");
    if (!trigger) return;

    function activate() {
      areasPanels.forEach((p) => {
        p.classList.remove("is-open");
        const t = p.querySelector(".areas-panel__trigger");
        const c = p.querySelector(".areas-panel__content");
        if (t) t.setAttribute("aria-expanded", "false");
        if (c) c.hidden = true;
      });
      panel.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      const content = panel.querySelector(".areas-panel__content");
      if (content) content.hidden = false;
    }

    trigger.addEventListener("click", activate);
    trigger.addEventListener("mouseenter", activate);
    trigger.addEventListener("focus", activate);
  });

  /* ---------- Apartment-Bild-Slider ---------- */
  const apartmentsSlider = document.getElementById("apartmentsSlider");
  if (apartmentsSlider) {
    const apartSlides = apartmentsSlider.querySelectorAll(".apartments__slider-slide");
    const apartPrev = apartmentsSlider.querySelector("[data-apartments-prev]");
    const apartNext = apartmentsSlider.querySelector("[data-apartments-next]");
    let apartIndex = 0;

    function showApartSlide(index) {
      apartIndex = (index + apartSlides.length) % apartSlides.length;
      apartSlides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === apartIndex);
      });
    }

    if (apartPrev) apartPrev.addEventListener("click", () => showApartSlide(apartIndex - 1));
    if (apartNext) apartNext.addEventListener("click", () => showApartSlide(apartIndex + 1));

    showApartSlide(0);
  }

  /* ---------- Typ-Galerien (Grundrisse) ---------- */
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const slides = gallery.querySelectorAll(".bw-type__slide");
    const prev = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const currentEl = gallery.querySelector("[data-gallery-current]");
    const totalEl = gallery.querySelector("[data-gallery-total]");
    let index = 0;

    if (totalEl) totalEl.textContent = String(slides.length);

    function show(i) {
      if (!slides.length) return;
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => slide.classList.toggle("is-active", n === index));
      if (currentEl) currentEl.textContent = String(index + 1);
    }

    if (prev) prev.addEventListener("click", () => show(index - 1));
    if (next) next.addEventListener("click", () => show(index + 1));
    show(0);
  });

  /* ---------- Grundriss-Lightbox ---------- */
  const planLightbox = document.getElementById("planLightbox");
  const planLightboxImg = document.getElementById("planLightboxImg");
  const planLightboxTitle = document.getElementById("planLightboxTitle");
  let planLastFocus = null;

  function openPlanLightbox(src, title, trigger) {
    if (!planLightbox || !planLightboxImg) return;
    planLastFocus = trigger || document.activeElement;
    planLightboxImg.src = src;
    planLightboxImg.alt = title || "Grundriss";
    if (planLightboxTitle) planLightboxTitle.textContent = title || "Grundriss";
    planLightbox.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = planLightbox.querySelector(".plan-lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closePlanLightbox() {
    if (!planLightbox || !planLightboxImg) return;
    planLightbox.hidden = true;
    planLightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (planLastFocus && typeof planLastFocus.focus === "function") {
      planLastFocus.focus();
    }
  }

  function liveMediaUrl(trigger, attr) {
    const video = trigger && trigger.querySelector ? trigger.querySelector("video") : null;
    if (video) {
      const nested = video.querySelector("source");
      const url =
        (nested && (nested.currentSrc || nested.getAttribute("src"))) ||
        video.currentSrc ||
        video.getAttribute("src");
      if (url) return url;
    }
    const img = trigger && trigger.querySelector ? trigger.querySelector("img") : null;
    if (img) {
      const url = img.currentSrc || img.getAttribute("src");
      if (url) return url;
    }
    return (trigger && trigger.getAttribute(attr)) || "";
  }

  document.querySelectorAll("[data-plan-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openPlanLightbox(
        liveMediaUrl(btn, "data-src"),
        btn.getAttribute("data-plan-title"),
        btn
      );
    });
  });

  if (planLightbox) {
    planLightbox.querySelectorAll("[data-plan-close]").forEach((el) => {
      el.addEventListener("click", closePlanLightbox);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && planLightbox && !planLightbox.hidden) {
      closePlanLightbox();
    }
  });

  /* ---------- Scroll-Reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- FAQ-Akkordeon ---------- */
  document.querySelectorAll(".faq__item").forEach((item) => {
    const trigger = item.querySelector(".faq__trigger");
    const panel = item.querySelector(".faq__panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      item.classList.toggle("is-open", !isOpen);
      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  /* ---------- Aktive Sektion in der Navigation ---------- */
  const spyLinks = Array.from(document.querySelectorAll(".nav__track > .nav__link, .nav__item > .nav__link, .nav__list--drawer > li > .nav__link"));
  const sections = [...new Set(
    spyLinks
      .map((a) => {
        const href = a.getAttribute("href") || "";
        const hashIndex = href.indexOf("#");
        if (hashIndex === -1) return null;
        const hash = href.slice(hashIndex);
        if (hash === "#") return null;
        try {
          return document.querySelector(hash);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean)
  )];
  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          spyLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Barrierefreiheit Sidebar ---------- */
  const a11yKey = "juventa-a11y";
  const a11yRoot = document.documentElement;
  const a11yWidget = document.getElementById("a11yWidget");
  const a11yToggle = document.getElementById("a11yToggle");
  const a11yPanel = document.getElementById("a11yPanel");
  const a11yClose = document.getElementById("a11yClose");
  const a11yReset = document.getElementById("a11yReset");
  const a11yFontBtns = document.querySelectorAll(".a11y__font-btn");
  const a11yContrast = document.getElementById("a11yContrast");
  const a11yUnderline = document.getElementById("a11yUnderline");
  const a11yMotion = document.getElementById("a11yMotion");
  const a11yLineHeight = document.getElementById("a11yLineHeight");

  const defaultA11y = {
    font: "normal",
    contrast: false,
    underline: false,
    motion: false,
    lineHeight: false
  };

  const a11yFontScales = { normal: 1, sm: 0.875, lg: 1.125, xl: 1.25 };

  function applyFontScale(font) {
    const scale = a11yFontScales[font] || 1;
    if (scale === 1) {
      a11yRoot.removeAttribute("data-a11y-font");
      a11yRoot.style.zoom = "";
      a11yRoot.style.fontSize = "";
      return;
    }
    a11yRoot.setAttribute("data-a11y-font", font);
    a11yRoot.style.zoom = scale;
    a11yRoot.style.fontSize = "";
  }

  function loadA11y() {
    try {
      return Object.assign({}, defaultA11y, JSON.parse(localStorage.getItem(a11yKey) || "{}"));
    } catch {
      return Object.assign({}, defaultA11y);
    }
  }

  function saveA11y(settings) {
    localStorage.setItem(a11yKey, JSON.stringify(settings));
  }

  function applyA11y(settings) {
    applyFontScale(settings.font || "normal");
    a11yRoot.classList.toggle("a11y-contrast", settings.contrast);
    a11yRoot.classList.toggle("a11y-underline-links", settings.underline);
    a11yRoot.classList.toggle("a11y-reduced-motion", settings.motion);
    a11yRoot.classList.toggle("a11y-line-height", settings.lineHeight);
  }

  function syncA11yUI(settings) {
    a11yFontBtns.forEach((btn) => {
      const active = btn.getAttribute("data-a11y-font") === settings.font;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (a11yContrast) a11yContrast.setAttribute("aria-pressed", settings.contrast ? "true" : "false");
    if (a11yUnderline) a11yUnderline.setAttribute("aria-pressed", settings.underline ? "true" : "false");
    if (a11yMotion) a11yMotion.setAttribute("aria-pressed", settings.motion ? "true" : "false");
    if (a11yLineHeight) a11yLineHeight.setAttribute("aria-pressed", settings.lineHeight ? "true" : "false");
  }

  let a11ySettings = loadA11y();
  applyA11y(a11ySettings);
  syncA11yUI(a11ySettings);

  function openA11y() {
    if (!a11yPanel || !a11yToggle || !a11yWidget) return;
    a11yPanel.hidden = false;
    a11yWidget.classList.add("is-open");
    a11yToggle.setAttribute("aria-expanded", "true");
    a11yToggle.setAttribute("aria-label", "Barrierefreiheit schließen");
    if (a11yClose) a11yClose.focus();
  }

  function closeA11y() {
    if (!a11yPanel || !a11yToggle || !a11yWidget) return;
    a11yPanel.hidden = true;
    a11yWidget.classList.remove("is-open");
    a11yToggle.setAttribute("aria-expanded", "false");
    a11yToggle.setAttribute("aria-label", "Barrierefreiheit öffnen");
    a11yToggle.focus();
  }

  if (a11yToggle) {
    a11yToggle.addEventListener("click", () => {
      a11yPanel.hidden ? openA11y() : closeA11y();
    });
  }
  if (a11yClose) a11yClose.addEventListener("click", closeA11y);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && a11yPanel && !a11yPanel.hidden) closeA11y();
  });

  document.addEventListener("click", (e) => {
    if (!a11yWidget || a11yPanel.hidden) return;
    if (!a11yWidget.contains(e.target)) closeA11y();
  });

  a11yFontBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      a11ySettings.font = btn.getAttribute("data-a11y-font");
      applyA11y(a11ySettings);
      syncA11yUI(a11ySettings);
      saveA11y(a11ySettings);
    });
  });

  function bindA11yToggle(el, key) {
    if (!el) return;
    el.addEventListener("click", () => {
      a11ySettings[key] = !a11ySettings[key];
      applyA11y(a11ySettings);
      syncA11yUI(a11ySettings);
      saveA11y(a11ySettings);
    });
  }

  bindA11yToggle(a11yContrast, "contrast");
  bindA11yToggle(a11yUnderline, "underline");
  bindA11yToggle(a11yMotion, "motion");
  bindA11yToggle(a11yLineHeight, "lineHeight");

  if (a11yReset) {
    a11yReset.addEventListener("click", () => {
      a11ySettings = Object.assign({}, defaultA11y);
      applyA11y(a11ySettings);
      syncA11yUI(a11ySettings);
      localStorage.removeItem(a11yKey);
    });
  }

  /* ---------- Video-Lightbox (Willkommen) ---------- */
  const videoLightbox = document.getElementById("videoLightbox");
  const videoLightboxPlayer = document.getElementById("videoLightboxPlayer");
  const videoTriggers = document.querySelectorAll("[data-video-open]");
  let videoLastFocus = null;

  function openVideoLightbox(src, trigger) {
    if (!videoLightbox || !videoLightboxPlayer || !src) return;
    videoLastFocus = trigger || document.activeElement;
    const preview = trigger?.querySelector(".story__video-preview");
    if (preview) preview.pause();
    videoLightbox.hidden = false;
    document.body.style.overflow = "hidden";
    videoLightboxPlayer.pause();
    videoLightboxPlayer.removeAttribute("src");
    while (videoLightboxPlayer.firstChild) {
      videoLightboxPlayer.removeChild(videoLightboxPlayer.firstChild);
    }
    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    videoLightboxPlayer.appendChild(source);
    videoLightboxPlayer.load();
    const playWhenReady = () => {
      const playPromise = videoLightboxPlayer.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    };
    if (videoLightboxPlayer.readyState >= 3) {
      playWhenReady();
    } else {
      videoLightboxPlayer.addEventListener("canplay", playWhenReady, { once: true });
    }
    const closeBtn = videoLightbox.querySelector(".video-lightbox__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeVideoLightbox() {
    if (!videoLightbox || !videoLightboxPlayer) return;
    videoLightboxPlayer.pause();
    videoLightboxPlayer.removeAttribute("src");
    while (videoLightboxPlayer.firstChild) {
      videoLightboxPlayer.removeChild(videoLightboxPlayer.firstChild);
    }
    videoLightboxPlayer.load();
    videoLightbox.hidden = true;
    document.body.style.overflow = "";
    const preview = videoLastFocus?.querySelector?.(".story__video-preview");
    if (preview && !prefersReduced) {
      preview.play().catch(() => {});
    }
    if (videoLastFocus && typeof videoLastFocus.focus === "function") {
      videoLastFocus.focus();
    }
  }

  videoTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openVideoLightbox(liveMediaUrl(trigger, "data-src"), trigger);
    });
  });

  document.querySelectorAll(".story__video-preview").forEach((preview) => {
    if (prefersReduced) return;
    preview.play().catch(() => {});
  });

  if (videoLightbox) {
    videoLightbox.querySelectorAll("[data-video-close]").forEach((el) => {
      el.addEventListener("click", closeVideoLightbox);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoLightbox && !videoLightbox.hidden) {
      closeVideoLightbox();
    }
  });
})();
