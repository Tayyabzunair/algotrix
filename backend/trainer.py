import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score


def train_models(file_path: str, target_column: str):
    # 1. Load the cleaned dataset
    df = pd.read_csv(file_path)

    # 2. Basic safety check: does the target column exist?
    if target_column not in df.columns:
        return {"error": f"Target column '{target_column}' not found in dataset."}

    # 3. Drop rows where the target itself is missing (we cannot learn from those)
    df = df.dropna(subset=[target_column])

    # 4. Separate features (X) from target (y)
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # 5. Encode any text columns inside the features into numbers
    encoders = {}
    for col in X.columns:
        if X[col].dtype == "object":
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            encoders[col] = le

    # 6. Encode the target column if it is text
    target_encoder = None
    if y.dtype == "object":
        target_encoder = LabelEncoder()
        y = target_encoder.fit_transform(y.astype(str))

    # 7. Split data: 80% for training, 20% for testing
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 8. Define the models we want to try
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Random Forest": RandomForestClassifier(random_state=42),
    }

    # 9. Train each model and measure its accuracy on the test set
    results = []
    best_model_name = None
    best_accuracy = -1

    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)

        results.append({
            "model": name,
            "accuracy": round(float(accuracy) * 100, 2),
        })

        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_model_name = name

    # 9b. Re-train the best model on ALL data and save it as a .pkl file
    best_model = models[best_model_name]
    best_model.fit(X, y)   # train on the full dataset now, not just 80%

    # Make sure a folder exists to store trained models
    os.makedirs("trained_models", exist_ok=True)

    model_filename = "trained_models/best_model.pkl"
    joblib.dump(best_model, model_filename)

    # 10. Build and return the final report
    return {
        "target_column": target_column,
        "rows_used": len(df),
        "features_used": list(X.columns),
        "results": results,
        "best_model": best_model_name,
        "best_accuracy": round(float(best_accuracy) * 100, 2),
        "model_file": model_filename,
    }
