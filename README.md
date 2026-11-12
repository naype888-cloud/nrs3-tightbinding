# RS^N³ · Tight-binding

**[▶ naype888-cloud.github.io/nrs3-tightbinding](https://naype888-cloud.github.io/nrs3-tightbinding/)**

La tabla periódica completa (H a Og, Z = 1..118) y, por cada elemento, un modelo 3D interactivo del
átomo como hidrógeno más `Z − 1` electrones sobre el cubo entero ℤ³. El único movimiento es el paso de
eje (`T_d : P_d`), el hopping del tight-binding del cubo `RS^N³`.

Clic en un elemento de la tabla abre su modelo; **← Regresar** (o `Esc`) vuelve a la tabla, y ‹ › pasa
al elemento anterior o siguiente.

## Qué hay

- `docs/index.html` — la tabla (118 celdas, lantánidos y actínidos en filas aparte).
- `docs/ver.html?z=N` — visor: barra con Regresar + el modelo del elemento `N`.
- `docs/modelos/Visualizador-<Nombre>-NRS3-Bloch-Cubo.html` — un modelo autocontenido por elemento
  (Three.js incluido, sin red). 118 archivos.
- `docs/data/elementos.js` — símbolo, nombre, archivo y posición en la tabla de cada Z.

## De dónde salen los modelos

Se generan de una plantilla única (`generar_cubo.py` → `canon_cuadrantes.py`) y se auditan regenerando y
comparando byte a byte (`auditar_cubo.py`), más un barrido de errores de JS en Chrome headless.
No se editan a mano. Caja de lado `2H + 1` según la Ley A, core saturante `d ≤ 3` (343 sitios), valencia
separada del core, isótopo de referencia en la tarjeta.

## Convención, no corpus

Los slots 3s–7p, las orientaciones d y f, las posiciones nucleares y la masa de los elementos con Z ≥ 103
son convención de dibujo, no resultados formales del corpus.

Teoría y Lean 4: [nrs3-hidrogeno](https://github.com/naype888-cloud/nrs3-hidrogeno) ·
[nrs3-cristales](https://github.com/naype888-cloud/nrs3-cristales) ·
[BACQM-NRS3](https://github.com/naype888-cloud/BACQM-NRS3).
