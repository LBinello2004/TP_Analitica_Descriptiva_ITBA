# Datos

## Estructura

- `raw/`: salida consolidada del scraper, sin transformaciones analiticas.
- `interim/`: datasets geocodificados y enriquecidos.
- `processed/`: dataset limpio, dataset con indices, diccionario y salidas ejecutivas.

## Salidas ejecutivas

- `ranking_barrios_oportunidad.csv`: priorizacion territorial usando el indice existente, con minimos de evidencia.
- `ranking_oportunidades_propiedades.csv`: propiedades con descuento positivo y al menos cinco comparables.
- `resultados_tests_estadisticos.csv`: tests, p-values ajustados y tamanos de efecto.

Los rankings no representan ROI ni recomendacion automatica de compra.
