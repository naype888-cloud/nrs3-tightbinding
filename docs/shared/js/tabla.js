// Tabla periódica literal: una celda por elemento (Z = 1..118), clic -> ver.html?z=Z (modelo 3D + Regresar).
// El dato viene de data/elementos.js; los modelos 3D los pone Antigravity en modelos/ (esta página solo enlaza).
(function () {
  "use strict";
  var DATOS = window.ELEMENTOS || [];
  var tabla = document.getElementById("tabla");
  if (!tabla) return;

  function celda(e) {
    var a = document.createElement("a");
    a.className = "el";
    a.href = "ver.html?z=" + e.z;
    a.style.gridRow = e.fila > 7 ? e.fila + 1 : e.fila;
    a.style.gridColumn = e.col;
    a.title = e.nombre + " (Z=" + e.z + ")";
    a.setAttribute("aria-label", e.nombre + ", número atómico " + e.z);
    a.innerHTML = '<span class="z">' + e.z + '</span><span class="s">' + e.sim +
      '</span><span class="n">' + e.nombre + "</span>";
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
  DATOS.forEach(function (e) { tabla.appendChild(celda(e)); });

  var ley = document.getElementById("leyenda");
  if (ley) ley.textContent = DATOS.length + " elementos · clic para abrir el modelo 3D";
})();
