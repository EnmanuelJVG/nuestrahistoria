/**
 * ============================================================================
 * NUESTRO WRAPPED: 5 MESES — LÓGICA INTERACTIVA (VANILLA JS)
 * ============================================================================
 * Maneja:
 * 1. Hidratación tipográfica y gráfica desde config.js
 * 2. Navegación tipo Instagram Stories (tap der/izq, swipe, hold para pausar)
 * 3. Animaciones de conteo rápido (count-up) y líneas de progreso
 * 4. Música de fondo con fade-in suave y respaldo ambiental si aún no hay MP3
 * 5. Confeti en pantalla completa al desbloquear la sorpresa final
 * ============================================================================
 */

(function () {
  "use strict";

  const config = window.WRAPPED_CONFIG;
  if (!config) {
    console.error("No se encontró window.WRAPPED_CONFIG en config.js");
    return;
  }

  // --------------------------------------------------------------------------
  // REFERENCIAS DEL DOM
  // --------------------------------------------------------------------------
  const phoneFrame = document.getElementById("phone-frame");
  const progressContainer = document.getElementById("progress-bars");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const slideCounterEl = document.getElementById("slide-counter");
  const tapZoneLeft = document.getElementById("tap-prev");
  const tapZoneRight = document.getElementById("tap-next");
  const footerPrevBtn = document.getElementById("footer-prev");
  const footerNextBtn = document.getElementById("footer-next");

  const audioToggleBtn = document.getElementById("audio-toggle");
  const spotifyPlayBtn = document.getElementById("spotify-play-btn");
  const bgAudio = document.getElementById("bg-music");

  const btnStart = document.getElementById("btn-start");
  const btnUnlock = document.getElementById("btn-unlock");
  const couponForm = document.getElementById("coupon-form");
  const couponInput = document.getElementById("coupon-input");
  const couponFeedback = document.getElementById("coupon-feedback");
  const couponSlotsTitle = document.getElementById("coupon-slots-title");
  const couponSlotsEl = document.getElementById("coupon-slots");
  const couponBadgeEl = document.getElementById("s7-coupon-badge");
  const couponUnlockedMsg = document.getElementById("s7-unlocked-msg");
  const couponUnlockedDesc = document.getElementById("s7-unlocked-desc");
  const couponExtraNote = document.getElementById("s7-extra-note");
  const btnAnotherCoupon = document.getElementById("btn-another-coupon");
  const btnReplayConfetti = document.getElementById("btn-replay-confetti");
  const btnRestartStory = document.getElementById("btn-restart-story");
  const surpriseLocked = document.getElementById("surprise-locked");
  const surpriseUnlocked = document.getElementById("surprise-unlocked");
  const confettiCanvas = document.getElementById("confetti-canvas");

  const COUPON_STORAGE_KEY = "wrapped_5m_cupones_v1";

  function loadSavedCoupons() {
    try {
      const raw = window.localStorage.getItem(COUPON_STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? new Set(parsed) : new Set();
    } catch (_) {
      return new Set();
    }
  }

  function saveUnlockedCoupons(set) {
    try {
      window.localStorage.setItem(
        COUPON_STORAGE_KEY,
        JSON.stringify(Array.from(set))
      );
    } catch (_) {}
  }

  function normalizeCouponCode(str) {
    return String(str || "")
      .trim()
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s-]+/g, "");
  }

  // --------------------------------------------------------------------------
  // ESTADO DE LA APLICACIÓN
  // --------------------------------------------------------------------------
  const state = {
    currentSlide: 0,
    totalSlides: slides.length,
    isPaused: false,
    progressMs: 0,
    lastFrameTime: 0,
    rafId: null,
    countAnimations: new WeakMap(),
    surpriseRevealed: false,
    unlockedCodes: loadSavedCoupons(),
  };

  // --------------------------------------------------------------------------
  // UTILIDADES DE FORMATO, TIPOGRAFÍA EDITORIAL Y FALLBACK DE IMAGEN
  // --------------------------------------------------------------------------
  function formatNumber(num, useThousandSeparator) {
    const rounded = Math.round(num);
    if (!useThousandSeparator) return String(rounded);
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function renderScriptDropcap(el, text) {
    const clean = String(text || "").trim();
    el.textContent = "";
    if (!clean) return;
    const drop = document.createElement("span");
    drop.className = "script-dropcap";
    drop.textContent = clean.charAt(0);
    el.appendChild(drop);
    el.appendChild(document.createTextNode(clean.slice(1)));
  }

  function renderEditorialTitle(el, text, mode) {
    const clean = String(text || "").trim();
    el.textContent = "";
    if (!clean) return;

    // Modo "bracket": capitular caligráfica + cuerpo serif + último bloque entre [ corchetes ]
    if (mode === "bracket") {
      let lead = clean;
      let accent = "";

      if (clean.includes(":")) {
        const idx = clean.indexOf(":");
        lead = clean.slice(0, idx).trim();
        accent = clean.slice(idx + 1).trim();
      } else {
        const words = clean.split(/\s+/);
        if (words.length > 1) {
          accent = words.pop();
          lead = words.join(" ");
        }
      }

      const drop = document.createElement("span");
      drop.className = "script-dropcap";
      drop.textContent = lead.charAt(0);
      el.appendChild(drop);
      el.appendChild(document.createTextNode(lead.slice(1)));

      if (accent) {
        if (clean.includes(":")) {
          el.appendChild(document.createElement("br"));
        } else {
          el.appendChild(document.createTextNode(" "));
        }
        const bracket = document.createElement("span");
        bracket.className = "bracket-accent";
        bracket.textContent = `[ ${accent} ]`;
        el.appendChild(bracket);
      }
      return;
    }

    // Modo "script-end": texto editorial + última palabra en caligrafía fluida
    const words = clean.split(/\s+/);
    const lastWord = words.length > 1 ? words.pop() : "";
    const firstPart = words.join(" ");

    if (mode === "dropcap-and-script" && firstPart) {
      const drop = document.createElement("span");
      drop.className = "script-dropcap";
      drop.textContent = firstPart.charAt(0);
      el.appendChild(drop);
      el.appendChild(document.createTextNode(firstPart.slice(1)));
    } else if (firstPart) {
      el.appendChild(document.createTextNode(firstPart));
    }

    if (lastWord) {
      el.appendChild(document.createTextNode(" "));
      const script = document.createElement("span");
      script.className = "script-word";
      script.textContent = lastWord;
      el.appendChild(script);
    }
  }

  function createFallbackImageUri(label) {
    const safeLabel = String(label || "Nuestra Foto")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#f3eded"/>
        <rect x="26" y="26" width="748" height="548" fill="none" stroke="#821118" stroke-width="2" opacity="0.35"/>
        <text x="400" y="275" font-size="64" text-anchor="middle" fill="#821118">♥</text>
        <text x="400" y="355" font-family="Georgia, serif" font-style="italic" font-size="28" text-anchor="middle" fill="#463b3a">${safeLabel}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function attachImageFallback(imgEl, label) {
    imgEl.addEventListener("error", function handleImgError() {
      if (imgEl.dataset.fallbackApplied === "true") return;
      imgEl.dataset.fallbackApplied = "true";
      imgEl.src = createFallbackImageUri(label);
    });
  }

  // --------------------------------------------------------------------------
  // 1. HIDRATACIÓN DEL CONTENIDO DESDE config.js
  // --------------------------------------------------------------------------
  function hydrateContent() {
    // Encabezado editorial
    const headerStartDate = document.getElementById("header-start-date");
    const headerNames = document.getElementById("header-couple-names");
    if (headerStartDate) {
      headerStartDate.textContent = `${config.pareja.fechaInicio} — ${config.pareja.fechaCorte}`;
    }
    if (headerNames) {
      headerNames.textContent = config.pareja.nombres;
    }

    // Slide 1: Portada
    document.getElementById("s1-tag").textContent = config.slide1_portada.etiqueta;
    document.getElementById("s1-code-start").textContent =
      config.pareja.codigoInicio || "06";
    document.getElementById("s1-code-end").textContent =
      config.pareja.codigoFin || "11";
    renderEditorialTitle(
      document.getElementById("s1-title"),
      config.slide1_portada.titulo,
      "bracket"
    );
    document.getElementById("s1-subtitle").textContent =
      config.slide1_portada.subtitulo;
    document.getElementById("s1-btn-text").textContent =
      config.slide1_portada.textoBoton;

    // Slide 2: Contador del tiempo
    document.getElementById("s2-heading").textContent =
      config.slide2_tiempo.encabezado;
    const countersContainer = document.getElementById("s2-counters");
    countersContainer.innerHTML = "";
    config.slide2_tiempo.contadores.forEach((item, idx) => {
      const row = document.createElement("article");
      row.className = "time-row anim-item";
      row.style.setProperty("--delay", `${0.12 + idx * 0.11}s`);

      const numberSpan = document.createElement("span");
      numberSpan.className = "time-number js-time-counter";
      numberSpan.dataset.target = String(item.valor);
      numberSpan.dataset.separator = item.separadorMiles ? "true" : "false";
      numberSpan.dataset.suffix = item.sufijo || "";
      numberSpan.textContent = "0";

      const labelSpan = document.createElement("span");
      labelSpan.className = "time-label";
      labelSpan.textContent = item.etiqueta;

      row.appendChild(numberSpan);
      row.appendChild(labelSpan);
      countersContainer.appendChild(row);
    });
    document.getElementById("s2-quote").textContent =
      config.slide2_tiempo.fraseDivertida;

    // Slide 3: Top 3 Momentos (Polaroids editoriales)
    renderEditorialTitle(
      document.getElementById("s3-title"),
      config.slide3_momentos.titulo,
      "bracket"
    );
    document.getElementById("s3-subtitle").textContent =
      config.slide3_momentos.subtitulo;

    const polaroidsContainer = document.getElementById("s3-polaroids");
    polaroidsContainer.innerHTML = "";
    const applyBwFilter = config.slide3_momentos.fotosBlancoYNegro !== false;

    config.slide3_momentos.momentos.slice(0, 3).forEach((momento) => {
      const card = document.createElement("article");
      card.className = "polaroid-card";

      const dateTag = document.createElement("span");
      dateTag.className = "polaroid-date-tag";
      dateTag.textContent = momento.fecha;

      const photoWrap = document.createElement("div");
      photoWrap.className = "polaroid-photo-wrap";

      const img = document.createElement("img");
      img.className = applyBwFilter
        ? "polaroid-photo is-bw-filter"
        : "polaroid-photo";
      img.src = momento.foto;
      img.alt = momento.titulo;
      img.loading = "eager";
      attachImageFallback(img, momento.titulo);

      photoWrap.appendChild(img);

      const caption = document.createElement("div");
      caption.className = "polaroid-caption";

      const title = document.createElement("span");
      title.className = "polaroid-title";
      title.textContent = momento.titulo;

      caption.appendChild(title);

      card.appendChild(dateTag);
      card.appendChild(photoWrap);
      card.appendChild(caption);
      polaroidsContainer.appendChild(card);
    });

    // Slide 4: Estadísticas y chistes internos
    renderEditorialTitle(
      document.getElementById("s4-title"),
      config.slide4_estadisticas.titulo,
      "dropcap-and-script"
    );
    document.getElementById("s4-subtitle").textContent =
      config.slide4_estadisticas.subtitulo;

    const featured = config.slide4_estadisticas.contadorDestacado;
    document.getElementById("s4-featured-label").textContent = featured.etiqueta;
    const featuredValEl = document.getElementById("s4-featured-value");
    featuredValEl.dataset.target = String(featured.valor);
    featuredValEl.textContent = "0";
    document.getElementById("s4-featured-note").textContent = featured.nota;

    const barsContainer = document.getElementById("s4-bars-container");
    barsContainer.innerHTML = "";
    config.slide4_estadisticas.barras.forEach((barra, idx) => {
      const block = document.createElement("article");
      block.className = "stat-block anim-item";
      block.style.setProperty("--delay", `${0.22 + idx * 0.1}s`);

      const header = document.createElement("div");
      header.className = "bar-header";

      const label = document.createElement("span");
      label.className = "stat-label";
      label.textContent = barra.etiqueta;

      const percent = document.createElement("span");
      percent.className = "bar-percent js-bar-percent";
      percent.dataset.target = String(barra.porcentaje);
      percent.dataset.finalText = barra.valorTexto || `${barra.porcentaje}%`;
      percent.textContent = "0%";

      header.appendChild(label);
      header.appendChild(percent);

      const track = document.createElement("div");
      track.className = "bar-track";

      const fill = document.createElement("div");
      fill.className = "bar-fill";
      const safePct = Math.max(0, Math.min(100, Number(barra.porcentaje) || 0));
      fill.style.setProperty("--target-width", `${safePct}%`);
      track.appendChild(fill);

      block.appendChild(header);
      block.appendChild(track);

      if (barra.detalle) {
        const note = document.createElement("p");
        note.className = "stat-note";
        note.textContent = barra.detalle;
        block.appendChild(note);
      }

      barsContainer.appendChild(block);
    });

    const sleep = config.slide4_estadisticas.dormidoPrimero;
    document.getElementById("s4-sleep-label").textContent = sleep.etiqueta;
    document.getElementById("s4-sleep-name").textContent = sleep.nombre;
    document.getElementById("s4-sleep-note").textContent = sleep.detalle;

    // Slide 5: Nuestra Banda Sonora
    const s5 = config.slide5_bandaSonora;
    renderEditorialTitle(
      document.getElementById("s5-heading"),
      s5.encabezado,
      "script-end"
    );
    const coverImg = document.getElementById("s5-cover");
    coverImg.src = s5.caratula;
    coverImg.alt = `${s5.cancion} - ${s5.artista}`;
    attachImageFallback(coverImg, s5.cancion);

    document.getElementById("s5-song").textContent = s5.cancion;
    document.getElementById("s5-artist").textContent = s5.artista;
    document.getElementById("s5-time-current").textContent = s5.duracionActual;
    document.getElementById("s5-time-total").textContent = s5.duracionTotal;
    const spPct = Math.max(5, Math.min(98, Number(s5.porcentajeProgreso) || 42));
    document.getElementById("s5-progress-fill").style.width = `${spPct}%`;
    document.getElementById("s5-meaning").textContent = s5.porQueEsNuestra;

    // Slide 6: El mensaje sincero
    const s6 = config.slide6_mensaje;
    document.getElementById("s6-heading").textContent = s6.encabezado;
    renderScriptDropcap(document.getElementById("s6-salutation"), s6.saludo);
    const paragraphsEl = document.getElementById("s6-paragraphs");
    paragraphsEl.innerHTML = "";
    s6.parrafos.forEach((texto) => {
      const p = document.createElement("p");
      p.textContent = texto;
      paragraphsEl.appendChild(p);
    });
    document.getElementById("s6-farewell").textContent = s6.despedida;
    document.getElementById("s6-signature").textContent = s6.firma;

    // Slide 7: La sorpresa final (canje de cupones secretos)
    const s7 = config.slide7_sorpresa;
    document.getElementById("s7-pretitle").textContent = s7.preTitulo;
    renderEditorialTitle(
      document.getElementById("s7-title"),
      s7.titulo,
      "bracket"
    );
    document.getElementById("s7-subtitle").textContent = s7.subtitulo;
    if (s7.placeholderInput) {
      couponInput.placeholder = s7.placeholderInput;
    }
    document.getElementById("s7-btn-text").textContent = s7.textoBoton;
    renderCouponSlots();
  }

  function renderCouponSlots() {
    const cupones = Array.isArray(config.slide7_sorpresa.cupones)
      ? config.slide7_sorpresa.cupones
      : [];
    couponSlotsEl.innerHTML = "";

    let unlockedCount = 0;
    cupones.forEach((cupon, idx) => {
      const norm = normalizeCouponCode(cupon.codigo);
      const isUnlocked = state.unlockedCodes.has(norm);
      if (isUnlocked) unlockedCount++;

      const labelText = cupon.etiquetaLista || `Cupón ${idx + 1}`;

      if (isUnlocked) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "coupon-slot is-unlocked";
        btn.textContent = `✓ ${labelText}`;
        btn.title = "Toca para volver a ver tu premio";
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          revealCouponReward(cupon, false);
        });
        couponSlotsEl.appendChild(btn);
      } else {
        const span = document.createElement("span");
        span.className = "coupon-slot";
        span.textContent = `🔒 ${labelText}`;
        couponSlotsEl.appendChild(span);
      }
    });

    couponSlotsTitle.textContent = `Cupones desbloqueados: ${unlockedCount} de ${cupones.length}`;
  }

  function revealCouponReward(cupon, fullCelebration) {
    couponInput.blur();
    state.surpriseRevealed = true;

    couponBadgeEl.textContent = `cupón desbloqueado • ${String(cupon.codigo).toUpperCase()}`;
    couponUnlockedMsg.textContent = cupon.tituloGanado;
    couponUnlockedDesc.textContent = cupon.descripcion || "";
    couponExtraNote.textContent = cupon.notaPie || "";
    couponExtraNote.hidden = !cupon.notaPie;

    surpriseLocked.hidden = true;
    surpriseUnlocked.hidden = false;
    updateProgressUI(state.totalSlides - 1, 100);

    if (fullCelebration) {
      confetti.spawnBurst(155);
      setTimeout(() => confetti.spawnBurst(90), 360);
    } else {
      confetti.spawnBurst(75);
    }
  }

  // --------------------------------------------------------------------------
  // 2. BARRAS DE PROGRESO SUPERIORES Y CONTEO RÁPIDO (COUNT-UP)
  // --------------------------------------------------------------------------
  const progressFills = [];
  const progressSegments = [];

  function buildProgressBars() {
    progressContainer.innerHTML = "";
    for (let i = 0; i < state.totalSlides; i++) {
      const seg = document.createElement("div");
      seg.className = "progress-segment";
      seg.setAttribute("role", "tab");
      seg.setAttribute("aria-label", `Ir a pantalla ${i + 1}`);
      seg.addEventListener("click", (e) => {
        e.stopPropagation();
        if (i > 0 && !music.started) {
          music.start();
        }
        goToSlide(i);
      });

      const fill = document.createElement("div");
      fill.className = "progress-fill";
      seg.appendChild(fill);

      progressContainer.appendChild(seg);
      progressSegments.push(seg);
      progressFills.push(fill);
    }
  }

  function animateCountUp(el, target, durationMs, useThousandSeparator, suffix) {
    const prevId = state.countAnimations.get(el);
    if (prevId) cancelAnimationFrame(prevId);

    const startTime = performance.now();
    const endValue = Number(target) || 0;

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 4);
      const current = endValue * eased;
      el.textContent = `${formatNumber(current, useThousandSeparator)}${suffix || ""}`;

      if (t < 1) {
        const id = requestAnimationFrame(tick);
        state.countAnimations.set(el, id);
      } else {
        el.textContent = `${formatNumber(endValue, useThousandSeparator)}${suffix || ""}`;
        state.countAnimations.delete(el);
      }
    }

    const id = requestAnimationFrame(tick);
    state.countAnimations.set(el, id);
  }

  function triggerSlideAnimations(index) {
    if (index === 1) {
      const timeNumbers = document.querySelectorAll(".js-time-counter");
      timeNumbers.forEach((el, idx) => {
        const target = Number(el.dataset.target) || 0;
        const useSep = el.dataset.separator === "true";
        const suffix = el.dataset.suffix || "";
        el.textContent = "0";
        setTimeout(() => {
          animateCountUp(el, target, 1150 + idx * 140, useSep, suffix);
        }, 120);
      });
    }

    if (index === 3) {
      const featuredEl = document.getElementById("s4-featured-value");
      const featuredTarget = Number(featuredEl.dataset.target) || 0;
      featuredEl.textContent = "0";
      setTimeout(() => {
        animateCountUp(
          featuredEl,
          featuredTarget,
          1200,
          featuredTarget >= 1000,
          ""
        );
      }, 150);

      const barPercents = document.querySelectorAll(".js-bar-percent");
      barPercents.forEach((el) => {
        const target = Number(el.dataset.target) || 0;
        el.textContent = "0%";
        setTimeout(() => {
          animateCountUp(el, target, 1100, false, "%");
        }, 220);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. MOTOR DE NAVEGACIÓN TIPO STORIES
  // --------------------------------------------------------------------------
  function shouldAutoAdvance(slideIndex) {
    if (!config.configuracion.autoAvance) return false;
    return slideIndex > 0 && slideIndex < state.totalSlides - 1;
  }

  function updateProgressUI(activeIndex, pct) {
    for (let i = 0; i < state.totalSlides; i++) {
      const seg = progressSegments[i];
      const fill = progressFills[i];
      if (i < activeIndex) {
        seg.classList.add("is-completed");
        fill.style.width = "100%";
      } else if (i === activeIndex) {
        seg.classList.remove("is-completed");
        fill.style.width = `${pct}%`;
      } else {
        seg.classList.remove("is-completed");
        fill.style.width = "0%";
      }
    }
  }

  function updateFooterUI(index) {
    slideCounterEl.innerHTML = `página <strong>${index + 1}</strong> de ${state.totalSlides}`;
    footerPrevBtn.classList.toggle("is-hidden", index === 0);
    footerNextBtn.classList.toggle("is-hidden", index === state.totalSlides - 1);
  }

  function stopStoryTimer() {
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
  }

  function startStoryTimer() {
    stopStoryTimer();
    const duration = Number(config.configuracion.duracionSlideMs) || 8500;

    if (!shouldAutoAdvance(state.currentSlide)) {
      const staticPct =
        state.currentSlide === state.totalSlides - 1 && state.surpriseRevealed
          ? 100
          : 0;
      updateProgressUI(state.currentSlide, staticPct);
      return;
    }

    state.lastFrameTime = performance.now();

    function frame(now) {
      if (!state.isPaused) {
        const delta = now - state.lastFrameTime;
        state.progressMs += delta;
        const pct = Math.min(100, (state.progressMs / duration) * 100);
        updateProgressUI(state.currentSlide, pct);

        if (state.progressMs >= duration) {
          nextSlide();
          return;
        }
      }
      state.lastFrameTime = now;
      state.rafId = requestAnimationFrame(frame);
    }

    state.rafId = requestAnimationFrame(frame);
  }

  function goToSlide(index) {
    const clamped = Math.max(0, Math.min(state.totalSlides - 1, index));
    state.currentSlide = clamped;
    state.progressMs = 0;

    phoneFrame.dataset.activeSlide = String(clamped);
    updateFooterUI(clamped);

    slides.forEach((slideEl, i) => {
      if (i === clamped) {
        slideEl.classList.remove("is-active");
        void slideEl.offsetWidth;
        slideEl.classList.add("is-active");
      } else {
        slideEl.classList.remove("is-active");
      }
    });

    triggerSlideAnimations(clamped);
    startStoryTimer();
  }

  function nextSlide() {
    if (state.currentSlide < state.totalSlides - 1) {
      goToSlide(state.currentSlide + 1);
    }
  }

  function prevSlide() {
    if (state.currentSlide > 0) {
      goToSlide(state.currentSlide - 1);
    } else {
      state.progressMs = 0;
      updateProgressUI(0, 0);
    }
  }

  function pauseStory() {
    if (state.isPaused) return;
    state.isPaused = true;
    phoneFrame.classList.add("is-paused");
  }

  function resumeStory() {
    if (!state.isPaused) return;
    state.isPaused = false;
    state.lastFrameTime = performance.now();
    phoneFrame.classList.remove("is-paused");
  }

  function flashTapZone(zoneEl) {
    if (!zoneEl) return;
    zoneEl.classList.add("is-flash");
    setTimeout(() => zoneEl.classList.remove("is-flash"), 160);
  }

  // --------------------------------------------------------------------------
  // 4. GESTOS TÁCTILES Y DE RATÓN (TAP, SWIPE Y MANTENER PRESIONADO)
  // --------------------------------------------------------------------------
  function setupGestures() {
    let pointerDown = false;
    let startX = 0;
    let startY = 0;
    let isHolding = false;
    let holdTimer = null;
    let activePointerId = null;

    phoneFrame.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (
        e.target.closest(
          "button, a, input, form, .coupon-slot, .stories-header, .editorial-footer"
        )
      ) {
        return;
      }

      pointerDown = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      isHolding = false;

      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        if (!pointerDown) return;
        isHolding = true;
        pauseStory();
      }, 180);
    });

    phoneFrame.addEventListener("pointermove", (e) => {
      if (!pointerDown || e.pointerId !== activePointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 12) {
        clearTimeout(holdTimer);
      }
    });

    function handlePointerRelease(e, cancelled) {
      if (!pointerDown || e.pointerId !== activePointerId) return;
      pointerDown = false;
      activePointerId = null;
      clearTimeout(holdTimer);

      if (isHolding) {
        isHolding = false;
        resumeStory();
        return;
      }

      if (cancelled) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.15) {
        if (dx < 0) {
          if (state.currentSlide === 0 && !music.started) music.start();
          nextSlide();
        } else {
          prevSlide();
        }
        return;
      }

      if (Math.abs(dx) < 16 && Math.abs(dy) < 16) {
        const rect = phoneFrame.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        if (relX < rect.width * 0.42) {
          flashTapZone(tapZoneLeft);
          prevSlide();
        } else {
          flashTapZone(tapZoneRight);
          if (state.currentSlide === 0 && !music.started) music.start();
          nextSlide();
        }
      }
    }

    phoneFrame.addEventListener("pointerup", (e) => handlePointerRelease(e, false));
    phoneFrame.addEventListener("pointercancel", (e) =>
      handlePointerRelease(e, true)
    );

    window.addEventListener("keydown", (e) => {
      if (e.target && e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight") {
        if (state.currentSlide === 0 && !music.started) music.start();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === " " && !e.target.closest("button")) {
        e.preventDefault();
        if (state.isPaused) {
          resumeStory();
        } else {
          pauseStory();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. SISTEMA DE MÚSICA DUAL (MP3 EN assets/ + SINTETIZADOR AMBIENTAL)
  // --------------------------------------------------------------------------
  const ambientSynth = {
    ctx: null,
    masterGain: null,
    intervalId: null,
    running: false,
    chordIndex: 0,
    chords: [
      [174.61, 220.0, 261.63, 329.63],
      [164.81, 196.0, 246.94, 293.66],
      [146.83, 174.61, 220.0, 261.63],
      [130.81, 164.81, 196.0, 246.94],
    ],

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.0001;
        this.masterGain.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return true;
    },

    playChord() {
      if (!this.ctx || !this.running) return;
      const now = this.ctx.currentTime;
      const freqs = this.chords[this.chordIndex % this.chords.length];
      this.chordIndex++;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(680, now);
      filter.connect(this.masterGain);

      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        const peak = 0.045 / freqs.length;
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(peak, now + 0.65);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.1);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    },

    start(volume) {
      if (!this.ensureContext()) return;
      if (!this.running) {
        this.running = true;
        this.playChord();
        this.intervalId = setInterval(() => this.playChord(), 2800);
      }
      this.setVolume(volume, 1.3);
    },

    setVolume(target, fadeSeconds = 0.35) {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(
        Math.max(0.0001, this.masterGain.gain.value),
        now
      );
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0.0001, target),
        now + fadeSeconds
      );
    },

    mute() {
      this.setVolume(0.0001, 0.25);
    },
  };

  const music = {
    started: false,
    muted: true,
    usingFallbackSynth: false,
    fadeTimer: null,
    targetVolume: Math.max(
      0.05,
      Math.min(1, Number(config.musica.volumen) || 0.55)
    ),

    init() {
      bgAudio.src = config.musica.ruta;
      bgAudio.volume = 0;

      bgAudio.addEventListener("error", () => {
        this.switchToFallback();
      });

      bgAudio.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(bgAudio.duration) && bgAudio.duration < 2) {
          this.switchToFallback();
        }
      });
    },

    switchToFallback() {
      if (this.usingFallbackSynth) return;
      this.usingFallbackSynth = true;
      try {
        bgAudio.pause();
      } catch (_) {}
      if (this.started && !this.muted) {
        ambientSynth.start(this.targetVolume);
      }
    },

    fadeAudioElement(toVolume, durationMs) {
      clearInterval(this.fadeTimer);
      const steps = 24;
      const stepTime = durationMs / steps;
      const startVol = bgAudio.volume;
      let step = 0;

      this.fadeTimer = setInterval(() => {
        step++;
        const ratio = step / steps;
        bgAudio.volume = Math.max(
          0,
          Math.min(1, startVol + (toVolume - startVol) * ratio)
        );
        if (step >= steps) {
          clearInterval(this.fadeTimer);
        }
      }, stepTime);
    },

    syncUI() {
      audioToggleBtn.classList.toggle("is-muted", this.muted);
      phoneFrame.classList.toggle("is-music-muted", this.muted);
    },

    start() {
      this.started = true;
      this.muted = false;
      this.syncUI();

      ambientSynth.ensureContext();

      if (
        this.usingFallbackSynth ||
        (bgAudio.readyState >= 1 &&
          Number.isFinite(bgAudio.duration) &&
          bgAudio.duration < 2)
      ) {
        this.switchToFallback();
        ambientSynth.start(this.targetVolume);
        return;
      }

      bgAudio.volume = 0;
      const playPromise = bgAudio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            if (Number.isFinite(bgAudio.duration) && bgAudio.duration < 2) {
              this.switchToFallback();
            } else {
              this.fadeAudioElement(this.targetVolume, 1400);
            }
          })
          .catch(() => {
            this.switchToFallback();
          });
      }
    },

    toggleMute() {
      if (!this.started) {
        this.start();
        return;
      }

      this.muted = !this.muted;
      this.syncUI();

      if (this.usingFallbackSynth) {
        if (this.muted) {
          ambientSynth.mute();
        } else {
          ambientSynth.start(this.targetVolume);
        }
      } else {
        if (this.muted) {
          this.fadeAudioElement(0, 260);
          setTimeout(() => {
            if (this.muted) bgAudio.pause();
          }, 270);
        } else {
          bgAudio.play().catch(() => this.switchToFallback());
          this.fadeAudioElement(this.targetVolume, 450);
        }
      }
    },
  };

  // --------------------------------------------------------------------------
  // 6. CONFETI EN PANTALLA COMPLETA (PALETA CARMESÍ, ROSA Y MARFIL)
  // --------------------------------------------------------------------------
  const confetti = {
    ctx: confettiCanvas.getContext("2d"),
    particles: [],
    animId: null,
    colors: ["#821118", "#b3242e", "#e2c2c2", "#fcfaf7", "#d4af37", "#e8a598"],

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      confettiCanvas.width = Math.floor(window.innerWidth * dpr);
      confettiCanvas.height = Math.floor(window.innerHeight * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },

    spawnBurst(count = 150) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const originX = w / 2;
      const originY = h * 0.56;

      for (let i = 0; i < count; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.35;
        const speed = 5 + Math.random() * 11;
        const isHeart = Math.random() < 0.22;

        this.particles.push({
          x: originX + (Math.random() - 0.5) * 80,
          y: originY + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 4,
          size: isHeart ? 7 + Math.random() * 5 : 6 + Math.random() * 6,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          tilt: Math.random() * Math.PI,
          tiltSpeed: 0.06 + Math.random() * 0.08,
          isHeart,
          alpha: 1,
        });
      }

      if (!this.animId) {
        this.animate();
      }
    },

    drawHeart(ctx, size) {
      ctx.beginPath();
      const s = size * 0.55;
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s, -s * 0.45, -s * 1.15, s * 0.65, 0, s * 1.25);
      ctx.bezierCurveTo(s * 1.15, s * 0.65, s, -s * 0.45, 0, s * 0.35);
      ctx.fill();
    },

    animate() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.ctx.clearRect(0, 0, w, h);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.vy += 0.22;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.tilt += p.tiltSpeed;

        if (p.y > h * 0.86) {
          p.alpha -= 0.025;
        }

        if (p.alpha <= 0 || p.y > h + 40) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.scale(1, Math.cos(p.tilt));
        this.ctx.fillStyle = p.color;

        if (p.isHeart) {
          this.drawHeart(this.ctx, p.size);
        } else {
          this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
        }
        this.ctx.restore();
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.animate());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, w, h);
      }
    },
  };

  // --------------------------------------------------------------------------
  // 7. BOTONES DE ACCIÓN E INICIALIZACIÓN
  // --------------------------------------------------------------------------
  function setupButtons() {
    btnStart.addEventListener("click", (e) => {
      e.stopPropagation();
      music.start();
      goToSlide(1);
    });

    footerPrevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
    });

    footerNextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.currentSlide === 0 && !music.started) {
        music.start();
      }
      nextSlide();
    });

    audioToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      music.toggleMute();
    });

    spotifyPlayBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      music.toggleMute();
    });

    couponInput.addEventListener("input", () => {
      couponInput.classList.remove("is-error");
      couponFeedback.hidden = true;
    });

    couponForm.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const typed = normalizeCouponCode(couponInput.value);
      const cupones = Array.isArray(config.slide7_sorpresa.cupones)
        ? config.slide7_sorpresa.cupones
        : [];
      const matched = cupones.find(
        (c) => normalizeCouponCode(c.codigo) === typed && typed.length > 0
      );

      if (!matched) {
        couponFeedback.textContent =
          config.slide7_sorpresa.mensajeError ||
          "Código incorrecto. Pídele tu código secreto a tu novio ❤️";
        couponFeedback.hidden = false;
        couponInput.classList.remove("is-error");
        void couponInput.offsetWidth;
        couponInput.classList.add("is-error");
        return;
      }

      couponFeedback.hidden = true;
      couponInput.classList.remove("is-error");
      couponInput.value = "";

      const normCode = normalizeCouponCode(matched.codigo);
      state.unlockedCodes.add(normCode);
      saveUnlockedCoupons(state.unlockedCodes);
      renderCouponSlots();
      revealCouponReward(matched, true);
    });

    btnAnotherCoupon.addEventListener("click", (e) => {
      e.stopPropagation();
      surpriseUnlocked.hidden = true;
      surpriseLocked.hidden = false;
      couponFeedback.hidden = true;
      couponInput.value = "";
    });

    btnReplayConfetti.addEventListener("click", (e) => {
      e.stopPropagation();
      confetti.spawnBurst(130);
    });

    btnRestartStory.addEventListener("click", (e) => {
      e.stopPropagation();
      state.surpriseRevealed = false;
      surpriseLocked.hidden = false;
      surpriseUnlocked.hidden = true;
      couponFeedback.hidden = true;
      goToSlide(0);
    });
  }

  function init() {
    hydrateContent();
    buildProgressBars();
    music.init();
    music.syncUI();
    confetti.resize();
    window.addEventListener("resize", () => confetti.resize());
    setupGestures();
    setupButtons();
    goToSlide(0);
  }

  init();
})();
