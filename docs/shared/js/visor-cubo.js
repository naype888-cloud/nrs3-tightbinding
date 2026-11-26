// Visor canónico Open Cube +/+/+ (1 celda = 1 orbital, PR #2118 / #2096 / #2122, compresión 90:10 -> 1:1).
(function () {
  "use strict";

  var DATOS = window.ELEMENTOS || [];
  var zParam = parseInt(new URLSearchParams(location.search).get("z"), 10) || 1;
  var elem = DATOS.filter(function (x) { return x.z === zParam; })[0];

  var quien = document.getElementById("quien");
  if (!elem) {
    if (quien) quien.textContent = "Elemento no disponible";
    return;
  }

  document.title = "RS^N³ · " + elem.nombre + " (Z=" + elem.z + ") · Open Cube";
  if (quien) {
    quien.innerHTML = "<b>" + elem.sim + "</b>" + elem.nombre + " · Z=" + elem.z +
      "<small>Fin " + elem.cajaN + "³ (+/+/+) · " + elem.bravais.id + "</small>";
  }
  function setNav(id, target) {
    var a = document.getElementById(id);
    if (!a) return;
    if (target) {
      a.href = "ver.html?z=" + target.z;
      a.title = target.nombre + " (Z=" + target.z + ")";
    } else {
      a.setAttribute("aria-disabled", "true");
      a.removeAttribute("href");
    }
  }
  setNav("ant", DATOS.filter(function (x) { return x.z === elem.z - 1; })[0]);
  setNav("sig", DATOS.filter(function (x) { return x.z === elem.z + 1; })[0]);
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") location.href = "index.html#tabla-sec";
  });

  // ---- Utilidades matemáticas exactas (Lean PhyslibAlpha) ------------------
  function calcCN(N) {
    if (N <= 3) return 1.0;
    var th = Math.PI / (N + 1);
    var norm2 = (N + 1) / 2;
    var meanX = 0, varX = 0, varH = 0;
    var probs = [];
    for (var n = 0; n < N; n++) {
      var p = (2 / (N + 1)) * Math.pow(Math.sin((n + 1) * th), 2);
      probs.push(p);
      meanX += n * p;
    }
    for (var n2 = 0; n2 < N; n2++) varX += Math.pow(n2 - meanX, 2) * probs[n2];
    for (var m = 0; m < N; m++) {
      var sL = m > 0 ? Math.sin(m * th) : 0;
      var sR = m + 1 < N ? Math.sin((m + 2) * th) : 0;
      varH += (1 / norm2) * Math.pow(sL - sR, 2);
    }
    return Math.sqrt(varH * varX) / Math.abs(Math.cos(th));
  }
  var SZEGO_MAX = Math.sqrt(Math.PI * Math.PI / 3 - 2);

  // Red espectral del pathgraph 3D: cada eje (x, y, z) es una cadena abierta con su propio C_Nava
  // (PR #1725 CNava_alongX/Y/Z, #1742 det Σ = (C_x C_y C_z)² |det Ω|, estricto desde 4×4×4).
  // Core 0..3 a paso 1 (saturado, C_3 = 1). Desde 4 el paso por eje es C_j, estrictamente creciente
  // (#1735 cNavaSqForm_strictMonoOn) y acotado por SZEGO_MAX (#1734 tendsto_CNava).
  // La lógica de saltos y Pauli sigue en enteros; W() solo coloca y mide en la red deformada.
  var warpTab = [0, 1, 2, 3];
  function W(m) {
    if (m <= 3) return m;
    var i = Math.floor(m);
    while (warpTab.length <= i) warpTab.push(warpTab[warpTab.length - 1] + calcCN(warpTab.length));
    var f = m - i;
    return warpTab[i] + (f > 0 ? f * calcCN(i + 1) : 0);
  }

  // ---- Poblar HUD textual por elemento (cero residuos heredados) -----------
  var N = elem.cajaN;
  var totalSites = N * N * N;
  var freeSitesPos = Math.pow(Math.max(0, N - 4), 3); // x,y,z >= 4 sin ningún 3
  var coreSitesPos = totalSites - freeSitesPos; // min(x,y,z) <= 3 en +/+/+
  var cN = calcCN(N);
  var detRatio = Math.pow(cN, 6);

  document.getElementById("badge-elem").textContent = elem.nombre.toUpperCase() + " · " + elem.sim + "-" + elem.masaA;
  document.getElementById("badge-cube").textContent = "OPEN CUBE Fin " + N + "³ (" + totalSites + " celdas)";
  document.getElementById("badge-bravais").textContent = "BRAVAIS " + elem.bravais.id;
  document.getElementById("el-title").textContent = elem.nombre + " (" + elem.sim + ")";
  document.getElementById("el-sub").textContent =
    elem.config + " · Core " + (elem.coreSym ? "[" + elem.coreSym + "]" : "ninguno") +
    " · Valencia " + elem.valencia + " · Red " + elem.bravais.nombre;

  document.getElementById("core-desc-txt").innerHTML =
    "El <b>núcleo y los puntos grises vacíos (≤ 3)</b> están <b>dentro del átomo</b> en <code>+/+/+</code>: arrancan en <b>(0,0,0)</b>, abarcan <code>(0..3)³</code> y todo punto con un <code>3</code> (<code>mín(x,y,z) ≤ 3</code>). Ahí se <b>satura el gaussiano sin exclusión de Pauli</b> (pueden coincidir protones, neutrones y <code>1s</code>) con hopping a mayor velocidad; potencial <code>V(r) ~ −" + elem.z + "/r</code>.";

  document.getElementById("open-desc-txt").innerHTML =
    "El cubo de colores sin ningún <code>3</code> (<code>x,y,z ≥ 4</code>) arranca en la <b>primera muesca gris (4,4,4)</b> (umbral <code>N=4</code> PR #2122) hasta " +
    (elem.kMax >= 4 ? "<b>(" + elem.kMax + "," + elem.kMax + "," + elem.kMax + ")</b>" : "el borde abierto") +
    ": ahí sí rige la <b>exclusión de Pauli / Slater</b> (1 celda = 1 electrón). Vacío <b>90:10 → 1:1</b> (" + freeSitesPos + " celdas en <code>+/+/+</code>).";

  document.getElementById("bravais-link").href = "https://naype888-cloud.github.io/nrs3-cristales/lab/#" + elem.bravais.id;
  document.getElementById("bravais-txt").textContent =
    elem.bravais.id + " · " + elem.bravais.nombre + " (" + elem.bravais.fase + "). " +
    "Las redes de Bravais son el espectro completo de pasos de eje del cubo.";

  document.getElementById("stat-cubo").textContent = "Fin " + N + "³ (+/+/+)";
  document.getElementById("stat-core").textContent = "0..3 + todo 3 (" + coreSitesPos + " en +/+/+)";
  document.getElementById("stat-orb").textContent = elem.kMax >= 4 ? "(4,4,4)→(" + elem.kMax + "," + elem.kMax + "," + elem.kMax + ")" : "(4,4,4) umbral";
  document.getElementById("stat-cn").textContent = "C_" + N + "=" + cN.toFixed(4) + " · ΠC²=" + detRatio.toFixed(3);
  document.getElementById("stat-elec").textContent = elem.z + " / " + elem.z;
  document.getElementById("stat-dmin").textContent = elem.z === 1 ? "— (1 electrón)" : "≥ 1.000";

  // Botones dinámicos por subcapa real de Z
  var layerBtns = document.getElementById("layer-filter-btns");
  function mkLayerBtn(label, key, on) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "vaction" + (on ? " on" : "");
    b.textContent = label;
    b.addEventListener("click", function () {
      layerBtns.querySelectorAll(".vaction").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on");
      filterElectronsBySubshell(key);
    });
    layerBtns.appendChild(b);
  }
  mkLayerBtn("Todos (" + elem.z + ")", "all", true);
  elem.subcapas.forEach(function (sh) {
    var cnt = elem.electrones.filter(function (e) { return e[1].indexOf(sh) === 0; }).length;
    mkLayerBtn(sh + " (" + cnt + ")", sh, false);
  });

  // Sliders del modo (mx, my, mz) del espectro Open Cube
  ["mx", "my", "mz"].forEach(function (id) {
    var s = document.getElementById("sl-" + id);
    s.max = String(N);
    s.value = "1";
    document.getElementById("val-" + id).textContent = "1";
  });

  // ---- Tabs y panel --------------------------------------------------------
  document.querySelectorAll(".tab-b").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-b").forEach(function (b) { b.classList.toggle("on", b === btn); });
      document.querySelectorAll(".pane").forEach(function (p) { p.classList.toggle("on", p.id === id); });
    });
  });

  var workspace = document.getElementById("workspace");
  var btnPanel = document.getElementById("btn-panel");
  btnPanel.addEventListener("click", function () {
    workspace.classList.toggle("panel-closed");
    setTimeout(onResize, 20);
  });

  document.getElementById("legend-toggle").addEventListener("click", function () {
    document.getElementById("legend-wrap").classList.toggle("collapsed");
  });
  document.getElementById("bloch-min").addEventListener("click", function () {
    document.getElementById("bloch-pip").classList.toggle("min");
  });

  // ---- Escena 3D principal (Three.js, anclada en (0,0,0) -> +/+/+) ---------
  function createSafeRenderer(cvs, opts) {
    try {
      var r = new THREE.WebGLRenderer(Object.assign({ canvas: cvs, antialias: true, alpha: true }, opts || {}));
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      return r;
    } catch (_err) {
      return { setPixelRatio: function () {}, setSize: function () {}, render: function () {} };
    }
  }
  var canvas = document.getElementById("main-canvas");
  var wrap3d = document.getElementById("stage-3d");
  var renderer = createSafeRenderer(canvas, { powerPreference: "high-performance" });

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(44, 1, 0.1, 500);
  var controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minDistance = 2;
  controls.maxDistance = 160;

  var ambLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambLight);
  var dirLight = new THREE.DirectionalLight(0x88bbee, 0.85);
  dirLight.position.set(20, 30, 25);
  scene.add(dirLight);

  var gAxes = new THREE.Group();
  var gZeroPlanes = new THREE.Group();
  var gCore = new THREE.Group();
  var gOpenBox = new THREE.Group();
  var gSpectrum = new THREE.Group();
  var gFluct = new THREE.Group();
  var gNucleus = new THREE.Group();
  var gElectrons = new THREE.Group();

  scene.add(gAxes, gZeroPlanes, gCore, gOpenBox, gSpectrum, gFluct, gNucleus, gElectrons);
  gFluct.visible = false; // Apagado por defecto: 7 octantes solo fluctuación

  function buildAxes() {
    var len = W(N + 1.6);
    var cfg = [
      { dir: [1, 0, 0], col: 0x5b9be6 },
      { dir: [0, 1, 0], col: 0x4fb37d },
      { dir: [0, 0, 1], col: 0xf08a5d }
    ];
    cfg.forEach(function (c) {
      var v = new THREE.Vector3(c.dir[0], c.dir[1], c.dir[2]);
      var pts = [new THREE.Vector3(0, 0, 0), v.clone().multiplyScalar(len)];
      var line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: c.col, transparent: true, opacity: 0.9 })
      );
      gAxes.add(line);
      var cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.42, 12),
        new THREE.MeshBasicMaterial({ color: c.col })
      );
      cone.position.copy(v.clone().multiplyScalar(len + 0.2));
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v);
      gAxes.add(cone);
    });
  }

  function buildZeroPlanes() {
    // Coordenada 0 en cada eje (0=0, conmuta, no habitable): rejilla tenue en +/+/+
    var maxC = N - 1;
    var mat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.2 });
    for (var i = 0; i <= maxC; i++) {
      gZeroPlanes.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(W(i), 0, 0), new THREE.Vector3(W(i), 0, W(maxC))]), mat));
      gZeroPlanes.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, W(i)), new THREE.Vector3(W(maxC), 0, W(i))]), mat));
    }
  }

  function buildCoreSaturante() {
    // Núcleo y cubo amarillo 100% DENTRO de +/+/+ (nunca en coordenadas negativas < 0):
    // 1) Bloque interior [0,3]^3 desde la esquina inferior izquierda (0,0,0) hasta (3,3,3) (64 sitios).
    // 2) Todo punto en +/+/+ que contenga un 3 (min(x,y,z) <= 3): planos x=3, y=3, z=3 hacia 4,5,6...
    //    incluyendo (3,4,3), (3,5,3), (3,6,3), (3,5,5), (3,6,6), etc.
    var box = new THREE.BoxGeometry(3, 3, 3);
    box.translate(1.5, 1.5, 1.5);
    gCore.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(box),
      new THREE.LineBasicMaterial({ color: 0xffc400, transparent: true, opacity: 0.88 })
    ));
    gCore.add(new THREE.Mesh(
      box,
      new THREE.MeshBasicMaterial({ color: 0xffc400, transparent: true, opacity: 0.06, depthWrite: false })
    ));

    // Sitios del bloque [0,3]^3 llegando explícitamente hasta (0,0,0) + franjas saturantes con 3 (hasta lim)
    var ptsInner = [], ptsSlab3 = [], ptsZero = [];
    var lim = Math.min(N - 1, Math.max(7, elem.kMax));
    for (var x = 0; x <= lim; x++) {
      for (var y = 0; y <= lim; y++) {
        for (var z = 0; z <= lim; z++) {
          if (x <= 3 && y <= 3 && z <= 3) {
            if (x === 0 || y === 0 || z === 0) ptsZero.push(x, y, z);
            else ptsInner.push(x, y, z);
          } else if (x === 3 || y === 3 || z === 3) {
            // Todo punto en +/+/+ que lleva al menos un 3 satura: (3,4,3), (3,5,3), (3,6,3), (3,5,5), (3,6,6)...
            ptsSlab3.push(W(x), W(y), W(z));
          }
        }
      }
    }
    var gH = new THREE.BufferGeometry();
    gH.setAttribute("position", new THREE.Float32BufferAttribute(ptsInner, 3));
    gCore.add(new THREE.Points(gH, new THREE.PointsMaterial({ color: 0xffc400, size: 0.13, transparent: true, opacity: 0.8 })));
    var gZ = new THREE.BufferGeometry();
    gZ.setAttribute("position", new THREE.Float32BufferAttribute(ptsZero, 3));
    gCore.add(new THREE.Points(gZ, new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.09, transparent: true, opacity: 0.55 })));
    if (ptsSlab3.length) {
      var gS3 = new THREE.BufferGeometry();
      gS3.setAttribute("position", new THREE.Float32BufferAttribute(ptsSlab3, 3));
      gCore.add(new THREE.Points(gS3, new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.12, transparent: true, opacity: 0.68 })));
    }
    // Guías sutiles de las 3 paredes x=3, y=3, z=3 extendiéndose en +/+/+ (si tiene un 3, satura)
    var wallMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.28 });
    var wallLines = [
      [[3, 3, 3], [lim, 3, 3]], [[3, 3, 3], [3, lim, 3]], [[3, 3, 3], [3, 3, lim]],
      [[3, lim, 3], [lim, lim, 3]], [[lim, 3, 3], [lim, lim, 3]],
      [[3, 3, lim], [lim, 3, lim]], [[lim, 3, 3], [lim, 3, lim]],
      [[3, 3, lim], [3, lim, lim]], [[3, lim, 3], [3, lim, lim]]
    ];
    wallLines.forEach(function (seg) {
      gCore.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(W(seg[0][0]), W(seg[0][1]), W(seg[0][2])),
          new THREE.Vector3(W(seg[1][0]), W(seg[1][1]), W(seg[1][2]))
        ]),
        wallMat
      ));
    });
  }

  function buildOpenCubeFrame() {
    // Marco abierto desde (0,0,0) hacia +/+/+ -> inf + frontera pura de orbitales (4,4,4)+
    var L = N - 0.5;
    var mat = new THREE.LineBasicMaterial({ color: 0x5b9be6, transparent: true, opacity: 0.3 });
    var rays = [
      [[0,0,0],[L,0,0]], [[0,0,0],[0,L,0]], [[0,0,0],[0,0,L]],
      [[3,0,0],[L,0,0]], [[0,3,0],[0,L,0]], [[0,0,3],[0,0,L]],
      [[4,4,4],[L,4,4]], [[4,4,4],[4,L,4]], [[4,4,4],[4,4,L]]
    ];
    rays.forEach(function (r) {
      gOpenBox.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(W(r[0][0]), W(r[0][1]), W(r[0][2])), new THREE.Vector3(W(r[1][0]), W(r[1][1]), W(r[1][2]))]),
        mat
      ));
    });

    // Muescas de referencia desde (0,0,0): 0..3 interior saturante (dorado) y >= 4 orbitales (gris)
    var maxK = Math.max(5, elem.kMax);
    var coreTickMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
    var notchMat = new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.9 });
    var notchPts = [];
    for (var k = 0; k <= maxK; k++) {
      var m = k <= 3 ? coreTickMat : notchMat;
      var d = k <= 3 ? 0.16 : 0.24;
      var wk = W(k);
      notchPts.push(wk, wk, wk);
      gOpenBox.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(wk - d, wk, wk), new THREE.Vector3(wk + d, wk, wk)]), m));
      gOpenBox.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(wk, wk - d, wk), new THREE.Vector3(wk, wk + d, wk)]), m));
      gOpenBox.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(wk, wk, wk - d), new THREE.Vector3(wk, wk, wk + d)]), m));
      // Muescas sobre ejes +X, +Y, +Z desde 0
      gOpenBox.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(wk, -0.15, 0), new THREE.Vector3(wk, 0.15, 0)]), m));
      gOpenBox.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.15, wk, 0), new THREE.Vector3(0.15, wk, 0)]), m));
      gOpenBox.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.15, wk), new THREE.Vector3(0, 0.15, wk)]), m));
    }
    var nGeom = new THREE.BufferGeometry();
    nGeom.setAttribute("position", new THREE.Float32BufferAttribute(notchPts, 3));
    gOpenBox.add(new THREE.Points(nGeom, new THREE.PointsMaterial({ color: 0xc4c3bf, size: 0.22 })));

    // Guía diagonal continua desde el ancla inferior izquierda (0,0,0) -> (3,3,3) -> (4,4,4) -> (5,5,5) -> inf
    gOpenBox.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(W(maxK + 0.8), W(maxK + 0.8), W(maxK + 0.8))]),
      new THREE.LineBasicMaterial({ color: 0x8a8985, transparent: true, opacity: 0.42 })
    ));
  }

  var nucLim = Math.min(N - 1, Math.max(7, elem.kMax));
  var nucP = [], nucN = [];
  var imP = null, imN = null;
  var nucLineP = null, nucLineN = null;
  var NUC_TRAIL = 50; // Homologado exactamente con MAX_TRAIL = 50 de los electrones

  function makeNucParticle(pt) {
    var hx = new Int16Array(NUC_TRAIL);
    var hy = new Int16Array(NUC_TRAIL);
    var hz = new Int16Array(NUC_TRAIL);
    hx.fill(pt[0]); hy.fill(pt[1]); hz.fill(pt[2]);
    return { init: pt.slice(), pos: pt.slice(), vis: new THREE.Vector3(pt[0], pt[1], pt[2]), hx: hx, hy: hy, hz: hz, head: 0 };
  }

  function createNucTrailLines(particles, colorHex) {
    if (!particles.length) return null;
    var segs = particles.length * (NUC_TRAIL - 1);
    var arr = new Float32Array(segs * 6);
    var geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.62 }));
  }

  function syncNucMeshesAndTrails(alpha) {
    var m4 = new THREE.Matrix4();
    function updateGroup(list, im, line) {
      if (!list.length || !im) return;
      var arr = line ? line.geometry.attributes.position.array : null;
      var stride = (NUC_TRAIL - 1) * 6;
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        p.vis.x += (p.pos[0] - p.vis.x) * alpha;
        p.vis.y += (p.pos[1] - p.vis.y) * alpha;
        p.vis.z += (p.pos[2] - p.vis.z) * alpha;
        m4.setPosition(W(p.vis.x), W(p.vis.y), W(p.vis.z));
        im.setMatrixAt(i, m4);
        if (arr && line.visible) {
          var base = i * stride;
          var h = p.head;
          for (var s = 0; s < NUC_TRAIL - 1; s++) {
            var i0 = (h + 1 + s) % NUC_TRAIL;
            var i1 = (h + 2 + s) % NUC_TRAIL;
            var off = base + s * 6;
            arr[off]     = W(p.hx[i0]); arr[off + 1] = W(p.hy[i0]); arr[off + 2] = W(p.hz[i0]);
            arr[off + 3] = W(p.hx[i1]); arr[off + 4] = W(p.hy[i1]); arr[off + 5] = W(p.hz[i1]);
          }
        }
      }
      im.instanceMatrix.needsUpdate = true;
      if (line && line.visible) line.geometry.attributes.position.needsUpdate = true;
    }
    updateGroup(nucP, imP, nucLineP);
    updateGroup(nucN, imN, nucLineN);
  }

  function stepNucleon(p) {
    var d = DIRS[Math.floor(Math.random() * DIRS.length)];
    var nx = p.pos[0] + (d[0] === 0 ? d[1] : 0);
    var ny = p.pos[1] + (d[0] === 1 ? d[1] : 0);
    var nz = p.pos[2] + (d[0] === 2 ? d[1] : 0);
    // Núcleo y puntos grises en +/+/+: saturación gaussiana en min(x,y,z) <= 3 sin exclusión de Pauli
    if (nx < 0 || ny < 0 || nz < 0 || nx > nucLim || ny > nucLim || nz > nucLim) return;
    if (nx > 3 && ny > 3 && nz > 3) return;
    // Leve sesgo de retorno hacia [0,3]^3 para mantener denso el núcleo sin dejar de poblar las paredes en 3
    if ((nx > 4 || ny > 4 || nz > 4) && Math.random() < 0.28) return;
    p.pos[0] = nx; p.pos[1] = ny; p.pos[2] = nz;
    p.head = (p.head + 1) % NUC_TRAIL;
    p.hx[p.head] = nx; p.hy[p.head] = ny; p.hz[p.head] = nz;
  }

  function buildNucleusInCore() {
    // Protones (rojos) y neutrones (azules) dinámicos 100% DENTRO del átomo en +/+/+ (min(x,y,z) <= 3):
    // pueden compartir orbitales/celdas porque el core satura el gaussiano (sin exclusión de Pauli).
    var satSites = [];
    for (var x = 0; x <= nucLim; x++) {
      for (var y = 0; y <= nucLim; y++) {
        for (var z = 0; z <= nucLim; z++) {
          if (x > 3 && y > 3 && z > 3) continue;
          var inBox03 = (x <= 3 && y <= 3 && z <= 3);
          var has3 = (x === 3 || y === 3 || z === 3);
          var tier = (x === 0 && y === 0 && z === 0) ? 0 : (inBox03 ? 1 : (has3 ? 2 : 3));
          satSites.push({ p: [x, y, z], tier: tier, maxC: Math.max(x, y, z), dist: x * x + y * y + z * z });
        }
      }
    }
    satSites.sort(function (a, b) {
      return a.tier - b.tier || a.maxC - b.maxC || a.dist - b.dist || a.p[0] - b.p[0] || a.p[1] - b.p[1];
    });

    var A = elem.z + elem.n;
    var pCount = elem.z, nCount = elem.n;
    for (var i = 0; i < A; i++) {
      var pt = satSites[i % satSites.length].p;
      var isP = (i % 2 === 0 && pCount > 0) || nCount === 0;
      if (isP) { pCount--; nucP.push(makeNucParticle(pt)); }
      else { nCount--; nucN.push(makeNucParticle(pt)); }
    }
    var gP = new THREE.SphereGeometry(0.13, 10, 10);
    if (nucP.length) {
      imP = new THREE.InstancedMesh(gP, new THREE.MeshBasicMaterial({ color: 0xf0605f }), nucP.length);
      gNucleus.add(imP);
      nucLineP = createNucTrailLines(nucP, 0xf0605f);
      gNucleus.add(nucLineP);
    }
    if (nucN.length) {
      imN = new THREE.InstancedMesh(gP, new THREE.MeshBasicMaterial({ color: 0x5b9be6 }), nucN.length);
      gNucleus.add(imN);
      nucLineN = createNucTrailLines(nucN, 0x5b9be6);
      gNucleus.add(nucLineN);
    }
    syncNucMeshesAndTrails(1.0);
  }

  function buildFluctuationOctants() {
    // Los 7 octantes no positivos (fluctuación) + cubo [-3,3]^3 tenue
    var pts = [];
    var lim = Math.min(N - 1, 8);
    for (var x = -lim; x <= lim; x++) {
      for (var y = -lim; y <= lim; y++) {
        for (var z = -lim; z <= lim; z++) {
          if (x >= 0 && y >= 0 && z >= 0) continue; // +/+/+ es el dominio principal
          if ((Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 !== 0) continue;
          pts.push(x, y, z);
        }
      }
    }
    var geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    gFluct.add(new THREE.Points(geom, new THREE.PointsMaterial({ color: 0x8a8985, size: 0.09, transparent: true, opacity: 0.24 })));
  }

  // ---- Espectro completo del Open Cube (PR #2096 + Cube/Basic.lean) --------
  var specMesh = null;
  function updateOpenCubeSpectrum() {
    while (gSpectrum.children.length) gSpectrum.remove(gSpectrum.children[0]);
    var mx = parseInt(document.getElementById("sl-mx").value, 10) || 1;
    var my = parseInt(document.getElementById("sl-my").value, 10) || 1;
    var mz = parseInt(document.getElementById("sl-mz").value, 10) || 1;
    document.getElementById("val-mx").textContent = String(mx);
    document.getElementById("val-my").textContent = String(my);
    document.getElementById("val-mz").textContent = String(mz);

    // Energía tight-binding abierta (E0 = 0, t = 1): E = -2 sum cos(pi * m_j / (N + 1))
    var energy = -2 * (
      Math.cos(Math.PI * mx / (N + 1)) +
      Math.cos(Math.PI * my / (N + 1)) +
      Math.cos(Math.PI * mz / (N + 1))
    );
    document.getElementById("spec-readout").innerHTML =
      "Modo <b>(" + mx + ", " + my + ", " + mz + ")</b> en <code>Fin " + N + "³</code><br>" +
      "E<sub>m</sub> = E₀ − 2t·∑cos(πm<sub>j</sub>/(" + (N + 1) + ")) = <span class='c-blue'>" + energy.toFixed(4) + " t</span><br>" +
      "C<sub>" + N + "</sub> = <span class='c-warm'>" + cN.toFixed(5) + "</span> (Szegő &lt; " + SZEGO_MAX.toFixed(4) + ")<br>" +
      "det Σ / |det Ω| = <b>" + detRatio.toFixed(4) + "</b>" +
      (N >= 4 ? " · umbral N≥4 abierto" : "");

    // Pintar nodos del espectro en +/+/+ escalados/coloreados por |psi|²
    var coords = [];
    var weights = [];
    var maxW = 0;
    for (var x = 0; x < N; x++) {
      var sx = Math.sin(Math.PI * mx * (x + 1) / (N + 1));
      for (var y = 0; y < N; y++) {
        var sy = Math.sin(Math.PI * my * (y + 1) / (N + 1));
        for (var z = 0; z < N; z++) {
          var sz = Math.sin(Math.PI * mz * (z + 1) / (N + 1));
          var w = sx * sx * sy * sy * sz * sz;
          if (w > 0.05) {
            coords.push(x, y, z);
            weights.push(w);
            if (w > maxW) maxW = w;
          }
        }
      }
    }
    var count = weights.length;
    var cSat = new THREE.Color(0xffc400);
    var cOpen = new THREE.Color(0x5b9be6);
    var cHot = new THREE.Color(0xf08a5d);
    if (N <= 8 && count <= 500) {
      var geom = new THREE.BoxGeometry(0.24, 0.24, 0.24);
      var mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 });
      specMesh = new THREE.InstancedMesh(geom, mat, Math.max(1, count));
      var m4 = new THREE.Matrix4(), sc = new THREE.Vector3(), pos = new THREE.Vector3(), q = new THREE.Quaternion(), col = new THREE.Color();
      for (var i = 0; i < count; i++) {
        var wn = weights[i] / (maxW || 1);
        var s = 0.25 + 0.65 * Math.sqrt(wn);
        pos.set(W(coords[3 * i]), W(coords[3 * i + 1]), W(coords[3 * i + 2]));
        sc.set(s, s, s);
        m4.compose(pos, q, sc);
        specMesh.setMatrixAt(i, m4);
        var isSat = coords[3 * i] <= 3 || coords[3 * i + 1] <= 3 || coords[3 * i + 2] <= 3;
        col.copy(isSat ? cSat : cOpen).lerp(cHot, wn * 0.72);
        specMesh.setColorAt(i, col);
      }
      specMesh.instanceMatrix.needsUpdate = true;
      if (specMesh.instanceColor) specMesh.instanceColor.needsUpdate = true;
      gSpectrum.add(specMesh);
    } else {
      // Para cajas grandes (Fe, Og) usamos Points con vertexColors: 60 FPS sin overdraw
      var pArr = new Float32Array(count * 3);
      var cArr = new Float32Array(count * 3);
      var col2 = new THREE.Color();
      for (var j = 0; j < count; j++) {
        var wn2 = weights[j] / (maxW || 1);
        pArr[3 * j] = W(coords[3 * j]);
        pArr[3 * j + 1] = W(coords[3 * j + 1]);
        pArr[3 * j + 2] = W(coords[3 * j + 2]);
        var isSat2 = coords[3 * j] <= 3 || coords[3 * j + 1] <= 3 || coords[3 * j + 2] <= 3;
        col2.copy(isSat2 ? cSat : cOpen).lerp(cHot, wn2 * 0.78);
        cArr[3 * j] = col2.r; cArr[3 * j + 1] = col2.g; cArr[3 * j + 2] = col2.b;
      }
      var pGeom = new THREE.BufferGeometry();
      pGeom.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
      pGeom.setAttribute("color", new THREE.BufferAttribute(cArr, 3));
      specMesh = new THREE.Points(pGeom, new THREE.PointsMaterial({ size: 0.22, vertexColors: true, transparent: true, opacity: 0.65 }));
      gSpectrum.add(specMesh);
    }
  }

  ["sl-mx", "sl-my", "sl-mz"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", updateOpenCubeSpectrum);
  });

  // ---- Electrones en +/+/+ y motor de hopping discreto (3000 Hz + economía de recursos) ----
  var electronObjs = [];
  var selectedIdx = elem.electrones.length - 1;
  var autoHop = true;
  var hopHz = 3000;
  var lastHop = 0;
  var MAX_TRAIL = 50;

  var elecListEl = document.getElementById("elec-list");
  var legListEl = document.getElementById("legend-list");
  var legCountEl = document.getElementById("legend-count");

  function syncElectronTrailBuffer(obj) {
    var attr = obj.trail.geometry.attributes.position;
    var arr = attr.array;
    var nPts = obj.history.length;
    for (var i = 0; i < nPts; i++) {
      var pt = obj.history[i];
      arr[3 * i] = W(pt[0]);
      arr[3 * i + 1] = W(pt[1]);
      arr[3 * i + 2] = W(pt[2]);
    }
    obj.trail.geometry.setDrawRange(0, nPts);
    attr.needsUpdate = true;
    obj.dirtyTrail = false;
  }

  function buildElectronsAndHUD() {
    elecListEl.innerHTML = "";
    legListEl.innerHTML = "";
    var legendGroups = {};
    var eSphereGeom = new THREE.SphereGeometry(0.15, 10, 10);

    elem.electrones.forEach(function (e, idx) {
      var id = e[0], orb = e[1], spin = e[2], kNivel = e[3], pos = e[4], hex = e[5], isCore = e[6];
      var colorNum = parseInt(hex, 16);
      var sub = isCore ? "1s" : orb.replace(/(px|py|pz|dxy|dyz|dxz|dx2y2|dz2|fz3|fxz2|fyz2|fxyz|fzxy|fx3|fy3)$/, "");
      var grp = new THREE.Group();
      var sphere = new THREE.Mesh(
        eSphereGeom,
        new THREE.MeshBasicMaterial({ color: colorNum })
      );
      grp.add(sphere);
      grp.position.set(W(pos[0]), W(pos[1]), W(pos[2]));
      gElectrons.add(grp);

      var trailMat = new THREE.LineBasicMaterial({ color: colorNum, transparent: true, opacity: 0.72 });
      var trailArr = new Float32Array(MAX_TRAIL * 3);
      trailArr[0] = W(pos[0]); trailArr[1] = W(pos[1]); trailArr[2] = W(pos[2]);
      var trailGeom = new THREE.BufferGeometry();
      trailGeom.setAttribute("position", new THREE.BufferAttribute(trailArr, 3));
      trailGeom.setDrawRange(0, 1);
      var trail = new THREE.Line(trailGeom, trailMat);
      gElectrons.add(trail);

      electronObjs.push({
        id: id, orb: orb, spin: spin, sub: sub, kNivel: kNivel,
        hex: "#" + hex, isCore: isCore, active: true,
        initPos: pos.slice(), pos: pos.slice(), target: pos.slice(),
        history: [pos.slice()], group: grp, trail: trail, dirtyTrail: false
      });

      // Fila en lista
      var row = document.createElement("div");
      row.className = "erow" + (idx === selectedIdx ? " on" : "");
      row.id = "erow-" + idx;
      row.innerHTML =
        '<div class="eswatch" style="background:#' + hex + ';">' + (spin === "up" ? "↑" : "↓") + '</div>' +
        '<div>e' + id + ' · ' + orb + ' <span style="color:var(--muted);">' + (isCore ? "core≤3" : "k=" + kNivel) + '</span></div>' +
        '<div class="epos" id="epos-' + idx + '">(' + pos.join(",") + ')</div>' +
        '<input type="checkbox" checked aria-label="Activar e' + id + '">';
      row.addEventListener("click", function (ev) {
        if (ev.target.tagName === "INPUT") return;
        selectElectron(idx);
      });
      row.querySelector("input").addEventListener("change", function (ev) {
        var act = ev.target.checked;
        electronObjs[idx].active = act;
        electronObjs[idx].group.visible = act;
        electronObjs[idx].trail.visible = act && document.getElementById("tog-trails").checked;
        updateStats();
      });
      elecListEl.appendChild(row);

      if (!legendGroups[orb]) legendGroups[orb] = { hex: "#" + hex, ids: [] };
      legendGroups[orb].ids.push("e" + id);
    });

    // Leyenda acotada con scroll
    var fixedItems = [
      { col: "#ffc400", txt: "Cubo amarillo = Core / Bloch gen. (0..3 + todo 3 en +/+/+)" },
      { col: "#f0605f", txt: "Protones (" + elem.z + "p) dentro del átomo en +/+/+" },
      { col: "#5b9be6", txt: "Neutrones (" + elem.n + "n) dentro del átomo en +/+/+" },
      { col: "#94a3b8", txt: "Muescas grises: sin 3 → orbital 4 (4,4,4), orbital 5 (5,5,5)…" }
    ];
    fixedItems.forEach(function (it) {
      var d = document.createElement("div");
      d.className = "litem";
      d.innerHTML = '<span class="lsw" style="background:' + it.col + ';"></span><span>' + it.txt + '</span>';
      legListEl.appendChild(d);
    });
    Object.keys(legendGroups).forEach(function (k) {
      var g = legendGroups[k];
      var d = document.createElement("div");
      d.className = "litem";
      d.innerHTML = '<span class="lsw" style="background:' + g.hex + ';"></span><span>' + k + " (" + g.ids.join(", ") + ")</span>";
      legListEl.appendChild(d);
    });
    legCountEl.textContent = "(" + Object.keys(legendGroups).length + " orbitales)";
  }

  function filterElectronsBySubshell(key) {
    electronObjs.forEach(function (obj, idx) {
      var show = (key === "all") || (obj.orb.indexOf(key) === 0);
      obj.active = show;
      obj.group.visible = show;
      obj.trail.visible = show && document.getElementById("tog-trails").checked;
      var cb = document.querySelector("#erow-" + idx + " input");
      if (cb) cb.checked = show;
    });
    updateStats();
  }

  function selectElectron(idx) {
    selectedIdx = idx;
    electronObjs.forEach(function (_, i) {
      var r = document.getElementById("erow-" + i);
      if (r) r.classList.toggle("on", i === idx);
    });
    updateStats();
  }

  function stepElectron(idx, axis, delta, deferTrail) {
    var obj = electronObjs[idx];
    if (!obj || !obj.active) return false;
    var nx = obj.pos[0] + (axis === 0 ? delta : 0);
    var ny = obj.pos[1] + (axis === 1 ? delta : 0);
    var nz = obj.pos[2] + (axis === 2 ? delta : 0);
    if (obj.isCore) {
      // Electrones saturados (core <= 3): habitan todos los puntos <= 3 en +/+/+ (incluyendo puntos grises 0)
      // SIN restricción de exclusión de Pauli porque el core satura el gaussiano.
      if (nx < 0 || ny < 0 || nz < 0 || nx > 3 || ny > 3 || nz > 3) return false;
    } else {
      // Cubo de colores (orbitales >= 4 sin ningún 3): exclusión estricta de Pauli / Slater (1 celda = 1 electrón)
      if (nx < 4 || ny < 4 || nz < 4 || nx >= N || ny >= N || nz >= N) return false;
      for (var i = 0; i < electronObjs.length; i++) {
        if (i === idx || !electronObjs[i].active || electronObjs[i].isCore) continue;
        var p = electronObjs[i].pos;
        if (p[0] === nx && p[1] === ny && p[2] === nz) return false;
      }
    }

    obj.pos[0] = nx; obj.pos[1] = ny; obj.pos[2] = nz;
    obj.target[0] = nx; obj.target[1] = ny; obj.target[2] = nz;
    obj.history.push([nx, ny, nz]);
    if (obj.history.length > MAX_TRAIL) obj.history.shift();
    if (deferTrail) {
      obj.dirtyTrail = true;
    } else {
      syncElectronTrailBuffer(obj);
      var lbl = document.getElementById("epos-" + idx);
      if (lbl) lbl.textContent = "(" + nx + "," + ny + "," + nz + ")";
    }
    return true;
  }

  var DIRS = [[0,1],[0,-1],[1,1],[1,-1],[2,1],[2,-1]];
  function randomHopBatch(deferTrail) {
    var active = [];
    for (var i = 0; i < electronObjs.length; i++) if (electronObjs[i].active) active.push(i);
    if (!active.length) return;
    var batch = Math.max(1, Math.min(8, Math.ceil(active.length / 6)));
    for (var b = 0; b < batch; b++) {
      var idx = active[Math.floor(Math.random() * active.length)];
      var d = DIRS[Math.floor(Math.random() * DIRS.length)];
      stepElectron(idx, d[0], d[1], deferTrail);
    }
  }

  function randomNucleusHopBatch() {
    var tot = nucP.length + nucN.length;
    if (!tot) return;
    // Mayor velocidad en el núcleo saturante (protones + neutrones saltan ~2.5x más rápido)
    var batch = Math.max(2, Math.min(20, Math.ceil(tot / 8)));
    for (var b = 0; b < batch; b++) {
      var r = Math.floor(Math.random() * tot);
      stepNucleon(r < nucP.length ? nucP[r] : nucN[r - nucP.length]);
    }
  }

  document.querySelectorAll("[data-hop]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var parts = btn.getAttribute("data-hop").split(",").map(Number);
      if (stepElectron(selectedIdx, parts[0], parts[1], false)) updateStats();
    });
  });

  document.getElementById("btn-hop-toggle").addEventListener("click", function (ev) {
    autoHop = !autoHop;
    ev.target.textContent = autoHop ? "⏸ Pausar" : "▶ Reanudar";
  });
  document.getElementById("btn-hop-reset").addEventListener("click", function () {
    occReset();
    electronObjs.forEach(function (obj, idx) {
      obj.pos = obj.initPos.slice();
      obj.target = obj.initPos.slice();
      obj.history = [obj.initPos.slice()];
      obj.group.position.set(W(obj.pos[0]), W(obj.pos[1]), W(obj.pos[2]));
      syncElectronTrailBuffer(obj);
      var lbl = document.getElementById("epos-" + idx);
      if (lbl) lbl.textContent = "(" + obj.pos.join(",") + ")";
    });
    function resetNucList(list) {
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        p.pos = p.init.slice();
        p.vis.set(p.init[0], p.init[1], p.init[2]);
        p.hx.fill(p.init[0]); p.hy.fill(p.init[1]); p.hz.fill(p.init[2]); p.head = 0;
      }
    }
    resetNucList(nucP);
    resetNucList(nucN);
    syncNucMeshesAndTrails(1.0);
    updateStats();
  });
  document.getElementById("sl-speed").addEventListener("input", function (ev) {
    hopHz = parseInt(ev.target.value, 10);
    document.getElementById("val-speed").textContent = hopHz + " Hz";
  });

  // ---- PIP Bola de Bloch d=2 (BolaDeBloch.lean) ----------------------------
  var blochCvs = document.getElementById("bloch-canvas");
  var bRenderer = createSafeRenderer(blochCvs);
  var bScene = new THREE.Scene();
  var bCam = new THREE.PerspectiveCamera(40, 240 / 145, 0.1, 30);
  bCam.position.set(2.4, 1.9, 2.7);
  bCam.lookAt(0, 0, 0);
  bScene.add(new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({ color: 0xa48bf0, wireframe: true, transparent: true, opacity: 0.35 })));
  var bEq = new THREE.Mesh(new THREE.RingGeometry(0.98, 1.01, 32), new THREE.MeshBasicMaterial({ color: 0x5b9be6, side: THREE.DoubleSide }));
  bEq.rotation.x = Math.PI / 2;
  bScene.add(bEq);
  var bArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 1, 0xf08a5d, 0.22, 0.12);
  bScene.add(bArrow);

  var bR = 1.0, bTh = Math.PI / 2, bPh = Math.PI / 4;
  function updateBlochPIP() {
    var x = bR * Math.sin(bTh) * Math.cos(bPh);
    var y = bR * Math.sin(bTh) * Math.sin(bPh);
    var z = bR * Math.cos(bTh);
    var dir = new THREE.Vector3(x, z, y);
    var len = Math.max(0.01, dir.length());
    bArrow.setDirection(dir.normalize());
    bArrow.setLength(len, 0.22, 0.12);
    var defect = Math.max(0, 1 - (x * x + y * y + z * z));
    document.getElementById("bloch-stats").innerHTML =
      "<div>ρ₀₀: <b>" + (0.5 * (1 + z)).toFixed(2) + "</b></div>" +
      "<div>ρ₁₁: <b>" + (0.5 * (1 - z)).toFixed(2) + "</b></div>" +
      "<div>J: <b>" + y.toFixed(3) + "</b></div>" +
      "<div>Δ<sub>RS</sub>: <b>" + defect.toFixed(3) + "</b></div>";
  }
  ["sl-br", "sl-bt", "sl-bp"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      bR = parseFloat(document.getElementById("sl-br").value) / 100;
      bTh = parseFloat(document.getElementById("sl-bt").value) * Math.PI / 180;
      bPh = parseFloat(document.getElementById("sl-bp").value) * Math.PI / 180;
      document.getElementById("val-br").textContent = bR.toFixed(2);
      document.getElementById("val-bt").textContent = Math.round(bTh * 180 / Math.PI) + "°";
      document.getElementById("val-bp").textContent = Math.round(bPh * 180 / Math.PI) + "°";
      updateBlochPIP();
    });
  });

  function updateStats() {
    var active = electronObjs.filter(function (o) { return o.active; });
    var orbActive = active.filter(function (o) { return !o.isCore; });
    document.getElementById("stat-elec").textContent = active.length + " / " + elem.z;
    var minD = Infinity;
    for (var i = 0; i < orbActive.length; i++) {
      for (var j = i + 1; j < orbActive.length; j++) {
        var a = orbActive[i].pos, b = orbActive[j].pos;
        var d = Math.hypot(W(a[0]) - W(b[0]), W(a[1]) - W(b[1]), W(a[2]) - W(b[2]));
        if (d < minD) minD = d;
      }
    }
    var sel = electronObjs[selectedIdx];
    var rNuc = sel ? Math.hypot(sel.pos[0], sel.pos[1], sel.pos[2]) : 0;
    var minTxt = orbActive.length < 2 ? "Core satura (≤ 3)" : (minD.toFixed(3) + " ≥ 1");
    document.getElementById("stat-dmin").textContent = minTxt;
    document.getElementById("metric-readout").innerHTML =
      "Electrón seleccionado: <b>e" + sel.id + " (" + sel.orb + ")</b> en <code>(" + sel.pos.join(", ") + ")</code><br>" +
      "Distancia al origen (0,0,0): <span class='c-blue'>" + rNuc.toFixed(3) + "</span> celdas (L₁ = " +
      (sel.pos[0] + sel.pos[1] + sel.pos[2]) + " pasos)<br>" +
      "Pauli en orbitales ≥ 4: <span class='c-warm'>" + minTxt + "</span> (core ≤ 3 satura)";
    updateOccReadout();
  }

  // ---- Ocupación promediada en el tiempo (límite de alta frecuencia) -----------
  // Cuenta, por celda, en cuántos pasos de hopping estuvo ocupada. Medida de ESTA animación:
  // "fracción de celdas aún no ocupadas en la ventana" (no una prueba de solidez). Tiende a 0
  // al subir la frecuencia o la ventana. Core: bloque saturado (0..3)^3 (electrones y nucleones);
  // Open Cube: celdas con x,y,z >= 4 (electrones, 1 celda = 1 electrón).
  var OCC_M = Math.max(0, N - 4);
  var OCC_OPEN = OCC_M * OCC_M * OCC_M;
  var occCore = new Uint32Array(64), stampCore = new Uint32Array(64);
  var occOpen = new Uint32Array(OCC_OPEN), stampOpen = new Uint32Array(OCC_OPEN);
  var occTicks = 0;
  var gOcc = new THREE.Group();
  gOcc.visible = false;
  scene.add(gOcc);
  var occColors = new Float32Array((64 + OCC_OPEN) * 3);
  (function buildOccPoints() {
    var pos = new Float32Array((64 + OCC_OPEN) * 3), n = 0, x, y, z;
    for (z = 0; z < 4; z++) for (y = 0; y < 4; y++) for (x = 0; x < 4; x++) {
      pos[n++] = W(x); pos[n++] = W(y); pos[n++] = W(z);
    }
    for (z = 0; z < OCC_M; z++) for (y = 0; y < OCC_M; y++) for (x = 0; x < OCC_M; x++) {
      pos[n++] = W(x + 4); pos[n++] = W(y + 4); pos[n++] = W(z + 4);
    }
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(occColors, 3));
    gOcc.add(new THREE.Points(g, new THREE.PointsMaterial({
      size: 0.46, vertexColors: true, transparent: true, opacity: 0.92,
      depthWrite: false, blending: THREE.AdditiveBlending
    })));
  })();

  function occMark(p) {
    var x = p[0], y = p[1], z = p[2], c;
    if (x >= 0 && y >= 0 && z >= 0 && x <= 3 && y <= 3 && z <= 3) {
      c = x + 4 * (y + 4 * z);
      if (stampCore[c] !== occTicks) { stampCore[c] = occTicks; occCore[c]++; }
    } else if (OCC_M > 0 && x >= 4 && y >= 4 && z >= 4 && x < N && y < N && z < N) {
      c = (x - 4) + OCC_M * ((y - 4) + OCC_M * (z - 4));
      if (stampOpen[c] !== occTicks) { stampOpen[c] = occTicks; occOpen[c]++; }
    }
  }
  function sampleOccupancy() {
    occTicks++;
    var i;
    for (i = 0; i < electronObjs.length; i++) if (electronObjs[i].active) occMark(electronObjs[i].pos);
    for (i = 0; i < nucP.length; i++) occMark(nucP[i].pos);
    for (i = 0; i < nucN.length; i++) occMark(nucN[i].pos);
  }
  function occReset() {
    occCore.fill(0); stampCore.fill(0);
    occOpen.fill(0); stampOpen.fill(0);
    occTicks = 0;
  }
  function occCovered(arr) {
    var c = 0;
    for (var i = 0; i < arr.length; i++) if (arr[i] > 0) c++;
    return c;
  }
  function updateOccColors() {
    var maxOcc = 1, i, v, o = 0;
    for (i = 0; i < 64; i++) if (occCore[i] > maxOcc) maxOcc = occCore[i];
    for (i = 0; i < OCC_OPEN; i++) if (occOpen[i] > maxOcc) maxOcc = occOpen[i];
    for (i = 0; i < 64; i++, o += 3) {
      v = occCore[i] > 0 ? 0.28 + 0.72 * Math.sqrt(occCore[i] / maxOcc) : 0;
      occColors[o] = v; occColors[o + 1] = 0.77 * v; occColors[o + 2] = 0;
    }
    for (i = 0; i < OCC_OPEN; i++, o += 3) {
      v = occOpen[i] > 0 ? 0.28 + 0.72 * Math.sqrt(occOpen[i] / maxOcc) : 0;
      occColors[o] = 0.35 * v; occColors[o + 1] = 0.8 * v; occColors[o + 2] = v;
    }
    gOcc.children[0].geometry.attributes.color.needsUpdate = true;
  }
  function updateOccReadout() {
    var el = document.getElementById("occ-readout");
    if (!el) return;
    var cc = occCovered(occCore), co = occCovered(occOpen);
    var vacC = occTicks ? 100 * (1 - cc / 64) : 100;
    var vacO = OCC_OPEN ? (occTicks ? 100 * (1 - co / OCC_OPEN) : 100) : null;
    el.innerHTML =
      "Ventana: <b>" + occTicks + "</b> pasos (≈ " + (occTicks / hopHz).toFixed(2) + " s a " + hopHz + " Hz)<br>" +
      "Core (0..3)³: " + cc + " / 64 celdas ocupadas alguna vez → vacías <b>" + vacC.toFixed(1) + " %</b><br>" +
      (vacO === null ? "" : "Orbitales ≥ 4: " + co + " / " + OCC_OPEN + " celdas → vacías <b>" + vacO.toFixed(1) + " %</b><br>") +
      "<span style='color:var(--muted)'>La probabilidad de encontrar vacío en una celda llena tiende a 0 al subir la frecuencia o la ventana. Es una medida de esta animación, no una prueba de solidez.</span>";
    if (gOcc.visible) updateOccColors();
  }

  // ---- Capas y vistas de cámara desde (0,0,0) -> +/+/+ ---------------------
  var CAMERAS = {
    esquina0: { pos: [-N * 0.92, N * 0.65, N * 1.95], target: [N * 0.44, N * 0.42, N * 0.40] },
    core:     { pos: [-2.8, 2.6, 6.8], target: [1.5, 1.5, 1.5] },
    diag:     { pos: [N * 1.55, N * 1.45, N * 1.55], target: [3.2, 3.2, 3.2] },
    xy:       { pos: [N * 0.45, N * 0.45, N * 2.25], target: [N * 0.45, N * 0.45, 0] },
    xz:       { pos: [N * 0.45, N * 2.35, N * 0.45], target: [N * 0.45, 0, N * 0.45] },
    iso:      { pos: [N * 1.75, N * 1.30, -N * 0.85], target: [N * 0.4, N * 0.4, N * 0.4] }
  };
  function setView(k) {
    var v = CAMERAS[k];
    if (!v) return;
    camera.position.set(v.pos[0], v.pos[1], v.pos[2]);
    controls.target.set(v.target[0], v.target[1], v.target[2]);
    controls.update();
    document.querySelectorAll(".vbtn").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-view") === k); });
  }
  document.querySelectorAll(".vbtn").forEach(function (b) {
    b.addEventListener("click", function () { setView(b.getAttribute("data-view")); });
  });

  function syncLayers() {
    gCore.visible = document.getElementById("tog-core").checked;
    gOpenBox.visible = document.getElementById("tog-open").checked;
    gSpectrum.visible = document.getElementById("tog-spec").checked;
    gAxes.visible = document.getElementById("tog-axes").checked;
    gZeroPlanes.visible = document.getElementById("tog-zero").checked;
    gNucleus.visible = document.getElementById("tog-nuc").checked;
    gFluct.visible = document.getElementById("tog-fluct").checked;
    gOcc.visible = document.getElementById("tog-occ").checked;
    if (gOcc.visible) updateOccColors();
    var tr =document.getElementById("tog-trails").checked;
    electronObjs.forEach(function (o) { o.trail.visible = tr && o.active; });
    if (nucLineP) nucLineP.visible = tr;
    if (nucLineN) nucLineN.visible = tr;
  }
  ["tog-core", "tog-open", "tog-spec", "tog-axes", "tog-zero", "tog-nuc", "tog-fluct", "tog-occ", "tog-trails"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", syncLayers);
  });

  function onResize() {
    var w = wrap3d.clientWidth || 800;
    var h = wrap3d.clientHeight || 600;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    bRenderer.setSize(240, 145, false);
  }
  window.addEventListener("resize", onResize);

  // ---- Inicialización y loop -----------------------------------------------
  buildAxes();
  buildZeroPlanes();
  buildCoreSaturante();
  buildOpenCubeFrame();
  buildNucleusInCore();
  buildFluctuationOctants();
  buildElectronsAndHUD();
  updateOpenCubeSpectrum();
  updateBlochPIP();
  updateStats();
  syncLayers();
  setView("esquina0");
  onResize();

  var clock = new THREE.Clock();
  var lastDomSync = 0;
  var tmpVec = new THREE.Vector3();
  function animate() {
    requestAnimationFrame(animate);
    var dt = clock.getDelta();
    var elapsed = clock.getElapsedTime();
    if (autoHop) {
      var step = 1 / hopHz;
      if (elapsed - lastHop > 0.08) lastHop = elapsed - step;
      var nSteps = Math.min(64, Math.floor((elapsed - lastHop) / step));
      if (nSteps > 0) {
        lastHop += nSteps * step;
        for (var s = 0; s < nSteps; s++) {
          randomHopBatch(true);
          randomNucleusHopBatch();
          sampleOccupancy();
        }
        // Sincronizar geometrías de estelas una sola vez por frame (cero GC)
        for (var i = 0; i < electronObjs.length; i++) {
          if (electronObjs[i].dirtyTrail) syncElectronTrailBuffer(electronObjs[i]);
        }
        if (elapsed - lastDomSync > 0.14) {
          lastDomSync = elapsed;
          for (var j = 0; j < electronObjs.length; j++) {
            var lbl = document.getElementById("epos-" + j);
            if (lbl) lbl.textContent = "(" + electronObjs[j].pos.join(",") + ")";
          }
          updateStats();
        }
      }
    }
    syncNucMeshesAndTrails(0.55);
    for (var k = 0; k < electronObjs.length; k++) {
      var o = electronObjs[k];
      if (!o.active) continue;
      tmpVec.set(W(o.target[0]), W(o.target[1]), W(o.target[2]));
      o.group.position.lerp(tmpVec, 0.5);
    }
    bScene.rotation.y += dt * 0.35;
    controls.update();
    renderer.render(scene, camera);
    bRenderer.render(bScene, bCam);
  }
  animate();
})();
