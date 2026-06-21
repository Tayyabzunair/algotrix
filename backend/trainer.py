import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split, cross_val_score, KFold, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    mean_absolute_error, mean_squared_error, r2_score,
)


def detect_problem_type(y):
    if y.dtype == "object":
        return "classification"
    unique_count = y.nunique()
    total_count = len(y)
    all_whole_numbers = (y.dropna() % 1 == 0).all()
    if not all_whole_numbers:
        return "regression"
    if unique_count / total_count > 0.5:
        return "regression"
    if unique_count <= 10:
        return "classification"
    return "regression"


# Hyperparameter grids for each model.
# Keys use "model__" prefix because the model is a step named "model" inside the Pipeline.
PARAM_GRIDS = {
    "Logistic Regression": {"model__C": [0.1, 1, 10]},
    "Linear Regression": {},  # nothing useful to tune
    "Decision Tree": {"model__max_depth": [3, 5, 10, None]},
    "Random Forest": {
        "model__n_estimators": [50, 100, 200],
        "model__max_depth": [5, 10, None],
    },
}


def train_models(file_path: str, target_column: str):
    # 1. Load
    df = pd.read_csv(file_path)

    # 2. Check target
    if target_column not in df.columns:
        return {"error": f"Target column '{target_column}' not found in dataset."}

    # 3. Drop rows with missing target
    df = df.dropna(subset=[target_column])

    # 4. X / y
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # 5. Problem type
    problem_type = detect_problem_type(y)

    # 6. Encode target for classification (if text)
    if problem_type == "classification" and y.dtype == "object":
        from sklearn.preprocessing import LabelEncoder
        target_encoder = LabelEncoder()
        y = pd.Series(target_encoder.fit_transform(y), index=y.index)

    # 7. Numeric vs categorical
    numeric_features = X.select_dtypes(include=["number"]).columns.tolist()
    categorical_features = X.select_dtypes(include=["object"]).columns.tolist()

    # 8. Preprocessor (impute -> scale / one-hot)
    numeric_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ])
    categorical_pipeline = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore")),
    ])
    preprocessor = ColumnTransformer(transformers=[
        ("num", numeric_pipeline, numeric_features),
        ("cat", categorical_pipeline, categorical_features),
    ])

    # 9. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # 10. Models + scoring
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

    # 11. CV strategy
    if problem_type == "classification":
        smallest_class = pd.Series(y).value_counts().min()
        cv_folds = min(5, smallest_class)
        if cv_folds < 2:
            cv_folds = 2
        cv_strategy = cv_folds
    else:
        cv_folds = min(5, len(X_train))
        if cv_folds < 2:
            cv_folds = 2
        cv_strategy = KFold(n_splits=cv_folds, shuffle=True, random_state=42)

    # 12. Train + evaluate each model (default settings) to find the best
    results = []
    best_score = -999999
    best_model_name = None

    for name, model in models.items():
        pipe = Pipeline(steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ])
        pipe.fit(X_train, y_train)
        cv_scores = cross_val_score(pipe, X, y, cv=cv_strategy, scoring=scoring)
        cv_score = cv_scores.mean()

        if problem_type == "classification":
            train_score = accuracy_score(y_train, pipe.predict(X_train))
        else:
            train_score = r2_score(y_train, pipe.predict(X_train))

        results.append({
            "model": name,
            "cv_score": round(float(cv_score) * 100, 2),
            "train_score": round(float(train_score) * 100, 2),
        })

        if cv_score > best_score:
            best_score = cv_score
            best_model_name = name

    # 13. HYPERPARAMETER TUNING on the best model only (for speed)
    default_score = round(float(best_score) * 100, 2)
    param_grid = PARAM_GRIDS.get(best_model_name, {})

    tuned_pipe = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("model", models[best_model_name]),
    ])

    if param_grid:
        grid = GridSearchCV(
            tuned_pipe,
            param_grid=param_grid,
            cv=cv_strategy,
            scoring=scoring,
        )
        grid.fit(X, y)
        best_pipe = grid.best_estimator_
        tuned_score = round(float(grid.best_score_) * 100, 2)
        best_params = {k.replace("model__", ""): v for k, v in grid.best_params_.items()}
    else:
        # Nothing to tune (e.g. Linear Regression)
        tuned_pipe.fit(X, y)
        best_pipe = tuned_pipe
        tuned_score = default_score
        best_params = {}

    # 14. Detailed metrics on the test set (using tuned best model)
    best_pipe.fit(X_train, y_train)
    predictions = best_pipe.predict(X_test)

    if problem_type == "classification":
        detailed_metrics = {
            "accuracy": round(accuracy_score(y_test, predictions) * 100, 2),
            "precision": round(precision_score(y_test, predictions, average="weighted", zero_division=0) * 100, 2),
            "recall": round(recall_score(y_test, predictions, average="weighted", zero_division=0) * 100, 2),
            "f1_score": round(f1_score(y_test, predictions, average="weighted", zero_division=0) * 100, 2),
        }
    else:
        mse = mean_squared_error(y_test, predictions)
        detailed_metrics = {
            "mae": round(mean_absolute_error(y_test, predictions), 2),
            "mse": round(mse, 2),
            "rmse": round(mse ** 0.5, 2),
            "r2_score": round(r2_score(y_test, predictions), 4),
        }

    # 15. Retrain tuned best model on ALL data and save
    best_pipe.fit(X, y)
    os.makedirs("trained_models", exist_ok=True)
    model_filename = "trained_models/best_model.pkl"
    joblib.dump(best_pipe, model_filename)

    # 16. Return report (now with tuning info)
    return {
        "problem_type": problem_type,
        "target_column": target_column,
        "rows_used": len(df),
        "features_used": list(X.columns),
        "results": results,
        "best_model": best_model_name,
        "best_score": tuned_score,
        "tuning": {
            "default_score": default_score,
            "tuned_score": tuned_score,
            "best_params": best_params,
        },
        "detailed_metrics": detailed_metrics,
        "model_file": model_filename,
    }
