/* Standortkarte · Über Juventa */
(function () {
  "use strict";

  var root = document.getElementById("uj-locations");
  if (!root) return;

  var map = root.querySelector(".uj-map");
  var regions = root.querySelectorAll(".uj-map-region[data-loc]");
  var places = root.querySelectorAll(".uj-place[data-loc]");
  var legendItems = root.querySelectorAll(".uj-map-legend__item[data-loc]");
  if (!regions.length || !places.length) return;

  var activeLoc = null;

  function setActive(loc, hovering) {
    activeLoc = loc || null;

    var mapHover = Boolean(hovering) && loc && loc !== "rastatt";
    var expandLoc = loc && loc !== "rastatt" ? loc : null;

    regions.forEach(function (region) {
      var on = region.getAttribute("data-loc") === loc;
      region.classList.toggle("is-active", on);
      if (on && region.parentNode) {
        region.parentNode.appendChild(region);
      }
    });

    places.forEach(function (place) {
      place.classList.toggle("is-active", place.getAttribute("data-loc") === expandLoc);
    });

    legendItems.forEach(function (item) {
      item.classList.toggle("is-active", item.getAttribute("data-loc") === loc);
    });

    if (map) {
      map.classList.toggle("is-hovering", mapHover);
    }
  }

  function clearExpand() {
    places.forEach(function (place) {
      place.classList.remove("is-active");
    });
    regions.forEach(function (region) {
      region.classList.remove("is-active");
    });
    legendItems.forEach(function (item) {
      item.classList.remove("is-active");
    });
    if (map) map.classList.remove("is-hovering");
    activeLoc = null;
  }

  regions.forEach(function (region) {
    var loc = region.getAttribute("data-loc");
    if (loc === "rastatt") return;

    region.addEventListener("mouseenter", function () {
      setActive(loc, true);
    });

    region.addEventListener("focus", function () {
      setActive(loc, true);
    });

    region.addEventListener("click", function () {
      setActive(loc, true);
    });

    region.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setActive(loc, true);
      }
    });
  });

  places.forEach(function (place) {
    var loc = place.getAttribute("data-loc");

    place.addEventListener("mouseenter", function () {
      setActive(loc, true);
    });

    place.addEventListener("focusin", function () {
      setActive(loc, true);
    });
  });

  legendItems.forEach(function (item) {
    var loc = item.getAttribute("data-loc");
    item.addEventListener("mouseenter", function () {
      setActive(loc, loc !== "rastatt");
    });
    item.addEventListener("focus", function () {
      setActive(loc, loc !== "rastatt");
    });
    item.addEventListener("click", function () {
      setActive(loc, loc !== "rastatt");
    });
  });

  if (map) {
    map.addEventListener("mouseleave", function (event) {
      if (root.contains(event.relatedTarget)) return;
      clearExpand();
    });
  }

  root.addEventListener("mouseleave", function () {
    clearExpand();
  });

  setActive(null, false);
})();
