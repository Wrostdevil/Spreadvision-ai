from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(
    title="SpreadVision.ai API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model safely
try:
    model = joblib.load("model/disease_model.pkl")
except Exception as e:
    model = None
    print("⚠️ Model loading failed:", e)

# Input schema
class WeatherInput(BaseModel):
    rainfall: float
    temperature: float
    humidity: float
    stagnant_water: float

@app.get("/")
def root():
    return {"message": "SpreadVision.ai backend is running"}


# 🔹 Prediction API
@app.post("/predict-risk")
def predict_risk(data: WeatherInput):

    if model is None:
        return {"error": "Model not loaded properly"}

    features = np.array([[ 
        data.rainfall,
        data.temperature,
        data.humidity,
        data.stagnant_water
    ]])

    prediction = model.predict(features)[0]

    risk_map = {
        0: "LOW",
        1: "MEDIUM",
        2: "HIGH"
    }

    return {
        "risk_level": risk_map[int(prediction)]
    }


# 🔹 Preventive Actions API
@app.get("/preventive-actions")
def preventive_actions(risk: str):

    actions = {
        "LOW": [
            "Maintain cleanliness",
            "Avoid water accumulation",
            "Stay aware of surroundings"
        ],
        "MEDIUM": [
            "Use mosquito repellents",
            "Clean nearby stagnant water",
            "Wear protective clothing"
        ],
        "HIGH": [
            "Remove stagnant water immediately",
            "Use mosquito nets",
            "Community fogging required",
            "Seek medical attention if symptoms appear"
        ]
    }

    return {
        "risk_level": risk.upper(),
        "recommended_actions": actions.get(risk.upper(), [])
    }