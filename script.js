(function () {
  "use strict";

  var body = document.body;
  var sidebar = document.getElementById("sidebar");
  var menuBtn = document.getElementById("menuBtn");
  var closeBtn = document.getElementById("closeBtn");
  var overlay = document.getElementById("overlay");

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    sidebar.classList.toggle("open", open);
    body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) { closeBtn.focus(); } else if (window.matchMedia("(max-width: 960px)").matches) { menuBtn.focus({ preventScroll: true }); }
  }
  menuBtn.addEventListener("click", function () { setMenu(!sidebar.classList.contains("open")); });
  closeBtn.addEventListener("click", function () { setMenu(false); });
  overlay.addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("open")) setMenu(false);
  });
  // Close the drawer when a section link is tapped
  sidebar.querySelectorAll(".side-nav a").forEach(function (a) {
    a.addEventListener("click", function () {
      if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        body.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    });
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 960 && sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
      body.classList.remove("menu-open");
    }
  });

  /* ---------- Active section highlight ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll("[data-section]"));
  var topLinks = Array.prototype.slice.call(document.querySelectorAll(".topnav a, .side-nav a"));

  function setActive(id) {
    topLinks.forEach(function (a) {
      var match = a.getAttribute("href") === "#" + id;
      a.classList.toggle("active", match);
      if (match) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }

  function onScroll() {
    var y = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0].id;
    sections.forEach(function (s) { if (s.offsetTop <= y) current = s.id; });
    // bottom of page → last section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }
    setActive(current);
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Rotating role text ---------- */
  var swap = document.getElementById("swap");
  var roles = ["Full-Stack Developer", "Graphic Designer", "Email Developer", "Problem Solver"];
  if (swap && !reduce) {
    var r = 0;
    setInterval(function () {
      swap.classList.add("out");
      setTimeout(function () {
        r = (r + 1) % roles.length;
        swap.textContent = roles[r];
        swap.classList.remove("out");
      }, 350);
    }, 2800);
  }

  /* ---------- Contact form → WhatsApp ---------- */
  var form = document.getElementById("contactForm");
  var err = document.getElementById("formError");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements["name"].value.trim();
      var msg = form.elements["message"].value.trim();
      if (!name || !msg) { err.hidden = false; return; }
      err.hidden = true;
      var text = "Hi Godwin, my name is " + name + ".\n\n" + msg;
      window.open("https://wa.me/2347046594823?text=" + encodeURIComponent(text), "_blank", "noopener");
    });
  }

  /* ---------- Footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
