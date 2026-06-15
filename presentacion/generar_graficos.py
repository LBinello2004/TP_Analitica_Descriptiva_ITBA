"""Genera los assets analiticos previos a la presentacion ejecutiva."""

import json
import os

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import pandas as pd

NAVY = "#0F1B2D"
TERRA = "#C2683C"
INK = "#3A3A3A"
GRAY = "#BFBFBF"
GRAYD = "#7A7A7A"
BLUE = "#4C78A8"
BLUE_LIGHT = "#B9CBE0"

plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "axes.edgecolor": INK,
    "axes.linewidth": 0.8,
    "text.color": NAVY,
    "axes.labelcolor": NAVY,
    "xtick.color": INK,
    "ytick.color": INK,
    "figure.dpi": 200,
    "savefig.dpi": 200,
})

BASE = os.path.dirname(os.path.abspath(__file__))
PROC = os.path.join(BASE, "..", "data", "processed")
OUT = os.path.join(BASE, "assets")
os.makedirs(OUT, exist_ok=True)


def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, transparent=True, bbox_inches="tight", pad_inches=0.15)
    plt.close(fig)
    print("OK", name)


def clean_axes(ax, grid_axis=None):
    ax.spines[["top", "right"]].set_visible(False)
    if grid_axis:
        ax.grid(axis=grid_axis, alpha=0.18)
        ax.set_axisbelow(True)


df = pd.read_csv(os.path.join(PROC, "Argenprop_limpio_con_indices.csv"))
ranking_barrios = pd.read_csv(os.path.join(PROC, "ranking_barrios_oportunidad.csv"))
accesibilidad = pd.read_csv(
    os.path.join(PROC, "resumen_presentacion_accesibilidad.csv"),
    index_col=0,
)
amenities = pd.read_csv(
    os.path.join(PROC, "resumen_presentacion_amenities.csv"),
    index_col=0,
)
metricas = pd.read_csv(os.path.join(PROC, "metricas_modelos_presentacion.csv"))
importancia = pd.read_csv(os.path.join(PROC, "importancia_variables_rf.csv"))

CLUSTER_NAMES = {
    0: "Tradicional accesible",
    1: "Premium consolidado",
    2: "Residencial medio-alto",
    3: "Residencial accesible",
    4: "Alto valor por m2",
    5: "Compactos economicos",
}

# 1) Mapa decorativo para portada. No incluye escala ni afirmaciones analiticas.
mapa = df.dropna(
    subset=["enriquecida_Latitud", "enriquecida_Longitud", "sintetica_precio_m2"]
).copy()
mapa = mapa[mapa["sintetica_precio_m2"].between(1, 8000)]
vmax = mapa["sintetica_precio_m2"].quantile(0.95)
fig, ax = plt.subplots(figsize=(7.2, 7.6))
ax.scatter(
    mapa["enriquecida_Longitud"],
    mapa["enriquecida_Latitud"],
    c=mapa["sintetica_precio_m2"].clip(upper=vmax),
    cmap="YlOrBr",
    s=34,
    alpha=0.10,
    linewidths=0,
)
ax.scatter(
    mapa["enriquecida_Longitud"],
    mapa["enriquecida_Latitud"],
    c=mapa["sintetica_precio_m2"].clip(upper=vmax),
    cmap="YlOrBr",
    s=8,
    alpha=0.9,
    linewidths=0,
)
ax.set_aspect("equal")
ax.axis("off")
save(fig, "01_mapa_cover.png")

# 2) Hallazgo territorial: precio mediano por m2.
top_barrios = (
    ranking_barrios.sort_values("precio_m2_mediano", ascending=False)
    .head(14)
    .iloc[::-1]
)
fig, ax = plt.subplots(figsize=(8.4, 6.2))
colors = [TERRA if i == len(top_barrios) - 1 else NAVY for i in range(len(top_barrios))]
ax.barh(
    top_barrios["enriquecida_Barrio"],
    top_barrios["precio_m2_mediano"],
    color=colors,
    height=0.72,
)
for y, value in enumerate(top_barrios["precio_m2_mediano"]):
    ax.text(value + 25, y, f"{value:,.0f}", va="center", fontsize=9.5, color=INK)
ax.set_xlabel("Precio mediano por m2 (USD)")
ax.tick_params(axis="y", length=0)
clean_axes(ax, "x")
save(fig, "02_precio_m2_barrio.png")

# 2a) Version compacta para combinar precio y amenities en una misma slide.
top_barrios_compacto = (
    ranking_barrios.sort_values("precio_m2_mediano", ascending=False)
    .head(10)
    .iloc[::-1]
)
fig, ax = plt.subplots(figsize=(6.2, 4.2))
colors = [
    TERRA if barrio == "Belgrano" else NAVY
    for barrio in top_barrios_compacto["enriquecida_Barrio"]
]
ax.barh(
    top_barrios_compacto["enriquecida_Barrio"],
    top_barrios_compacto["precio_m2_mediano"],
    color=colors,
    height=0.66,
)
for y, value in enumerate(top_barrios_compacto["precio_m2_mediano"]):
    ax.text(value + 35, y, f"{value:,.0f}", va="center", fontsize=8.5, color=INK)
ax.set_xlabel("Precio mediano por m2 (USD)")
ax.tick_params(axis="y", length=0, labelsize=8.5)
ax.set_xlim(0, top_barrios_compacto["precio_m2_mediano"].max() * 1.17)
clean_axes(ax, "x")
save(fig, "02_precio_m2_barrio_compacto.png")

# 2b) Barrios priorizados por el indice de oportunidad.
top_oportunidad = (
    ranking_barrios.sort_values("indice_oportunidad_mediano", ascending=False)
    .head(10)
    .iloc[::-1]
)
fig, ax = plt.subplots(figsize=(8.2, 5.8))
colors = [
    TERRA if barrio == "Belgrano" else NAVY
    for barrio in top_oportunidad["enriquecida_Barrio"]
]
ax.barh(
    top_oportunidad["enriquecida_Barrio"],
    top_oportunidad["indice_oportunidad_mediano"],
    color=colors,
    height=0.68,
)
for y, value in enumerate(top_oportunidad["indice_oportunidad_mediano"]):
    ax.text(value + 0.35, y, f"{value:.1f}", va="center", fontsize=9.5, color=INK)
ax.set_xlabel("Indice de oportunidad mediano (0-100)")
ax.tick_params(axis="y", length=0)
ax.set_xlim(0, top_oportunidad["indice_oportunidad_mediano"].max() * 1.12)
clean_axes(ax, "x")
save(fig, "02_ranking_barrios_oportunidad.png")

# 3) Cruce de señales centrales del flipper.
fig, ax = plt.subplots(figsize=(8.0, 5.7))
sizes = 30 + 170 * (
    ranking_barrios["propiedades"] / ranking_barrios["propiedades"].max()
)
ax.scatter(
    ranking_barrios["pct_stock_mejorable"],
    ranking_barrios["pct_descuento_fuerte"],
    s=sizes,
    color=BLUE,
    alpha=0.58,
    edgecolor="white",
    linewidth=0.8,
)
belgrano = ranking_barrios[ranking_barrios["enriquecida_Barrio"] == "Belgrano"].iloc[0]
ax.scatter(
    [belgrano["pct_stock_mejorable"]],
    [belgrano["pct_descuento_fuerte"]],
    s=190,
    color=TERRA,
    edgecolor=NAVY,
    linewidth=1.2,
    zorder=5,
)
label_names = ["Belgrano", "La Boca", "Villa Lugano", "Mataderos", "Palermo", "Recoleta"]
for _, row in ranking_barrios[
    ranking_barrios["enriquecida_Barrio"].isin(label_names)
].iterrows():
    ax.annotate(
        row["enriquecida_Barrio"],
        (row["pct_stock_mejorable"], row["pct_descuento_fuerte"]),
        xytext=(5, 5),
        textcoords="offset points",
        fontsize=9,
        color=NAVY,
    )
ax.axvline(
    ranking_barrios["pct_stock_mejorable"].median(),
    color=GRAY,
    linestyle="--",
    linewidth=1,
)
ax.axhline(
    ranking_barrios["pct_descuento_fuerte"].median(),
    color=GRAY,
    linestyle="--",
    linewidth=1,
)
ax.set_xlabel("Stock mejorable del barrio (%)")
ax.set_ylabel("Avisos con descuento fuerte (%)")
ax.xaxis.set_major_formatter(mticker.PercentFormatter(xmax=100, decimals=0))
ax.yaxis.set_major_formatter(mticker.PercentFormatter(xmax=100, decimals=0))
clean_axes(ax, "both")
save(fig, "03_stock_mejorable_descuento.png")

# 4) Accesibilidad: cuatro cuartiles, sin lectura causal.
orden_accesibilidad = ["Baja", "Media-baja", "Media-alta", "Alta"]
medianas = accesibilidad.loc[orden_accesibilidad, "precio_m2_mediana"]
fig, ax = plt.subplots(figsize=(7.8, 5.4))
bars = ax.bar(
    orden_accesibilidad,
    medianas.values,
    color=[BLUE_LIGHT, "#72B7D2", BLUE, NAVY],
    width=0.65,
)
for bar, value in zip(bars, medianas.values):
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        value + 28,
        f"USD {value:,.0f}",
        ha="center",
        fontsize=10,
        color=NAVY,
    )
ax.set_xlabel("Cuartil de accesibilidad")
ax.set_ylabel("Mediana de precio por m2 (USD)")
ax.yaxis.set_major_formatter(mticker.StrMethodFormatter("{x:,.0f}"))
clean_axes(ax, "y")
save(fig, "06_accesibilidad_precio.png")

# 5) Amenities: asociacion descriptiva con precio publicado.
orden_amenities = ["Baja dotacion", "Media dotacion", "Alta dotacion"]
precio_amenities = amenities.loc[orden_amenities, "precio_m2_promedio"]
fig, ax = plt.subplots(figsize=(7.8, 5.4))
bars = ax.bar(
    ["Baja", "Media", "Alta"],
    precio_amenities.values,
    color=[BLUE_LIGHT, BLUE, NAVY],
    width=0.65,
)
for bar, value in zip(bars, precio_amenities.values):
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        value + 32,
        f"USD {value:,.0f}",
        ha="center",
        fontsize=10,
        color=NAVY,
    )
ax.set_xlabel("Dotacion de amenities")
ax.set_ylabel("Precio promedio por m2 (USD)")
ax.yaxis.set_major_formatter(mticker.StrMethodFormatter("{x:,.0f}"))
clean_axes(ax, "y")
save(fig, "07_amenities_precio.png")

# 5b) Version compacta de amenities para la slide de insights.
fig, ax = plt.subplots(figsize=(5.4, 4.2))
bars = ax.bar(
    ["Baja", "Media", "Alta"],
    precio_amenities.values,
    color=[BLUE_LIGHT, BLUE, TERRA],
    width=0.62,
)
for bar, value in zip(bars, precio_amenities.values):
    ax.text(
        bar.get_x() + bar.get_width() / 2,
        value + 32,
        f"USD {value:,.0f}",
        ha="center",
        fontsize=9.5,
        color=NAVY,
        fontweight="bold",
    )
ax.set_xlabel("Dotacion de amenities")
ax.set_ylabel("Precio promedio por m2 (USD)")
ax.set_ylim(0, precio_amenities.max() * 1.19)
ax.yaxis.set_major_formatter(mticker.StrMethodFormatter("{x:,.0f}"))
clean_axes(ax, "y")
save(fig, "07_amenities_precio_compacto.png")

# 6) PCA en lenguaje de negocio: muchas variables se resumen en tres lentes.
fig, ax = plt.subplots(figsize=(5.7, 4.2))
ax.set_xlim(0, 100)
ax.set_ylim(-0.6, 2.75)
labels_pca = ["Amplitud", "Entorno urbano", "Confort"]
values_pca = [81.2, 59.5, 93.4]
subtitles_pca = [
    "superficie, ambientes, dormitorios y banos",
    "transporte, servicios y cercanias",
    "alineacion con la cantidad de amenities",
]
metric_labels = [
    "81% de variacion resumida",
    "59% de variacion resumida",
    "93% de alineacion",
]
colors_pca = [NAVY, BLUE, TERRA]
for idx, (label, value, subtitle, metric, color) in enumerate(
    zip(labels_pca, values_pca, subtitles_pca, metric_labels, colors_pca)
):
    y = 2 - idx
    ax.barh(y, 100, color="#E9E6E1", height=0.28)
    ax.barh(y, value, color=color, height=0.28)
    ax.text(0, y + 0.30, label, color=NAVY, fontsize=11, fontweight="bold")
    ax.text(100, y + 0.30, metric, color=color, fontsize=9, ha="right")
    ax.text(0, y - 0.38, subtitle, color=GRAYD, fontsize=8.5)
ax.axis("off")
save(fig, "08_pca_lentes_negocio.png")

# 7) Clusters en lenguaje natural: seis perfiles de mercado.
cluster_summary = (
    df.groupby("sintetica_Cluster")
    .agg(
        propiedades=("sintetica_precio_m2", "size"),
        precio_m2=("sintetica_precio_m2", "median"),
    )
    .reset_index()
)
cluster_summary["perfil"] = cluster_summary["sintetica_Cluster"].map(CLUSTER_NAMES)
cluster_summary = cluster_summary.sort_values("precio_m2", ascending=True)
fig, ax = plt.subplots(figsize=(6.3, 4.2))
colors = [
    TERRA if cluster == 4 else NAVY
    for cluster in cluster_summary["sintetica_Cluster"]
]
ax.barh(
    cluster_summary["perfil"],
    cluster_summary["precio_m2"],
    color=colors,
    height=0.62,
)
for y, (_, row) in enumerate(cluster_summary.iterrows()):
    ax.text(
        row["precio_m2"] + 55,
        y,
        f"USD {row['precio_m2']:,.0f}/m2",
        va="center",
        fontsize=8.6,
        color=INK,
    )
ax.set_xlabel("Precio mediano por m2 (USD)")
ax.set_xlim(0, cluster_summary["precio_m2"].max() * 1.22)
ax.tick_params(axis="y", length=0, labelsize=8.5)
clean_axes(ax, "x")
save(fig, "09_clusters_perfiles.png")

# 6) Modelo: variables originales mas importantes por permutacion.
labels = {
    "Sup_Total_m2_num": "Superficie total",
    "Sup_Cubierta_m2_num": "Superficie cubierta",
    "Expensas_num": "Expensas",
    "Latitud": "Latitud",
    "Baños": "Baños",
    "Antiguedad": "Antigüedad",
    "Baulera": "Baulera",
    "Estado": "Estado",
}
top_importancia = importancia[importancia["aumento_MAE_USD"] > 0].head(8).iloc[::-1].copy()
top_importancia["label"] = top_importancia["feature"].map(labels).fillna(top_importancia["feature"])
fig, ax = plt.subplots(figsize=(8.0, 5.6))
colors = [NAVY] * len(top_importancia)
colors[-1] = TERRA
ax.barh(
    top_importancia["label"],
    top_importancia["aumento_MAE_USD"],
    color=colors,
    height=0.68,
)
ax.set_xlabel("Aumento del MAE al permutar la variable (USD)")
ax.xaxis.set_major_formatter(mticker.StrMethodFormatter("{x:,.0f}"))
ax.tick_params(axis="y", length=0)
clean_axes(ax, "x")
save(fig, "04_importancia_variables.png")

brecha_accesibilidad = 100 * (medianas["Alta"] / medianas["Baja"] - 1)
brecha_amenities = (
    precio_amenities["Alta dotacion"] - precio_amenities["Baja dotacion"]
)
manifest = {
    "assets": {
        "portada": "01_mapa_cover.png",
        "precio_barrio": "02_precio_m2_barrio.png",
        "precio_barrio_compacto": "02_precio_m2_barrio_compacto.png",
        "ranking_barrios": "02_ranking_barrios_oportunidad.png",
        "stock_descuento": "03_stock_mejorable_descuento.png",
        "importancia_modelo": "04_importancia_variables.png",
        "accesibilidad": "06_accesibilidad_precio.png",
        "amenities": "07_amenities_precio.png",
        "amenities_compacto": "07_amenities_precio_compacto.png",
        "pca_negocio": "08_pca_lentes_negocio.png",
        "clusters_perfiles": "09_clusters_perfiles.png",
    },
    "hallazgos": {
        "accesibilidad_alta_vs_baja_pct": float(brecha_accesibilidad),
        "amenities_alta_vs_baja_usd_m2": float(brecha_amenities),
    },
    "metricas_modelos": metricas.to_dict(orient="records"),
    "variables_importantes": importancia.head(8).to_dict(orient="records"),
}

with open(os.path.join(OUT, "datos_presentacion.json"), "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, ensure_ascii=False, indent=2)

print("OK datos_presentacion.json")
print("\nListo. Assets en:", OUT)
