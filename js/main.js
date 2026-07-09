/* =========================================================
   JUVENTA · Brückenmühle Gernsbach – Interaktionen
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const navLinks = document.querySelectorAll(".nav__link, .nav__cta");

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
  const spyLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = [...new Set(
    spyLinks
      .map((a) => document.querySelector(a.getAttribute("href")))
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
})();
