"""Reproduce los modelos del notebook 10 y valida el caso del deck."""

import json
import os
import warnings

import pandas as pd

warnings.filterwarnings("ignore")

BASE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(BASE, ".."))
NB = os.path.join(ROOT, "notebooks", "10_Prediccion.ipynb")
RANKING = os.path.join(ROOT, "data", "processed", "ranking_oportunidades_propiedades.csv")
OUT = os.path.join(BASE, "assets", "datos_ejemplo.json")

with open(NB, encoding="utf-8") as fh:
    nb = json.load(fh)

cells = {
    i: "".join(cell["source"])
    for i, cell in enumerate(nb["cells"])
    if cell["cell_type"] == "code"
}

# Los notebooks usan rutas relativas a su propia carpeta.
os.chdir(os.path.join(ROOT, "notebooks"))
ns = {}
for idx in [2, 4, 6, 8, 10, 12, 17]:
    exec(cells[idx], ns)

ridge_model = ns["ridge_model"]
rf_model = ns["rf_model"]
df_modelo = ns["df_modelo"]
features = ns["features"]

mask = (
    df_modelo["Calle"].astype(str).str.contains("Vuelta De Obligado", case=False, na=False)
    & df_modelo["Altura"].eq(2600)
    & df_modelo["Barrio"].eq("Belgrano")
    & df_modelo["Ambientes"].eq(2)
)
matches = df_modelo.loc[mask]
if len(matches) != 1:
    raise RuntimeError(f"Se esperaba una propiedad de ejemplo y se encontraron {len(matches)}")

row = matches.iloc[[0]]
idx = row.index[0]
x_row = row[features]
precio_publicado = float(row["Precio_USD"].iloc[0])
pred_ridge = float(ridge_model.predict(x_row)[0])
pred_rf = float(rf_model.predict(x_row)[0])

ranking = pd.read_csv(RANKING)
ranking_match = ranking[
    ranking["original_Calle"].astype(str).str.contains("Vuelta De Obligado", case=False, na=False)
    & ranking["original_Altura"].eq(2600)
    & ranking["enriquecida_Barrio"].eq("Belgrano")
    & ranking["imputada_Ambientes"].eq(2)
]
if len(ranking_match) != 1:
    raise RuntimeError(f"El ranking contiene {len(ranking_match)} coincidencias para el ejemplo")

rank = ranking_match.iloc[0]
train_indices = set(df_modelo.index[ns["train_idx"]])
test_indices = set(df_modelo.index[ns["test_idx"]])
particion = "train" if idx in train_indices else "test" if idx in test_indices else "fuera del split"

resultado = {
    "uso": "ejemplo ilustrativo; no es una validacion fuera de muestra",
    "particion_modelo": particion,
    "propiedad": {
        "barrio": "Belgrano",
        "calle": "Vuelta de Obligado",
        "altura": 2600,
        "ambientes": 2,
        "estado": str(rank["imputada_Estado"]),
        "superficie_total_m2": float(rank["imputada_Sup_Total_m2"]),
        "link": str(rank["original_Link"]),
    },
    "ranking": {
        "precio_publicado_usd": precio_publicado,
        "precio_m2_usd": float(rank["Precio_m2"]),
        "precio_m2_comparable_usd": float(rank["Precio_m2_comparable"]),
        "subvaluacion_pct": float(rank["Subvaluacion_%"]),
        "comparables": int(rank["N_comparables"]),
        "indice_oportunidad": float(rank["Indice_oportunidad_flip"]),
    },
    "modelos": {
        "ridge": {
            "prediccion_usd": pred_ridge,
            "diferencia_vs_publicado_pct": 100 * (pred_ridge / precio_publicado - 1),
        },
        "random_forest": {
            "prediccion_usd": pred_rf,
            "diferencia_vs_publicado_pct": 100 * (pred_rf / precio_publicado - 1),
        },
    },
}

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as fh:
    json.dump(resultado, fh, ensure_ascii=False, indent=2)

print("Repro check -> Ridge MAE:", round(ns["evaluacion_ridge"]["MAE_USD"]))
print("Repro check -> RF MAE:", round(ns["evaluacion_rf"]["MAE_USD"]))
print("\n=== EJEMPLO: Belgrano, Vuelta de Obligado 2600 ===")
print(f"Precio publicado : USD {precio_publicado:,.0f}")
print(f"Comparable       : USD {rank['Precio_m2_comparable']:,.0f}/m2")
print(f"Subvaluacion     : {rank['Subvaluacion_%']:.1f}%")
print(f"Ridge predice    : USD {pred_ridge:,.0f} ({resultado['modelos']['ridge']['diferencia_vs_publicado_pct']:+.1f}%)")
print(f"Random Forest    : USD {pred_rf:,.0f} ({resultado['modelos']['random_forest']['diferencia_vs_publicado_pct']:+.1f}%)")
print(f"Particion        : {particion}")
print("Nota             : ejemplo ilustrativo; no es validacion fuera de muestra")
print("\nOK ->", OUT)
