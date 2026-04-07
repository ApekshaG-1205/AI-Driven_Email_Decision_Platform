# import pandas as pd
# from pathlib import Path


# def load_data(filename: str) -> pd.DataFrame:
#     """Load a CSV file by name from the current models directory."""
#     base_dir = Path(__file__).resolve().parent
#     data_path = base_dir / filename
#     if not data_path.is_file():
#         raise FileNotFoundError(f"Data file not found: {data_path}")
#     return pd.read_csv(data_path)


import re
import joblib
import pandas as pd

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'\W', ' ', text)
    return text.strip()

def load_data(path):
    df = pd.read_csv(path)
    df = df.dropna(subset=["text"])
    df["text"] = df["text"].apply(clean_text)
    return df

def save_model(model, vectorizer, name):
    joblib.dump(model, f"ml/models/{name}.pkl")
    joblib.dump(vectorizer, f"ml/models/{name}_vectorizer.pkl")