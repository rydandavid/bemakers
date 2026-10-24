/* =========================================================
   BEMAKERS · lógica del sitio
   1 Datos y utilidades   2 Inicio y menú   3 Transición
   4 Servicios            5 Portafolio      6 Reproductor y visor
   7 Contacto
   Los videos, fotos y marcas se editan en js/portafolio.js
   ========================================================= */
(() => {
  "use strict";

  /* ---------- 1. Datos y utilidades ---------- */
  const IMG = "assets/img/";
  const ISO = IMG + "isotipo-rojo.webp";      // isotipo sobre fondo oscuro
  const ISO_K = IMG + "isotipo-negro.webp";   // isotipo sobre fondo claro
  const LOGO = IMG + "logo-blanco.webp";
  const WA = "https://wa.me/51922368421";

  // Escenas: 0 Producción, 1 Portafolio, 2 Fotografía, 3 Diseño, 4 Marketing, 5 Hablemos (-1 es el inicio)
  const SCENES = [
    { name: "Producción audiovisual", icon: 7 },
    { name: "Portafolio" },
    { name: "Fotografía comercial", icon: 8 },
    { name: "Diseño y branding", icon: 9 },
    { name: "Marketing digital", icon: 2 },
    { name: "Hablemos", icon: 6 }
  ];
  const PF = 1, CT = 5;
  const SV = [0, 2, 3, 4];         // los cuatro servicios (menú y barra inferior)
  const ORB = [0, 2, 3, 4, CT];    // íconos del círculo de inicio
  const nameOf = i => SCENES[i].name;
  const icon = i => `${IMG}icono-${SCENES[i].icon}.webp`;

  const d = document;
  const $ = s => d.querySelector(s);
  const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const tpl = (...parts) => parts.join("");   // plantillas sin espacios entre etiquetas
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const md = $("#md"), mv = $("#mv"), home = $("#home"), sc = $("#sc"), dock = $("#dock"), wipe = $("#wipe"), stage = $("#stage");
  let cur = -1;          // escena actual
  let pre = null;        // opción elegida antes de abrir el contacto
  let busy = false;      // hay una transición en curso
  let raf = 0;           // animación del canvas de Marketing

  // Temporizadores de la escena actual: se cancelan todos al cambiar de escena
  // (los de "modo" también al pasar de un modo de la animación al siguiente).
  const sceneTimers = new Set(), modeTimers = new Set();
  let stopPreview = () => { };
  const track = (set, fn, ms) => {
    const id = setTimeout(() => { set.delete(id); fn(); }, ms);
    set.add(id);
    return id;
  };
  const later = (fn, ms) => track(sceneTimers, fn, ms);
  const laterInMode = (fn, ms) => track(modeTimers, fn, ms);
  const cancelAll = set => { set.forEach(clearTimeout); set.clear(); };
  const clearModeTasks = () => { cancelAll(modeTimers); cancelAnimationFrame(raf); };
  const clearSceneTasks = () => { stopPreview(); cancelAll(sceneTimers); clearModeTasks(); };

  // Activa con clic o con Enter/Espacio (para elementos que no son <button>)
  const act = (el, fn) => {
    el.addEventListener("click", fn);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(e); } });
  };
  // Entrada suave de un bloque
  const reveal = (el, dx) => {
    if (RM || !el) return;
    el.getAnimations().forEach(a => a.cancel());
    el.animate(
      [{ opacity: 0, transform: `translateY(10px) translateX(${dx || 0}px)` }, { opacity: 1, transform: "translate(0,0)" }],
      { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  };

  // Iconos de línea (contacto y chips)
  const IO = {};
  Object.entries({
    wa: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    ig: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    ar: '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><path d="M7.5 7.5h.01"/>',
    video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    cam: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    ev: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    cal: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    ad: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    spark: '<path d="M9.94 14.06 4 20M14 4l.94 2.06L17 7l-2.06.94L14 10l-.94-2.06L11 7l2.06-.94z"/><path d="M5 3v4M3 5h4M19 15v4M17 17h4"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>'
  }).forEach(([k, path]) => { IO[k] = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${path}</svg>`; });

  /* ---------- 2. Inicio y menú ---------- */
  // Círculo de íconos
  ORB.forEach((si, k) => {
    const b = d.createElement("button");
    b.type = "button";
    b.className = "orb";
    b.style.setProperty("--a", `${k * 360 / ORB.length}deg`);
    b.setAttribute("aria-label", nameOf(si));
    b.innerHTML = `<img src="${icon(si)}" alt=""><span class="orb-name">${nameOf(si)}</span>`;
    b.onclick = () => go(si, b);
    stage.appendChild(b);
  });

  // Barra inferior: solo los cuatro servicios
  dock.setAttribute("aria-label", "Servicios");
  dock.innerHTML = SV.map(i => `<button type="button" aria-label="${nameOf(i)}" data-i="${i}"><img src="${icon(i)}" alt=""><span class="dk-t" aria-hidden="true">${nameOf(i)}</span></button>`).join("");
  dock.onclick = e => { const b = e.target.closest("button"); if (b && +b.dataset.i !== cur) go(+b.dataset.i, b); };

  // El círculo sigue suavemente al puntero
  let pointerFrame = 0, pointerX = 0, pointerY = 0;
  home.addEventListener("pointermove", e => {
    if (RM || busy || cur !== -1 || e.pointerType !== "mouse") return;   // solo con mouse: al tocar y deslizar en celular no se mueve el círculo
    pointerX = e.clientX; pointerY = e.clientY;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (busy || cur !== -1) return;
      const r = stage.getBoundingClientRect();
      const axis = (v, from, size) => Math.max(-1, Math.min(1, (v - from - size / 2) / (size / 1.2)));
      stage.style.setProperty("--px", axis(pointerX, r.left, r.width));
      stage.style.setProperty("--py", axis(pointerY, r.top, r.height));
    });
  });

  // Marcas con las que hemos trabajado (se repiten para la cinta móvil)
  (() => {
    const clients = window.CLIENTES || [], strip = $("#brands-track");
    if (!clients.length) { $("#brands").hidden = true; return; }
    const brand = (c, dup) => `<span class="bd${dup ? " dup" : ""}"${dup ? ' aria-hidden="true"' : ""}><img src="assets/clientes/${esc(encodeURI(c.archivo))}" alt="${esc(c.nombre)}" title="${esc(c.nombre)}" decoding="async"></span>`;
    strip.innerHTML = clients.map(c => brand(c)).join("") + clients.map(c => brand(c, true)).join("");
  })();

  // Menú superior: "Servicios" abre un desplegable con los cuatro
  const nav = $("#nav"), svc = $("#svc"), menu = $("#svc-menu"), mm = $("#mm"), navHome = $('[data-n="home"]'), navPf = $('[data-n="pf"]'), wa = $("#wa"), logo = $("#lg");
  menu.innerHTML = SV.map(i => `<button type="button" data-i="${i}"><img src="${icon(i)}" alt=""><span>${nameOf(i)}</span></button>`).join("");
  const openMenu = open => { menu.hidden = !open; svc.setAttribute("aria-expanded", String(open)); };
  const closeNav = () => {
    openMenu(false);
    nav.classList.remove("open");
    mm.setAttribute("aria-expanded", "false");
    mm.setAttribute("aria-label", "Abrir menú");
  };
  const hoverMenu = e => e.pointerType === "mouse" && innerWidth > 860;
  svc.onclick = e => { e.stopPropagation(); openMenu(menu.hidden); };
  $(".dd").addEventListener("pointerenter", e => { if (hoverMenu(e)) openMenu(true); });
  $(".dd").addEventListener("pointerleave", e => { if (hoverMenu(e)) openMenu(false); });
  mm.onclick = e => {
    e.stopPropagation();
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    mm.setAttribute("aria-expanded", String(open));
    mm.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  d.addEventListener("click", e => { if (!e.target.closest("#nav,#mm")) closeNav(); });
  const toTop = () => home.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" });
  nav.onclick = e => {
    const b = e.target.closest("button[data-n],button[data-i]");
    if (!b || b === svc) return;
    closeNav();
    if (b.dataset.n === "home") { if (cur > -1) go(-1, b); else toTop(); }
    else if (b.dataset.n === "pf") { if (cur !== PF) go(PF, b); }
    else if (+b.dataset.i !== cur) go(+b.dataset.i, b);
  };
  act(logo, () => { closeNav(); if (cur > -1) go(-1, logo); else toTop(); });
  act(wa, () => { closeNav(); if (cur !== CT) go(CT, wa); });
  const setNav = i => {
    navHome.classList.toggle("on", i === -1);
    navPf.classList.toggle("on", i === PF);
    svc.classList.toggle("on", SV.includes(i));
    wa.classList.toggle("active", i === CT);
  };

  // Aparición al desplazarse, flecha y botón del inicio
  (() => {
    const items = d.querySelectorAll(".rv");
    if ("IntersectionObserver" in window && !RM) {
      const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }), { root: home, threshold: .2 });
      items.forEach(el => io.observe(el));
    } else items.forEach(el => el.classList.add("in"));
    $("#scue").onclick = () => $("#intro").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    $("#to-pf").onclick = e => go(PF, e.currentTarget);
  })();

  // Teclado: Escape cierra lo que esté abierto; flechas en el visor de fotos
  d.addEventListener("keydown", e => {
    if (!lb.hidden) {
      if (e.key === "Escape") closeLB();
      else if (e.key === "ArrowLeft") showLB(lbk - 1);
      else if (e.key === "ArrowRight") showLB(lbk + 1);
    } else if (e.key === "Escape") {
      if (!md.hidden) closeV();
      else if (nav.classList.contains("open") || !menu.hidden) closeNav();
      else if (cur > -1) go(-1, logo);
    }
  });

  /* ---------- 3. Transición circular entre escenas ---------- */
  const coverRadius = (x, y, w, h) => Math.ceil(Math.hypot(Math.max(x, w - x), Math.max(y, h - y))) + 2;
  async function go(i, el, preset) {
    if (busy) return;
    pre = preset == null ? null : preset;
    if (RM) { show(i); return; }
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    let w = innerWidth, h = innerHeight, animation;
    busy = true;
    d.body.classList.add("transitioning");
    wipe.style.display = "grid";
    wipe.style.willChange = "clip-path";
    try {
      // el círculo rojo crece desde el botón y cubre la pantalla…
      animation = wipe.animate(
        [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${coverRadius(x, y, w, h)}px at ${x}px ${y}px)` }],
        { duration: 620, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }
      );
      await animation.finished;
      wipe.style.clipPath = "none";
      animation.cancel();
      show(i);
      await new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
      // …y se encoge al centro para revelar la nueva escena
      w = innerWidth; h = innerHeight;
      animation = wipe.animate(
        [{ clipPath: `circle(${coverRadius(w / 2, h / 2, w, h)}px at 50% 50%)` }, { clipPath: "circle(0px at 50% 50%)" }],
        { duration: 720, delay: 100, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }
      );
      await animation.finished;
    } finally {
      wipe.style.display = "none";
      wipe.style.clipPath = "";
      wipe.style.willChange = "";
      if (animation) animation.cancel();
      d.body.classList.remove("transitioning");
      busy = false;
    }
  }
  function show(i) {
    clearSceneTasks();
    sc.querySelectorAll("video").forEach(v => v.pause());
    cur = i;
    const on = i > -1, isSvc = SV.includes(i);
    home.style.display = on ? "none" : "";
    sc.style.display = on ? "flex" : "none";
    dock.style.display = isSvc ? "flex" : "none";
    setNav(i);
    if (!on) home.scrollTop = 0;
    sc.dataset.scene = !on ? "" : isSvc ? "svc" : i === PF ? "pf" : "ct";
    dock.querySelectorAll("button").forEach(b => {
      const here = +b.dataset.i === i;
      b.classList.toggle("on", here);
      if (here) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    if (on) { sc.scrollTop = 0; render(i); }
  }
  function render(i) {
    sc.innerHTML = i === CT ? contact() : i === PF ? portfolio() : service(i);
    sc.className = "in";
    if (i === CT) { contactInit(); return; }
    sc.querySelectorAll("[data-contact]").forEach(b => { b.onclick = e => go(CT, e.currentTarget, e.currentTarget.dataset.pre); });
    if (i === PF) portfolioInit(); else SERVICES[i].init();
  }

  /* ---------- 4. Servicios: una escena por disciplina, solo con animaciones gráficas ---------- */
  // Estructura común: barra superior, escenario y pie con contador (01 / 03).
  // `cls` es la clase del contenedor; `stageAttr` se añade al escenario.
  function studio(cls, top, label, stageHtml, opt = {}) {
    return tpl(
      `<div class="motion-study${cls ? " " + cls : ""}" id="motion-study" data-mode="0">`,
      `<div class="motion-top"><span>${top}</span><button type="button" id="motion-toggle" aria-label="Pausar animación">Ⅱ</button></div>`,
      `<div class="motion-stage"${opt.hidden ? ' aria-hidden="true"' : ""}>${stageHtml}</div>`,
      `<div class="motion-bottom"><div><span class="motion-index" id="motion-index">01 / 03</span><p id="motion-label">${label}</p></div>`,
      `<button type="button" id="motion-next" aria-label="${opt.next || "Siguiente"}">↗</button></div></div>`
    );
  }
  // Rota entre los tres modos de una escena. Devuelve { set } para saltar a uno.
  function studioInit(labels, onSet, ms) {
    const box = $("#motion-study"), toggle = $("#motion-toggle"), count = labels.length;
    let n = 0, timer = 0, paused = RM;
    const schedule = () => {
      clearTimeout(timer);
      if (!paused) timer = later(() => { if (d.hidden) { schedule(); return; } set((n + 1) % count); schedule(); }, ms || 4600);
    };
    const set = k => {
      n = k;
      clearModeTasks();
      box.dataset.mode = n;
      $("#motion-index").textContent = `0${n + 1} / 0${count}`;
      $("#motion-label").textContent = labels[n];
      reveal(box.querySelector(".motion-bottom>div"));
      if (onSet) onSet(n);
    };
    const state = () => {
      box.classList.toggle("paused", paused);
      toggle.textContent = paused ? "▶" : "Ⅱ";
      toggle.setAttribute("aria-label", paused ? "Reanudar animación" : "Pausar animación");
    };
    toggle.onclick = () => { paused = !paused; state(); schedule(); };
    $("#motion-next").onclick = () => { set((n + 1) % count); schedule(); };
    state(); set(0); schedule();
  }

  // ---- Producción: una idea, tres formatos (reel, corporativo, anuncio)
  const PRODUCCION = ["Reels · Directos, cercanos, con ritmo.", "Corporativos · Una presencia con carácter.", "Publicidad · Un mensaje que invita a actuar."];
  const demoProduccion = () => studio("", "Una idea. Muchas formas.", PRODUCCION[0], tpl(
    `<div class="motion-grid"></div><div class="motion-frame">`,
    `<div class="motion-scene scene-reel"><img class="reel-logo" src="${LOGO}" alt="">`,
    `<div class="reel-headline"><span>Tu marca.</span><strong>En<br>movimiento.</strong></div>`,
    `<div class="reel-social"><svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg></div>`,
    `<span class="reel-handle">@bemakers.pe</span><div class="reel-progress"><i></i></div></div>`,
    `<div class="motion-scene scene-brand"><img src="${LOGO}" alt=""><span class="brand-rule"></span><p>Ideas que conectan.<br><strong>Historias que quedan.</strong></p><small>PRODUCCIÓN AUDIOVISUAL</small></div>`,
    `<div class="motion-scene scene-ad"><div class="ad-identity"><img src="${LOGO}" alt=""><small>PUBLICIDAD</small></div>`,
    `<div class="ad-headline">En cualquier<br><strong>formato</strong></div><span class="ad-action">Conoce más <b>↗</b></span></div></div>`
  ), { hidden: true, next: "Cambiar enfoque audiovisual" });
  const initProduccion = () => studioInit(PRODUCCION, null, 4200);

  // ---- Fotografía: pila de fotos impresas (producto, retrato, espacio)
  const PV = [
    tpl(
      `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" class="pv pv0"><defs>`,
      `<linearGradient id="p0w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6efe5"/><stop offset="1" stop-color="#e6d8c4"/></linearGradient>`,
      `<linearGradient id="p0b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b81c1c"/><stop offset=".35" stop-color="#ff3b3b"/><stop offset="1" stop-color="#8f1414"/></linearGradient>`,
      `<radialGradient id="p0l" cx=".25" cy=".2" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`,
      `<rect width="200" height="200" fill="url(#p0w)"/><rect y="146" width="200" height="54" fill="#d8c5ab"/><rect width="200" height="200" fill="url(#p0l)"/>`,
      `<ellipse cx="108" cy="160" rx="38" ry="6" fill="#000" opacity=".22"/><rect x="80" y="74" width="40" height="86" rx="11" fill="url(#p0b)"/>`,
      `<rect x="92" y="54" width="16" height="22" rx="2" fill="#5c0f0f"/><rect x="88" y="40" width="24" height="16" rx="4" fill="#111"/>`,
      `<rect x="85" y="100" width="30" height="34" rx="3" fill="#f6efe5"/><image href="${ISO}" x="88" y="106" width="24" height="22" preserveAspectRatio="xMidYMid meet"/>`,
      `<rect x="86" y="80" width="4" height="72" rx="2" fill="#fff" opacity=".45"/></svg>`
    ),
    tpl(
      `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" class="pv pv1"><defs>`,
      `<linearGradient id="p1b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff4545"/><stop offset="1" stop-color="#b51b1b"/></linearGradient></defs>`,
      `<rect width="200" height="200" fill="url(#p1b)"/><circle cx="126" cy="78" r="48" fill="#f6efe5" opacity=".92"/>`,
      `<circle cx="96" cy="92" r="25" fill="#0b0b0b"/><path d="M48 200c2-44 22-68 48-68s46 24 48 68Z" fill="#0b0b0b"/></svg>`
    ),
    tpl(
      `<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" class="pv pv2"><defs>`,
      `<linearGradient id="p2w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3eadf"/><stop offset="1" stop-color="#e2d3bf"/></linearGradient>`,
      `<linearGradient id="p2l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`,
      `<rect width="200" height="200" fill="url(#p2w)"/><rect y="150" width="200" height="50" fill="#c9b293"/>`,
      `<path d="M84 150V70a26 26 0 0 1 52 0v80Z" fill="#fffaf3"/><path d="M84 150h52l40 50H60Z" fill="url(#p2l)"/>`,
      `<rect x="40" y="128" width="30" height="8" rx="3" fill="#ff3131"/><rect x="36" y="118" width="38" height="12" rx="5" fill="#ff3131"/>`,
      `<path d="M42 136v14M66 136v14" stroke="#111" stroke-width="3"/><rect x="150" y="134" width="16" height="16" rx="2" fill="#111"/>`,
      `<path d="M158 134c-10-12-6-24 0-28 6 4 10 16 0 28z" fill="#ff3131"/></svg>`
    )
  ];
  const PC = [["Beso de Sol", "Producto · f/8 · 1/125"], ["Ana, fundadora", "Retrato · f/1.8 · 1/250"], ["Café del Río", "Espacio · f/5.6 · 1/60"]];
  const FOTO = ["Producto · La luz que hace brillar cada detalle.", "Retrato · Personas reales, con carácter.", "Espacios · Lugares que invitan a entrar."];
  const demoFoto = () => studio("kit st-foto", "Producto · Retrato · Espacio", FOTO[0],
    `<div class="stk" id="stk" role="button" tabindex="0" aria-label="Ver la siguiente foto">${PV.map((v, k) =>
      `<div class="pola q${k}" data-pos="${k}"><div class="pola-img">${v}</div><div class="pola-cap"><b>${PC[k][0]}</b><small>${PC[k][1]}</small></div></div>`).join("")}</div>`
  );
  function initFoto() {
    const stack = $("#stk"), prints = stack.querySelectorAll(".pola");
    let front = 0;
    // la foto de adelante sale volando al fondo y la siguiente pasa al frente
    const layout = k => {
      prints.forEach((p, j) => {
        if (j === front && j !== k && !RM) {
          p.classList.remove("toss");
          void p.offsetWidth;
          p.classList.add("toss");
          later(() => p.classList.remove("toss"), 800);
        }
        p.dataset.pos = (j - k + prints.length) % prints.length;
      });
      front = k;
    };
    act(stack, () => $("#motion-next").click());
    studioInit(FOTO, layout, 4200);
  }

  // ---- Diseño: construcción del logo, paleta y aplicaciones
  const BRAND = ["Logotipo · Construido sobre una retícula.", "Paleta y tipografía · Un sistema que se reconoce.", "Aplicaciones · La misma voz en cada pieza."];
  const demoDiseno = () => studio("kit st-brand", "Del boceto al sistema", BRAND[0], tpl(
    `<div class="ab"><div class="ab-s ab0"><svg viewBox="0 0 200 200" class="ab-con" aria-hidden="true"><path d="M0 100h200M100 0v200M0 50h200M0 150h200M50 0v200M150 0v200" class="g"/><circle cx="100" cy="100" r="72" class="k"/><circle cx="72" cy="112" r="34" class="k"/><circle cx="130" cy="108" r="30" class="k"/><path d="M30 30 170 170" class="k"/></svg><img src="${ISO_K}" alt=""><span class="ab-tag">Isotipo · 1:1</span></div>`,
    `<div class="ab-s ab1"><div class="sw"><i style="--c:#ff3131"><b>Rojo be</b><small>#FF3131</small></i><i style="--c:#0b0b0b"><b>Tinta</b><small>#0B0B0B</small></i><i style="--c:#f2ece4;--t:#0b0b0b"><b>Papel</b><small>#F2ECE4</small></i><i style="--c:#7d1515"><b>Vino</b><small>#7D1515</small></i></div>`,
    `<div class="ty"><b>Aa</b><span><strong>Basic Commerce</strong><small>Titulares</small></span><span><strong class="pp">Poppins</strong><small>Textos</small></span></div></div>`,
    `<div class="ab-s ab2"><div class="ap-card"><img src="${LOGO}" alt=""><small>hola@tumarca.pe</small></div><div class="ap-post"><img src="${LOGO}" alt=""><p>Hecha para<br><strong>que te elijan.</strong></p></div><div class="ap-stk"><img src="${ISO}" alt=""></div></div></div>`
  ));
  const initDiseno = () => studioInit(BRAND, null, 4800);

  // ---- Marketing: estrategia (calendario), anuncios (embudo) y comunidad (chat)
  const MKT = ["Estrategia · Un mes de contenido con rumbo.", "Anuncios · Tu mensaje llega a quien sí compra.", "Comunidad · Cada comentario puede ser una venta."];
  const demoMarketing = () => studio("kit st-mkt", "Planificar · Publicar · Medir", MKT[0], tpl(
    `<div class="mk"><div class="mk-s mk0"><div class="mcal-h"><b>Octubre</b><span><i class="f1"></i>Reel<i class="f2"></i>Foto<i class="f3"></i>Historia<i class="f4"></i>Anuncio</span></div>`,
    `<div class="mcal" id="mcal">${"<i></i>".repeat(28)}</div><div class="mcal-f"><b id="mcn">0</b> publicaciones planeadas</div></div>`,
    `<div class="mk-s mk1"><canvas id="cv" width="560" height="340"></canvas><div class="mk-kpi"><small>Te escriben</small><b id="ct">0</b></div><span class="mk-lb l1">Todo el público</span><span class="mk-lb l2">Tu cliente ideal</span></div>`,
    `<div class="mk-s mk2"><div class="mk-ph"><div class="mk-ph-top"><img src="${ISO}" alt=""><b>tumarca</b><small>en línea</small></div><div class="chat" id="ch"></div></div></div></div>`
  ));
  const POSTS = [1, 2, 0, 3, 1, 0, 4, 2, 0, 1, 3, 0, 2, 4, 1, 0, 3, 2, 0, 1, 4, 0, 2, 3, 1, 0, 2, 4];   // tipo de publicación por día (0 = descanso)
  const CHAT = [["c", "Hola, vi su anuncio. ¿Tienen disponible para hoy?"], ["b", "¡Hola! Sí, te separamos uno. ¿A nombre de quién?"], ["c", "De Andrea. ¿Hacen delivery?"], ["b", "Claro, llegamos a donde estés. Pedido confirmado ✓"]];
  function initMarketing() {
    const days = [...$("#mcal").children], chat = $("#ch"), canvas = $("#cv"), planned = $("#mcn"), leads = $("#ct");
    const fillCalendar = () => {
      let count = 0;
      days.forEach(day => { day.className = ""; });
      days.forEach((day, k) => {
        if (!POSTS[k]) return;
        laterInMode(() => { day.className = "f" + POSTS[k]; planned.textContent = ++count; }, 250 + k * 95);
      });
    };
    const playChat = () => {
      chat.innerHTML = "";
      CHAT.forEach(([who, text], k) => laterInMode(() => {
        const bubble = d.createElement("div");
        bubble.className = who;
        bubble.textContent = text;
        chat.appendChild(bubble);
      }, 350 + k * 1050));
    };
    // Anuncios: mucha gente pasa por el filtro rojo y solo la que encaja llega a escribirte
    const playAds = () => {
      const g = canvas.getContext("2d"), W = 560, H = 340, GATE = W * .46, dots = [];
      let found = 0;
      const dot = initial => ({ x: initial ? Math.random() * GATE : -10, y: 24 + Math.random() * (H - 48), v: 1 + Math.random() * 1.3, fit: Math.random() < .3 });
      for (let i = 0; i < 70; i++) dots.push(dot(true));
      leads.textContent = 0;
      (function frame() {
        if (!canvas.isConnected) return;
        if (busy || d.hidden) { raf = requestAnimationFrame(frame); return; }
        g.clearRect(0, 0, W, H);
        g.strokeStyle = "rgba(255,255,255,.08)"; g.lineWidth = 1; g.beginPath();
        g.moveTo(GATE, 20); g.lineTo(W - 20, H / 2 - 28); g.moveTo(GATE, H - 20); g.lineTo(W - 20, H / 2 + 28); g.stroke();
        g.fillStyle = "rgba(255,49,49,.95)"; g.fillRect(GATE - 2, 14, 4, H - 28);
        dots.forEach((p, j) => {
          p.x += p.v;
          if (p.x > GATE) { if (p.fit) p.y += (H / 2 - p.y) * .05; else { p.y += 1.6; p.v *= .985; } }
          g.beginPath();
          g.arc(p.x, p.y, p.x > GATE && p.fit ? 5.5 : 3.5, 0, 7);
          g.fillStyle = p.x > GATE ? (p.fit ? "#ff3131" : "rgba(255,255,255,.18)") : "rgba(255,255,255,.75)";
          g.fill();
          if (p.x > W - 18 || p.y > H + 10) {
            if (p.x > W - 18 && p.fit) leads.textContent = ++found;
            dots[j] = dot(false);
          }
        });
        raf = requestAnimationFrame(frame);
      })();
    };
    // Cada pantalla se reduce (sin deformarse) solo si no cabe en el alto del recuadro
    const fit = () => {
      if (!canvas.isConnected) { removeEventListener("resize", fit); return; }
      // reserva el alto del chat completo para que el teléfono no crezca al llegar los mensajes
      const shown = [...chat.children];
      chat.style.minHeight = "";
      CHAT.forEach(([who, text]) => { const b = d.createElement("div"); b.className = who; b.textContent = text; b.style.animation = "none"; chat.appendChild(b); });
      const full = chat.offsetHeight;
      chat.replaceChildren(...shown);
      chat.style.minHeight = full + "px";
      d.querySelectorAll(".mk-s").forEach(scene => {
        const flow = [...scene.children].filter(el => getComputedStyle(el).position !== "absolute");
        const natural = flow.reduce((sum, el) => sum + el.offsetHeight, 0) + 10 * (flow.length - 1);
        scene.style.setProperty("--fit", Math.min(1, scene.clientHeight / (natural + 4)).toFixed(3));
      });
    };
    addEventListener("resize", fit);
    fit();
    d.fonts && d.fonts.ready.then(fit);
    studioInit(MKT, k => { if (k === 0) fillCalendar(); else if (k === 1) playAds(); else playChat(); }, 5200);
  }

  // ---- Textos de cada servicio y su animación
  const SERVICES = {
    0: { rev: true, demo: demoProduccion, init: initProduccion, title: "Tu marca, en pantalla grande.", text: "De la idea al último corte. Creamos videos publicitarios, corporativos y contenido para redes con una dirección visual pensada para tu marca.", short: "Videos publicitarios, corporativos y contenido para redes.", cta: "Quiero un video", pre: "Video para mi marca" },
    2: { rev: false, demo: demoFoto, init: initFoto, title: "Imágenes que se eligen solas.", text: "Productos, retratos, espacios y eventos. Cuidamos la luz, la composición y cada detalle para que tus fotos vendan por ti.", short: "Productos, retratos, espacios y eventos.", cta: "Quiero una sesión de fotos", pre: "Fotos para mi marca" },
    3: { rev: true, demo: demoDiseno, init: initDiseno, title: "Una marca clara se recuerda.", text: "Identidad visual y comunicación gráfica: logotipo, colores, tipografía y piezas que hablan con una sola voz, en todos lados.", short: "Identidad visual y comunicación gráfica.", cta: "Quiero una marca más fuerte", pre: "Renovar mi imagen" },
    4: { rev: false, demo: demoMarketing, init: initMarketing, title: "Mensajes que terminan en clientes.", text: "Gestión de redes, publicidad pagada y estrategia de contenido. Planificamos, publicamos y medimos para que tu marca crezca con rumbo.", short: "Gestión de redes, publicidad pagada y estrategia de contenido.", cta: "Quiero hacer crecer mi marca", pre: "Contenido para redes" }
  };
  function service(i) {
    const s = SERVICES[i];
    return tpl(
      `<img class="bgi" src="${icon(i)}" alt=""><div class="sin service${s.rev ? " rev" : ""}">`,
      `<div class="tx"><h2 class="sec">${nameOf(i)}</h2><h3 class="sub">${s.title}</h3>`,
      `<p class="desktop-description">${s.text}</p><p class="mobile-summary">${s.short}</p>`,
      `<button class="btn" data-contact data-pre="${s.pre}">${s.cta}</button></div>`,
      `<div class="demo" id="service-demo">${s.demo()}</div></div>`
    );
  }

  /* ---------- 5. Portafolio ---------- */
  let pfTab = "v";    // pestaña activa: v = videos, f = fotografías
  const PF_CTA = { v: ["Quiero un video así", "Video para mi marca"], f: ["Quiero una sesión de fotos", "Fotos para mi marca"] };
  const PF_TEXT = ["Historias que se ven y se sienten.", "Aftermovies, reels, spots y fotografía para marcas que quieren destacar. Mira proyectos para Mannucci Motors, Kalia, Pizza D Meza, Qalikay, Canoas, Cataleya, Está Chévere, Tumi y más.", "Aftermovies, reels, spots y fotografía para marcas."];
  const driveThumb = (id, w) => `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w${w}`;
  const driveView = id => `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`;
  const photoSrc = (f, w) => f.archivo ? "assets/fotos/" + encodeURI(f.archivo) : driveThumb(f.driveId, w);
  const asset = (dir, file) => `assets/${dir}/${esc(encodeURI(file))}`;
  // En pantallas chicas los videos de Drive se abren en Drive; en escritorio, en el reproductor
  const mobileDrive = matchMedia("(max-width:860px), (pointer:coarse) and (max-height:600px)");

  function videoTile(v, k) {
    const vertical = v.formato === "vertical", drive = !!v.driveId;
    let media = drive
      ? `<img class="video-cover" src="${v.portada ? asset("portadas", v.portada) : driveThumb(v.driveId, 800)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">`
      : `<video muted loop playsinline preload="metadata" src="${asset("videos", v.archivo)}#t=0.1"${v.portada ? ` poster="${asset("portadas", v.portada)}"` : ""}></video>`;
    if (v.preview) media += `<video class="hover-preview" muted loop playsinline preload="none" data-src="${asset("previews", v.preview)}" aria-hidden="true"></video>`;
    const tag = drive ? "a" : "button";
    const link = drive ? ` href="${driveView(v.driveId)}" target="_blank" rel="noopener noreferrer"` : ' type="button"';
    return tpl(
      `<${tag}${link} class="mt vc ${vertical ? "v" : "h"}" style="--ar:${vertical ? "0.5625" : "1.7778"}" data-k="${k}" aria-label="Ver ${esc(v.titulo)}${drive ? " en Google Drive (nueva pestaña)" : ""}">`,
      `${media}<span class="vp" aria-hidden="true"></span>`,
      `<span class="vt"><small>${esc(v.marca)}</small><b>${esc(v.titulo)}</b>`,
      drive ? '<span class="video-destination">Ver en Drive · Nueva pestaña <span aria-hidden="true">↗</span></span>' : "",
      `</span></${tag}>`
    );
  }
  const ctaTile = () => '<div class="cta-t"><p class="eyebrow">¿Tu marca es la siguiente?</p><h3>Hagamos tu próximo video</h3><button class="btn" type="button" data-contact data-pre="Video para mi marca">Quiero un video así</button></div>';

  // Mosaico de videos: arma bloques donde los verticales ocupan el alto de dos horizontales.
  function videoMosaic(items) {
    const verticals = [], horizontals = [], blocks = [];
    let mirror = false, first = true;
    items.forEach((v, k) => (v.formato === "vertical" ? verticals : horizontals).push(videoTile(v, k)));
    const block = (cls, tiles) => { blocks.push(`<div class="mb ${cls}${mirror ? " mirror" : ""}">${tiles.join("")}</div>`); mirror = !mirror; };
    for (;;) {
      if (first && verticals.length >= 1 && horizontals.length >= 3) block("bento", [horizontals.shift(), horizontals.shift(), horizontals.shift(), verticals.shift()]);
      else if (verticals.length >= 2 && horizontals.length >= 2) block("trio", [verticals.shift(), verticals.shift(), horizontals.shift(), horizontals.shift()]);
      else if (verticals.length >= 1 && horizontals.length >= 3) block("bento", [horizontals.shift(), horizontals.shift(), horizontals.shift(), verticals.shift()]);
      else break;
      first = false;
    }
    while (verticals.length) {
      const n = Math.min(4, verticals.length);
      blocks.push(`<div class="mb rowv n${n}">${verticals.splice(0, n).join("")}</div>`);
    }
    while (horizontals.length) {
      const left = horizontals.length;
      if (left === 1) blocks.push(`<div class="mb feat">${horizontals.shift()}${ctaTile()}</div>`);
      else if (left === 3) blocks.push(`<div class="mb tri">${horizontals.splice(0, 3).join("")}</div>`);
      else blocks.push(`<div class="mb pair">${horizontals.splice(0, 2).join("")}</div>`);
    }
    return blocks.join("");
  }
  const photoTile = (f, k) => `<button type="button" class="mt pt" style="--ar:${f.ratio || 1.5}" data-k="${k}" aria-label="Ver fotografía ${k + 1}${f.titulo ? ": " + esc(f.titulo) : ""}"><img src="${photoSrc(f, 900)}" alt="${esc(f.titulo || "Fotografía de BEMAKERS")}" loading="lazy" decoding="async" referrerpolicy="no-referrer"></button>`;

  function portfolio() {
    const videos = window.PORTAFOLIO || [], photos = window.FOTOS || [], t = PF_TEXT, v = pfTab === "v";
    return tpl(
      `<div class="pw"><div class="pfh"><div class="tx"><h2 class="sec">Portafolio</h2><h3 class="sub">${t[0]}</h3><p class="desktop-description">${t[1]}</p><p class="mobile-summary">${t[2]}</p></div>`,
      `<button class="btn" id="pf-cta" data-contact data-pre="${PF_CTA[pfTab][1]}">${PF_CTA[pfTab][0]}</button></div>`,
      `<div class="pf-tabs" role="tablist" aria-label="Tipo de trabajo"><button type="button" role="tab" data-t="v" aria-selected="${v}">Videos</button><button type="button" role="tab" data-t="f" aria-selected="${!v}">Fotografías</button></div>`,
      `<div class="mz vm" id="mz-v" role="tabpanel"${v ? "" : " hidden"}>${videos.length ? videoMosaic(videos) : '<p class="pe">Estamos preparando los videos del portafolio. Mientras tanto, cuéntanos tu proyecto y te mostramos ideas para tu marca.</p>'}</div>`,
      `<div class="mz" id="mz-f" role="tabpanel"${v ? " hidden" : ""}>${photos.length ? photos.map(photoTile).join("") : '<p class="pe">Estamos preparando la galería de fotografías.</p>'}</div></div>`
    );
  }

  const updateVideoDestinations = () => {
    sc.querySelectorAll(".vc[href]").forEach(c => {
      const v = window.PORTAFOLIO[+c.dataset.k];
      c.setAttribute("aria-label", "Ver " + v.titulo + (mobileDrive.matches ? " en Google Drive (nueva pestaña)" : ""));
      c.querySelector(".video-destination").hidden = !mobileDrive.matches;
    });
  };
  mobileDrive.addEventListener("change", updateVideoDestinations);

  // Portadas nítidas: la copia local se ve al instante y, cuando la miniatura grande de Drive carga, la reemplaza.
  function sharpCovers() {
    const upgrade = tile => {
      const img = tile.querySelector("img.video-cover"), v = window.PORTAFOLIO[+tile.dataset.k];
      if (!img || !v || !v.driveId || img.dataset.hi) return;
      img.dataset.hi = 1;
      const vertical = tile.classList.contains("v"), dpr = Math.min(devicePixelRatio || 1, 2);
      const src = driveThumb(v.driveId, Math.min(vertical ? 1080 : 1920, Math.round((vertical ? 540 : 960) * dpr)));
      const big = new Image();
      big.referrerPolicy = "no-referrer";
      big.onload = () => { if (big.naturalWidth > img.naturalWidth && img.isConnected) img.src = src; };
      big.src = src;
    };
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); upgrade(e.target); } }), { root: sc, rootMargin: "400px" })
      : null;
    sc.querySelectorAll(".vc").forEach(tile => (io ? io.observe(tile) : upgrade(tile)));
  }

  function portfolioInit() {
    const videos = window.PORTAFOLIO || [];
    let active = null, timer = 0, version = 0;
    updateVideoDestinations();

    // pestañas Videos / Fotografías
    sc.querySelectorAll(".pf-tabs button").forEach(b => {
      b.onclick = () => {
        if (pfTab === b.dataset.t) return;
        stopPreview();
        pfTab = b.dataset.t;
        const cta = $("#pf-cta");
        cta.textContent = PF_CTA[pfTab][0];
        cta.dataset.pre = PF_CTA[pfTab][1];
        sc.querySelectorAll(".pf-tabs button").forEach(x => x.setAttribute("aria-selected", String(x === b)));
        $("#mz-v").hidden = pfTab !== "v";
        $("#mz-f").hidden = pfTab !== "f";
        reveal($("#mz-" + pfTab));
      };
    });

    // fotografías: cada una toma su proporción real y se abre en el visor
    sc.querySelectorAll(".pt").forEach(tile => {
      const img = tile.querySelector("img");
      const fit = () => { if (img.naturalWidth && img.naturalHeight) tile.style.setProperty("--ar", Math.max(.55, Math.min(2.4, img.naturalWidth / img.naturalHeight)).toFixed(4)); };
      if (img.complete) fit();
      img.onload = fit;
      img.onerror = () => { tile.hidden = true; };
      tile.onclick = () => openLB(+tile.dataset.k, tile);
    });
    sharpCovers();
    sc.querySelectorAll("img.video-cover").forEach(img => {
      img.onerror = () => {
        const fallback = d.createElement("span");
        fallback.className = "cover-fallback";
        fallback.setAttribute("aria-hidden", "true");
        fallback.textContent = "Ver video";
        img.replaceWith(fallback);
      };
    });

    // adelanto de seis segundos al pasar el mouse
    stopPreview = () => {
      clearTimeout(timer);
      version++;
      if (!active) return;
      const video = active.querySelector("video");
      if (video) { video.pause(); if (video.readyState) video.currentTime = 0; }
      active.classList.remove("previewing");
      active = null;
    };
    sc.querySelectorAll(".vc").forEach(tile => {
      const v = tile.querySelector("video");
      const start = () => {
        if (!v || RM || busy || !md.hidden || d.hidden || (navigator.connection && navigator.connection.saveData)) return;
        stopPreview();
        active = tile;
        const token = version;
        timer = setTimeout(() => {
          if (token !== version || !tile.isConnected) return;
          v.muted = true;
          if (v.dataset.src && !v.getAttribute("src")) v.src = v.dataset.src;
          const played = v.play();
          if (played) played
            .then(() => { if (token === version && active === tile) tile.classList.add("previewing"); else if (active !== tile) v.pause(); })
            .catch(() => { if (token === version) stopPreview(); });
        }, 200);
      };
      tile.onpointerenter = e => { if (e.pointerType === "mouse") start(); };
      tile.onfocus = () => { if (tile.matches(":focus-visible")) start(); };
      tile.onpointerleave = tile.onblur = () => { if (active === tile) stopPreview(); };
      tile.onclick = e => {
        stopPreview();
        if (tile.tagName === "A") {
          if (mobileDrive.matches || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;   // se abre en Drive
          e.preventDefault();
        }
        openVideo(videos[+tile.dataset.k]);
      };
      if (v) v.onerror = () => { if (active === tile) stopPreview(); };
    });
  }
  d.addEventListener("visibilitychange", () => { if (d.hidden) stopPreview(); });

  /* ---------- 6. Reproductor y visor de fotos ---------- */
  const player = $("#drive-player"), driveLink = $("#drive-link");
  const modalBackground = [...d.querySelectorAll("body > header, #home, #sc, #dock")];
  const lockBackground = locked => modalBackground.forEach(el => { el.inert = locked; });
  let lastTrigger = null;

  // Mantiene el foco dentro del reproductor
  md.addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const items = [...md.querySelectorAll("button,a[href],video[controls],iframe")].filter(el => !el.hidden && el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  function openVideo(o) {
    lastTrigger = d.activeElement;
    const drive = !!o.driveId;
    md.classList.toggle("v", o.formato === "vertical");
    mv.hidden = drive;
    player.hidden = !drive;
    driveLink.hidden = !drive;
    if (drive) {
      player.src = `https://drive.google.com/file/d/${encodeURIComponent(o.driveId)}/preview`;
      player.title = o.titulo;
      driveLink.href = driveView(o.driveId);
    } else {
      mv.src = "assets/videos/" + encodeURI(o.archivo);
      const played = mv.play();
      if (played) played.catch(() => { });
    }
    $("#mt").textContent = o.titulo;
    $("#mb").textContent = o.marca || "";
    md.hidden = false;
    md.scrollTop = 0;
    lockBackground(true);
    reveal(md.querySelector(".player-panel"));
    $("#mc").focus({ preventScroll: true });
  }
  function closeV() {
    mv.pause();
    mv.removeAttribute("src");
    mv.load();
    player.removeAttribute("src");
    driveLink.removeAttribute("href");
    md.hidden = true;
    md.classList.remove("v");
    lockBackground(false);
    if (lastTrigger && lastTrigger.isConnected) lastTrigger.focus({ preventScroll: true });
  }
  $("#mc").onclick = closeV;
  md.onclick = e => { if (e.target === md) closeV(); };
  $("#mq").onclick = () => { go(CT, $("#mq"), "Video para mi marca"); closeV(); };

  const lb = $("#lb"), lbImg = $("#lb-i");
  let lbk = 0, lbTrigger = null, lbX = 0;
  function showLB(k) {
    const photos = window.FOTOS || [];
    if (!photos.length) return;
    lbk = (k + photos.length) % photos.length;
    const f = photos[lbk];
    lbImg.src = photoSrc(f, 2000);
    lbImg.alt = f.titulo || "Fotografía de BEMAKERS";
    $("#lb-c").textContent = `${lbk + 1} / ${photos.length}`;
  }
  function openLB(k, trigger) {
    lbTrigger = trigger;
    showLB(k);
    lb.hidden = false;
    lockBackground(true);
    $("#lb-x").focus({ preventScroll: true });
  }
  function closeLB() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    lockBackground(false);
    if (lbTrigger && lbTrigger.isConnected) lbTrigger.focus({ preventScroll: true });
  }
  $("#lb-x").onclick = closeLB;
  $("#lb-p").onclick = () => showLB(lbk - 1);
  $("#lb-n").onclick = () => showLB(lbk + 1);
  lb.onclick = e => { if (e.target === lb) closeLB(); };
  lb.addEventListener("touchstart", e => { lbX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - lbX; if (Math.abs(dx) > 50) showLB(lbk + (dx < 0 ? 1 : -1)); }, { passive: true });

  /* ---------- 7. Contacto: datos y pedido por WhatsApp ---------- */
  const CHIPS = [
    ["Lanzar mi marca", "rocket"], ["Renovar mi imagen", "spark"], ["Contenido para redes", "cal"], ["Campaña para vender más", "ad"],
    ["Video para mi marca", "video"], ["Fotos para mi marca", "cam"], ["Cobertura de un evento", "ev"], ["Un plan completo", "grid"]
  ];
  const contactLink = (href, ico, label, text, ext) => `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ""}>${IO[ico]}<span class="t">${label ? `<small>${label}</small>` : ""}<b>${text}</b></span></a>`;
  function contact() {
    const tab = pre ? "form" : "info";
    return tpl(
      `<img class="bgi" src="${icon(CT)}" alt=""><div class="sin ct" data-tab="${tab}">`,
      `<div class="ct-tabs" role="tablist"><button type="button" role="tab" data-t="info" aria-selected="${tab === "info"}">Contacto</button><button type="button" role="tab" data-t="form" aria-selected="${tab === "form"}">Cotizar</button></div>`,
      `<div class="contact-info"><h2 class="bc">Hablemos.<img src="${ISO}" alt=""></h2><p class="contact-intro">Tu negocio ya existe. Ahora hagámoslo crecer.</p>`,
      `<div class="lk">`,
      contactLink(WA, "wa", "", "922 368 421", true),
      contactLink("mailto:bemakersperu@gmail.com", "mail", "", "bemakersperu@gmail.com"),
      contactLink("https://www.instagram.com/bemakers.pe/", "ig", "Agencia", "@bemakers.pe", true),
      contactLink("https://www.instagram.com/bemakerstudio/", "ig", "Estudio", "@bemakerstudio", true),
      `</div><p class="ad">${IO.pin}<span><span class="address-label">Nuestro estudio</span>Av. Alfonso Ugarte 2211, Condominio Llanos del Río (Casa A14), frente al Colegio Atumpampa, Tarapoto. `,
      `<a href="https://www.google.com/maps/search/?api=1&query=Av.+Alfonso+Ugarte+2211+Tarapoto" target="_blank" rel="noopener">Ver en el mapa${IO.ar}</a></span></p></div>`,
      `<div class="pd"><p class="eyebrow">De tu idea a la acción</p><h3>Demos forma a tu próxima idea</h3><p class="form-intro">¿Qué quieres lograr?</p>`,
      `<div class="chips" id="chips">${CHIPS.map(([label, ic]) => `<button class="chip" aria-pressed="${label === pre}">${IO[ic]}${label}</button>`).join("")}</div>`,
      `<div class="fld">${IO.tag}<input id="brand" type="text" placeholder="Nombre de tu marca" aria-label="Nombre de tu marca" autocomplete="organization"></div>`,
      `<div class="bub" id="msg"></div><a class="btn" id="send" target="_blank" rel="noopener">${IO.wa}Enviar por WhatsApp</a></div></div>`
    );
  }
  function contactInit() {
    const ct = $(".ct"), tabs = ct.querySelectorAll(".ct-tabs button"), msg = $("#msg"), send = $("#send"), brand = $("#brand");
    const chosen = pre ? [pre] : [];
    tabs.forEach(b => {
      b.onclick = () => {
        if (ct.dataset.tab === b.dataset.t) return;
        ct.dataset.tab = b.dataset.t;
        reveal(ct.querySelector(b.dataset.t === "info" ? ".contact-info" : ".pd"));
        tabs.forEach(x => x.setAttribute("aria-selected", x === b));
      };
    });
    // el mensaje de WhatsApp se arma con la marca y las opciones elegidas
    const update = () => {
      const brandName = brand.value.trim();
      const text = `Hola BEMAKERS, ${brandName ? "soy de la marca " + brandName + ". Quiero" : "quiero"} trabajar con ustedes. ${chosen.length ? "Me interesa: " + chosen.join(", ") + "." : "Quiero saber cómo pueden ayudar a mi marca."} ¿Podemos conversar?`;
      msg.textContent = text;
      send.href = WA + "?text=" + encodeURIComponent(text);
    };
    $("#chips").onclick = e => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const on = chip.getAttribute("aria-pressed") !== "true", label = chip.textContent, at = chosen.indexOf(label);
      chip.setAttribute("aria-pressed", on);
      if (on && at < 0) chosen.push(label);
      if (!on && at >= 0) chosen.splice(at, 1);
      update();
    };
    brand.oninput = update;
    update();
  }
})();
