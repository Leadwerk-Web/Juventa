(function () {
  "use strict";

  var searchInput = document.getElementById("faqSearch");
  var filterRoot = document.getElementById("faqFilters");
  var list = document.getElementById("faqDirectoryList");
  var empty = document.getElementById("faqEmpty");
  var countEl = document.getElementById("faqResultCount");
  if (!list) return;

  var items = Array.prototype.slice.call(list.querySelectorAll(".faq__item"));
  var activeCat = "alle";
  var query = "";

  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss");
  }

  function itemText(item) {
    return normalize(item.textContent);
  }

  function update() {
    var visible = 0;
    var q = normalize(query).trim();
    items.forEach(function (item) {
      var cats = (item.getAttribute("data-cat") || "").split(/\s+/);
      var catOk = activeCat === "alle" || cats.indexOf(activeCat) !== -1;
      var textOk = !q || itemText(item).indexOf(q) !== -1;
      var show = catOk && textOk;
      item.hidden = !show;
      item.classList.toggle("is-filtered-out", !show);
      if (show) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
    if (countEl) {
      countEl.textContent =
        visible === 1 ? "1 Frage" : visible + " Fragen";
    }
  }

  if (filterRoot) {
    filterRoot.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-faq-filter]");
      if (!btn) return;
      activeCat = btn.getAttribute("data-faq-filter") || "alle";
      filterRoot.querySelectorAll("[data-faq-filter]").forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      update();
    });
  }

  if (searchInput) {
    var scrolledForSearch = false;
    searchInput.addEventListener("input", function () {
      query = searchInput.value || "";
      update();
      if (!query.trim()) {
        scrolledForSearch = false;
        return;
      }
      if (!scrolledForSearch && query.trim().length > 1) {
        scrolledForSearch = true;
        var dir = document.getElementById("faq-verzeichnis");
        if (dir) {
          var top = dir.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      }
    });
  }

  var searchForm = document.querySelector(".faq-search");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  document.querySelectorAll("[data-faq-open]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var id = el.getAttribute("data-faq-open");
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      if (filterRoot) {
        activeCat = "alle";
        filterRoot.querySelectorAll("[data-faq-filter]").forEach(function (b) {
          var on = b.getAttribute("data-faq-filter") === "alle";
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
      }
      if (searchInput) {
        searchInput.value = "";
        query = "";
      }
      update();

      var trigger = target.querySelector(".faq__trigger");
      var panel = target.querySelector(".faq__panel");
      if (trigger && panel && !target.classList.contains("is-open")) {
        target.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  update();
})();
