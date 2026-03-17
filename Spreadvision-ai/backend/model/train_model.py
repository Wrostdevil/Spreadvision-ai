import pandas as pd
from xgboost import XGBClassifier
import joblib

# Load dataset (correct path)
df = pd.read_csv("../data/disease_weather_dataset.csv")

X = df[["rainfall", "temperature", "humidity", "stagnant_water"]]
y = df["risk"]

# Train model
model = XGBClassifier(eval_metric='mlogloss')

model.fit(X, y)

# Save model (correct path)
joblib.dump(model, "disease_model.pkl")

print("Model trained and saved successfully")