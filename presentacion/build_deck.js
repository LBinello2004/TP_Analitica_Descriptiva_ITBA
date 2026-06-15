// Presentacion ejecutiva - Priorizacion de oportunidades de flip en CABA
// Diseno: editorial / consulting (MBB) - running head, action titles, sin cajas
const path = require("path");
const PptxGenJS = require(path.join(process.env.APPDATA, "npm", "node_modules", "pptxgenjs"));

const pres = new PptxGenJS();
pres.defineLayout({ name: "W", width: 13.333, height: 7.5 });
pres.layout = "W";
pres.author = "Tamaki, Goldschmidt, Binelo";
pres.title = "Priorizacion de oportunidades de flip inmobiliario en CABA";

// ---- Paleta ----
const NAVY = "0F1B2D", TERRA = "C2683C", PAPER = "F4F1EC", WHITE = "FFFFFF";
const INK = "3A3A3A", GRAY = "BFBFBF", GRAYD = "7A7A7A", ICE = "C7D2DD";
const LINE = "D8D0C2", LINED = "2A3C52", MUTEDD = "8A97A6";
const SERIF = "Georgia", SANS = "Calibri", SANSL = "Calibri Light";
const A = path.join(__dirname, "assets");
const DASH = "https://app.powerbi.com/view?r=eyJrIjoiNTQ0NjhkY2UtMjdjMC00YmQ0LWIyNGUtYjMwNzEzMDk0YTQ4IiwidCI6ImExZjUwYTk3LTIxYzAtNDlhNy1hOWQ0LWYyNDRlYmI0MmRhNyIsImMiOjR9";
const W = 13.333, H = 7.5, MX = 0.7;

function fit(ratio, maxW, maxH) { let w = maxW, h = w / ratio; if (h > maxH) { h = maxH; w = h * ratio; } return { w, h }; }
function hl(slide, x, y, w, color) { slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.014, fill: { color }, line: { type: "none" } }); }
function vl(slide, x, y, h, color) { slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.014, h, fill: { color }, line: { type: "none" } }); }

// running head (cintillo) + action title -> sin barra vertical, sin footer
function head(slide, kicker, page, title, opts = {}) {
  const dark = opts.dark;
  const ln = dark ? LINED : LINE, mu = dark ? MUTEDD : GRAYD, tc = dark ? WHITE : NAVY;
  slide.addText(kicker.toUpperCase(), { x: MX, y: 0.34, w: 9.5, h: 0.3, fontFace: SANS, fontSize: 10.5, color: TERRA, bold: true, charSpacing: 2.5, margin: 0 });
  slide.addText(`${String(page).padStart(2, "0")} / 12`, { x: W - 2.0, y: 0.34, w: 1.3, h: 0.3, fontFace: SANS, fontSize: 10.5, color: mu, align: "right", charSpacing: 1, margin: 0 });
  hl(slide, MX, 0.72, W - 2 * MX, ln);
  slide.addText(title, { x: MX - 0.02, y: 0.86, w: W - 2 * MX, h: opts.th ?? 0.9, fontFace: SERIF, fontSize: opts.ts ?? 31, color: tc, bold: true, margin: 0, valign: "top" });
}

// ======================================================================
// SLIDE 1 - Portada
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  const m = fit(1.087, 6.3, 6.4);
  s.addImage({ path: path.join(A, "06_mapa_cover.png"), x: W - m.w - 0.2, y: (H - m.h) / 2, w: m.w, h: m.h });
  // masthead
  s.addText("ANÁLISIS DE OPORTUNIDADES INMOBILIARIAS · CABA", { x: 0.85, y: 0.6, w: 8, h: 0.3, fontFace: SANS, fontSize: 11, color: TERRA, bold: true, charSpacing: 2.5, margin: 0 });
  s.addText("ITBA · 2025", { x: 9.2, y: 0.6, w: 3.3, h: 0.3, fontFace: SANS, fontSize: 11, color: MUTEDD, align: "right", charSpacing: 1, margin: 0 });
  hl(s, 0.85, 0.98, W - 1.7, LINED);
  // titulo
  s.addText("Priorización de\noportunidades de\nflip inmobiliario", { x: 0.82, y: 2.0, w: 7.2, h: 2.5, fontFace: SERIF, fontSize: 42, color: WHITE, bold: true, lineSpacingMultiple: 1.0, margin: 0 });
  s.addText("Una herramienta de decisión en tres niveles — barrio, propiedad y validación — para concentrar la búsqueda donde hay evidencia.", { x: 0.85, y: 4.75, w: 6.0, h: 1.0, fontFace: SANSL, fontSize: 15, color: ICE, lineSpacingMultiple: 1.12, margin: 0 });
  hl(s, 0.85, 6.05, 3.0, TERRA);
  s.addText([
    { text: "Felipe Tamaki · 66477      Matías Goldschmidt · 66061      Lucas Binelo · 66011", options: { breakLine: true, color: WHITE, fontSize: 12, bold: true } },
    { text: "Analítica Descriptiva — Presentación ejecutiva", options: { color: MUTEDD, fontSize: 11 } },
  ], { x: 0.85, y: 6.2, w: 8.2, h: 0.8, fontFace: SANS, lineSpacingMultiple: 1.35, margin: 0 });
})();

// ======================================================================
// SLIDE 2 - La oportunidad
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "Contexto y oportunidad", 2, "El problema del flipper");
  s.addText([
    { text: "Comprar, mejorar y revender un departamento exige elegir bien antes de invertir. Pero el mercado de CABA es enorme, heterogéneo y difícil de comparar: miles de publicaciones, 48 barrios con dinámicas distintas y atributos que no se comparan entre sí.", options: { breakLine: true } },
    { text: "", options: { breakLine: true, fontSize: 10 } },
    { text: "Hoy esa selección se hace a ojo —scrolleando Argenprop o por intuición—. El inversor ", options: {} },
    { text: "flipper", options: { italic: true } },
    { text: ", sin un equipo de research, pierde tiempo en avisos sin evidencia y decide sobre cientos de miles de dólares con información dispersa.", options: {} },
  ], { x: MX, y: 2.0, w: 6.5, h: 3.4, fontFace: SANS, fontSize: 17, color: INK, lineSpacingMultiple: 1.2, valign: "top", margin: 0 });

  // numeros grandes, sin cajas, separados por hairlines
  const stats = [["12.518", "publicaciones de departamentos relevadas"], ["48", "barrios con precios y dinámicas distintas"], ["USD 100k+", "decisión típica por operación"]];
  let cy = 1.95;
  stats.forEach(([n, l], i) => {
    if (i > 0) hl(s, 8.3, cy - 0.18, 4.3, LINE);
    s.addText(n, { x: 8.3, y: cy, w: 4.3, h: 0.75, fontFace: SERIF, fontSize: 40, color: NAVY, bold: true, margin: 0 });
    s.addText(l, { x: 8.34, y: cy + 0.78, w: 4.3, h: 0.4, fontFace: SANS, fontSize: 12.5, color: GRAYD, margin: 0 });
    cy += 1.5;
  });
  vl(s, 8.1, 1.98, 4.2, TERRA);
})();

// ======================================================================
// SLIDE 3 - La pregunta
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "Objetivo del análisis", 3, "¿Qué buscamos responder?");
  s.addText([
    { text: "¿Cómo puede un inversor ", options: {} },
    { text: "concentrar su búsqueda", options: { color: TERRA, bold: true } },
    { text: " en los barrios y propiedades con mejores señales de descuento, puesta en valor y salida comercial?", options: {} },
  ], { x: MX, y: 2.0, w: 11.6, h: 1.5, fontFace: SERIF, fontSize: 25, color: NAVY, italic: true, lineSpacingMultiple: 1.12, margin: 0 });

  const steps = [
    ["01", "Barrio", "Dónde concentrar la búsqueda: zonas con precio de entrada, profundidad de comparables y descuento relativo favorables."],
    ["02", "Propiedad", "Qué avisos investigar primero: cada unidad comparada contra inmuebles equivalentes de su mismo barrio."],
    ["03", "Validación", "Del score a la decisión: qué confirmar —precio de cierre, estado real, obra y costos— antes de comprometer capital."],
  ];
  const colW = 3.74, gap = 0.45; let x = MX;
  steps.forEach(([n, t, d], i) => {
    if (i > 0) vl(s, x - gap / 2, 4.0, 2.3, LINE);
    s.addText(n, { x, y: 3.95, w: 2, h: 0.6, fontFace: SERIF, fontSize: 26, color: TERRA, bold: true, margin: 0 });
    s.addText(t, { x, y: 4.6, w: colW, h: 0.5, fontFace: SERIF, fontSize: 22, color: NAVY, bold: true, margin: 0 });
    s.addText(d, { x, y: 5.2, w: colW, h: 1.3, fontFace: SANS, fontSize: 13.5, color: INK, lineSpacingMultiple: 1.18, valign: "top", margin: 0 });
    x += colW + gap;
  });
})();

// ======================================================================
// SLIDE 4 - Datos y metodo
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "Metodología y datos", 4, "De 12.518 avisos crudos a 7.245 comparables");
  const stages = [
    ["Crudo", "12.518", "Avisos de Argenprop"],
    ["Geocodificado", "12.518", "Coordenadas y control CABA"],
    ["Enriquecido", "7.991", "Variables territoriales"],
    ["Limpio", "7.245", "Tipos, outliers e imputación"],
    ["Final + índices", "7.245", "Clusters e índices PCA/MCA"],
  ];
  const colW = 2.32, gap = 0.13; let x = MX;
  const baseY = 2.35;
  stages.forEach(([t, n, d], i) => {
    const last = i === stages.length - 1;
    s.addText(t.toUpperCase(), { x, y: baseY, w: colW, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: last ? TERRA : NAVY, charSpacing: 1, margin: 0 });
    s.addText(n, { x: x - 0.02, y: baseY + 0.34, w: colW, h: 0.85, fontFace: SERIF, fontSize: 38, bold: true, color: last ? TERRA : NAVY, margin: 0 });
    s.addText("filas", { x, y: baseY + 1.2, w: colW, h: 0.28, fontFace: SANS, fontSize: 10, italic: true, color: GRAY, margin: 0 });
    hl(s, x, baseY + 1.6, colW - 0.15, last ? TERRA : LINE);
    s.addText(d, { x, y: baseY + 1.72, w: colW - 0.1, h: 0.7, fontFace: SANS, fontSize: 11.5, color: GRAYD, lineSpacingMultiple: 1.08, valign: "top", margin: 0 });
    if (!last) s.addText("›", { x: x + colW - 0.13, y: baseY + 0.45, w: gap + 0.18, h: 0.6, fontFace: SANS, fontSize: 22, color: GRAY, align: "center", margin: 0 });
    x += colW + gap;
  });
  s.addText("La caída de filas son avisos fuera de CABA o sin geocodificar (→ 7.991) y registros sin superficie válida u outliers de precio (→ 7.245).", { x: MX, y: 4.88, w: W - 2 * MX, h: 0.32, fontFace: SANS, fontSize: 10.5, italic: true, color: GRAYD, margin: 0 });
  // fuentes
  s.addText("FUENTES", { x: MX, y: 5.3, w: 3, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: TERRA, charSpacing: 2, margin: 0 });
  hl(s, MX, 5.58, W - 2 * MX, LINE);
  const src = [["Argenprop", "Publicaciones de venta en CABA"], ["GCBA Datos Abiertos", "Barrios, subte, hospitales"], ["OpenStreetMap / Overpass", "Servicios urbanos y geocodificación"]];
  let sx = MX; const sw = 4.0;
  src.forEach(([t, d], i) => {
    if (i > 0) vl(s, sx - 0.2, 5.78, 0.85, LINE);
    s.addText(t, { x: sx, y: 5.75, w: sw - 0.4, h: 0.35, fontFace: SANS, fontSize: 14, bold: true, color: NAVY, margin: 0 });
    s.addText(d, { x: sx, y: 6.12, w: sw - 0.4, h: 0.4, fontFace: SANS, fontSize: 11.5, color: GRAYD, margin: 0 });
    sx += sw;
  });
})();

// ======================================================================
// SLIDE 5 - Hallazgo 1: Territorio
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "Hallazgo 1 · Territorio", 5, "El barrio es el primer filtro de precio");
  const m = fit(1.273, 5.6, 4.5);
  s.addImage({ path: path.join(A, "01_mapa_precio_m2.png"), x: MX, y: 1.95, w: m.w, h: m.h });
  s.addText("Precio por m² publicado · cada punto es un aviso geolocalizado", { x: MX, y: 1.95 + m.h - 0.05, w: m.w, h: 0.3, fontFace: SANS, fontSize: 10, italic: true, color: GRAYD, align: "center", margin: 0 });
  const b = fit(1.477, 5.8, 4.15);
  s.addImage({ path: path.join(A, "02_precio_m2_barrio.png"), x: 7.1, y: 1.9, w: b.w, h: b.h });
  s.addText([
    { text: "Puerto Madero ", options: { bold: true, color: NAVY } },
    { text: "encabeza con una mediana de ~USD 4.800/m². La diferencia de precio entre barrios es ", options: {} },
    { text: "fuerte (ε² = 0,305)", options: { bold: true, color: TERRA } },
    { text: ", y la accesibilidad los separa con aún más nitidez ", options: {} },
    { text: "(ε² = 0,574)", options: { bold: true, color: TERRA } },
    { text: " — aunque más acceso no implica mayor precio.", options: {} },
  ], { x: 7.1, y: 6.0, w: 5.7, h: 1.3, fontFace: SANS, fontSize: 13, color: INK, lineSpacingMultiple: 1.12, valign: "top", margin: 0 });
})();

// ======================================================================
// SLIDE 6 - Hallazgo 2: descuento + mejorable
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "Hallazgo 2 · Oportunidad", 6, "Las oportunidades no están donde está el dinero");
  const c = fit(1.305, 6.5, 4.7);
  s.addImage({ path: path.join(A, "03_descuento_mejorable.png"), x: MX, y: 1.95, w: c.w, h: c.h });
  const tx = MX + c.w + 0.55;
  s.addText("Los barrios premium concentran el precio; los descuentos y el stock mejorable, no.", { x: tx, y: 2.05, w: 12.8 - tx, h: 1.3, fontFace: SERIF, fontSize: 19, bold: true, color: NAVY, lineSpacingMultiple: 1.1, margin: 0, valign: "top" });
  const pts = [
    ["Villa Lugano", "lidera en avisos con descuento fuerte (≥15% vs. comparables)."],
    ["La Boca", "27,8% de stock clasificado como mejorable — el mayor de CABA."],
    ["Señal real, pero débil", "la concentración del descuento es significativa con efecto bajo (Cramer's V = 0,093)."],
  ];
  let py = 3.5;
  pts.forEach(([t, d]) => {
    hl(s, tx, py - 0.12, 12.7 - tx, LINE);
    s.addText([{ text: t + ". ", options: { bold: true, color: NAVY } }, { text: d, options: { color: INK } }], { x: tx, y: py, w: 12.75 - tx, h: 0.85, fontFace: SANS, fontSize: 13.5, lineSpacingMultiple: 1.12, margin: 0, valign: "top" });
    py += 1.05;
  });
})();

// ======================================================================
// SLIDE 7 - Hallazgo 3: amenities
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "Hallazgo 3 · Cautela", 7, "Mejorar suma, pero no siempre se recupera");
  const c = fit(1.341, 5.7, 4.3);
  s.addImage({ path: path.join(A, "04_amenities_precio.png"), x: MX, y: 2.1, w: c.w, h: c.h });
  const tx = MX + c.w + 0.6;
  s.addText("El promedio de amenities sube de 2,40 en el rango de precio bajo a 3,98 en el alto.", { x: tx, y: 2.15, w: 12.8 - tx, h: 1.2, fontFace: SERIF, fontSize: 19, color: NAVY, lineSpacingMultiple: 1.1, margin: 0, valign: "top" });
  // stat sin caja: numero grande con hairlines
  hl(s, tx, 3.75, 12.7 - tx, TERRA);
  s.addText([{ text: "ρ = 0,192", options: { color: TERRA, bold: true } }], { x: tx, y: 3.9, w: 12.7 - tx, h: 0.85, fontFace: SERIF, fontSize: 40, margin: 0 });
  s.addText("Asociación positiva pero baja entre amenities y precio por m².", { x: tx, y: 4.78, w: 12.7 - tx, h: 0.4, fontFace: SANS, fontSize: 12.5, color: GRAYD, margin: 0 });
  hl(s, tx, 5.3, 12.7 - tx, LINE);
  s.addText("La prima por amenities cambia según el barrio: no toda mejora recupera su costo ni vale lo mismo comercialmente.", { x: tx, y: 5.45, w: 12.7 - tx, h: 1.0, fontFace: SANS, fontSize: 13.5, color: INK, lineSpacingMultiple: 1.14, margin: 0, valign: "top" });
})();

// ======================================================================
// SLIDE 8 - El producto (embudo) - 3 columnas sin cajas
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "La solución", 8, "Un embudo de decisión, no una lista de avisos");
  const cols = [
    ["01", "Barrio", "FILTRA ZONAS", "Score territorial con precio de entrada, profundidad de mercado, accesibilidad y descuento relativo.", "Palermo · Recoleta · Belgrano · Colegiales"],
    ["02", "Propiedad", "ORDENA AVISOS", "Índice de oportunidad que compara cada aviso con la mediana de su barrio, tipo y ambientes.", "40% descuento · 20% accesibilidad · 15% zona · 15% estado · 10% mercado"],
    ["03", "Validación", "EXPLICITA EL RIESGO", "Lista de verificaciones financieras, técnicas y legales necesarias antes de comprometer capital.", "Precio de cierre · obra · gastos · impuestos · plazo"],
  ];
  const colW = 3.75, gap = 0.42; let x = MX;
  cols.forEach(([n, t, sub, d, tag], i) => {
    if (i > 0) { vl(s, x - gap / 2, 2.1, 4.4, LINE); s.addText("›", { x: x - gap / 2 - 0.18, y: 3.7, w: 0.4, h: 0.5, fontFace: SANS, fontSize: 22, color: TERRA, align: "center", margin: 0 }); }
    s.addText(n, { x, y: 2.15, w: 2, h: 0.55, fontFace: SERIF, fontSize: 24, bold: true, color: TERRA, margin: 0 });
    s.addText(t, { x, y: 2.72, w: colW, h: 0.5, fontFace: SERIF, fontSize: 25, bold: true, color: NAVY, margin: 0 });
    s.addText(sub, { x, y: 3.3, w: colW, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: GRAYD, charSpacing: 1.5, margin: 0 });
    hl(s, x, 3.68, colW - 0.25, LINE);
    s.addText(d, { x, y: 3.85, w: colW - 0.2, h: 1.6, fontFace: SANS, fontSize: 13.5, color: INK, lineSpacingMultiple: 1.18, valign: "top", margin: 0 });
    s.addText(tag, { x, y: 5.75, w: colW - 0.2, h: 0.8, fontFace: SANS, fontSize: 10.5, italic: true, color: NAVY, lineSpacingMultiple: 1.1, valign: "top", margin: 0 });
    x += colW + gap;
  });
})();

// ======================================================================
// SLIDE 9 - Ejemplo en accion (worked example)
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "El embudo en acción", 9, "Una oportunidad priorizada, con su evidencia");
  // Ficha de la propiedad (izquierda)
  s.addText("PROPIEDAD PRIORIZADA", { x: MX, y: 1.9, w: 5, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: TERRA, charSpacing: 2, margin: 0 });
  s.addText("Belgrano · Vuelta de Obligado 2600", { x: MX, y: 2.22, w: 5.7, h: 0.5, fontFace: SERIF, fontSize: 23, bold: true, color: NAVY, margin: 0 });
  s.addText("Departamento · 2 ambientes · 45 m² · estado a refaccionar", { x: MX, y: 2.76, w: 5.7, h: 0.4, fontFace: SANS, fontSize: 13.5, color: GRAYD, margin: 0 });
  const facts = [
    ["Precio publicado", "USD 80.000", "USD 1.778 / m²"],
    ["Comparable del barrio", "USD 2.706 / m²", "mediana de 38 avisos equivalentes"],
    ["Subvaluación", "34,3%", "≈ USD 42.000 bajo la línea de comparables"],
  ];
  let fy = 3.35;
  facts.forEach(([l, v, d], i) => {
    hl(s, MX, fy - 0.1, 5.7, LINE);
    s.addText(l, { x: MX, y: fy, w: 2.5, h: 0.5, fontFace: SANS, fontSize: 12.5, color: GRAYD, valign: "middle", margin: 0 });
    s.addText(v, { x: MX + 2.4, y: fy, w: 3.3, h: 0.5, fontFace: SERIF, fontSize: 19, bold: true, color: i === 2 ? TERRA : NAVY, valign: "middle", align: "right", margin: 0 });
    s.addText(d, { x: MX, y: fy + 0.46, w: 5.7, h: 0.3, fontFace: SANS, fontSize: 10.5, italic: true, color: GRAY, margin: 0 });
    fy += 0.9;
  });
  s.addText([{ text: "Índice de oportunidad  ", options: { color: GRAYD, fontSize: 12.5 } }, { text: "77 / 100", options: { color: NAVY, bold: true, fontSize: 16 } }],
    { x: MX, y: 6.15, w: 5.7, h: 0.4, fontFace: SERIF, valign: "middle", margin: 0 });

  // Segunda opinion del modelo + validar (derecha)
  const rx = 7.3;
  vl(s, rx - 0.45, 1.92, 4.6, LINE);
  s.addText("SEGUNDA OPINIÓN DEL MODELO", { x: rx, y: 1.9, w: 5.4, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: TERRA, charSpacing: 2, margin: 0 });
  s.addText("Valor estimado a partir de los atributos de la unidad (ubicación, superficie, estado, servicios):", { x: rx, y: 2.25, w: 5.4, h: 0.6, fontFace: SANS, fontSize: 12, italic: true, color: GRAYD, lineSpacingMultiple: 1.1, valign: "top", margin: 0 });
  const preds = [["Ridge", "≈ USD 86.700", "+8%"], ["Random Forest", "≈ USD 87.700", "+10%"]];
  let py = 3.0;
  preds.forEach(([m, v, p]) => {
    hl(s, rx, py - 0.06, 5.4, LINE);
    s.addText(m, { x: rx, y: py, w: 2.3, h: 0.5, fontFace: SANS, fontSize: 13.5, color: NAVY, valign: "middle", margin: 0 });
    s.addText(v, { x: rx + 2.0, y: py, w: 2.3, h: 0.5, fontFace: SERIF, fontSize: 18, bold: true, color: NAVY, align: "right", valign: "middle", margin: 0 });
    s.addText(p, { x: rx + 4.3, y: py, w: 1.1, h: 0.5, fontFace: SANS, fontSize: 13, bold: true, color: TERRA, align: "right", valign: "middle", margin: 0 });
    py += 0.62;
  });
  s.addText([
    { text: "Ambos estiman la propiedad por encima de su precio publicado", options: { bold: true, color: NAVY } },
    { text: " — una segunda señal, independiente del comparable, de que está subvaluada.", options: { color: INK } },
  ], { x: rx, y: 4.32, w: 5.4, h: 0.95, fontFace: SANS, fontSize: 13, lineSpacingMultiple: 1.12, valign: "top", margin: 0 });
  hl(s, rx, 5.45, 5.4, LINE);
  s.addText("ANTES DE INVERTIR — VALIDAR", { x: rx, y: 5.58, w: 5, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: NAVY, charSpacing: 1.5, margin: 0 });
  s.addText("Precio de cierre y estado real · presupuesto de obra y plazo de reventa · gastos, impuestos y comisiones.", { x: rx, y: 5.9, w: 5.4, h: 0.7, fontFace: SANS, fontSize: 12.5, color: INK, lineSpacingMultiple: 1.15, valign: "top", margin: 0 });
})();

// ======================================================================
// SLIDE 10 - Modelo predictivo
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  head(s, "Modelo predictivo (opcional)", 10, "Una segunda opinión sobre cada precio");
  const c = fit(1.324, 4.9, 3.9);
  s.addImage({ path: path.join(A, "05_modelo_mae.png"), x: MX, y: 2.2, w: c.w, h: c.h });
  const tx = MX + c.w + 0.7;
  const rows = [
    [{ text: "Modelo", options: { bold: true, color: WHITE, fill: { color: NAVY }, fontSize: 13 } },
     { text: "MAE", options: { bold: true, color: WHITE, fill: { color: NAVY }, align: "center", fontSize: 13 } },
     { text: "MAPE", options: { bold: true, color: WHITE, fill: { color: NAVY }, align: "center", fontSize: 13 } },
     { text: "R²", options: { bold: true, color: WHITE, fill: { color: NAVY }, align: "center", fontSize: 13 } }],
    ["Ridge", "USD 49.138", "25,0%", "0,59"].map((t, i) => ({ text: t, options: { color: INK, fontSize: 13, align: i ? "center" : "left", fill: { color: PAPER } } })),
    ["Random Forest", "USD 41.337", "21,1%", "0,69"].map((t, i) => ({ text: t, options: { color: NAVY, bold: true, fontSize: 13, align: i ? "center" : "left", fill: { color: "EAE0CF" } } })),
  ];
  const tw = 12.75 - tx;
  s.addTable(rows, { x: tx, y: 2.3, w: tw, colW: [tw * 0.34, tw * 0.26, tw * 0.2, tw * 0.2], rowH: [0.45, 0.5, 0.5], border: { type: "solid", pt: 1, color: LINE }, valign: "middle", margin: 4 });
  s.addText([
    { text: "Random Forest reduce el error 15,9% frente a Ridge", options: { bold: true, color: NAVY } },
    { text: " y se mantiene estable en validación agrupada (R² = 0,74).", options: { color: INK } },
  ], { x: tx, y: 4.3, w: tw, h: 0.9, fontFace: SANS, fontSize: 14.5, lineSpacingMultiple: 1.14, margin: 0, valign: "top" });
  hl(s, tx, 5.55, tw, LINE);
  s.addText("Se usa como detector de desalineamiento de precio, no como tasación ni precio esperado de reventa.", { x: tx, y: 5.7, w: tw, h: 0.9, fontFace: SERIF, fontSize: 14, italic: true, color: GRAYD, lineSpacingMultiple: 1.12, valign: "top", margin: 0 });
})();

// ======================================================================
// SLIDE 10 - Conclusiones y recomendaciones (dark)
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  head(s, "Conclusiones y recomendaciones", 11, "Concentrar el esfuerzo donde hay evidencia", { dark: true });
  const recs = [
    ["Empezar por Palermo, Recoleta, Belgrano y Colegiales", "Lideran el índice integrado por profundidad de comparables, deal flow y accesibilidad."],
    ["Exigir descuento defendible y estado mejorable", "Combinar subvaluación frente a comparables con potencial real de puesta en valor."],
    ["Validar los comparables uno a uno", "Verificar equivalencia en micro-ubicación, calidad y estado antes de decidir."],
    ["Adaptar las mejoras al barrio", "La prima por amenities varía territorialmente; no toda obra se recupera."],
    ["Cerrar con due diligence", "Precio negociado, obra, gastos, impuestos y plazo de salida antes de invertir."],
  ];
  let y = 2.0;
  recs.forEach(([t, d], i) => {
    s.addText(`0${i + 1}`, { x: MX, y: y, w: 0.8, h: 0.7, fontFace: SERIF, fontSize: 24, bold: true, color: TERRA, margin: 0 });
    s.addText([{ text: t + "   ", options: { bold: true, color: WHITE, fontSize: 16 } }, { text: d, options: { color: ICE, fontSize: 13.5 } }], { x: 1.55, y: y + 0.04, w: 6.5, h: 0.85, fontFace: SANS, lineSpacingMultiple: 1.1, margin: 0, valign: "top" });
    if (i < recs.length - 1) hl(s, MX, y + 0.92, 7.3, LINED);
    y += 1.0;
  });
  // impacto: lista sin cajas
  vl(s, 8.95, 2.0, 4.45, TERRA);
  s.addText("IMPACTO ESPERADO", { x: 9.2, y: 2.0, w: 3.8, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: TERRA, charSpacing: 2, margin: 0 });
  const imp = [["3.104 elegibles", "de ~7.245 avisos, con descuento y ≥5 comparables"], ["44 barrios", "comparados con criterios consistentes"], ["Trazabilidad", "cada oportunidad documentada y auditable"]];
  let iy = 2.6;
  imp.forEach(([t, d], i) => {
    if (i > 0) hl(s, 9.2, iy - 0.18, 3.6, LINED);
    s.addText(t, { x: 9.2, y: iy, w: 3.6, h: 0.4, fontFace: SERIF, fontSize: 18, bold: true, color: WHITE, margin: 0 });
    s.addText(d, { x: 9.2, y: iy + 0.42, w: 3.6, h: 0.55, fontFace: SANS, fontSize: 12.5, color: ICE, lineSpacingMultiple: 1.08, valign: "top", margin: 0 });
    iy += 1.18;
  });
})();

// ======================================================================
// SLIDE 11 - Proximos pasos + cierre (dark)
// ======================================================================
(() => {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  head(s, "Próximos pasos y líneas futuras", 12, "De prototipo a producto monitoreado", { dark: true });
  const next = [
    "Incorporar precios de cierre y negociación, no solo publicados",
    "Registrar presupuestos y costos reales de obra",
    "Automatizar el recálculo de scores y alertas de nuevas oportunidades",
    "Actualizar el dashboard vía dataset programado en Power BI Service",
    "Monitorear el error del modelo y reentrenar periódicamente",
  ];
  let y = 2.05;
  next.forEach((t, i) => {
    s.addText(`0${i + 1}`, { x: MX, y: y, w: 0.7, h: 0.4, fontFace: SERIF, fontSize: 17, bold: true, color: TERRA, margin: 0 });
    s.addText(t, { x: 1.4, y: y, w: 6.6, h: 0.45, fontFace: SANS, fontSize: 14.5, color: ICE, valign: "top", margin: 0 });
    if (i < next.length - 1) hl(s, MX, y + 0.5, 7.3, LINED);
    y += 0.62;
  });

  // ROI sin caja: regla vertical + label + formula
  vl(s, 8.95, 2.05, 1.85, LINED);
  s.addText("CUANDO EXISTAN LAS VARIABLES FINANCIERAS", { x: 9.2, y: 2.05, w: 3.7, h: 0.5, fontFace: SANS, fontSize: 9.5, bold: true, color: TERRA, charSpacing: 1.5, lineSpacingMultiple: 1.1, margin: 0 });
  s.addText("ROI = (venta − compra − obra − gastos) / capital invertido", { x: 9.2, y: 2.65, w: 3.7, h: 1.2, fontFace: SERIF, fontSize: 15, italic: true, color: WHITE, lineSpacingMultiple: 1.18, valign: "top", margin: 0 });

  hl(s, MX, 5.4, W - 2 * MX, LINED);
  s.addText("Mientras tanto, el producto maximiza la calidad de las oportunidades detectadas — no promete retornos.", { x: MX, y: 5.6, w: 7.8, h: 1.0, fontFace: SERIF, fontSize: 16, italic: true, color: WHITE, lineSpacingMultiple: 1.12, valign: "top", margin: 0 });
  s.addText([
    { text: "Dashboard interactivo en vivo →", options: { color: TERRA, bold: true, breakLine: true, fontSize: 13, hyperlink: { url: DASH } } },
    { text: "Power BI Service · click para abrir", options: { color: ICE, fontSize: 11, hyperlink: { url: DASH } } },
  ], { x: 8.9, y: 5.65, w: 3.9, h: 0.8, fontFace: SANS, align: "right", lineSpacingMultiple: 1.25, margin: 0 });
})();

const out = path.join(__dirname, "Presentacion_Ejecutiva_Flip_CABA.pptx");
pres.writeFile({ fileName: out }).then(() => console.log("OK ->", out));
