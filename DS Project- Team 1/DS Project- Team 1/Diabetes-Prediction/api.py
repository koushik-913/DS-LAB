from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from data.config import thresholds

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import shap

app = FastAPI(title="Diabetes Prediction API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = joblib.load('model.pkl')
data = pd.read_csv('datasets/diabetes.csv')
X = data[['Pregnancies', 'Glucose', 'Insulin', 'BMI', 'Age']]
y = data['Outcome']
y_score = model.predict_proba(X)[:, 1]
y_pred = (y_score >= thresholds).astype(int)

precision_val = round(precision_score(y, y_pred) * 100, 2)
p_label = "Optimal" if precision_val >= 90 else ("Good" if precision_val >= 80 else ("Moderate" if precision_val >= 60 else "Poor"))

global_metrics = {
    "accuracy": round(accuracy_score(y, y_pred) * 100, 2),
    "precision": precision_val,
    "precision_label": p_label,
    "recall": round(recall_score(y, y_pred) * 100, 2),
    "f1": round(f1_score(y, y_pred) * 100, 2),
    "roc_auc": round(roc_auc_score(y, y_score) * 100, 2)
}
X_background = shap.sample(X, 50)

def predict_fn(x):
    df = pd.DataFrame(x, columns=['Pregnancies', 'Glucose', 'Insulin', 'BMI', 'Age'])
    return model.predict_proba(df)[:, 1]

explainer = shap.KernelExplainer(predict_fn, X_background)

class PredictionRequest(BaseModel):
    Pregnancies: float
    Glucose: float
    Insulin: float
    BMI: float
    Age: float

@app.post("/predict")
def predict(req: PredictionRequest):
    input_data = pd.DataFrame([[
        req.Pregnancies,
        req.Glucose,
        req.Insulin,
        req.BMI,
        req.Age
    ]], columns=['Pregnancies', 'Glucose', 'Insulin', 'BMI', 'Age'])
    
    prediction = model.predict_proba(input_data)[:, 1][0]
    
    is_diabetes = prediction >= thresholds
    return {
        "probability": float(round(prediction * 100, 2)),
        "is_diabetes": bool(is_diabetes)
    }

@app.get("/metrics")
def metrics():
    return global_metrics

@app.post("/explain")
def explain(req: PredictionRequest):
    input_data = pd.DataFrame([[
        req.Pregnancies,
        req.Glucose,
        req.Insulin,
        req.BMI,
        req.Age
    ]], columns=['Pregnancies', 'Glucose', 'Insulin', 'BMI', 'Age'])
    
    prediction = model.predict_proba(input_data)[:, 1][0]
    is_diabetes = prediction >= thresholds
    
    shap_values = explainer.shap_values(input_data)
    sv = shap_values[0] if isinstance(shap_values, list) else shap_values
    if hasattr(sv, "shape") and len(sv.shape) == 2:
        sv = sv[0]
        
    return {
        "probability": float(round(prediction * 100, 2)),
        "is_diabetes": bool(is_diabetes),
        "shap_values": {
            "Pregnancies": float(sv[0]),
            "Glucose": float(sv[1]),
            "Insulin": float(sv[2]),
            "BMI": float(sv[3]),
            "Age": float(sv[4])
        },
        "base_value": float(explainer.expected_value[1] if isinstance(explainer.expected_value, (list, tuple)) else explainer.expected_value)
    }

from fastapi.responses import RedirectResponse

@app.get("/")
def read_root():
    return RedirectResponse(url="/predict.html")
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
