# Proyecto: Analisis de Departamentos en Venta en CABA (Argenprop)

Este repositorio contiene un pipeline completo para extraer, geolocalizar, enriquecer, limpiar, analizar y preparar datos de departamentos en venta en CABA publicados en Argenprop. El trabajo esta orientado a un perfil de inversor inmobiliario tipo *flipper*, interesado en detectar propiedades con potencial de valorizacion mediante refaccion y posterior reventa.

---

## Flujo del pipeline

```text
1. 01_scraper.py                         -> argenprop_1776007342.tsv
                                                     |
2. 02_mapeo_latitud_longitud.ipynb       -> Argenprop_Lat_Lon.tsv
                                                     |
3. 03_enrichment.ipynb                   -> Argenprop_Enriched.tsv
                                                     |
4. 04_Limpieza.ipynb                     -> Argenprop_limpio.csv
                                                     |
5. 05_EDA_Y_Clusters.ipynb               -> EDA + clusters de barrios
                                                     |
6. 06_Hipotesis_Y_KPIs.ipynb             -> hipotesis, KPIs e indice de oportunidad
                                                     |
7. 07_Correciones_Entrega2.ipynb         -> prefijos semanticos + diccionario
                                                     |
8. 08_Validacion_Estadistica_Formal.ipynb -> validacion estadistica de hipotesis
                                                     |
9. 09_Reduccion_de_Dimensionalidad.ipynb -> Argenprop_limpio_con_indices.csv
                                                     |
10. 10_Prediccion.ipynb                  -> modelos predictivos
```

---

## Archivos principales

### `01_scraper.py`
Script de scraping sobre Argenprop. Usa Playwright para navegar con browser real y `aiohttp` para descargar paginas de detalle en paralelo.

Extrae precio, expensas, direccion, piso, ambientes, dormitorios, banos, estado, antiguedad, descripcion, amenities y caracteristicas publicadas.

**Salida:** `argenprop_1776007342.tsv`

### `02_mapeo_latitud_longitud.ipynb`
Geocodifica las direcciones del dataset crudo usando Nominatim/OpenStreetMap. Valida que las coordenadas caigan dentro de CABA.

**Salida:** `Argenprop_Lat_Lon.tsv`

### `03_enrichment.ipynb`
Enriquece el dataset con variables geoespaciales y urbanas:

- `Barrio` y `Comuna`.
- Distancia a subte, hospitales, colegios, comisarias, gimnasios, supermercados y avenidas.
- Conteos de colegios, supermercados y paradas de colectivo en radios definidos.

**Salida:** `Argenprop_Enriched.tsv`

### `04_Limpieza.ipynb`
Limpia e imputa el dataset:

- Conversion de precios, expensas, superficies y piso.
- Correccion de inconsistencias de superficie.
- Deteccion y tratamiento de outliers.
- Imputacion numerica con KNN.
- Imputacion jerarquica de antiguedad.
- Imputacion categorica con `"No disponible"`.

**Salida:** `Argenprop_limpio.csv`

### `05_EDA_Y_Clusters.ipynb`
Realiza el analisis exploratorio y segmenta barrios con KMeans. El analisis incluye distribuciones, correlaciones, boxplots por variables categoricas, analisis espacial y nombres interpretables para clusters.

Clusters definidos:

- Cluster 0: Barrios tradicionales accesibles.
- Cluster 1: Premium consolidado.
- Cluster 2: Residencial medio-alto.
- Cluster 3: Residencial accesible.
- Cluster 4: Alto valor por m2.
- Cluster 5: Compactos economicos.

### `06_Hipotesis_Y_KPIs.ipynb`
Define hipotesis y KPIs para decision inmobiliaria. Incluye precio por m2, profundidad de mercado, stock mejorable, dotacion de amenities, accesibilidad urbana, descuento frente a comparables e indice de oportunidad de flip.

> Los KPIs usan precios publicados, no precios de cierre. Sirven para priorizar oportunidades, no para estimar ROI real.

### `07_Correciones_Entrega2.ipynb`
Corrige y estandariza el dataset final:

- Agrega el cluster sintetico usado para segmentar las propiedades.
- Renombra variables con prefijos semanticos:
  - `original_`: variables observadas o extraidas del aviso publicado.
  - `imputada_`: variables completadas durante limpieza.
  - `enriquecida_`: variables agregadas por geocodificacion o cruces geoespaciales.
  - `sintetica_`: identificadores, clusters e indices calculados.
- Genera `diccionario_variables_limpio.csv`.

### `08_Validacion_Estadistica_Formal.ipynb`
Formaliza pruebas estadisticas sobre hipotesis del analisis descriptivo. Evalua relaciones entre precio, precio por m2, amenities, accesibilidad, subvaluacion y variables de contexto.

### `09_Reduccion_de_Dimensionalidad.ipynb`
Genera indices sinteticos mediante PCA/MCA:

- `sintetica_indice_entorno_integral_pca`
- `sintetica_indice_servicios_barriales_pca`
- `sintetica_indice_conectividad_pca`
- `sintetica_indice_amplitud_pca`
- `sintetica_indice_lujo_confort_mca`
- `sintetica_cantidad_amenities`
- `sintetica_score_antiguedad_nueva`
- `sintetica_precio_m2`

**Salida:** `Argenprop_limpio_con_indices.csv`

### `10_Prediccion.ipynb`
Entrena y compara modelos predictivos sobre el dataset final con indices. El objetivo es complementar el analisis descriptivo con una mirada predictiva sobre precio.

---

## Datasets generados

| Archivo | Etapa | Descripcion |
|---|---|---|
| `argenprop_1776007342.tsv` | Scraping | Dataset crudo extraido desde Argenprop. |
| `Argenprop_Lat_Lon.tsv` | Geocoding | Dataset con latitud y longitud. |
| `Argenprop_Enriched.tsv` | Enrichment | Dataset con barrio, comuna y variables urbanas. |
| `Argenprop_limpio.csv` | Limpieza + correcciones | Dataset limpio, imputado y con prefijos semanticos. |
| `diccionario_variables_limpio.csv` | Diccionario | Mapeo entre nombre original, tipo de variable y nombre final. |
| `Argenprop_limpio_con_indices.csv` | Indices | Dataset final con indices PCA/MCA y variables sinteticas. |

---

## Transformaciones y analisis realizados

El proyecto incorpora transformaciones sucesivas para pasar de avisos publicados a un dataset analitico final:

- Extraccion y normalizacion inicial de atributos publicados: precio, expensas, superficie, ambientes, dormitorios, banos, antiguedad, estado, amenities y caracteristicas del aviso.
- Geocodificacion de direcciones y validacion espacial para conservar coordenadas ubicadas dentro de CABA.
- Enriquecimiento urbano con variables de barrio, comuna, distancias a puntos de interes y conteos de servicios cercanos.
- Limpieza de tipos, conversion de unidades, tratamiento de inconsistencias de superficie, deteccion de outliers e imputaciones numericas y categoricas.
- Segmentacion de barrios mediante clustering para resumir patrones territoriales de precio, accesibilidad y caracteristicas del stock.
- Construccion de KPIs orientados a decision inmobiliaria, incluyendo precio por m2, descuento frente a comparables, accesibilidad urbana, dotacion de amenities e indice de oportunidad de flip.
- Validacion estadistica formal de hipotesis descriptivas mediante pruebas sobre relaciones entre precio, amenities, accesibilidad, subvaluacion y contexto urbano.
- Reduccion de dimensionalidad con PCA/MCA para sintetizar informacion de entorno, servicios, conectividad, amplitud y lujo/confort.
- Modelado predictivo como complemento del analisis descriptivo, usando el dataset final con indices sinteticos.

---

## Decisiones metodologicas adoptadas

- Se trabajo con precios publicados de Argenprop.
- Se valido la geocodificacion para restringir el analisis a propiedades ubicadas dentro de CABA.
- Se aplicaron imputaciones diferenciadas segun tipo de variable: KNN para variables numericas, reglas jerarquicas para antiguedad y categoria `"No disponible"` para faltantes categoricos.
- Se usaron prefijos semanticos (`original_`, `imputada_`, `enriquecida_`, `sintetica_`) para mejorar trazabilidad entre dato observado, dato imputado, enriquecimiento externo y variable calculada.
- Se documentaron por separado las etapas de analisis descriptivo, validacion estadistica, reduccion de dimensionalidad y prediccion.

---

## Dependencias principales

```bash
pip install playwright aiohttp beautifulsoup4 pandas numpy scipy scikit-learn matplotlib seaborn geopandas shapely requests prince
playwright install chromium
```
---

## Limitaciones

- Los precios son de publicacion, no de cierre.
- No se incorporan costos de obra, impuestos, comisiones ni dias en mercado.
- Los scores e indices son herramientas de priorizacion, no una estimacion directa de rentabilidad.
- La calidad de geocodificacion depende de la precision de las direcciones publicadas.

---

## Proximos pasos previstos para la entrega final

- Consolidar los hallazgos principales en una narrativa ejecutiva orientada al perfil inversor definido.
- Documentar metricas y resultados del modelo predictivo, incluyendo comparacion de modelos y criterios de seleccion.

Última actualización del README: 2026-06-11
