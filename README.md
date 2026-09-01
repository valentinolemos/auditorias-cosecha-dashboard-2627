# Auditorías Cosecha 26/27 — Dashboard

Panel de control de calidad de cosecha (pérdidas de grano, recupero y valorización)
para Estancia San Luis, campaña 2026/27.

Es una copia de [`auditorias-cosecha-dashboard`](https://github.com/valentinolemos/auditorias-cosecha-dashboard)
(campaña 25/26, no se toca) apuntada a los datos de la campaña nueva. Mismo diseño,
mismos gráficos — cambia la fuente de datos y se sacaron las notas de calidad de
datos específicas del dataset viejo (no aplicaban acá).

Parte de [[App Auditorías de Maquinaria]] — Hito 5.

## Cómo se actualiza

Los datos se leen **en vivo** desde el Google Sheet que llena la
[app de Diego Cavanillas](https://github.com/valentinolemos/auditorias-cosecha-app):

- Planilla: <https://docs.google.com/spreadsheets/d/1cCgO78Iss02ke5XRgS2vLjInGWcXYJYZS9cyPtNeTR0/edit>
- Diego carga una auditoría en la tablet → sincroniza al Sheet → recargás el dashboard → se actualiza.
- La planilla tiene que estar compartida como **"Cualquiera con el enlace: Lector"** (ya configurado).
- Si la planilla no está disponible, el panel queda con la planilla vacía (arranca sin datos — no hay respaldo embebido, a diferencia del dashboard 25/26, porque la campaña 26/27 recién empieza).

### Columnas de la planilla (headers reales de la app)

`FECHA, ZONA, ENCARGADO, ESTABLECIMIENTO, SUPERFICIE, CULTIVO, CONTRATISTA,
COSECHADORA, MODELO, PLATAFORMA, PIES, PMG, HUMEDAD, TOLERANCIA,
PERDIDA INICIAL, PERDIDA FINAL, DIFERENCIA, KG RECUPERADOS, % MINUTA, OBSERVACIONES`

El dashboard normaliza estos headers a los nombres internos que ya usaba
(`marca` en vez de `MODELO`, snake_case en vez de espacios) en `csvToRows()`.

Se recalculan en el JS (no se toman del Sheet, aunque ya vengan calculadas):

- `diferencia = perdida_inicial - perdida_final`
- `kg_recuperados = superficie × diferencia`

`resultado` (CONFORME / CORREGIDO / NO CONFORME) **no existe como columna** en
este Sheet (a diferencia del 25/26) — se deriva en `buildRecord()` a partir de
`tolerancia` vs. `perdida_inicial`/`perdida_final`:

- **CONFORME** — pérdida final ≤ tolerancia y pérdida inicial también
- **CORREGIDO** — pérdida inicial > tolerancia, pero se corrigió a ≤ tolerancia
- **NO CONFORME** — pérdida final > tolerancia pese al ajuste

## Publicación

`index.html` es un único archivo autónomo (incluye Chart.js embebido). Se sirve
desde Vercel (mismo hosting que [la app](https://github.com/valentinolemos/auditorias-cosecha-app)):
**https://auditorias-cosecha-dashboard-2627.vercel.app**

Para publicar un cambio: `npx vercel --prod` desde esta carpeta.

Para apuntar a otra fuente de datos sin tocar el código:
`index.html?csv=<URL_de_un_CSV>`
