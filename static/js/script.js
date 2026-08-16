/* ==========================================================================
   CREATIVE PORTFOLIO — script.js
   Escrito em ES5 (var, function) para manter compatibilidade com WebViews
   antigas do Android, incluindo o navegador usado pelo Pydroid 3.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     EDIÇÃO RÁPIDA — troque aqui seus trabalhos e links sociais
     ------------------------------------------------------------------ */

  // Adicione/remova projetos livremente. type pode ser "image" ou "video".
  var projects = [
    {
      type: "video",
      src: "/static/videos/projeto1.mp4",
      title: "Billie Edit"
    },
    {
      type: "image",
      src: "/static/images/projeto2.png",
      title: "Swag Montage"
    },
    {
      type: "video",
      src: "/static/videos/projeto3.mp4",
      title: "Peter Edit"
    },
    {
      type: "image",
      src: "/static/images/projeto4.png",
      title: "Your Turn Montage"
    },
    {
      type: "video",
      src: "/static/videos/projeto5.mp4",
      title: "Lia Edit"
    }
    ];

  // Troque "#" pelos seus links reais.
  var socialLinks = {
    instagram: "https://www.instagram.com/vitorr.mp?igsh=b2xjeHltYmMweWU1",
    linkedin: "https://www.linkedin.com/in/vitor-mendes-padovani-a8b4b4383?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    email: "vitormendespadovani022@gmail.com"
  };

  /* ------------------------------------------------------------------
     UTIL
     ------------------------------------------------------------------ */

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) {
    var list = (ctx || document).querySelectorAll(sel);
    return Array.prototype.slice.call(list);
  }
  function on(el, evt, fn, opts) {
    if (el) el.addEventListener(evt, fn, opts || false);
  }

  /* ------------------------------------------------------------------
     LOADER
     ------------------------------------------------------------------ */

  function initLoader() {
    var loader = qs("#loader");
    window.addEventListener("load", function () {
      setTimeout(function () {
        if (loader) loader.className = "loader is-hidden";
        document.documentElement.className += " loaded";
      }, 500);
    });
  }

  /* ------------------------------------------------------------------
     CURSOR PERSONALIZADO
     ------------------------------------------------------------------ */

  function initCursor() {
    var dot = qs("#cursorDot");
    var ring = qs("#cursorRing");
    if (!dot || !ring) return;
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;

    var mx = 0, my = 0, rx = 0, ry = 0;

    on(document, "mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    var interactive = qsa("a, button, .skill-card, .glass-card");
    for (var i = 0; i < interactive.length; i++) {
      on(interactive[i], "mouseenter", function () { ring.className = "cursor-ring is-active"; });
      on(interactive[i], "mouseleave", function () { ring.className = "cursor-ring"; });
    }
  }

  /* ------------------------------------------------------------------
     NAVBAR (scroll state, menu mobile, link ativo)
     ------------------------------------------------------------------ */

  function initNavbar() {
    var navbar = qs("#navbar");
    var toggle = qs("#navToggle");
    var links = qs("#navLinks");
    var navLinkEls = qsa("[data-nav]");

    on(window, "scroll", function () {
      if (window.scrollY > 40) {
        navbar.className = "navbar is-scrolled";
      } else {
        navbar.className = "navbar";
      }
      updateActiveLink();
    });

    on(toggle, "click", function () {
      var open = links.className.indexOf("is-open") !== -1;
      links.className = open ? "nav-links" : "nav-links is-open";
      toggle.className = open ? "nav-toggle" : "nav-toggle is-open";
    });

    for (var i = 0; i < navLinkEls.length; i++) {
      on(navLinkEls[i], "click", function () {
        links.className = "nav-links";
        toggle.className = "nav-toggle";
      });
    }

    var sections = qsa(".section[id]");

    function updateActiveLink() {
      var scrollPos = window.scrollY + window.innerHeight * 0.35;
      var current = "";
      for (var i = 0; i < sections.length; i++) {
        var sec = sections[i];
        if (scrollPos >= sec.offsetTop) {
          current = sec.id;
        }
      }
      for (var j = 0; j < navLinkEls.length; j++) {
        var isActive = navLinkEls[j].getAttribute("href") === "#" + current;
        navLinkEls[j].className = isActive ? "nav-link is-active" : "nav-link";
      }
    }
  }

  /* ------------------------------------------------------------------
     REVEAL ON SCROLL (com fallback caso IntersectionObserver não exista)
     ------------------------------------------------------------------ */

  function initReveal() {
    var targets = qsa(".fade-in-up, .reveal-up, .reveal-title .line");
    var titleLines = qsa(".hero-title .line");

    // hero entra sozinho, um pouco depois do loader
    setTimeout(function () {
      for (var i = 0; i < titleLines.length; i++) {
        (function (el) {
          setTimeout(function () { el.className += " in-view"; }, 0);
        })(titleLines[i]);
      }
      var heroExtras = qsa(".hero .reveal-up");
      for (var j = 0; j < heroExtras.length; j++) {
        heroExtras[j].className += " in-view";
      }
    }, 550);

    var scrollTargets = qsa(".fade-in-up");

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.className += " in-view";
            observer.unobserve(entries[i].target);
          }
        }
      }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

      for (var k = 0; k < scrollTargets.length; k++) {
        observer.observe(scrollTargets[k]);
      }
    } else {
      // fallback simples: verifica no scroll
      function checkVisible() {
        var winBottom = window.scrollY + window.innerHeight;
        for (var i = 0; i < scrollTargets.length; i++) {
          var el = scrollTargets[i];
          var top = el.getBoundingClientRect().top + window.scrollY;
          if (winBottom > top + 60 && el.className.indexOf("in-view") === -1) {
            el.className += " in-view";
          }
        }
      }
      on(window, "scroll", checkVisible);
      checkVisible();
    }
  }

  /* ------------------------------------------------------------------
     SKILL CARDS — brilho seguindo o cursor
     ------------------------------------------------------------------ */

  function initSkillGlow() {
    var cards = qsa(".skill-card");
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        on(card, "mousemove", function (e) {
          var rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
          card.style.setProperty("--my", (e.clientY - rect.top) + "px");
        });
      })(cards[i]);
    }
  }

  /* ------------------------------------------------------------------
     GALERIA NO CELULAR 3D
     ------------------------------------------------------------------ */

  function initPhoneGallery() {
    var mediaEl = qs("#phoneMedia");
    var titleEl = qs("#phoneTitle");
    var indexEl = qs("#phoneIndex");
    var prevBtn = qs("#prevWork");
    var nextBtn = qs("#nextWork");
    var playBtn = qs("#phonePlayPause");
    var screenEl = qs("#phoneScreen");
    var thumbsWrap = qs("#worksThumbs");
    var phone = qs("#phone");

    if (!mediaEl || projects.length === 0) return;

    var current = 0;

    function currentVideo() {
      return mediaEl.querySelector("video");
    }

    function render() {
      var item = projects[current];
      mediaEl.innerHTML = "";
      playBtn.hidden = true; // sempre começa escondido ao trocar de projeto

      if (item.type === "video") {
        var video = document.createElement("video");
        video.src = item.src;
        video.setAttribute("playsinline", "");
        video.loop = true; // fica em replay sozinho enquanto não for pausado
        mediaEl.appendChild(video);
      } else {
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = item.title;
        img.onerror = function () {
          // placeholder visual caso a imagem ainda não exista
          mediaEl.style.background = "linear-gradient(155deg, #1a1a1a, #060606)";
        };
        mediaEl.appendChild(img);
      }

      titleEl.textContent = item.title;
      indexEl.textContent = pad(current + 1) + " / " + pad(projects.length);

      var thumbs = qsa(".work-thumb", thumbsWrap);
      for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].className = i === current ? "work-thumb is-active" : "work-thumb";
      }
    }

    // Registrados UMA única vez (fora do render) — evitava o bug de duplicar
    // listeners a cada troca de projeto, que fazia vídeos travarem/não tocarem.

    // Clicar no botão: dá play e o botão some (só aparece de novo quando pausado).
    on(playBtn, "click", function (e) {
      e.stopPropagation();
      var vid = currentVideo();
      if (!vid) return;
      vid.play();
      playBtn.hidden = true;
    });

    // Clicar em qualquer outro ponto da tela do celular:
    // se estava tocando, pausa e mostra o botão; se já estava pausado, só mostra o botão.
    on(screenEl, "click", function (e) {
      if (e.target === playBtn || playBtn.contains(e.target)) return;
      var vid = currentVideo();
      if (!vid) return;
      if (!vid.paused) { vid.pause(); }
      playBtn.hidden = false;
    });

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function go(delta) {
      current = (current + delta + projects.length) % projects.length;
      render();
    }

    function buildThumbs() {
      thumbsWrap.innerHTML = "";
      for (var i = 0; i < projects.length; i++) {
        (function (item, idx) {
          var thumb = document.createElement("button");
          thumb.className = idx === 0 ? "work-thumb is-active" : "work-thumb";
          thumb.setAttribute("aria-label", item.title);

          if (item.type === "image") {
            var img = document.createElement("img");
            img.src = item.src;
            img.alt = item.title;
            thumb.appendChild(img);
          } else {
            thumb.style.background = "linear-gradient(155deg,#222,#050505)";
          }

          on(thumb, "click", function () { current = idx; render(); });
          thumbsWrap.appendChild(thumb);
        })(projects[i], i);
      }
    }

    on(prevBtn, "click", function () { go(-1); });
    on(nextBtn, "click", function () { go(1); });

    // swipe touch no celular
    var touchStartX = 0;
    on(phone, "touchstart", function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    on(phone, "touchend", function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); }
    }, { passive: true });

    // Celular fica estático — sem tilt 3D ao passar o cursor.
    // O ângulo 3D fixo continua vindo do CSS (.phone { transform: ... }).

    buildThumbs();
    render();
  }

  /* ------------------------------------------------------------------
     LINKS SOCIAIS
     ------------------------------------------------------------------ */

  function initSocialLinks() {
    var links = qsa("[data-social]");
    for (var i = 0; i < links.length; i++) {
      var key = links[i].getAttribute("data-social");
      if (socialLinks[key]) {
        links[i].setAttribute("href", socialLinks[key]);
        if (key === "email" && socialLinks[key] !== "#") {
          links[i].setAttribute("href", "mailto:" + socialLinks[key]);
        }
      }
    }
  }

  /* ------------------------------------------------------------------
     RODAPÉ — ano atual
     ------------------------------------------------------------------ */

  function initFooterYear() {
    var yearEl = qs("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------
     INIT
     ------------------------------------------------------------------ */

  document.addEventListener("DOMContentLoaded", function () {
    initLoader();
    initCursor();
    initNavbar();
    initReveal();
    initSkillGlow();
    initPhoneGallery();
    initSocialLinks();
    initFooterYear();
  });

})();