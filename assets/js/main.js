/* مكتب المستشار جمال عبدالناصر صادق — interactions */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var CFG = window.SITE_CONFIG || {};
  var T = window.I18N || { media: {}, contact: {} };
  var RTL = root.dir === "rtl";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var ROOT_PREFIX = (function () { var s = $('script[src$="assets/js/main.js"]'); return s ? s.getAttribute("src").replace("assets/js/main.js", "") : ""; })();
  window.__siteReady = true;

  /* ---------- loader ---------- */
  function done() { root.classList.add("loaded"); }
  if (doc.readyState === "complete") setTimeout(done, 300);
  else { window.addEventListener("load", function () { setTimeout(done, 350); }); setTimeout(done, 2200); }

  /* ---------- word split ---------- */
  $$("[data-split]").forEach(function (el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/), frag = doc.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(doc.createTextNode(" ")); return; }
            var s = doc.createElement("span"); s.className = "w"; s.textContent = p; s.style.setProperty("--wi", i++); frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  });
  // stagger hero lines
  $$(".hero-title .line").forEach(function (l, k) { l.style.setProperty("--d0", (0.25 + k * 0.18) + "s"); });

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$("[data-reveal],[data-split],.hero-visual,[data-steps]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          if (e.target.hasAttribute("data-steps")) e.target.style.setProperty("--sp", 1);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); el.style.setProperty("--sp", 1); });
  }

  /* ---------- counters ---------- */
  function countUp(el) {
    var end = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce || end < 3) { el.textContent = end; return; }
    var t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$(".count").forEach(function (c) { cio.observe(c); });
  }

  /* ---------- header, progress, mobile CTA ---------- */
  var prog = $(".progress span"), hero = $(".hero");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    root.classList.toggle("scrolled", y > 30);
    var h = doc.documentElement.scrollHeight - window.innerHeight;
    if (prog) prog.style.setProperty("--p", h > 0 ? (y / h).toFixed(4) : 0);
    root.classList.toggle("show-cta", hero ? y > hero.offsetHeight * 0.7 : y > 400);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- active nav ---------- */
  var navLinks = $$(".nav a[data-nav]");
  if (navLinks.length && "IntersectionObserver" in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute("data-nav")] = a; });
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          navLinks.forEach(function (a) { a.classList.remove("is-active"); });
          map[e.target.id].classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var s = doc.getElementById(id); if (s) nio.observe(s); });
  }

  /* ---------- mobile drawer ---------- */
  var burger = $(".burger"), drawer = $("#drawer");
  function setMenu(open) {
    if (!drawer) return;
    if (open) { drawer.hidden = false; requestAnimationFrame(function () { root.classList.add("menu-open"); }); }
    else { root.classList.remove("menu-open"); setTimeout(function () { if (!root.classList.contains("menu-open")) drawer.hidden = true; }, 400); }
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    doc.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", function () { setMenu(!root.classList.contains("menu-open")); });
  if (drawer) drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("menu-open")) setMenu(false); });

  /* ---------- spotlight cards ---------- */
  if (finePointer) {
    $$("[data-spot]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
    /* magnetic buttons */
    if (!reduce) $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.18) + "px," + ((e.clientY - r.top - r.height / 2) * 0.25) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    /* hero tilt */
    var tilt = $("[data-tilt]");
    if (tilt && hero && !reduce) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = "perspective(900px) rotateY(" + (x * 7) + "deg) rotateX(" + (-y * 6) + "deg)";
      });
      hero.addEventListener("pointerleave", function () { tilt.style.transform = ""; });
    }
  }

  /* ---------- gold dust canvas ---------- */
  $$(".hero-dust").forEach(function (cv) {
    var ctx = cv.getContext("2d"); if (!ctx) return;
    var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), parts = [], running = true;
    function size() {
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, W * H / 16000));
      parts = []; for (var i = 0; i < n; i++) parts.push(make(true));
    }
    function make(any) {
      return { x: Math.random() * W, y: any ? Math.random() * H : H + 10, r: Math.random() * 1.6 + 0.3,
        vy: -(Math.random() * 0.25 + 0.06), vx: (Math.random() - 0.5) * 0.12, a: Math.random() * 0.6 + 0.15, tw: Math.random() * Math.PI * 2 };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy; p.tw += 0.02;
        if (p.y < -10) parts[i] = p = make(false);
        var al = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(227,198,138," + al.toFixed(3) + ")";
        ctx.shadowColor = "rgba(197,161,90,.8)"; ctx.shadowBlur = 6; ctx.fill();
      }
      if (running && !reduce) requestAnimationFrame(draw);
    }
    size(); draw();
    window.addEventListener("resize", function () { size(); if (reduce) draw(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) {
      var vis = en[0].isIntersecting; if (vis && !running) { running = true; draw(); } running = vis;
    }).observe(cv);
  });

  /* ---------- YouTube IFrame API loader ---------- */
  var ytQueue = [], ytLoading = false, ytPlayers = [];
  function withYT(cb) {
    if (window.YT && window.YT.Player) return cb();
    ytQueue.push(cb);
    if (ytLoading) return; ytLoading = true;
    var prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () { if (prev) prev(); ytQueue.splice(0).forEach(function (f) { f(); }); };
    var s = doc.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; s.async = true; doc.head.appendChild(s);
  }
  function pauseOthers(except) {
    ytPlayers.forEach(function (p) { if (p !== except && p.pauseVideo) try { p.pauseVideo(); } catch (e) {} });
    $$(".reel iframe[data-ext]").forEach(function (f) { if (!except || f !== except) { /* external players: reset */ } });
  }
  function ytPlaylistPlayer(host, lists, index) {
    withYT(function () {
      var k = 0;
      var p = new YT.Player(host, {
        width: "100%", height: "100%",
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, autoplay: 1 },
        events: {
          onReady: function (e) { e.target.loadPlaylist({ list: lists[0], listType: "playlist", index: index || 0 }); },
          onError: function (e) { k++; if (k < lists.length) e.target.loadPlaylist({ list: lists[k], listType: "playlist", index: index || 0 }); },
          onStateChange: function (e) { if (e.data === 1) pauseOthers(p); }
        }
      });
      ytPlayers.push(p);
    });
  }
  var CID = (CFG.youtubeChannelId || "").replace(/^UC/, "");

  /* ---------- reels ---------- */
  var track = $(".reels-track");
  function parseReel(url) {
    var m;
    if ((m = url.match(/youtube\.com\/shorts\/([\w-]{11})/) || url.match(/youtu\.be\/([\w-]{11})/) || url.match(/[?&]v=([\w-]{11})/)))
      return { p: "youtube", src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&playsinline=1&rel=0", poster: "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg" };
    if ((m = url.match(/tiktok\.com\/.*\/video\/(\d+)/)))
      return { p: "tiktok", src: "https://www.tiktok.com/player/v1/" + m[1] + "?autoplay=1&rel=0" };
    if ((m = url.match(/instagram\.com\/(?:reel|reels|p)\/([\w-]+)/)))
      return { p: "instagram", src: "https://www.instagram.com/reel/" + m[1] + "/embed" };
    if (/facebook\.com|fb\.watch/.test(url))
      return { p: "facebook", src: "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(url) + "&show_text=false&autoplay=true" };
    return null;
  }
  var PLAT = {
    youtube: ["YouTube Shorts", '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/></svg>'],
    tiktok: ["TikTok", '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3h-3.1v12.3a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.5a5.9 5.9 0 1 0 5 5.8V9.1a7.6 7.6 0 0 0 4.4 1.4V7.4a4.4 4.4 0 0 1-4.4-4.4z"/></svg>'],
    instagram: ["Instagram Reels", '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/></svg>'],
    facebook: ["Facebook Reels", '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z"/></svg>']
  };
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.4-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5z"/></svg>';

  if (track) {
    var items = (CFG.reels || []).filter(function (r) { return r && r.url; }).map(function (r) {
      var p = parseReel(r.url); return p ? { kind: "url", p: p.p, src: p.src, poster: p.poster, title: r.title, url: r.url } : null;
    }).filter(Boolean);
    if (!items.length && CID) {
      for (var i = 0; i < (CFG.autoReelsCount || 6); i++) items.push({ kind: "auto", p: "youtube", index: i });
    }
    var posters = (CFG.reelPosters || []).map(function (p) { return ROOT_PREFIX + p; });
    var html = "";
    items.forEach(function (it, i) {
      var poster = it.poster || posters[i % Math.max(1, posters.length)] || "";
      var num = (i + 1 < 10 ? "0" : "") + (i + 1);
      var title = it.title || (T.media.reel + " " + num);
      html += '<article class="reel" data-i="' + i + '">' +
        '<button type="button" class="reel-poster" aria-label="' + T.media.play + ': ' + title.replace(/"/g, "&quot;") + '">' +
        '<img src="' + poster + '" alt="" loading="lazy" width="540" height="960">' +
        '<span class="reel-play">' + PLAY + '</span>' +
        '<span class="reel-num">' + num + '</span>' +
        '<span class="reel-meta"><span class="reel-plat">' + PLAT[it.p][1] + PLAT[it.p][0] + '</span><span class="reel-title">' + title + '</span></span>' +
        '</button></article>';
    });
    track.innerHTML = html;
    var reels = $$(".reel", track), dots = $(".reels-dots");
    if (dots) dots.innerHTML = reels.map(function () { return "<i></i>"; }).join("");
    var dotEls = dots ? $$("i", dots) : [];

    function playReel(card) {
      var it = items[+card.getAttribute("data-i")];
      if (card.querySelector("iframe,.yt-host")) return;
      pauseOthers(null);
      if (it.kind === "auto") {
        var host = doc.createElement("div"); host.className = "yt-host"; card.appendChild(host);
        ytPlaylistPlayer(host, ["UUSH" + CID, "UU" + CID], it.index);
      } else {
        var f = doc.createElement("iframe");
        f.src = it.src; f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen"); f.setAttribute("allowfullscreen", ""); f.setAttribute("data-ext", "");
        f.title = it.title || PLAT[it.p][0]; f.loading = "lazy"; card.appendChild(f);
      }
    }
    track.addEventListener("click", function (e) {
      var btn = e.target.closest(".reel-poster"); if (!btn || moved) return;
      var card = btn.closest(".reel");
      if (!card.classList.contains("is-center")) { center(card); }
      playReel(card);
    });
    function center(card) { card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", inline: "center", block: "nearest" }); }
    var current = 0;
    function updateCenter() {
      var r = track.getBoundingClientRect(), mid = r.left + r.width / 2, best = 0, bd = 1e9;
      reels.forEach(function (c, i) { var cr = c.getBoundingClientRect(), d = Math.abs(cr.left + cr.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
      current = best;
      reels.forEach(function (c, i) { c.classList.toggle("is-center", i === best); });
      dotEls.forEach(function (d, i) { d.classList.toggle("on", i === best); });
    }
    var raf; track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(updateCenter); }, { passive: true });
    window.addEventListener("resize", updateCenter);
    $$("[data-reels]").forEach(function (b) {
      b.addEventListener("click", function () {
        var dir = b.getAttribute("data-reels") === "next" ? 1 : -1;
        var n = Math.max(0, Math.min(reels.length - 1, current + dir));
        center(reels[n]);
      });
    });
    track.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      var fwd = (e.key === "ArrowRight") !== RTL ? 1 : -1;
      center(reels[Math.max(0, Math.min(reels.length - 1, current + fwd))]);
    });
    // mouse drag
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    window.addEventListener("pointermove", function (e) {
      if (!down) return; var dx = e.clientX - sx;
      if (Math.abs(dx) > 6) { moved = true; track.classList.add("dragging"); }
      track.scrollLeft = sl - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!down) return; down = false; track.classList.remove("dragging");
      if (moved) { center(reels[current]); setTimeout(function () { moved = false; }, 50); }
    });
    // start on the 2nd card on wide screens for a "carousel" feel
    setTimeout(function () { updateCenter(); }, 60);
  }

  /* ---------- big YouTube player ---------- */
  var yt = $("[data-yt]");
  if (yt && CID) {
    $(".yt-play", yt).addEventListener("click", function () {
      var host = doc.createElement("div"); host.className = "yt-host"; yt.appendChild(host);
      $(".yt-play", yt).hidden = true;
      ytPlaylistPlayer(host, ["UULF" + CID, "UU" + CID], 0);
    });
  }

  /* ---------- map (lazy) ---------- */
  $$("[data-map]").forEach(function (m) {
    function load() {
      if (m.querySelector("iframe")) return;
      var f = doc.createElement("iframe");
      f.src = "https://maps.google.com/maps?q=" + encodeURIComponent(m.getAttribute("data-map")) + "&z=16&hl=" + (T.lang || "ar") + "&output=embed";
      f.loading = "lazy"; f.title = "Map"; f.referrerPolicy = "no-referrer-when-downgrade";
      m.appendChild(f); var b = $(".map-load", m); if (b) b.hidden = true;
    }
    $(".map-load", m).addEventListener("click", load);
    if ("IntersectionObserver" in window) {
      var mio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { load(); mio.disconnect(); } }, { rootMargin: "200px" });
      mio.observe(m);
    }
  });

  /* ---------- copy ---------- */
  $$("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = b.getAttribute("data-copy"), label = b.textContent;
      function ok() { b.textContent = T.contact.copied || "✓"; setTimeout(function () { b.textContent = label; }, 1600); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, fallback); else fallback();
      function fallback() { var ta = doc.createElement("textarea"); ta.value = txt; doc.body.appendChild(ta); ta.select(); try { doc.execCommand("copy"); ok(); } catch (e) {} ta.remove(); }
    });
  });

  /* ---------- preselect service ---------- */
  var form = $("#consult-form"), sel = $("#f-service");
  $$("[data-service]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (!sel) return; var v = a.getAttribute("data-service");
      $$("option", sel).forEach(function (o) { if (o.textContent.trim() === v) sel.value = o.value || o.textContent; });
      setTimeout(function () { var n = $("#f-name"); if (n) n.focus({ preventScroll: true }); }, 700);
    });
  });

  /* ---------- consultation form → WhatsApp ---------- */
  if (form) {
    var C = T.contact, L = C.wa_labels || {};
    function setErr(name, msg) {
      var f = form.elements[name], box = $('[data-err="' + name + '"]', form);
      if (box) box.textContent = msg || "";
      if (f && f.closest) { var fl = f.closest(".field"); if (fl) fl.classList.toggle("invalid", !!msg); }
      return !msg;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; };
      var okAll = true;
      okAll = setErr("name", v("name").length < 2 ? C.f_err_name : "") && okAll;
      okAll = setErr("phone", v("phone").replace(/[^\d+]/g, "").length < 8 ? C.f_err_phone : "") && okAll;
      okAll = setErr("service", !v("service") ? C.f_err_service : "") && okAll;
      okAll = setErr("msg", v("msg").length < 5 ? C.f_err_msg : "") && okAll;
      if (!okAll) { var bad = $(".field.invalid input,.field.invalid select,.field.invalid textarea", form); if (bad) bad.focus(); return; }
      var typeEl = form.querySelector('input[name="type"]:checked');
      var lines = ["*" + C.wa_title + "*", "",
        "👤 " + L.name + ": " + v("name"),
        "📞 " + L.phone + ": " + v("phone")];
      if (v("email")) lines.push("✉️ " + L.email + ": " + v("email"));
      if (v("city")) lines.push("📍 " + L.city + ": " + v("city"));
      if (typeEl) lines.push("🏷️ " + L.type + ": " + typeEl.value);
      lines.push("⚖️ " + L.service + ": " + v("service"));
      lines.push("💬 " + L.pref + ": " + v("pref"));
      lines.push("", "📝 " + L.msg + ":", v("msg"));
      var url = "https://wa.me/" + (CFG.whatsapp || "201117170122") + "?text=" + encodeURIComponent(lines.join("\n"));
      var okBox = $(".form-ok", form);
      if (okBox) { okBox.hidden = false; $("a", okBox).href = url; }
      var w = window.open(url, "_blank", "noopener");
      if (!w) window.location.href = url;
    });
    ["name", "phone", "service", "msg"].forEach(function (n) {
      var el = form.elements[n]; if (el) el.addEventListener("input", function () { setErr(n, ""); });
    });
  }

  /* ---------- year ---------- */
  $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
