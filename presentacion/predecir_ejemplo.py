"""Reproduce fielmente el modelo del notebook 10 y predice el precio de la
propiedad usada como ejemplo (Palermo, Julian Alvarez 2600)."""
import json, os, warnings
warnings.filterwarnings("ignore")
import matplotlib
matplotlib.use("Agg")

BASE = os.path.dirname(os.path.abspath(__file__))
NB = os.path.join(BASE, "..", "notebooks", "10_Prediccion.ipynb")
nb = json.load(open(NB, encoding="utf-8"))
cells = {i: "".join(c["source"]) for i, c in enumerate(nb["cells"]) if c["cell_type"] == "code"}

# trabajar desde notebooks/ para que las rutas relativas funcionen
os.chdir(os.path.join(BASE, "..", "notebooks"))
ns = {}
# imports, df_modelo, features (X,y), split, evaluar, ridge, rf
for idx in [2, 4, 6, 8, 10, 12, 17]:
    exec(cells[idx], ns)

ridge_model = ns["ridge_model"]; rf_model = ns["rf_model"]
df_modelo = ns["df_modelo"]; features = ns["features"]
print("Repro check -> Ridge MAE:", round(ns["evaluacion_ridge"]["MAE_USD"]),
      "| RF MAE:", round(ns["evaluacion_rf"]["MAE_USD"]))

# localizar la propiedad ejemplo
m = df_modelo[df_modelo["Calle"].astype(str).str.contains("Alvarez", case=False, na=False)
              & (df_modelo["Altura"] == 2600) & (df_modelo["Ambientes"] == 2)]
print("\nFilas que matchean:", len(m))
row = m.iloc[[0]]
Xrow = row[features]
precio_pub = float(row["Precio_USD"].iloc[0])
pred_ridge = float(ridge_model.predict(Xrow)[0])
pred_rf = float(rf_model.predict(Xrow)[0])

print("\n=== EJEMPLO: Palermo, Julian Alvarez 2600 ===")
print(f"Precio publicado : USD {precio_pub:,.0f}")
print(f"Ridge predice    : USD {pred_ridge:,.0f}  ({(pred_ridge/precio_pub-1)*100:+.1f}% vs publicado)")
print(f"Random Forest    : USD {pred_rf:,.0f}  ({(pred_rf/precio_pub-1)*100:+.1f}% vs publicado)")
print(f"\nEn train? -> {row.index[0] in set(df_modelo.index[ns['train_idx']])}")
