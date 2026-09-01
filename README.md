# Auditorías de Maquinaria 26/27 — Dashboard

Panel de control de auditorías de maquinaria (cosecha, siembra, fertilización) para
Estancia San Luis, campaña 2026/27.

`index.html` es un shell liviano con 3 pestañas (Cosecha / Siembra / Fertilización)
que cargan cada dashboard por separado vía `<iframe>`:

- **`cosecha.html`** — pérdidas de grano, recupero y valorización. Es una copia de
  [`auditorias-cosecha-dashboard`](https://github.com/valentinolemos/auditorias-cosecha-dashboard)
  (campaña 25/26, no se toca) apuntada a los datos de la campaña nueva.
- **`siembra.html`** — densidad de semilla y de fertilizante aplicado en la siembra,
  por cultivo. Mismo diseño y CSS que Cosecha, adaptado a los campos reales de esa labor.
- **`fertilizacion.html`** — dosis de fertilizante aplicado, mismo criterio que Siembra.

Parte de [[App Auditorías de Maquinaria]] — Hitos 5 y 7. Las 3 pestañas están completas.

## Por qué pestañas y no todo junto

Cada labor mide cosas distintas — Cosecha mide pérdida de grano (kg/ha), Siembra mide
densidad de semilla y fertilizante (dos cosas a la vez), Fertilización mide dosis
aplicada (kg). No hay un gráfico que tenga sentido comparando las 3 a la vez. Pestañas
dentro del mismo link evitan tanto mezclar peras con papas en una sola vista gigante
como obligar a acordarse de 3 direcciones distintas.

## Cómo se actualiza

Los datos se leen **en vivo** desde el Google Sheet que llena la
[app de Diego Cavanillas](https://github.com/valentinolemos/auditorias-cosecha-app)
("Auditorias Maquinaria - App (26-27)"), cada pestaña del dashboard lee su propia
hoja del Sheet:

- Planilla: <https://docs.google.com/spreadsheets/d/1cCgO78Iss02ke5XRgS2vLjInGWcXYJYZS9cyPtNeTR0/edit>
- Diego carga una auditoría en la tablet → sincroniza al Sheet → recargás el dashboard → se actualiza.
- La planilla tiene que estar compartida como **"Cualquiera con el enlace: Lector"** (ya configurado).
- `cosecha.html` lee `/export?format=csv` (primera pestaña del Sheet). `siembra.html`
  lee `/gviz/tq?tqx=out:csv&sheet=Siembra` explícitamente — hace falta apuntar la
  hoja por nombre porque no es la primera pestaña del archivo.

### Columnas — Cosecha

`FECHA, ZONA, ENCARGADO, ESTABLECIMIENTO, SUPERFICIE, CULTIVO, CONTRATISTA,
COSECHADORA, MODELO, PLATAFORMA, PIES, PMG, HUMEDAD, TOLERANCIA,
PERDIDA INICIAL, PERDIDA FINAL, DIFERENCIA, KG RECUPERADOS, % MINUTA, OBSERVACIONES`

`resultado` (CONFORME / CORREGIDO / NO CONFORME) se deriva en `buildRecord()` a partir
de `tolerancia` vs. `perdida_inicial`/`perdida_final` (no viene como columna del Sheet):

- **CONFORME** — pérdida final ≤ tolerancia y pérdida inicial también
- **CORREGIDO** — pérdida inicial > tolerancia, pero se corrigió a ≤ tolerancia
- **NO CONFORME** — pérdida final > tolerancia pese al ajuste

### Columnas — Siembra

`FECHA, ZONA, ENCARGADO, ESTABLECIMIENTO, SUPERFICIE, CULTIVO, CONTRATISTA,
SEMBRADORA, MARCA, DISTANCIAMIENTO, PROFUNDIDAD, DOSIFICADOR, CORTE, VARIABLE,
PILOTO, SEÑAL, PMG, SEMILLA DENSIDAD OBJETIVO/INICIAL/FINAL/DIFERENCIA/KG RECUPERADOS,
FERTILIZANTE DENSIDAD OBJETIVO/INICIAL/FINAL/DIFERENCIA/KG RECUPERADOS, % MINUTA, OBSERVACION`

Diferencia y Kg recuperados se recalculan en el JS para semilla y fertilizante por
separado, misma fórmula que Cosecha (`diferencia = inicial − final`,
`kg = diferencia × superficie`). **No hay clasificación conforme/no conforme** —
Siembra no tiene columna de tolerancia, el panel solo muestra el desvío real contra
el objetivo cargado en cada auditoría.

### Columnas — Fertilización

`FECHA, ZONA, ENCARGADO, ESTABLECIMIENTO, SUPERFICIE, CULTIVO, CONTRATISTA,
FERTILIZADORA, SISTEMA, DISTANCIAMIENTO, PROFUNDIDAD, KG OBJETIVO, KG INICIAL,
KG FINAL, DIFERENCIA, KG RECUPERADO, % MINUTA, OBSERVACIONES`

Misma fórmula de diferencia/kg recuperado que Cosecha y Siembra. Tampoco tiene
columna de tolerancia — no hay clasificación conforme/no conforme, solo desvío
real contra el objetivo.

## Publicación

Cada página es un archivo autónomo (incluye Chart.js embebido). Se sirve desde Vercel
(mismo hosting que [la app](https://github.com/valentinolemos/auditorias-cosecha-app)):
**https://auditorias-cosecha-dashboard-2627.vercel.app**

Para publicar un cambio: `npx vercel --prod` desde esta carpeta.

Para apuntar `cosecha.html` a otra fuente de datos sin tocar el código:
`cosecha.html?csv=<URL_de_un_CSV>`
