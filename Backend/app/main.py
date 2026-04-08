from fastapi import FastAPI
from pydantic import BaseModel
import joblib

app = FastAPI()

# # Load model once
# model = joblib.load("../ml_models/sentiment.pkl")
# vectorizer = joblib.load("../ml_models/sentiment_vectorizer.pkl")

class EmailReq(BaseModel):
    email: str


@app.get("/")
def home():
    return {"message": "Welcome to Email Intelligence System APIs"}


@app.get("/dashboard")
def dashboard():
    return {"message": "Visualizes data depending upon the emails data"}


@app.post("/sentiment")
def sentiment_analysis(req: EmailReq):
    model = joblib.load("../ml_models/sentiment.pkl")
    vectorizer = joblib.load("../ml_models/sentiment_vectorizer.pkl")

    text = req.email

    text_vec = vectorizer.transform([text])

    prediction = model.predict(text_vec)[0]

    return {"email": text, "sentiment": prediction}

@app.post("/urgency")
def urgency_analysis(req: EmailReq):
    model = joblib.load("../ml_models/urgency.pkl")
    vectorizer = joblib.load("../ml_models/urgency_vectorizer.pkl")

    text = req.email
    
    
