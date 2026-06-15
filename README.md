# Priorizacion de oportunidades de flip inmobiliario en CABA

Proyecto final de Analitica Descriptiva orientado a un inversor inmobiliario tipo *flipper*: comprar una propiedad, mejorarla y revenderla. El desarrollo transforma publicaciones de Argenprop en un embudo de decision que ayuda a elegir **donde buscar**, **que propiedades investigar primero** y **que informacion falta validar antes de invertir**.

> El proyecto no calcula ni garantiza ROI real. Trabaja con precios publicados, no con precios de cierre, y no dispone de costos de obra, negociacion, impuestos, comisiones ni tiempos de reventa.

## Equipo

- Felipe Tamaki - Legajo 66477
- Matias Goldschmidt - Legajo 66061
- Lucas Binelo - Legajo 66011

## Resumen ejecutivo

El mercado de departamentos en CABA presenta miles de publicaciones heterogeneas, diferencias territoriales marcadas y atributos dificiles de comparar. Para reducir ese universo, el proyecto construye una herramienta de priorizacion en tres niveles:

1. **Barrio:** identifica zonas con precio de entrada, profundidad de mercado, stock mejorable, accesibilidad y descuentos relativos favorables.
2. **Propiedad:** compara cada aviso con inmuebles del mismo barrio, tipo y cantidad de ambientes, y lo ordena mediante un indice de oportunidad.
3. **Validacion:** explicita las verificaciones financieras, tecnicas y legales necesarias antes de comprometer capital.

El resultado no reemplaza una tasacion ni una due diligence. Su valor consiste en mejorar la seleccion inicial y concentrar el esfuerzo del inversor en oportunidades respaldadas por mas evidencia.

## Problema y objetivo de negocio

La pregunta central es:

> ¿Como puede un inversor flipper concentrar su busqueda en barrios y propiedades con mejores señales de descuento, puesta en valor y salida comercial?

El analisis busca:

- separar zonas premium de zonas con menor precio de entrada;
- detectar barrios con suficiente oferta para construir comparables;
- encontrar stock potencialmente mejorable;
- medir descuentos frente a propiedades similares;
- incorporar accesibilidad, servicios y segmentacion territorial;
- usar un modelo de precio como segunda opinion;
- generar rankings explicables para decidir que casos investigar.

## Datos y fuentes

La fuente principal son publicaciones de departamentos en venta en CABA obtenidas de [Argenprop](https://www.argenprop.com/). El dataset fue enriquecido con:

- [Datos Abiertos del GCBA](https://data.buenosaires.gob.ar/): barrios, comunas, estaciones de subte, hospitales y otros puntos urbanos.
- [OpenStreetMap](https://www.openstreetmap.org/) mediante Overpass API: colegios, comisarias, gimnasios, supermercados, avenidas y paradas de colectivo.
- Nominatim/OpenStreetMap para geocodificacion de direcciones.

| Etapa | Filas | Columnas | Descripcion |
|---|---:|---:|---|
| Crudo | 12.518 | 48 | Publicaciones extraidas de Argenprop |
| Geocodificado | 12.518 | 51 | Coordenadas y control de ubicacion en CABA |
| Enriquecido | 7.991 | 67 | Variables territoriales y servicios urbanos |
| Limpio | 7.245 | 55 | Tipos corregidos, outliers tratados e imputaciones |
| Final con indices | 7.245 | 63 | Clusters e indices PCA/MCA |

El diccionario de variables se encuentra en [`data/processed/diccionario_variables_limpio.csv`](data/processed/diccionario_variables_limpio.csv).

El desarrollo conceptual previo, las definiciones de KPIs y las conclusiones de las pre-entregas se conservan en [`docs/Informe Ejecutivo.pdf`](docs/Informe%20Ejecutivo.pdf) como documentacion complementaria.

## Metodologia

### Preprocesamiento

- conversion de precios, expensas, superficies y piso;
- validacion y correccion de inconsistencias de superficie;
- tratamiento de outliers;
- imputacion KNN para variables numericas;
- imputacion jerarquica de antiguedad;
- categoria `No disponible` para faltantes categoricos;
- prefijos de trazabilidad:
  - `original_`: extraido del aviso;
  - `imputada_`: completado o transformado;
  - `enriquecida_`: incorporado desde fuentes geoespaciales;
  - `sintetica_`: cluster, score o indice calculado.

### Comparable e indice de oportunidad

Cada propiedad se compara con la mediana de precio por m2 de avisos con el mismo:

- barrio;
- tipo de unidad;
- numero de ambientes.

El indice de oportunidad reproduce la definicion del analisis original:

```text
40% descuento frente a comparables
20% accesibilidad urbana
15% potencial de zona
15% estado mejorable
10% profundidad de mercado
```

Para integrar el ranking se consideran elegibles los avisos con descuento positivo y al menos cinco comparables. El score ordena revisiones; no representa rentabilidad.

## Principales resultados

### Mercado y territorio

- El precio por m2 difiere significativamente entre barrios, con un tamaño de efecto relevante (`epsilon² = 0,305`).
- Puerto Madero presenta el mayor precio promedio, aproximadamente USD 4.514/m2.
- Palermo concentra 8,60% de la oferta, seguido por Balvanera con 7,90% y Recoleta con 6,75%.
- La accesibilidad difiere fuertemente entre barrios (`epsilon² = 0,574`), pero mayor accesibilidad no implica automaticamente mayor precio.
- Palermo, Recoleta, Belgrano y Colegiales encabezan el ranking territorial integrado generado por el notebook ejecutivo. Este resultado combina el indice existente con requisitos minimos de evidencia y no equivale a una recomendacion automatica de compra.

### Stock mejorable y descuentos

- La Boca registra 27,8% de stock clasificado como mejorable, seguida por Villa Pueyrredon con 20,7% y San Cristobal con 20,0%.
- El stock mejorable depende del barrio (`Cramer's V = 0,129`).
- Villa Lugano presenta 37,0% de avisos con descuento de al menos 15% frente a comparables; Mataderos 35,4% y La Boca 31,6%.
- La concentracion territorial del descuento fuerte resulta estadisticamente significativa, aunque con efecto bajo (`Cramer's V = 0,093`; p ajustado de Holm = 0,0479).

### Amenities

- El promedio de amenities aumenta desde 2,40 en el rango de precio bajo hasta 3,98 en el alto.
- La asociacion entre cantidad de amenities y precio por m2 es positiva pero baja (`rho = 0,192`).
- La prima asociada a amenities cambia por barrio. No toda mejora tiene el mismo valor comercial ni recupera necesariamente su costo.

### Modelo predictivo

El modelo se entrena sobre precios USD observados del dataset enriquecido, antes de la imputacion general. La separacion se realiza por ubicacion y todo el preprocesamiento se ajusta solo con train.

| Modelo | MAE test | MAPE test | R2 test |
|---|---:|---:|---:|
| Ridge | USD 49.138 | 25,04% | 0,59 |
| Random Forest | USD 41.337 | 21,13% | 0,69 |

Random Forest reduce el MAE 15,9% respecto de Ridge. En cinco validaciones agrupadas obtiene MAE promedio de USD 40.409 y `R2 = 0,74`, con menor dispersion. Se utiliza como segunda opinion sobre el precio publicado, no como precio esperado de reventa.

## Resultados estadisticos

Los tests formales utilizan `alpha = 0,05`, pruebas no parametricas cuando corresponde, correccion Holm-Bonferroni y tamaños de efecto.

| Hipotesis operativa | Resultado | Lectura de negocio |
|---|---|---|
| El precio por m2 cambia entre barrios | Se rechaza H0 | El barrio debe ser el primer filtro |
| La oferta cambia entre barrios | Se rechaza H0 | La profundidad de comparables no es uniforme |
| El stock mejorable depende del barrio | Se rechaza H0 | Algunas zonas concentran mas casos para puesta en valor |
| Amenities y precio por m2 estan asociados | Se rechaza H0 | Son una señal complementaria, de efecto bajo |
| La accesibilidad cambia entre barrios | Se rechaza H0 | Permite diferenciar contexto territorial |
| El descuento fuerte depende del barrio | Se rechaza H0 | La señal existe, pero es debil y requiere cautela |
| El indice de oportunidad cambia entre clusters | Se rechaza H0 | La segmentacion aporta contexto para priorizar |

La tabla completa y reproducible se genera en [`data/processed/resultados_tests_estadisticos.csv`](data/processed/resultados_tests_estadisticos.csv).

## Recomendaciones de negocio

1. Concentrar la busqueda inicial en barrios con score alto, oferta suficiente y comparables robustos.
2. Priorizar propiedades con descuento defendible y estado mejorable, sin decidir solo por el score.
3. Validar que los comparables sean equivalentes en micro-ubicacion, calidad y estado real.
4. Adaptar las mejoras al barrio: la prima de amenities varia territorialmente.
5. Usar el modelo predictivo para detectar desalineamientos, no como tasacion profesional.
6. Someter cada oportunidad a un filtro final de precio negociado, obra, gastos, impuestos y plazo de salida.

Los rankings reproducibles se encuentran en:

- [`data/processed/ranking_barrios_oportunidad.csv`](data/processed/ranking_barrios_oportunidad.csv)
- [`data/processed/ranking_oportunidades_propiedades.csv`](data/processed/ranking_oportunidades_propiedades.csv)

## Impacto esperado

El proyecto permite:

- reducir el tiempo dedicado a revisar avisos sin evidencia suficiente;
- comparar barrios con criterios consistentes;
- ordenar oportunidades dentro de cada zona;
- documentar por que una propiedad merece investigacion;
- separar oportunidad analitica de rentabilidad confirmada;
- construir una base para alertas y actualizaciones periodicas.

## Dashboard

El archivo [`dashboard/TP3_AD.pbix`](dashboard/TP3_AD.pbix) contiene cinco paginas:

1. `General`
2. `Clusters`
3. `Detalle Barrio`
4. `Detalle Propiedad`
5. `Tooltip M2`

Incluye navegacion, filtros, mapas, detalle territorial, comparacion de precio por m2 y composicion del indice de oportunidad.

**Dashboard interactivo online (Power BI Service):** [abrir dashboard](https://app.powerbi.com/view?r=eyJrIjoiNTQ0NjhkY2UtMjdjMC00YmQ0LWIyNGUtYjMwNzEzMDk0YTQ4IiwidCI6ImExZjUwYTk3LTIxYzAtNDlhNy1hOWQ0LWYyNDRlYmI0MmRhNyIsImMiOjR9)

**Archivo PBIX (SharePoint):** [descargar](https://itba2-my.sharepoint.com/:u:/g/personal/lbinello_itba_edu_ar/IQCjaMPz_cMJQrOz-0imvX2uAXUA5tgtS_VFlRb683tb3Iw?e=Ax8FaD)

La guia de publicacion y validacion se encuentra en [`dashboard/README.md`](dashboard/README.md).

## Estructura del repositorio

```text
.
|-- data/
|   |-- raw/             # dataset extraido
|   |-- interim/         # geocodificacion y enriquecimiento
|   `-- processed/       # dataset final, diccionario y rankings
|-- dashboard/           # PBIX y documentacion de publicacion
|-- docs/                # informe ejecutivo complementario
|-- notebooks/           # pipeline tecnico y notebook integrador
|-- src/                 # scraper
|-- README.md
`-- requirements.txt
```

## Notebooks

| Notebook | Funcion |
|---|---|
| `02_mapeo_latitud_longitud.ipynb` | Geocodificacion |
| `03_enrichment.ipynb` | Enriquecimiento geoespacial |
| `04_Limpieza.ipynb` | Limpieza e imputacion |
| `05_EDA_Y_Clusters.ipynb` | EDA y segmentacion |
| `06_Hipotesis_Y_KPIs.ipynb` | KPIs e indice de oportunidad |
| `07_Correcciones_Entrega2.ipynb` | Trazabilidad y diccionario |
| `08_Validación_Estadística_Formal.ipynb` | Tests estadisticos |
| `09_Reduccion_de_Dimensionalidad.ipynb` | Indices PCA/MCA |
| `10_Prediccion.ipynb` | Ridge y Random Forest |
| `11_Analisis_Integrador_Ejecutivo.ipynb` | Embudo barrio-propiedad-validacion |

## Reproduccion

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
cd notebooks
jupyter lab
```

Para regenerar las salidas ejecutivas, ejecutar `11_Analisis_Integrador_Ejecutivo.ipynb` desde la carpeta `notebooks`.

## Limitaciones

- precios publicados y no precios de cierre;
- sin historial temporal ni dias en mercado;
- sin costos de obra, impuestos, comisiones o financiacion;
- sin inspeccion estructural ni evaluacion legal;
- calidad dependiente de la informacion declarada en los avisos;
- comparables limitados a las variables disponibles;
- asociaciones estadisticas no causales;
- score de oportunidad distinto de ROI.

## Lineas futuras y produccion

- recolectar historial de precios y permanencia de cada aviso;
- incorporar precios de cierre y negociacion;
- registrar presupuestos y costos reales de obra;
- automatizar controles de calidad y recalculo de scores;
- actualizar Power BI Service mediante un dataset programado;
- generar alertas de nuevas oportunidades;
- monitorear error y reentrenar el modelo;
- calcular ROI esperado cuando existan todas las variables financieras.

Una futura estimacion de rentabilidad deberia incorporar:

```text
ROI = (venta esperada - compra negociada - obra - gastos totales) / capital invertido
```

Hasta entonces, el producto debe interpretarse como una herramienta para **maximizar la calidad de las oportunidades detectadas**, no para prometer retornos.
