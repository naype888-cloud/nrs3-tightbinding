<div align="center">

# RS<sup>N</sup>³ · Open Cube & Tight-Binding
### Modèle de Liaison Forte sur le Réseau Discret ℤ³ et Formalisation de la Table Périodique
#### *Fondé sur les PRs fusionnées dans Physlib #1725 et #2096 : l'opérateur de saut axial engendre la structure de graphe chemin, l'Open Cube NRS³, la saturation exacte en d ≤ 3 et la stabilité des 118 éléments.*

**Eduardo Nava Hernández**  
*Formalisation formelle certifiée en Lean 4 · 0 sorry · Mathlib · Physlib (#1725, #2096)*

[![Lean 4](https://img.shields.io/badge/Lean_4-v4.35.0-blue.svg?style=flat-square)](https://leanprover.github.io/)
[![Mathlib](https://img.shields.io/badge/Mathlib-v%C3%A9rifi%C3%A9-2ea44f.svg?style=flat-square)](https://github.com/leanprover-community/mathlib4)
[![Kernel Status](https://img.shields.io/badge/Kernel-0%20sorry%20%7C%20Certifi%C3%A9-brightgreen.svg?style=flat-square)]()
[![Physlib #1725](https://img.shields.io/badge/Physlib-PR_%231725_Merged-7c5cd6.svg?style=flat-square)](https://github.com/leanprover-community/physlib/pull/1725)
[![Physlib #2096](https://img.shields.io/badge/Physlib-PR_%232096_Merged-7c5cd6.svg?style=flat-square)](https://github.com/leanprover-community/physlib/pull/2096)
[![Simulador 3D](https://img.shields.io/badge/Simulador_3D-118_Elementos-00e5ff.svg?style=for-the-badge&logo=three.js)](https://naype888-cloud.github.io/nrs3-tightbinding/)
[![Sin Red](https://img.shields.io/badge/Modelos-100%25_Autocontenidos-2f8f5b.svg?style=flat-square)]()

<br>

<a href="https://naype888-cloud.github.io/nrs3-tightbinding/">
  <img src="docs/media/clip.gif" alt="La tabla periódica de 118 elementos sobre el cubo discreto ℤ³; un clic abre el modelo 3D del hierro, uranio, hidrógeno y oganesón" width="860">
</a>

<p>
  <a href="https://naype888-cloud.github.io/nrs3-tightbinding/"><b>▶ Abrir la tabla</b></a> ·
  <a href="https://naype888-cloud.github.io/nrs3-tightbinding/ver.html?z=1">Hidrógeno (Z = 1)</a> ·
  <a href="https://naype888-cloud.github.io/nrs3-tightbinding/ver.html?z=26">Hierro (Z = 26)</a> ·
  <a href="https://naype888-cloud.github.io/nrs3-tightbinding/ver.html?z=92">Uranio (Z = 92)</a> ·
  <a href="https://naype888-cloud.github.io/nrs3-tightbinding/ver.html?z=118">Oganesón (Z = 118)</a>
</p>

</div>

---

> ### 🏛️ Marco Fundamental: El Open Cube NRS³ y la Cadena de Grafo Camino
>
> ```text
> ⟨m | H_open | n⟩ = E₀ · I_mn − t · A(P_N)_mn                   (Physlib #2096)
> centeredGramDefect_alongX(ψ_max) = 0  ⟺  N_X ≤ 3               (Physlib #1725)
> |det Ω| < det Σ  sur tout le cube ouvert 4 × 4 × 4             (Physlib #1725)
> ```
>
> **L'Open Cube NRS³** (Nava–Robertson–Schrödinger sur le cube ouvert à trois axes orthogonaux, fusionné dans Physlib #1725) établit que le système tridimensionnel `Tx ⊗ Ty ⊗ Tz` commute identiquement entre axes distincts (`[O_X, O_Y] = 0`). Le Hamiltonien ouvert est exactement le saut sur le graphe chemin `SimpleGraph.pathGraph N` (Physlib #2096). Sur la cellule élémentaire `d ≤ 3`, le défaut de Gram s'annule identiquement ; dès la dimension `4 × 4 × 4`, la relation de Robertson devient strictement dispersive, stabilisant les couches électroniques des 118 éléments sans divergence ultraviolette.

---

## 🔬 Résumé / Abstract Formal

La formalisation certifiée en Lean 4 sur Mathlib et Physlib démontre la chaîne constructive complète du retículo discreto ℤ³ :

1. **La chaîne ouverte comme graphe chemin.** Le lemme maître `inner_openHamiltonian_eq_adjMatrix` (Physlib #2096) établit que les éléments matriciels du Hamiltonien de liaison forte à bords ouverts coïncident exactement avec `E₀ · I − t · A(P_N)`, reliant directement la mécanique quantique sur réseau à la théorie des graphes de Mathlib sans approximation phénoménologique.
2. **Observable position et commutateur de saut.** L'observable position `position` engendre un corchete `inner_bracket_openHamiltonian_position_eq` dont les éléments matriciels sont nuls en dehors des premiers voisins (`|m − n| = 1`), bornant la dispersion par l'inégalité de Robertson–Schrödinger `robertson_schrodinger_openHamiltonian_position`.
3. **Bifurcation de saturation de Szegő.** Dans l'état de courant maximal `maxCurrentState`, le défaut de Gram centré s'annule identiquement si et seulement si `N = 2` ou `N = 3` (`centeredGramDefect_maxCurrentState_eq_zero_iff`). Pour tout `N ≥ 4`, l'inégalité est strictement stricte (`robertson_schrodinger_maxCurrentState_lt`), et le ratio d'incertitude `C_N` croît de façon strictement monotone vers la limite universelle de Szegő `uncertaintyRatio_lt_sqrt_pi_sq_div_three_sub_two` (`lim C_N² = π²/3 − 2 ≈ 1.289868`).
4. **L'Open Cube NRS³ en trois dimensions.** Sur le produit tensoriel `Tx.CubeHilbertSpace Ty Tz`, les observables d'axes distincts commutent identiquement (`bracket_alongX_alongY`). La matrice simpléctique `Ω` et la matrice de covariance `Σ` sont bloc-diagonales (`bracketMatrix_cubePairs`). Sur tout cube ouvert avec `Nx, Ny, Nz ≥ 4`, le déterminant de Robertson est strictement supérieur à 1 (`robertson_det_maxCurrentCubeState_strict`, Physlib #1725).
5. **Réalisation physique des 118 éléments.** Le retículo entier ℤ³ fournit le substrat discret des éléments de H à Og : le core saturant `d ≤ 3` (343 sites) confine les couches internes sans potentiel ad-hoc, et les sous-couches de valence `d ≥ 4` exploitent le gap de dispersion strict.

---

## 📐 Cadena Deductiva en 5 Etapas Constructivas

### Étape 1 : Le Hamiltonien Ouvert et le Graphe Chemin (Physlib #2096)
> **Proposition 1.1 (Hamiltonien ouvert et matrice d'adjacence).** Pour toute chaîne de liaison forte ouverte à `N` sites avec auto-énergie `E₀` et saut `t`, les éléments matriciels vérifient identiquement :

```text
⟨m | H_open | n⟩ = E₀ · I_mn − t · (adjMatrix ℝ (SimpleGraph.pathGraph T.N)) m n
```

*Modules formels :* `Physlib/CondensedMatter/TightBindingChain/Open/Basic.lean` (`inner_openHamiltonian_eq_adjMatrix`). Démonstration directe par décomposition sur la base orthonormale des états localisés `|n⟩` et identification des arêtes du graphe chemin.

---

### Étape 2 : Commutateur de Position et Déplacement Discret
> **Proposition 2.1 (Commutateur canonique de position).** L'opérateur position `X = ∑ a n |n⟩⟨n|` satisfait la relation de commutation discrète pour tout opérateur `A` :

```text
⟨m | [A, X] | n⟩ = a · (n − m) · ⟨m | A | n⟩
```

Le corchete `⁅H, X⁆ = −(i/2) [H, X]` ne connecte que les sites immédiatement adjacents (`|m − n| = 1`), fondant l'inégalité d'incertitude locale énergie-position `Var(H) · Var(X) ≥ |⟨⁅H, X⁆⟩|²`.

*Modules formels :* `PhyslibAlpha/CondensedMatter/TightBindingChain/Open/Basic.lean` (`position`, `inner_commutator_position`), `Open/Uncertainty.lean` (`inner_bracket_openHamiltonian_position_eq`, `robertson_schrodinger_openHamiltonian_position`).

---

### Étape 3 : État de Courant Maximal et Saturation en d ≤ 3
> **Théorème 3.1 (Bifurcation géométrique de Robertson–Schrödinger).** Dans l'état de courant maximal `|ψ_max⟩`, le défaut de Gram centré vérifie :

```text
centeredGramDefect(ψ_max) = 0  ⟺  N = 2 ∨ N = 3
N ≥ 4  ⟹  Var(H) · Var(X) > |⟨⁅H, X⁆⟩|²
```

Le ratio d'incertitude `C_N = √(Var(H) Var(X)) / |⟨⁅H, X⁆⟩|` vérifie `C₂ = C₃ = 1`, est strictement croissant (`C_N < C_{N+1}`) et strictement borné par la constante universelle de Szegő :

```text
C_N² < π²/3 − 2 ≈ 1.289868
```

*Modules formels :* `PhyslibAlpha/CondensedMatter/TightBindingChain/MaxCurrentState/Saturation.lean` (`centeredGramDefect_maxCurrentState_eq_zero_iff`, `robertson_schrodinger_maxCurrentState_lt`), `UncertaintyRatio.lean` (`uncertaintyRatio_eq_one_iff`), `LongChainMonotonicity.lean` (`uncertaintyRatio_lt_sqrt_pi_sq_div_three_sub_two`), `MandelstamTamm.lean` (`mandelstamTammRatio_maxCurrentState`).

---

### Étape 4 : L'Open Cube NRS³ en 3D et Rupture Stricte 4 × 4 × 4 (Physlib #1725)
> **Théorème 4.1 (Orthogonalité inter-axes et déterminant de Robertson multidimensionnel).** Sur le cube ouvert à trois axes `Tx ⊗ Ty ⊗ Tz`, les observables d'axes distincts commutent rigoureusement :

```text
[alongX(a), alongY(b)] = 0,    [alongX(a), alongZ(c)] = 0,    [alongY(b), alongZ(c)] = 0
```

Pour les 6 observables conjuguées `((H_X, X), (H_Y, Y), (H_Z, Z))`, la matrice simpléctique `Ω` et la matrice de covariance `Σ` sont bloc-diagonales `3 × 3`. Dans l'état `maxCurrentCubeState`, le déterminant satisfait :

```text
det Σ / |det Ω| = (C_Nx · C_Ny · C_Nz)²
```

Sur tout cube ouvert avec `Nx ≥ 4, Ny ≥ 4, Nz ≥ 4`, l'inégalité de Robertson est **strictement stricte** :

```text
|det Ω| < det Σ
```

*Modules formels :* `PhyslibAlpha/CondensedMatter/TightBindingChain/Cube/Basic.lean` (`bracket_alongX_alongY`, `robertson_det_cube`, `robertson_det_maxCurrentCubeState_strict`, Physlib #1725), `Cube/Hamiltonian.lean` (`cubeHamiltonian`, `inner_cubeHamiltonian_eq_adjMatrix`), `Cube/SpeedLimit.lean` (`abs_expectation_alongX_current_le`).

---

### Étape 5 : Réalisation Physique — La Table Périodique des 118 Éléments sur ℤ³
> **Proposition 5.1 (Confinement du core d ≤ 3 et stabilité de valence d ≥ 4).** Chaque élément chimique Z ∈ {1, …, 118} est modélisé comme un noyau central au site `(0, 0, 0)` et Z électrons sur le retículo entier ℤ³ régis par l'opérateur de saut axial :

1. **Core doré saturant (`d ≤ 3`):** Les 7 × 7 × 7 = 343 sites (`−3 ≤ x, y, z ≤ 3`) forment la zone où le défaut de Gram s'annule (`defectGram(d) = 0`). Aucun effondrement ultraviolet vers le noyau n'est possible.
2. **Couches de valence (`d ≥ 4`):** Les sous-couches s, p, d et f se déploient dans la région où le déterminant de Robertson devient strictement dispersif (`|det Ω| < det Σ`), générant le plancher de cohérence cinématique borné par Szegő qui stabilise la matière.
3. **Sphère de Bloch locale :** Chaque électron individuel visualise sa phase complexe et son courant cinétique `⟨J⟩` sans trajectoire continue classique.

---

## 🏛️ Les Fondations dans Physlib : Pull Requests Fusionnées

| Étape | Fondement Mathématique | PRs Fusionnées dans Physlib | Modules Associés |
| :---: | :--- | :--- | :--- |
| **Étape 1** | Hamiltonien ouvert comme graphe chemin P_N | **[#2096](https://github.com/leanprover-community/physlib/pull/2096)** (`inner_openHamiltonian_eq_adjMatrix`) | `TightBindingChain.Open` |
| **Étape 2** | Commutateur de position et incertitude H − X | **[#1723](https://github.com/leanprover-community/physlib/pull/1723)**, **[#1689](https://github.com/leanprover-community/physlib/pull/1689)** | `TightBindingChain.Open.Uncertainty` |
| **Étape 3** | Courant maximal, saturation d ≤ 3 et cota de Szegő | **[#1716](https://github.com/leanprover-community/physlib/pull/1716)**, **[#1718](https://github.com/leanprover-community/physlib/pull/1718)**, **[#1732](https://github.com/leanprover-community/physlib/pull/1732)**, **[#1734](https://github.com/leanprover-community/physlib/pull/1734)**, **[#1735](https://github.com/leanprover-community/physlib/pull/1735)**, **[#1739](https://github.com/leanprover-community/physlib/pull/1739)** | `TightBindingChain.MaxCurrentState` |
| **Étape 4** | L'Open Cube NRS³, commutation orthogonale et rupture 4 × 4 × 4 | **[#1725](https://github.com/leanprover-community/physlib/pull/1725)** (Open Cube NRS³), **[#1986](https://github.com/leanprover-community/physlib/pull/1986)** (commutation axiale orthogonale), **[#1987](https://github.com/leanprover-community/physlib/pull/1987)** (coordination Δ = 12) | `TightBindingChain.Cube` |
| **Étape 5** | Réalisation physique et table périodique de 118 éléments | **[#1961](https://github.com/leanprover-community/physlib/pull/1961)** (réseaux de Bravais en dimension d) | Suite 3D 118 modèles Three.js |

---

## 🔬 Catalogue des Théorèmes Vérifiés par Machine (0 sorry)

| Déclaration Lean 4 | Énoncé Mathématique | Origine Formelle |
|:---|:---|:---:|
| `inner_openHamiltonian_eq_adjMatrix` | `⟨m\|H_open\|n⟩ = E₀ · I_mn − t · A(P_N)_mn` | Physlib #2096 |
| `bracket_alongX_alongY` | `[alongX(a), alongY(b)] = 0` (Commutation axiale orthogonale) | Physlib #1725 / #1986 |
| `centeredGramDefect_alongX_eq_zero_iff` | `defect_X = 0 ⟺ N_X = 2 ∨ N_X = 3` | Physlib #1725 |
| `robertson_det_maxCurrentCubeState_strict` | `4×4×4 ⟹ \|det Ω\| < det Σ` | Physlib #1725 |
| `inner_commutator_position` | `⟨m\|[A, X]\|n⟩ = a(n − m) ⟨m\|A\|n⟩` | PhyslibAlpha |
| `inner_bracket_openHamiltonian_position_eq` | `⁅H, X⁆` agit strictement entre premiers voisins (`\|m − n\| = 1`) | PhyslibAlpha |
| `robertson_schrodinger_openHamiltonian_position` | `Var(H) · Var(X) ≥ \|⟨⁅H, X⁆⟩\|²` | PhyslibAlpha |
| `centeredGramDefect_maxCurrentState_eq_zero_iff` | `defect(ψ_max) = 0 ⟺ N ∈ {2, 3}` | PhyslibAlpha |
| `robertson_schrodinger_maxCurrentState_lt` | `N ≥ 4 ⟹ Var(H) · Var(X) > \|⟨⁅H, X⁆⟩\|²` | PhyslibAlpha |
| `uncertaintyRatio_eq_one_iff` | `C_N = 1 ⟺ N = 2 ∨ N = 3` | PhyslibAlpha |
| `uncertaintyRatio_lt_uncertaintyRatio` | `N < N' ⟹ C_N < C_N'` (Monotonie de Bernstein) | PhyslibAlpha |
| `uncertaintyRatio_lt_sqrt_pi_sq_div_three_sub_two` | `C_N² < π²/3 − 2 ≈ 1.289868` (Cote de Szegő) | PhyslibAlpha |
| `mandelstamTammRatio_maxCurrentState` | `⟨J⟩² / (4 · Var(H) · Var(X)) = 1/C_N² ≤ 1` | PhyslibAlpha |
| `inner_cubeHamiltonian_eq_adjMatrix` | `H_cube = E_site · I − t · Adj(P_Nx □ P_Ny □ P_Nz)` | PhyslibAlpha |
| `bracketMatrix_cubePairs` | Matrice simpléctique `Ω` bloc-diagonale `3 × 3` | PhyslibAlpha |
| `robertson_det_cube` | `\|det Ω\| ≤ det Σ` sur tout état du cube | PhyslibAlpha |
| `abs_expectation_alongX_current_le` | `\|⟨J_X⟩\| ≤ 2 \|a t\| cos(π / (N_X + 1))` (Vitesse limite) | PhyslibAlpha |

---

## 🖥️ Cómo leer un modelo 3D

| Lo que ves | Qué significa |
|---|---|
| **Caja** `n×n×n` | La red de sitios enteros donde pueden estar los electrones. Crece con Z. |
| **Core dorado** | La zona saturante `d ≤ 3`: 343 sitios (`7×7×7`) alrededor del núcleo (`defectGram(d) = 0`). |
| **Lóbulos de color** | Las subcapas s, p, d y f; cada capa externa se dibuja más grande. |
| **Esfera de Bloch** | El estado de un electrón elegido, con su fase y su corriente cinemática `⟨J⟩`. |
| **Tarjeta del núcleo** | Isótopo de referencia (A, protones, neutrones): el más abundante, o el de vida más larga. |
| **Valencia** | Solo la capa externa; el resto es core (Fe: `4s² 3d⁶` sobre `[Ar]`). |

## Qué hay en el repo

```text
docs/
├── index.html          la tabla (118 celdas; lantánidos y actínidos en filas aparte)
├── ver.html?z=N        visor: barra «Regresar» + el modelo del elemento N
├── modelos/            118 HTML autocontenidos (Three.js incluido, sin red)
├── data/elementos.js   símbolo, nombre, archivo y posición de cada Z
└── shared/ media/      estilos, fuentes e imágenes
```

Para verlo en local: `python3 -m http.server -d docs 8000` y abre <http://localhost:8000>.

## De dónde salen los modelos

Una sola plantilla genera los 118 (`generar_cubo` → `canon_cuadrantes`). Cada archivo se **audita regenerándolo y comparando byte a byte**, y además se abre en Chrome headless para buscar errores de JavaScript: 118 de 118 pasan. Ningún HTML se edita a mano; si algo está mal se corrige el generador y se regenera todo.

## Qué es convención y qué no

Los slots 3s–7p, la orientación de los orbitales d y f, las posiciones de los nucleones y la masa de los elementos con Z ≥ 103 son **convención de dibujo**, no resultados formales. El marco matemático (el Open Cube `RS^N³`, el paso de eje y el cierre en `d ≤ 3`) está certificado en Lean 4 sobre Mathlib y Physlib (#1725, #2096).

---

## 🌐 Mosaico del Ecosistema naype888-cloud

| Repositorio | Descripción / Tema | Enlace |
| :--- | :--- | :---: |
| `lean4-commits` | Registro continuo de desarrollo y verificación formal en Lean 4 | [naype888-cloud/lean4-commits](https://github.com/naype888-cloud/lean4-commits) |
| `nava-robertson-schrodinger` | Teorema de incertitud elemental dimensional en d dimensiones | [naype888-cloud/nava-robertson-schrodinger](https://github.com/naype888-cloud/nava-robertson-schrodinger) |
| `YM-By-Perelmans-surgery-method` | Resolución constructiva del gap de masa de Yang–Mills en dimensión 4 | [naype888-cloud/YM-By-Perelmans-surgery-method](https://github.com/naype888-cloud/YM-By-Perelmans-surgery-method) |
| `Proper-Time-General-Relativity` | Geometría lorentziana y derivación formal del tiempo propio | [naype888-cloud/Proper-Time-General-Relativity](https://github.com/naype888-cloud/Proper-Time-General-Relativity) |
| `Anti-Kurt-Godel-Theorem` | Formalización semántica y consistencia constructiva | [naype888-cloud/Anti-Kurt-Godel-Theorem](https://github.com/naype888-cloud/Anti-Kurt-Godel-Theorem) |
| `nrs3-tightbinding` | El Open Cube NRS³ en ℤ³ y la tabla periódica de 118 elementos | [naype888-cloud/nrs3-tightbinding](https://github.com/naype888-cloud/nrs3-tightbinding) |
| `nrs3-cristales` | Redes cristalinas tridimensionales y bandas de energía | [naype888-cloud/nrs3-cristales](https://github.com/naype888-cloud/nrs3-cristales) |
| `bacqm-systems` | Núcleo de integración, autómatas formales y certificación | [naype888-cloud/bacqm-systems](https://github.com/naype888-cloud/bacqm-systems) |

---

## 🛠️ Instructions de Compilation et Certification Kernel

```bash
# Compilation des modules de liaison forte dans Physlib
lake build Physlib.CondensedMatter.TightBindingChain.Basic

# Compilation du cube ouvert et de la dérivation 3D
lake build PhyslibAlpha.CondensedMatter.TightBindingChain.Cube.Basic
```

L'ensemble des théorèmes est vérifié sous la base axiomatique standard du noyau Lean 4 :

```text
[propext, Classical.choice, Quot.sound]
```

**0 `sorry`**, aucun axiome ad hoc, vérifié formellement avec le compilateur officiel.

---

## 📜 Licencia y Citación

Distribuido bajo licencia [NRS Noncommercial License 1.0.0](LICENSE). Para citar este repositorio:

```bibtex
@software{nava_hernandez_2026_tightbinding,
  author       = {Nava-Hernández, Eduardo},
  title        = {{RS^N³ · Open Cube & Tight-binding: la tabla periódica, un cubo por elemento}},
  month        = nov,
  year         = 2026,
  publisher    = {GitHub},
  journal      = {naype888-cloud/nrs3-tightbinding},
  url          = {https://github.com/naype888-cloud/nrs3-tightbinding}
}
```

---

<div align="center">

### 🌌 *«Un electrón solo se desplaza por pasos de eje; en el Open Cube ℤ³, la saturación de Robertson en d ≤ 3 confina el core, y la estrictez en d ≥ 4 engendra la diversidad de la materia.»*

**Eduardo Nava Hernández** · naype888@gmail.com · [naype888-cloud](https://github.com/naype888-cloud)

</div>
