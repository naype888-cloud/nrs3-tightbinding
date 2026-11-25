// Tabla periódica editorial + mini-escena 3D Open Cube +/+/+ + inspector + filtros.
(function () {
  "use strict";
  var DATOS = window.ELEMENTOS || [];
  var tabla = document.getElementById("tabla");
  if (!tabla) return;

  // ---- 1. C_N exacto de Lean (estado de corriente máxima, PhyslibAlpha) -----
  // C_N² = ((N+1)^2 (2 N + 1 - ...) ) — calculado directamente desde Variances.lean:
  // Var H = (t²/2) (1 - cos(2θ)...) ; forma directa numérica exacta sobre la cadena P_N:
  function calcCN(N) {
    if (N <= 3) return 1.0;
    var th = Math.PI / (N + 1);
    var norm2 = (N + 1) / 2;
    var varH = 0, meanX = 0, varX = 0;
    // ψ_n = sqrt(2/(N+1)) * i^n * sin((n+1)*th), n = 0..N-1
    var probs = [];
    for (var n = 0; n < N; n++) {
      var p = (2 / (N + 1)) * Math.pow(Math.sin((n + 1) * th), 2);
      probs.push(p);
      meanX += n * p;
    }
    for (var n2 = 0; n2 < N; n2++) varX += Math.pow(n2 - meanX, 2) * probs[n2];
    // ⟨ψ|H|ψ⟩ = 0 (E0=0), ⟨ψ|H²|ψ⟩ en P_N con t=1:
    // H ψ_n = - (ψ_{n-1} + ψ_{n+1}); ⟨H²⟩ = sum |H ψ_n|²
    var h2 = 0;
    for (var m = 0; m < N; m++) {
      // ψ_n = i^n s_n; -(ψ_{m-1} + ψ_{m+1}) = -(i^{m-1} s_{m-1} + i^{m+1} s_{m+1})
      // i^{m-1} - i^{m+1} = i^{m-1}(1 - i^2) ... wait: i^{m+1} = -i^{m-1}, asi que |ψ_{m-1}+ψ_{m+1}| = |s_{m-1} - s_{m+1}|
      var sL = m > 0 ? Math.sin(m * th) : 0;
      var sR = m + 1 < N ? Math.sin((m + 2) * th) : 0;
      h2 += (1 / norm2) * Math.pow(sL - sR, 2);
    }
    varH = h2;
    var br = Math.cos(th); // |⟨⁅H,X⁆⟩|/(a*t)
    return Math.sqrt(varH * varX) / Math.abs(br);
  }

  // ---- 2. Hero Ticker (teoremas Lean, incl. #2118, #2096, #2122) ------------
  var TICKER = [
    { idx: "01 / 06", ttl: "1 celda = 1 orbital (PR #2118)", code: "hopping_hoppingMatrix : Matrix (Fin 1) (Fin 1) ℂ" },
    { idx: "02 / 06", ttl: "Solo Open Cube (PR #2096)", code: "inner_openHamiltonian_eq_adjMatrix (pathGraph N)" },
    { idx: "03 / 06", ttl: "Core saturante ≤ (3,3,3)", code: "cierra d ↔ d ≤ 3 · C_N = 1 en N = 2, 3" },
    { idx: "04 / 06", ttl: "Apertura en (4,4,4) (PR #2122)", code: "N = 4: umbral ≥ 3/2 |a t| · banda abierta" },
    { idx: "05 / 06", ttl: "Incertidumbre cinemática 3D", code: "det Σ = (C_Nx · C_Ny · C_Nz)² |det Ω|" },
    { idx: "06 / 06", ttl: "Bravais = espectro del cubo (PR #1987)", code: "Crystal.bravais 3 · AxisStepWords · spec B = ⋃ spec b(χ)" }
  ];
  var tIdx = 0;
  var elTick = document.getElementById("hero-ticker");
  function showTicker() {
    if (!elTick) return;
    var item = TICKER[tIdx];
    elTick.innerHTML = '<span class="idx">' + item.idx + '</span><span class="ttl">' + item.ttl +
      '</span><code>' + item.code + "</code>";
    tIdx = (tIdx + 1) % TICKER.length;
  }
  showTicker();
  setInterval(showTicker, 3400);

  // ---- 3. Mini-canvas 3D interactivo (Open Cube desde (0,0,0) en +/+/+) ----
  var cvs = document.getElementById("mini-cube");
  if (cvs && cvs.getContext) {
    var ctx = cvs.getContext("2d");
    var yaw = -0.68, pitch = 0.52, dragging = false, lx = 0, ly = 0;
    function resizeCvs() {
      var r = cvs.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.max(10, Math.floor(r.width * dpr));
      cvs.height = Math.max(10, Math.floor(r.height * dpr));
    }
    resizeCvs();
    window.addEventListener("resize", resizeCvs);

    cvs.addEventListener("pointerdown", function (ev) { dragging = true; lx = ev.clientX; ly = ev.clientY; });
    window.addEventListener("pointerup", function () { dragging = false; });
    window.addEventListener("pointermove", function (ev) {
      if (!dragging) return;
      yaw += (ev.clientX - lx) * 0.008;
      pitch = Math.max(-1.1, Math.min(1.2, pitch + (ev.clientY - ly) * 0.008));
      lx = ev.clientX; ly = ev.clientY;
    });

    function proj(x, y, z, cx, cy, sc) {
      // Centramos visualmente alrededor de (2.8, 2.8, 2.8) manteniendo (0,0,0) como ancla inferior izquierda
      var X = x - 2.6, Y = y - 2.6, Z = z - 2.6;
      var cyw = Math.cos(yaw), syw = Math.sin(yaw);
      var x1 = X * cyw - Z * syw;
      var z1 = X * syw + Z * cyw;
      var cpi = Math.cos(pitch), spi = Math.sin(pitch);
      var y2 = Y * cpi - z1 * spi;
      var z2 = Y * spi + z1 * cpi;
      var k = sc / (1 + z2 * 0.055);
      return [cx + x1 * k, cy - y2 * k, z2];
    }

    function drawMini(t) {
      requestAnimationFrame(drawMini);
      if (!dragging) yaw += 0.0022;
      var w = cvs.width, h = cvs.height;
      ctx.clearRect(0, 0, w, h);
      var dark = document.documentElement.dataset.theme === "dark" ||
        (!document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
      var cInk = dark ? "#f2f1ee" : "#0b0b0b";
      var cBlue = dark ? "#5b9be6" : "#1f63b8";
      var cWarm = dark ? "#f08a5d" : "#d95b26";
      var cGold = dark ? "#ffc400" : "#b87b00";
      var cMute = dark ? "rgba(138,137,133,0.45)" : "rgba(103,102,95,0.45)";
      var cx = w * 0.5, cy = h * 0.54, sc = Math.min(w, h) * 0.088;

      // Ejes +X, +Y, +Z desde (0,0,0) -> +/+/+ (abiertos)
      var o = proj(0, 0, 0, cx, cy, sc);
      [[7.2, 0, 0, "+X"], [0, 7.2, 0, "+Y"], [0, 0, 7.2, "+Z"]].forEach(function (ax) {
        var p = proj(ax[0], ax[1], ax[2], cx, cy, sc);
        ctx.strokeStyle = cMute;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
        ctx.fillStyle = cMute;
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText(ax[3] + "→∞", p[0] + 4, p[1]);
      });

      // Caja saturante [0,3]^3 en dorado
      ctx.strokeStyle = cGold;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1.2;
      var edges = [
        [[0,0,0],[3,0,0]], [[3,0,0],[3,3,0]], [[3,3,0],[0,3,0]], [[0,3,0],[0,0,0]],
        [[0,0,3],[3,0,3]], [[3,0,3],[3,3,3]], [[3,3,3],[0,3,3]], [[0,3,3],[0,0,3]],
        [[0,0,0],[0,0,3]], [[3,0,0],[3,0,3]], [[3,3,0],[3,3,3]], [[0,3,0],[0,3,3]]
      ];
      edges.forEach(function (e) {
        var a = proj(e[0][0], e[0][1], e[0][2], cx, cy, sc);
        var b = proj(e[1][0], e[1][1], e[1][2], cx, cy, sc);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });
      ctx.globalAlpha = 1;

      // Sitios de +/+/+ (0..6): 0..3 dorado/tenue; (4,4,4), (5,5,5), (6,6,6) destacados
      for (var x = 1; x <= 6; x++) {
        for (var y = 1; y <= 6; y++) {
          for (var z = 1; z <= 6; z++) {
            var isCore = x <= 3 && y <= 3 && z <= 3;
            var isDiagOrb = (x === y && y === z && x >= 4);
            if (!isCore && !isDiagOrb && ((x + y + z) % 2 !== 0)) continue;
            var pt = proj(x, y, z, cx, cy, sc);
            ctx.beginPath();
            var rad = isDiagOrb ? 4.4 : (isCore ? 1.9 : 1.5);
            ctx.arc(pt[0], pt[1], rad, 0, Math.PI * 2);
            ctx.fillStyle = isDiagOrb ? (x === 4 ? cWarm : cBlue) : (isCore ? cGold : cBlue);
            ctx.globalAlpha = isDiagOrb ? 0.95 : (isCore ? 0.55 : 0.25);
            ctx.fill();
            if (isDiagOrb) {
              ctx.globalAlpha = 0.95;
              ctx.fillStyle = cInk;
              ctx.font = "10px JetBrains Mono, monospace";
              ctx.fillText("(" + x + "," + x + "," + x + ")", pt[0] + 7, pt[1] + 3);
            }
          }
        }
      }
      // Pulso hopping (4,4,4) -> (5,5,5)
      var pulse = 0.5 + 0.5 * Math.sin(t * 0.003);
      var p0 = proj(0, 0, 0, cx, cy, sc);
      ctx.globalAlpha = 0.95;
      ctx.beginPath(); ctx.arc(p0[0], p0[1], 4 + pulse * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = cWarm; ctx.fill();
      ctx.fillStyle = cInk; ctx.font = "10px JetBrains Mono, monospace";
      ctx.fillText("(0,0,0) Bloch d=2", p0[0] + 7, p0[1] + 12);
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(drawMini);
  }

  // ---- 4. Poblar selector Bravais y construir la Tabla Periódica ------------
  var selBravais = document.getElementById("sel-bravais");
  if (selBravais) {
    var seenB = {};
    DATOS.forEach(function (e) {
      if (!seenB[e.bravais.id]) seenB[e.bravais.id] = e.bravais.sistema + " · " + e.bravais.id;
    });
    Object.keys(seenB).sort().forEach(function (id) {
      var op = document.createElement("option");
      op.value = id;
      op.textContent = seenB[id];
      selBravais.appendChild(op);
    });
  }

  var inspSym = document.getElementById("insp-sym");
  var inspName = document.getElementById("insp-name");
  var inspMeta = document.getElementById("insp-meta");
  var inspOpen = document.getElementById("insp-open");
  var inspCrystal = document.getElementById("insp-crystal");
  var cells = [];

  function inspect(e) {
    if (!e) return;
    cells.forEach(function (c) { c.el.classList.toggle("sel", c.data.z === e.z); });
    if (inspSym) inspSym.innerHTML = '<span class="iz">Z=' + e.z + '</span><span class="is">' + e.sim + '</span>';
    if (inspName) inspName.innerHTML = '<strong>' + e.nombre + '</strong><span>' + e.sim + '-' + e.masaA +
      ' (' + e.z + 'p + ' + e.n + 'n) · Bloque ' + e.bloque + '</span>';
    var cn = calcCN(e.cajaN);
    var nivelTxt = e.kMax <= 3 ? "Core saturante ≤ (3,3,3)" : "hasta (" + e.kMax + "," + e.kMax + "," + e.kMax + ")";
    if (inspMeta) {
      inspMeta.innerHTML =
        'Config: <b>' + e.config + '</b> · Valencia: ' + e.valencia +
        '<br>Open Cube <code>Fin ' + e.cajaN + '³</code> en +/+/+ (' + nivelTxt + ') · C<sub>' + e.cajaN + '</sub> = ' + cn.toFixed(4) +
        '<br>Espectro Bravais: <code>' + e.bravais.id + '</code> — ' + e.bravais.nombre + ' (' + e.bravais.fase + ')';
    }
    if (inspOpen) inspOpen.href = "ver.html?z=" + e.z;
    if (inspCrystal) inspCrystal.href = "https://naype888-cloud.github.io/nrs3-cristales/lab/#" + e.bravais.id;
  }

  function celda(e) {
    var a = document.createElement("a");
    a.className = "el b-" + e.bloque;
    a.href = "ver.html?z=" + e.z;
    a.style.gridRow = e.fila > 7 ? e.fila + 1 : e.fila;
    a.style.gridColumn = e.col;
    a.title = e.nombre + " (Z=" + e.z + ") · " + e.config + " · " + e.bravais.id;
    a.setAttribute("aria-label", e.nombre + ", número atómico " + e.z + ", red " + e.bravais.id);
    a.innerHTML =
      '<div class="top-el"><span class="z">' + e.z + '</span><span class="br">' + e.bravais.id + '</span></div>' +
      '<span class="s">' + e.sim + '</span>' +
      '<span class="n">' + e.nombre + '</span>';
    a.addEventListener("mouseenter", function () { inspect(e); });
    a.addEventListener("focus", function () { inspect(e); });
    return a;
  }

  function marca(texto, fila) {
    var m = document.createElement("div");
    m.className = "marca";
    m.textContent = texto;
    m.style.gridRow = fila;
    m.style.gridColumn = 3;
    return m;
  }

  var hueco = document.createElement("div");
  hueco.className = "hueco";
  hueco.style.gridRow = 8;
  tabla.appendChild(hueco);
  tabla.appendChild(marca("57–71", 6));
  tabla.appendChild(marca("89–103", 7));
  DATOS.forEach(function (e) {
    var el = celda(e);
    tabla.appendChild(el);
    cells.push({ data: e, el: el });
  });

  // Inspector inicial: Hierro (Z=26) o Hidrógeno (Z=1)
  inspect(DATOS[25] || DATOS[0]);

  // ---- 5. Filtros y búsqueda -----------------------------------------------
  var activeBlock = "all";
  var qIn = document.getElementById("q-elem");
  var ley = document.getElementById("leyenda");

  function applyFilters() {
    var q = (qIn ? qIn.value.trim().toLowerCase() : "");
    var br = selBravais ? selBravais.value : "all";
    var shown = 0;
    cells.forEach(function (c) {
      var d = c.data;
      var okBlock = (activeBlock === "all" || d.bloque === activeBlock);
      var okBr = (br === "all" || d.bravais.id === br);
      var okQ = !q ||
        String(d.z) === q ||
        d.sim.toLowerCase().indexOf(q) !== -1 ||
        d.nombre.toLowerCase().indexOf(q) !== -1 ||
        d.config.toLowerCase().indexOf(q) !== -1 ||
        d.bravais.id.toLowerCase() === q;
      var match = okBlock && okBr && okQ;
      c.el.classList.toggle("dim", !match);
      if (match) shown++;
    });
    if (ley) {
      ley.innerHTML =
        '<span><i class="s"></i>s</span><span><i class="p"></i>p</span><span><i class="d"></i>d</span>' +
        '<span><i class="f"></i>f</span><span class="fin">' + shown + " / " + DATOS.length +
        " elementos · Open Cube +/+/+ · vacío comprimido 90:10 → 1:1</span>";
    }
  }

  document.querySelectorAll(".chip-btn[data-block]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeBlock = btn.getAttribute("data-block");
      document.querySelectorAll(".chip-btn[data-block]").forEach(function (b) {
        b.classList.toggle("on", b === btn);
      });
      applyFilters();
    });
  });
  if (qIn) qIn.addEventListener("input", applyFilters);
  if (selBravais) selBravais.addEventListener("change", applyFilters);
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "/" && document.activeElement !== qIn && qIn) {
      ev.preventDefault();
      qIn.focus();
    }
  });
  applyFilters();
})();
