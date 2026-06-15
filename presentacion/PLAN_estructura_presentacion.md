# Plan - Presentacion ejecutiva (12 diapositivas)

## Objetivo

La presentacion debe explicar el proyecto a un publico directivo o no tecnico en 15-20 minutos:

> Un inversor enfrenta miles de avisos dificiles de comparar. El proyecto transforma esos datos en un proceso para decidir donde buscar, que propiedades investigar y que validar antes de invertir.

Las versiones anteriores se conservan. La revision actual se genera en `presentacion/Presentacion_Ejecutiva_Flip_CABA_v4.pptx` mediante `presentacion/build_deck_v2.py`.

## Principios

- Priorizar decisiones y consecuencias de negocio sobre tecnicas.
- Usar una idea principal y un titulo concluyente por diapositiva.
- Seguir el vocabulario simple de los notebooks.
- Presentar el indice como priorizacion y el modelo como segunda opinion.
- No confundir precios publicados con precios de cierre.
- No afirmar causalidad, rentabilidad ni ROI con los datos actuales.
- Respaldar cada grafico analitico con las definiciones de los notebooks.

## Estructura final

| # | Funcion | Titulo | Contenido | Recurso |
|---|---|---|---|---|
| 1 | Presentar | **Priorizacion de oportunidades de flip inmobiliario en CABA** | Proyecto, equipo y propuesta de valor | Mapa decorativo |
| 2 | Problema | **Miles de avisos, pero poca evidencia para decidir** | Informacion dispersa y dificultad para comparar antes de comprometer capital | Cifras de contexto |
| 3 | Modelo de negocio | **El resultado de un flip se define antes de empezar la obra** | Comprar bien, mejorar con criterio y revender con margen. El analisis mejora la seleccion de compra; todavia no calcula ROI | Flujo comprar -> mejorar -> revender |
| 4 | Datos | **Integramos publicaciones con informacion territorial** | Argenprop, GCBA y OpenStreetMap; que representa cada fila | Diagrama de fuentes |
| 5 | Señales | **Cuatro señales para decidir que avisos merecen una revision** | Precio de entrada, margen de mejora, mercado de salida y segunda opinion | Cuatro criterios + embudo 12.518 -> 7.245 -> 3.129 |
| 6 | Solucion | **Transformamos datos en un proceso de decision** | Explorar, comparar, priorizar, contrastar y validar | Flujo barrio -> propiedad -> validacion |
| 7 | Insight 1 | **El barrio fija el punto de entrada; los amenities agregan valor, pero no alcanzan solos** | Precio por m2 según barrio y asociación entre dotación de amenities y precio. Diferenciar señal principal de complemento | Precio por barrio del notebook 05 + amenities del notebook 06 |
| 8 | Insight 2 | **CABA no es un único mercado: identificamos seis perfiles con lógicas distintas** | PCA explicado como tres lentes comerciales y clusters expresados como perfiles de mercado. Belgrano pertenece a alto valor por m2 | PCA del notebook 09 + clusters del notebook 05 |
| 9 | Paso 3 | **El modelo aporta una segunda opinion sobre el precio** | Superficie, expensas, ubicacion, baños, antigüedad, estado y amenities. No estima reventa | Importancia de variables del notebook 10 |
| 10 | Aplicacion | **Belgrano: una propiedad que reune las señales para investigar** | Barrio priorizado -> descuento y mejora -> segunda opinion; cerrar con validaciones pendientes | Ficha del caso reproducido |
| 11 | Impacto | **La herramienta concentra el esfuerzo donde hay mas evidencia** | De 7.245 propiedades comparables a 3.129 casos elegibles; beneficios, metricas y reglas de uso | Embudo + tabla de modelos |
| 12 | Futuro | **El siguiente paso es pasar de priorizacion a rentabilidad medida** | Precios de cierre, costos, historial, automatizacion y futuro ROI | Hoja de ruta |

## Logica narrativa

1. **Problema y negocio, slides 1-3:** por que el flipper necesita comprar bien antes de pensar en la obra.
2. **Datos y solucion, slides 4-6:** que señales se construyeron y como forman un proceso de decision.
3. **Insights y ejemplo, slides 7-10:** ubicación y producto -> perfiles de mercado -> segunda opinión -> caso Belgrano.
4. **Impacto y futuro, slides 11-12:** que mejora hoy y que datos faltan para medir rentabilidad.

La conexion central debe quedar explicita:

> Los insights no son datos aislados. El barrio y el perfil comercial definen el contexto correcto; el descuento y el estado permiten identificar la propiedad; el modelo sirve para contrastar; el ejemplo demuestra la secuencia completa.

## Graficos principales

- **Precio por m2 según barrio:** muestra que la ubicación condiciona el punto de entrada.
- **Precio por m2 según dotación de amenities:** muestra una asociación positiva, pero complementaria.
- **PCA en lenguaje de negocio:** resume amplitud, entorno urbano y confort.
- **Clusters como perfiles comerciales:** muestra seis mercados con niveles de precio diferentes.
- **Importancia de variables:** explica la segunda opinion del modelo sin tecnicismos.
- **Mapa decorativo:** se mantiene solamente como recurso de portada.

## Cifras validadas

- Base inicial: `12.518` avisos.
- Base comparable: `7.245` propiedades.
- Casos elegibles para investigar: `3.129`.
- Belgrano: puesto `3`, `311` publicaciones y `138` oportunidades elegibles.
- Precio mediano general: `USD 2.160/m2`; Belgrano: `USD 2.726/m2`.
- Dotación alta de amenities: `USD 392/m2` por encima de la dotación baja; asociación baja (`rho = 0,19`).
- PCA de amplitud: un componente resume `81,2%` de la variación.
- PCA de entorno: tres componentes resumen `59,5%` de la variación.
- El índice de confort tiene una correlación de `0,934` con la cantidad de amenities.
- Belgrano, Recoleta y Retiro integran el perfil `Alto valor por m2`.
- Caso Belgrano: precio publicado `USD 80.000`, comparable `USD 2.706/m2`, descuento `34,3%`, indice `77/100`.
- Segunda opinion del caso: Ridge `+8,4%` y Random Forest `+9,6%`.
- Metricas de test: Ridge MAE `USD 49.138`, MAPE `25,04%`, R2 `0,59`; Random Forest MAE `USD 41.337`, MAPE `21,13%`, R2 `0,69`.
- El caso pertenece a train y se presenta como ejemplo ilustrativo, no como validacion fuera de muestra.

## Limites visibles

- Son precios publicados, no precios efectivos de cierre.
- El estado mejorable no garantiza una refaccion rentable.
- El indice ordena casos para investigar; no calcula rentabilidad.
- El modelo aporta una segunda opinion; no reemplaza una tasacion.
- Antes de invertir faltan precio negociado, costos de obra, impuestos, comisiones, aspectos legales y plazo de salida.

## Verificacion

1. Regenerar graficos y PPTX sin reemplazar versiones anteriores.
2. Confirmar cifras y definiciones contra notebooks y archivos procesados.
3. Validar que el PPTX tenga 12 diapositivas y todos los recursos embebidos.
4. Exportar a PDF e imagen para revisar margenes, contraste y desbordes cuando PowerPoint permita la automatizacion.
5. Ensayar entre 60 y 90 segundos por diapositiva.
