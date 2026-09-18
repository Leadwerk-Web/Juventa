(function () {
  try {
    var s = JSON.parse(localStorage.getItem("juventa-a11y") || "{}");
    var root = document.documentElement;
    var scales = { sm: 0.875, lg: 1.125, xl: 1.25 };
    if (s.font && s.font !== "normal" && scales[s.font]) {
      root.setAttribute("data-a11y-font", s.font);
      root.style.zoom = scales[s.font];
    }
    if (s.contrast) root.classList.add("a11y-contrast");
    if (s.underline) root.classList.add("a11y-underline-links");
    if (s.motion) root.classList.add("a11y-reduced-motion");
    if (s.lineHeight) root.classList.add("a11y-line-height");
  } catch (e) {}
})();
