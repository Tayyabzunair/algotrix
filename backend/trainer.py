import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_absolute_error, mean_squared_error, r2_score,
)


def detect_problem_type(y):
    """Decide if this is a classification or regression problem."""
    # Text target is always classification
    if y.dtype == "object":
        return "classification"

    unique_count = y.nunique()
    total_count = len(y)
    all_whole_numbers = (y.dropna() % 1 == 0).all()

    # If values have decimals (e.g. 3.5, 72.1) -> definitely regression
    if not all_whole_numbers:
        return "regression"

    # If most values are unique, it's continuous -> regression (e.g. salary)
    if unique_count / total_count > 0.5:
        return "regression"

    # Few repeated whole-number values -> classification (e.g. ratings 1-5)
    if unique_count <= 10:
        return "classification"

    return "regression"


def train_models(file_path: str, target_column: str):
    # 1. Load the dataset
    df = pd.read_csv(file_path)

    # 2. Safety check
    if target_column not in df.columns:
        return {"error": f"Target column '{target_column}' not found in dataset."}

    # 3. Drop rows where the target is missing
    df = df.dropna(subset=[target_column])

    # 4. Separate features (X) and target (y)
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # 5. Encode text feature columns into numbers
    for col in X.columns:
        if X[col].dtype == "object":
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))

    # 6. Detect the problem type
    problem_type = detect_problem_type(y)

    # 7. Encode the target ONLY for classification
    if problem_type == "classification" and y.dtype == "object":
        target_encoder = LabelEncoder()
        y = target_encoder.fit_transform(y.astype(str))

    # 8. Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 9. Choose models based on problem type
    if problem_type == "classification":
        models = {
            "Logistic Regression": LogisticRegression(max_iter=1000),
            "Decision Tree": DecisionTreeClassifier(random_state=42),
            "Random Forest": RandomForestClassifier(random_state=42),
        }
        scoring = "accuracy"
    else:
        models = {
            "Linear Regression": LinearRegression(),
            "Decision Tree": DecisionTreeRegressor(random_state=42),
            "Random Forest": RandomForestRegressor(random_state=42),
        }
        scoring = "r2"

    # 10. Set up cross-validation strategy based on problem type
    if problem_type == "classification":
        smallest_class = pd.Series(y).value_counts().min()
        cv_folds = min(5, smallest_class)
        if cv_folds < 2:
            cv_folds = 2
        cv_strategy = cv_folds
    else:
        # Regression: use simple KFold (does not require members per class)
        cv_folds = min(5, len(X_train))
        if cv_folds < 2:
            cv_folds = 2
        cv_strategy = KFold(n_splits=cv_folds, shuffle=True, random_state=42)

    # 11. Train each model and score it
    results = []
    best_model_name = None
    best_score = -999999

    for name, model in models.items():
        model.fit(X_train, y_train)

        cv_scores = cross_val_score(model, X, y, cv=cv_strategy, scoring=scoring)
        cv_score = cv_scores.mean()

        if problem_type == "classification":
            train_score = accuracy_score(y_train, model.predict(X_train))
        else:
            train_score = r2_score(y_train, model.predict(X_train))

        results.append({
            "model": name,
            "cv_score": round(float(cv_score) * 100, 2),
            "train_score": round(float(train_score) * 100, 2),
        })

        if cv_score > best_score:
            best_score = cv_score
            best_model_name = name

    # 12. Detailed metrics for the BEST model (still trained on X_train only)
    best_predictions = models[best_model_name].predict(X_test)

    if problem_type == "classification":
        detailed_metrics = {
            "accuracy": round(float(accuracy_score(y_test, best_predictions)) * 100, 2),
            "precision": round(float(precision_score(y_test, best_predictions, average="weighted", zero_division=0)) * 100, 2),
            "recall": round(float(recall_score(y_test, best_predictions, average="weighted", zero_division=0)) * 100, 2),
            "f1_score": round(float(f1_score(y_test, best_predictions, average="weighted", zero_division=0)) * 100, 2),
        }
    else:
        mae = mean_absolute_error(y_test, best_predictions)
        mse = mean_squared_error(y_test, best_predictions)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, best_predictions)
        detailed_metrics = {
            "mae": round(float(mae), 2),
            "mse": round(float(mse), 2),
            "rmse": round(float(rmse), 2),
            "r2_score": round(float(r2), 4),
        }

    # 13. Re-train best model on ALL data and save as .pkl
    best_model = models[best_model_name]
    best_model.fit(X, y)
    os.makedirs("trained_models", exist_ok=True)
    model_filename = "trained_models/best_model.pkl"
    joblib.dump(best_model, model_filename)

    # 14. Return the final report
    return {
        "problem_type": problem_type,
        "target_column": target_column,
        "rows_used": len(df),
        "features_used": list(X.columns),
        "results": results,
        "best_model": best_model_name,
        "best_score": round(float(best_score) * 100, 2),
        "detailed_metrics": detailed_metrics,
        "model_file": model_filename,
    }
