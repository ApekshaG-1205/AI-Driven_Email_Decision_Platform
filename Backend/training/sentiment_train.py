# from sklearn.linear_model import LogisticRegression
# from sklearn.model_selection import train_test_split
# from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
# from sklearn.feature_extraction.text import TfidfVectorizer
# from utils import load_data
# import joblib
# import os

# # Load data
# df = load_data("processed_data.csv")

# # Define X and y
# X = df["text"]
# y = df["sentiment"]

# # SPlit data
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y,
#     test_size=0.2,
#     random_state=42,
#     stratify=y
# )

# # Vectorize AFTER split (prevents leakage)
# vectorizer = TfidfVectorizer(
#     max_features=5000,
#     ngram_range=(1, 2)  # big improvement
# )

# X_train_vec = vectorizer.fit_transform(X_train)
# X_test_vec = vectorizer.transform(X_test)

# # Model
# model = LogisticRegression(
#     max_iter=1000,
#     solver="lbfgs",     # it is better for multiclass problems
#     class_weight="balanced"
# )

# model.fit(X_train_vec, y_train)

# # Predictions
# y_pred = model.predict(X_test_vec)

# # Evaluation
# print("Sentiment Model Report:")
# print(classification_report(y_test, y_pred))
# print("Accuracy:", accuracy_score(y_test, y_pred))
# print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# joblib.dump(model, "../ml_models/sentiment.pkl")
# joblib.dump(vectorizer, "../ml_models/sentiment_vectorizer.pkl")

# # Save
# # model_dir = "../ml_models"
# # os.makedirs(model_dir, exist_ok=True)

# # joblib.dump(model, os.path.join(model_dir, "sentiment.pkl"))
# # joblib.dump(vectorizer, os.path.join(model_dir, "sentiment_vectorizer.pkl"))

# print("Model saved successfully ")


from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from utils import load_data
import joblib

# Load data
df = load_data("processed_data.csv")

# Define X and y
X = df["text"]
y = df["sentiment"]

# Split FIRST (important)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Vectorize AFTER split (prevents leakage)
vectorizer = TfidfVectorizer(
    max_features=5000,
    ngram_range=(1, 2),
    min_df = 5
)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# Model
model = LogisticRegression(
    max_iter=1000,
    solver="lbfgs",
    class_weight="balanced"
)


# ADD CROSS‑VALIDATION
from sklearn.model_selection import StratifiedKFold, cross_val_score

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

cv_scores = cross_val_score(
    model,
    X_train_vec,
    y_train,
    cv=cv,
    scoring="f1_macro"
)

print("\nCross‑Validation F1 scores:", cv_scores)
print(" Mean CV F1:", cv_scores.mean())

# Train final model on full training set

model.fit(X_train_vec, y_train)

# Predictions
y_pred = model.predict(X_test_vec)

# Evaluation
print("\nSentiment Model Report:")
print(classification_report(y_test, y_pred))
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

# Save
joblib.dump(model, "../ml_models/sentiment.pkl")
joblib.dump(vectorizer, "../ml_models/sentiment_vectorizer.pkl")

print("\nModel saved successfully ")