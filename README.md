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
                                                     |
11. 11_PowerBI.ipynb                     -> snowflake/*.csv para Power BI
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

### `11_PowerBI.ipynb`
Prepara los datos para Power BI en formato Snowflake Schema.

**Salida:** carpeta `snowflake/`

Tablas generadas:

- `fact_propiedades.csv`
- `dim_barrio.csv`
- `dim_comuna.csv`
- `dim_cluster.csv`
- `dim_estado.csv`
- `dim_disposicion.csv`
- `dim_tipo_unidad.csv`
- `dim_subte_cercano.csv`
- `dim_linea_subte.csv`
- `dim_hospital_cercano.csv`
- `dim_avenida_cercana.csv`

Relaciones principales:

- `fact_propiedades.barrio_key` -> `dim_barrio.barrio_key`
- `dim_barrio.comuna_key` -> `dim_comuna.comuna_key`
- `fact_propiedades.cluster_key` -> `dim_cluster.cluster_key`
- Resto de dimensiones por sus respectivas columnas `*_key`.

`dim_barrio` y `dim_comuna` quedan conectadas por la jerarquia geografica Barrio -> Comuna. `dim_cluster` sigue como dimension independiente conectada directamente con `fact_propiedades` e incluye el numero de cluster, nombre descriptivo, etiqueta para Power BI y descripcion de negocio.

Las variables numericas discretas como ambientes, dormitorios, banos, piso, conteos y cantidad de amenities quedan directamente en la fact table. Las calles, alturas y links tambien quedan en `fact_propiedades.csv`.

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
| `snowflake/*.csv` | Power BI | Fact table y dimensiones listas para importar. |

---

## Preparacion para Power BI

1. Abrir Power BI Desktop.
2. Importar todos los CSV de la carpeta `snowflake/`.
3. Usar `fact_propiedades.csv` como tabla central.
4. Relacionar `fact_propiedades` con cada dimension mediante `*_key`.
5. Respetar la jerarquia geografica: `fact_propiedades -> dim_barrio -> dim_comuna`.
6. Usar `dim_cluster.cluster_etiqueta_powerbi` para slicers, leyendas y visualizaciones interpretables.

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

Última actualización del README: 2026-06-03
