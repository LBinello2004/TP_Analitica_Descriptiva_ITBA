"""Genera los graficos de la presentacion ejecutiva con paleta navy + terracota.
Salida: presentacion/assets/*.png (fondo transparente, listos para pptx)."""
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import font_manager as fm

# ---- Paleta -------------------------------------------------------------
NAVY   = "#0F1B2D"
TERRA  = "#C2683C"
PAPER  = "#F4F1EC"
INK    = "#3A3A3A"
GRAY   = "#BFBFBF"
GRAYD  = "#7A7A7A"

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
OUT  = os.path.join(BASE, "assets")
os.makedirs(OUT, exist_ok=True)

def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, transparent=True, bbox_inches="tight", pad_inches=0.15)
    plt.close(fig)
    print("OK", name)

df  = pd.read_csv(os.path.join(PROC, "Argenprop_limpio_con_indices.csv"))
rb  = pd.read_csv(os.path.join(PROC, "ranking_barrios_oportunidad.csv"))

# ========================================================================
# 1) MAPA CABA: scatter lat/lon coloreado por precio/m2
# ========================================================================
m = df.dropna(subset=["enriquecida_Latitud", "enriquecida_Longitud", "sintetica_precio_m2"]).copy()
m = m[(m["sintetica_precio_m2"] > 0) & (m["sintetica_precio_m2"] < 8000)]
vmax = m["sintetica_precio_m2"].quantile(0.95)
fig, ax = plt.subplots(figsize=(7.2, 7.6))
sc = ax.scatter(m["enriquecida_Longitud"], m["enriquecida_Latitud"],
                c=m["sintetica_precio_m2"].clip(upper=vmax), cmap="YlOrBr",
                s=7, alpha=0.75, linewidths=0)
ax.set_aspect("equal")
ax.axis("off")
cb = fig.colorbar(sc, ax=ax, fraction=0.035, pad=0.02)
cb.set_label("Precio por m² (USD)", color=NAVY, fontsize=11)
cb.ax.tick_params(colors=INK)
save(fig, "01_mapa_precio_m2.png")

# ---- 1b) MAPA DECORATIVO para portada (sin escala, sin ejes) ----------
fig, ax = plt.subplots(figsize=(7.2, 7.6))
# glow suave debajo
ax.scatter(m["enriquecida_Longitud"], m["enriquecida_Latitud"],
           c=m["sintetica_precio_m2"].clip(upper=vmax), cmap="YlOrBr",
           s=34, alpha=0.10, linewidths=0)
ax.scatter(m["enriquecida_Longitud"], m["enriquecida_Latitud"],
           c=m["sintetica_precio_m2"].clip(upper=vmax), cmap="YlOrBr",
           s=8, alpha=0.9, linewidths=0)
ax.set_aspect("equal")
ax.axis("off")
save(fig, "06_mapa_cover.png")

# ========================================================================
# 2) PRECIO/M2 POR BARRIO (top 14) - barras horizontales
# ========================================================================
top = rb.sort_values("precio_m2_mediano", ascending=False).head(14).iloc[::-1]
fig, ax = plt.subplots(figsize=(8.4, 6.2))
colors = [TERRA if i == len(top)-1 else NAVY for i in range(len(top))]
ax.barh(top["enriquecida_Barrio"], top["precio_m2_mediano"], color=colors, height=0.72)
for y, v in enumerate(top["precio_m2_mediano"]):
    ax.text(v + 25, y, f"{v:,.0f}".replace(",", "."), va="center", fontsize=9.5, color=INK)
ax.set_xlabel("Precio mediano por m² (USD)")
for s in ["top", "right"]:
    ax.spines[s].set_visible(False)
ax.tick_params(axis="y", length=0)
save(fig, "02_precio_m2_barrio.png")

# ========================================================================
# 3) STOCK MEJORABLE vs DESCUENTO FUERTE (top por descuento)
# ========================================================================
d = rb.sort_values("pct_descuento_fuerte", ascending=False).head(12).iloc[::-1]
y = np.arange(len(d))
h = 0.38
fig, ax = plt.subplots(figsize=(8.6, 6.4))
ax.barh(y + h/2, d["pct_descuento_fuerte"], height=h, color=TERRA, label="% con descuento fuerte (≥15%)")
ax.barh(y - h/2, d["pct_stock_mejorable"], height=h, color=NAVY, label="% stock mejorable")
ax.set_yticks(y)
ax.set_yticklabels(d["enriquecida_Barrio"])
ax.set_xlabel("% de avisos del barrio")
for s in ["top", "right"]:
    ax.spines[s].set_visible(False)
ax.tick_params(axis="y", length=0)
ax.legend(frameon=False, loc="upper center", bbox_to_anchor=(0.5, -0.10),
          ncol=2, fontsize=10)
save(fig, "03_descuento_mejorable.png")

# ========================================================================
# 4) AMENITIES vs PRECIO/M2 por rango de precio (barras) + rho
# ========================================================================
a = df.dropna(subset=["sintetica_cantidad_amenities", "sintetica_precio_m2"]).copy()
a = a[(a["sintetica_precio_m2"] > 0) & (a["sintetica_precio_m2"] < 8000)]
a["rango"] = pd.qcut(a["sintetica_precio_m2"], 4, labels=["Bajo", "Medio-bajo", "Medio-alto", "Alto"])
g = a.groupby("rango", observed=True)["sintetica_cantidad_amenities"].mean()
fig, ax = plt.subplots(figsize=(7.6, 5.6))
bars = ax.bar(g.index.astype(str), g.values, color=[GRAY, GRAYD, NAVY, TERRA], width=0.66)
for b, v in zip(bars, g.values):
    ax.text(b.get_x()+b.get_width()/2, v+0.05, f"{v:.2f}", ha="center", fontsize=11, color=NAVY)
ax.set_ylabel("Amenities promedio")
ax.set_xlabel("Rango de precio por m²")
for s in ["top", "right"]:
    ax.spines[s].set_visible(False)
ax.tick_params(axis="x", length=0)
save(fig, "04_amenities_precio.png")

# ========================================================================
# 5) MODELO: MAE Ridge vs Random Forest
# ========================================================================
modelos = ["Ridge", "Random Forest"]
mae = [49138, 41337]
fig, ax = plt.subplots(figsize=(6.6, 5.4))
bars = ax.bar(modelos, mae, color=[NAVY, TERRA], width=0.55)
for b, v in zip(bars, mae):
    ax.text(b.get_x()+b.get_width()/2, v+500, f"USD {v:,.0f}".replace(",", "."),
            ha="center", fontsize=12, color=NAVY, fontweight="bold")
ax.set_ylabel("MAE en test (USD)")
ax.set_ylim(0, 56000)
for s in ["top", "right"]:
    ax.spines[s].set_visible(False)
ax.tick_params(axis="x", length=0)
save(fig, "05_modelo_mae.png")

print("\nListo. Graficos en:", OUT)
