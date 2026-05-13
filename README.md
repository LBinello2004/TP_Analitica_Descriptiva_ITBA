# Proyecto: Análisis de Departamentos en Venta en CABA (Argenprop)

Este repositorio contiene el pipeline completo para extraer, geolocalizar, enriquecer, limpiar y analizar datos de departamentos en venta en la Ciudad Autónoma de Buenos Aires publicados en Argenprop. El análisis se orienta al perfil de un inversor inmobiliario tipo *flipper*, cuyo objetivo es identificar propiedades potencialmente subvaluadas con margen de valorización mediante refacción y posterior reventa.

---

## Flujo del pipeline

```
1. scraper.py                       →  argenprop_1776007342.tsv         (dataset crudo)
                                                  ↓
2. mapeo_latitud_longitud.ipynb     →  Argenprop_Lat_Lon.tsv            (con coordenadas)
                                                  ↓
3. enrichment.ipynb                 →  Argenprop_Enriched.tsv           (enriquecido geoespacial)
                                                  ↓
4. Limpieza.ipynb                   →  Argenprop_limpio.csv             (limpio e imputado)
                                                  ↓
5. EDA.ipynb                        →  Análisis exploratorio
                                                  ↓
6. Hipotesis_Y_KPIs.ipynb           →  Hipótesis, KPIs e índice de oportunidad
```

---

## Archivos

### `1. scraper.py`
Script principal de scraping. Usa **Playwright** para navegar Argenprop con un browser real (visible) y **aiohttp** para descargar las páginas de detalle en paralelo.

Características clave:
- Scrapea las páginas de listado de departamentos en venta en CABA (`argenprop.com/departamentos/venta/capital-federal`).
- Manejo automático de **CAPTCHA**: cuando detecta uno, pausa y espera que el usuario lo resuelva manualmente en el browser.
- **Checkpoint automático**: si se interrumpe, retoma desde la última página guardada.
- Guarda incrementalmente cada 50 propiedades en la carpeta `output/`.
- Extrae: precio, expensas, dirección (calle, altura, piso), descripción, características del departamento (ambientes, dormitorios, baños, estado, antigüedad, amenities, etc.).

**Salida:** `argenprop_1776007342.tsv`

---

### `2. mapeo_latitud_longitud.ipynb`
Notebook que **geocodifica** las direcciones del dataset crudo, convirtiendo la calle y altura de cada propiedad en coordenadas geográficas (latitud y longitud).

- Usa la API gratuita de **Nominatim (OpenStreetMap)**.
- Valida que las coordenadas obtenidas caigan dentro de los límites geográficos de CABA.
- Procesa las propiedades de forma asíncrona con un delay para respetar los límites de la API.

**Salida:** `Argenprop_Lat_Lon.tsv`

---

### `3. enrichment.ipynb`
Notebook que **enriquece geoespacialmente** el dataset geocodificado, cruzando cada propiedad con datos públicos de la ciudad.

Agrega columnas como:
- `Barrio` y `Comuna`: mediante un join espacial con el polígono de barrios de CABA.
- `Dist_Subte_m`, `Subte_cercano`, `Linea_subte`: distancia y línea de la boca de subte más cercana.
- `Dist_Hospital_m`, `Hospital_cercano`: distancia al hospital público más cercano.
- `Dist_Colegio_m`, `Colegios_500m`: distancia al colegio más cercano y conteo en radio de 500 m.
- `Dist_Comisaria_m`, `Dist_Gimnasio_m`, `Dist_Supermercado_m`, `Supermercados_500m`.
- `Dist_Avenida_m`, `Avenida_cercana`.
- `Paradas_colectivo_300m`: cantidad de paradas de colectivo en un radio de 300 m.

Usa **GeoPandas** y proyección EPSG:22185 para calcular distancias con precisión métrica.

**Salida:** `Argenprop_Enriched.tsv`

---

### `4. Limpieza.ipynb`
Notebook de **limpieza y preparación final** del dataset. Sus pasos principales:

- **Conversión de tipos**: parseo de strings monetarios (`Precio`, `Expensas`), superficies (`Sup_Cubierta_m2`, `Sup_Total_m2`) y `Piso` (incluyendo PB).
- **Consistencia**: corrección de casos donde `Sup_Cubierta_m2 > Sup_Total_m2` y eliminación de valores negativos/imposibles.
- **Detección de outliers** mediante transformación logarítmica y *z-score* (umbral |z| > 3) sobre precio, expensas, antigüedad y superficies.
- **Tests de normalidad** (Shapiro-Wilk y D'Agostino) con QQ-plots para validar la transformación.
- **Eliminación de columnas** con alto porcentaje de faltantes (`Toilettes`, `Tipo_Balcon`, `Estado_Edificio`, etc.) y sin variabilidad.
- **Imputación de variables numéricas** (`Precio`, `Expensas`, superficies, ambientes, dormitorios) con **KNNImputer**.
- **Imputación jerárquica por mediana** de `Antiguedad` usando combinaciones de `Barrio`, `Comuna`, `Estado`, `Tipo_Unidad` y `Ambientes`, evaluadas previamente con tests de Spearman y Kruskal-Wallis.
- **Imputación categórica** (`Estado`, `Tipo_Unidad`, `Disposicion`, `Piso`) con la categoría `"No disponible"`.

**Salida:** `Argenprop_limpio.csv`

---

### `5. EDA.ipynb`
Notebook de **análisis exploratorio de datos** sobre el dataset limpio. Incluye:

- Distribución del precio en USD y su transformación logarítmica (asimetría positiva ~2.72).
- Relaciones entre `Precio` y variables numéricas (superficies, expensas, distancias a puntos de interés) mediante scatterplots y matrices de correlación.
- Análisis de `Precio` vs variables categóricas (`Estado`, `Tipo_Unidad`, `Disposicion`, `Barrio`) con boxplots.
- Análisis de variables binarias (amenities) por tercil de precio.
- Visualización espacial de precios en CABA sobre el mapa de barrios.
- Análisis combinado de `Precio_m2` por barrio, accesibilidad y otras variables.

---

### `6. Hipotesis_Y_KPIs.ipynb`
Notebook que define las **hipótesis de inversión y los KPIs** orientados al perfil flipper. Estructurado en niveles:

**Nivel descriptivo:**
1. Precio promedio y mediano por m² por barrio (precio de entrada por zona).
2. Profundidad de mercado por barrio (participación de oferta como proxy de liquidez).
3. Stock refaccionable y mejorable (% `A Refaccionar` y % `A Refaccionar + Regular + Bueno`).
4. Frecuencia de amenities por rango de precio.
5. **Índice de accesibilidad urbana** = 0.25·subte + 0.20·colectivos + 0.20·avenida + 0.15·hospital + 0.10·colegio + 0.10·supermercado.

**Nivel diagnóstico:**
6. Descuento frente a comparables (mismo barrio + tipo de unidad + ambientes), con métricas de intensidad de subvaluación.
7. Prima de precio asociada a mayor dotación de amenities por barrio.
8. Precio por m² según cuartil de accesibilidad.
9. Precio por m² según distancia al subte.
10. **Índice de oportunidad de flip** = 0.40·descuento + 0.20·accesibilidad + 0.15·potencial de zona + 0.15·estado mejorable + 0.10·profundidad de mercado.

> Los KPIs se calculan sobre precios de publicación (no de cierre) y no contemplan costos de obra, días en mercado ni margen de negociación. Funcionan como scoring de priorización, no como ROI real.

---

## Datasets generados

| Archivo | Etapa | Filas aprox. | Descripción |
|---|---|---|---|
| `argenprop_1776007342.tsv` | Scraping | ~8.000 | Dataset crudo: precio, expensas, dirección, descripción, características y amenities. Sin geo. |
| `Argenprop_Lat_Lon.tsv` | Geocoding | ~8.000 | Agrega `Latitud`, `Longitud` y `Procesada`. Se descartan direcciones no geocodificables o fuera de CABA. |
| `Argenprop_Enriched.tsv` | Enrichment | ~8.000 | Incorpora barrio, comuna y proximidad a transporte, salud, educación, seguridad y comercio. 67 columnas. |
| `Argenprop_limpio.csv` | Limpieza | ~7.250 | Dataset final imputado, sin outliers extremos y con tipos consistentes. Listo para EDA y KPIs. |

---

## Dependencias

```
pip install playwright aiohttp beautifulsoup4 pandas numpy scipy scikit-learn matplotlib seaborn geopandas shapely requests
playwright install chromium
```
