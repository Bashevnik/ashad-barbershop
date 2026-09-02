/* ASHAD BARBERSHOP — вся логіка сайту.
   Бібліотеки лежать локально: js/lib/gsap.min.js, ScrollTrigger, lax.min.js */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ───────────────────────────────────────────
     1. ЗАВІСА МІЖ СТОРІНКАМИ
     Розмітка завіси є в HTML, стилі — у style.css,
     тому вона намальована з першого кадру і контент
     не блимає. Без JS завіса схована через .no-js.
     ─────────────────────────────────────────── */
  var curtain = document.getElementById("curtain");
  var LIFT = reduce ? 0 : 460;   // скільки тримаємо завісу після завантаження
  var DROP = reduce ? 0 : 420;   // скільки опускаємо перед переходом

  function lift() {
    root.classList.remove("is-leaving");
    root.classList.add("is-ready");
  }

  if (document.readyState === "complete") {
    setTimeout(lift, 60);
  } else {
    window.addEventListener("load", function () { setTimeout(lift, LIFT); });
    // страховка, якщо якесь відео/фото зависло
    setTimeout(lift, 2600);
  }

  // повернення "назад" з bfcache — завіса має бути піднята
  window.addEventListener("pageshow", function (e) { if (e.persisted) lift(); });

  var prefetched = {};
  function prefetch(href) {
    if (prefetched[href]) return;
    prefetched[href] = true;
    var l = document.createElement("link");
    l.rel = "prefetch";
    l.href = href;
    document.head.appendChild(l);
  }

  function isInternal(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    if (a.origin !== location.origin) return false;
    if (a.pathname === location.pathname && a.hash) return false;
    return /\.html?$/.test(a.pathname) || a.pathname === "/" || a.pathname.slice(-1) === "/";
  }

  document.addEventListener("mouseover", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (isInternal(a)) prefetch(a.href);
  });
  document.addEventListener("touchstart", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (isInternal(a)) prefetch(a.href);
  }, { passive: true });

  document.addEventListener("click", function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    var a = e.target.closest && e.target.closest("a");
    if (!isInternal(a)) return;
    if (a.pathname === location.pathname) return;
    e.preventDefault();
    prefetch(a.href);
    root.classList.remove("is-ready");
    root.classList.add("is-leaving");
    setTimeout(function () { location.href = a.href; }, DROP);
  });

  /* ───────────────────────────────────────────
     2. МОБІЛЬНЕ МЕНЮ
     ─────────────────────────────────────────── */
  var burger = document.querySelector(".burger");
  var scrim = document.querySelector(".scrim");

  function menu(open) {
    document.body.classList.toggle("is-menu", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (burger) {
    burger.addEventListener("click", function () {
      menu(!document.body.classList.contains("is-menu"));
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { menu(false); });
    });
    if (scrim) scrim.addEventListener("click", function () { menu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") menu(false);
    });
    // повернулись на широкий екран — меню більше не потрібне
    var wide = window.matchMedia("(min-width: 901px)");
    (wide.addEventListener ? wide.addEventListener.bind(wide, "change") : wide.addListener.bind(wide))(
      function (e) { if (e.matches) menu(false); }
    );
  }

  /* ───────────────────────────────────────────
     3. СТРІЧКА ВЕРТИКАЛЬНИХ ВІДЕО
     — src підставляємо тільки коли картка близько
     — грає лише те, що видно
     — тягнеться мишею і крутиться колесом
     ─────────────────────────────────────────── */
  var track = document.querySelector(".reel__track");
  if (track) {
    var cards = Array.prototype.slice.call(track.querySelectorAll("video"));

    // ліниве підвантаження
    var loader = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting && !v.src) {
          v.src = v.dataset.src;
          v.load();
        }
      });
    }, { root: track, rootMargin: "60% 0px" });

    // програвання лише видимого
    var player = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.intersectionRatio > 0.55) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { root: track, threshold: [0, 0.55, 1] });

    cards.forEach(function (v) { loader.observe(v); player.observe(v); });

    // перетягування мишею
    var down = false, startX = 0, startLeft = 0, moved = 0;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      down = true; moved = 0;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add("is-drag");
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      track.scrollLeft = startLeft - dx;
    });
    function up(e) {
      if (!down) return;
      down = false;
      track.classList.remove("is-drag");
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
    track.addEventListener("click", function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // колесо миші — горизонтально
    track.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var max = track.scrollWidth - track.clientWidth;
      var next = track.scrollLeft + e.deltaY;
      if (next > 0 && next < max) {
        e.preventDefault();
        track.scrollLeft = next;
      }
    }, { passive: false });
  }

  /* ───────────────────────────────────────────
     4. ПОЯВА БЛОКІВ + ПАРАЛАКС ДЕКОРУ
     ─────────────────────────────────────────── */
  if (!reduce && window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".reveal").forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        delay: (i % 3) * 0.06,
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    // рядок прайсу заповнюється зліва направо
    gsap.utils.toArray(".price li").forEach(function (li) {
      gsap.from(li, {
        opacity: 0, x: -18, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: li, start: "top 92%", once: true }
      });
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }

  if (!reduce && window.lax) {
    lax.init();
    lax.addDriver("scrollY", function () { return window.scrollY; });
    lax.addElements(".lax-slow", {
      scrollY: { translateY: [["elInY", "elOutY"], [40, -40]] }
    });
    lax.addElements(".lax-spin", {
      scrollY: { rotate: [["elInY", "elOutY"], [-6, 6]] }
    });
  }

  /* ───────────────────────────────────────────
     5. РІК У ПІДВАЛІ
     ─────────────────────────────────────────── */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
