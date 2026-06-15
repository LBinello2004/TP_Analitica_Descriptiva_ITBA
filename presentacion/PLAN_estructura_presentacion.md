# Plan — Reestructuración de la presentación ejecutiva (12 slides)

## Contexto

La presentación ejecutiva (`presentacion/Presentacion_Ejecutiva_Flip_CABA.pptx`, generada por `presentacion/build_deck.js`) está bien de diseño (sistema editorial navy+terracota, sin cajas, running head), pero el usuario definió una **nueva estructura de contenido** de 12 slides y una regla firme: **todo gráfico del deck debe existir en un notebook de análisis** (EDA). Si un gráfico necesario no está en un notebook, se agrega al notebook correspondiente y se re-ejecuta, y el deck usa una versión propia (navy+terracota) calculada con la **misma definición** para que los números coincidan exactamente.

Decisiones del usuario en esta ronda:
- **Sacar** el insight de "descuento por barrio" (no lo considera clave).
- **Mantener** precio por barrio como insight.
- Slides 7 y 8 = **Paradoja de accesibilidad** + **Prima de las mejoras**.
- **Partir** la slide de "Dataset + Fuentes" en **2** slides.
- Slide 4/5 "Análisis realizados" debe entenderlo **cualquiera** (no técnico).
- Slide del modelo: rendimiento de **ambos** modelos + **variables más importantes**.
- El ejemplo (Belgrano + predicción de modelos) ya está bien y se conserva.

## Estructura final (12 slides)

| # | Slide | Contenido | Gráfico / fuente |
|---|-------|-----------|------------------|
| 1 | Portada | Título, equipo, ITBA | Mapa decorativo (sin escala) |
| 2 | Problema de negocio (Flipper) | El flipper como interlocutor; mercado heterogéneo; hoy se decide a ojo | Stats (sin gráfico de datos) |
| 3 | Dataset y fuentes | De dónde salen los datos (Argenprop, GCBA, OSM), qué representa cada fila, tamaño | Diagrama de fuentes |
| 4 | Construcción del dataset | Transformaciones: geocodificación → enriquecimiento → limpieza/imputación → índices; embudo 12.518→7.245 | Embudo de etapas (diagrama) |
| 5 | Análisis realizados | Overview **no técnico** de lo hecho: exploración, segmentación, tests de hipótesis, índice de oportunidad, modelo | Mapa de pasos (diagrama) |
| 6 | Insight: el barrio define el precio | Precio/m² por barrio (2,7x); ε²=0,30 | **05 c33** (existe) ✓ |
| 7 | Insight: paradoja de accesibilidad | Zonas más accesibles ~12% más baratas/m² → ineficiencia; efecto chico (ε²=0,02) enmarcado como tendencia | **Agregar a 06** (tabla c31ed20d1) |
| 8 | Insight: la prima de las mejoras | Mejor dotación se publica +USD 280/m² (hasta +845); valida el flip; rho=0,19 | **Agregar a 06** (tabla cf74646ae) |
| 9 | Ejemplo: propiedad priorizada + modelo | Belgrano, V. de Obligado 2600; comparable −34,3%; Ridge/RF +8–10% | (se conserva, ya está bien) |
| 10 | Modelo | Rendimiento Ridge vs RF (MAE/MAPE/R²) + **feature importance** | Tabla (existe) + **feature importance 10 c27/28** ✓ |
| 11 | Conclusión | Recomendaciones + impacto cuantificado | (sin gráfico) |
| 12 | Futuro | Cómo seguir, evolución, ampliaciones | (sin gráfico) |

Nota: la nueva estructura **no tiene** una slide dedicada de "producto/embudo" (la del deck actual). El embudo barrio→propiedad→validación se absorbe en la slide 5 (análisis realizados) y queda demostrado en el ejemplo (slide 9).

## Estrategia de gráficos (todos respaldados por notebook)

**Existen y se reutilizan (restilizados navy+terracota, misma definición):**
- Precio/m² por barrio → `notebooks/05_EDA_Y_Clusters.ipynb` celda 33 (y datos en 06). Ya coincide exacto con el deck.
- Feature importance (permutation) → `notebooks/10_Prediccion.ipynb` celda 27/28.

**Agregar a `notebooks/06_Hipotesis_Y_KPIs.ipynb` (2 celdas de gráfico, estilo azul EDA) + re-ejecutar:**
1. **Paradoja de accesibilidad**: barras de `precio_m2` mediana por cuartil de accesibilidad (Baja 2222 → Alta 1963) — datos ya en celda `31ed20d1` (`precio_accesibilidad`).
2. **Prima de mejoras**: barras de precio/m² por nivel de dotación de amenities (Baja/Media/Alta) y/o brecha por barrio — datos ya en celda `f74646ae` (`brecha_amenities_barrio`).

**Descartar del deck (no se usan en la nueva estructura):** mapa analítico scatter, gráfico descuento/mejorable, amenities-por-rango, barras MAE.

**Mantener:** mapa decorativo de portada (es diseño, no afirma análisis).

## Archivos a modificar

- `notebooks/06_Hipotesis_Y_KPIs.ipynb` — insertar 2 celdas de gráfico (accesibilidad-paradoja tras `31ed20d1`; prima-mejoras tras `f74646ae`), estilo azul (#2F4B7C/#4C78A8/#72B7D2); re-ejecutar inplace con `jupyter nbconvert --execute --inplace`.
- `presentacion/generar_graficos.py` — regenerar set de assets: mantener precio/barrio + mapa decorativo; **agregar** accesibilidad-paradoja, prima-mejoras y feature-importance (esta última reproduciendo el modelo del notebook 10, como en el patrón ya usado para el ejemplo); **quitar** map analítico, descuento/mejorable, amenities-rango, MAE.
- `presentacion/build_deck.js` — reescribir la secuencia de slides a la nueva estructura de 12; nuevas slides 2/3/4/5; insights 6/7/8; slide 10 con tabla de rendimiento + feature importance; renumerar running head a `/12`.

## Verificación (end-to-end)

1. Re-ejecutar 06 sin errores; confirmar que las 2 celdas nuevas renderizan output (imagen) — `jupyter nbconvert --to notebook --execute --inplace`.
2. Regenerar assets: `python presentacion/generar_graficos.py` (verificar 0 errores y que los números de accesibilidad/prima coinciden con los del notebook 06).
3. Reconstruir deck: `node presentacion/build_deck.js`.
4. Render para QA visual: export por PowerPoint COM (PowerShell) a PNG; inspeccionar las 12 slides (overlaps, overflow, contraste, márgenes); fix-and-verify al menos una vuelta.
5. Limpiar temporales (carpetas render*, no dejar `_tmp*.ipynb`).

## Notas de consistencia / honestidad

- La paradoja de accesibilidad tiene **efecto chico** (ε²=0,02); enmarcarla como "tendencia / señal de ineficiencia", no como ley.
- Los números del deck deben salir de la **misma definición** que el notebook (06 carga `Argenprop_limpio.csv` y desprefija; precio_m2 = Precio/Sup_Total). Verificado que sintetica_precio_m2 == Precio/Sup_Total (diff 0).
- Mantener los disclaimers del proyecto (no es ROI, precios publicados, modelo = segunda opinión).
