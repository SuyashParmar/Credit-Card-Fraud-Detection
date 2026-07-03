from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os

app = FastAPI(title="Credit Card Fraud Detection API")

# Setup CORS to allow the frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Determine the path to the model relative to this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'model.pkl')

# Load the model on startup
try:
    with open(MODEL_PATH, 'rb') as file:
        model = pickle.load(file)
except Exception as e:
    model = None
    print(f"Failed to load model: {e}")

class TransactionInput(BaseModel):
    # We will accept a comma-separated string of the 29 features
    payload: str

@app.post("/predict")
async def predict_fraud(transaction: TransactionInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded.")
    
    try:
        # Split the comma-separated string into a list of floats
        input_list = transaction.payload.split(',')
        if len(input_list) != 29:
            raise HTTPException(status_code=400, detail=f"Expected 29 features, got {len(input_list)}")
            
        features = np.asarray(input_list, dtype=np.float64)
        features_reshaped = features.reshape(1, -1)
        
        # Make prediction
        prediction_value = model.predict(features_reshaped)[0]
        
        # Get probabilities if the model supports it
        probability = None
        if hasattr(model, "predict_proba"):
            proba_arr = model.predict_proba(features_reshaped)
            probability = float(np.max(proba_arr[0]))
        
        result = "Fraudulent" if prediction_value == 1 else "Legitimate"
        
        return {
            "prediction": result,
            "probability": probability,
            "status": "success"
        }
        
    except ValueError:
        raise HTTPException(status_code=400, detail="All input features must be valid numbers.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}
