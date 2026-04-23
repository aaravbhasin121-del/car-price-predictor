from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("car_price_model.pkl")

class CarInput(BaseModel):
    brand: int
    model_encoded: int
    age: int
    km_driven: float
    transmission: int
    owner: int
    fuel_type: int

@app.get("/")
def home():
    return {"message": "Car Price Prediction API is running"}

@app.post("/predict")
def predict(data: CarInput):
    features = [[
        data.brand,
        data.model_encoded,
        data.age,
        data.km_driven,
        data.transmission,
        data.owner,
        data.fuel_type
    ]]
    prediction = model.predict(features)
    return {"predicted_price": round(float(prediction[0]), 2)}