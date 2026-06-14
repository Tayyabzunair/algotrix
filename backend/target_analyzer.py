import pandas as pd


def analyze_columns(file_path: str):
    df = pd.read_csv(file_path)
    total_rows = len(df)

    results = []
    for col in df.columns:
        unique_count = df[col].nunique()
        missing_count = int(df[col].isna().sum())
        missing_ratio = missing_count / total_rows if total_rows > 0 else 0
        is_numeric = pd.api.types.is_numeric_dtype(df[col])
        unique_ratio = unique_count / total_rows if total_rows > 0 else 0

        # Scoring rules
        if unique_ratio > 0.9 and unique_count > 20:
            score = 5
            problem_type = "unknown"
            reason = "Almost all values are unique (looks like an identifier/ID). Not suitable as a target."
        elif unique_count <= 1:
            score = 5
            problem_type = "unknown"
            reason = "Only one value (no variation to predict)."
        elif not is_numeric and unique_count <= 20:
            score = 95
            problem_type = "classification"
            reason = f"Categorical column with {unique_count} distinct classes — ideal target for a classification problem."
        elif is_numeric:
            if unique_count <= 10:
                score = 60
                problem_type = "classification"
                reason = f"Numeric column with only {unique_count} distinct values — could be classification labels, but it may also be a feature."
            else:
                score = 45
                problem_type = "regression"
                reason = f"Numeric column with {unique_count} distinct values — could be a regression target."
        else:
            score = 25
            problem_type = "unknown"
            reason = "Text column with many categories — likely a feature, not a target."

        # Penalty for too many missing values
        if missing_ratio > 0.3:
            score = max(5, score - 30)
            reason += " Many missing values reduce its suitability."

        results.append({
            "name": col,
            "score": score,
            "problem_type": problem_type,
            "unique_values": unique_count,
            "missing_values": missing_count,
            "reason": reason,
        })

    # Sort by score (highest first)
    results.sort(key=lambda c: c["score"], reverse=True)

    recommended_target = results[0]["name"] if results and results[0]["score"] >= 50 else None

    return {
        "recommended_target": recommended_target,
        "columns": results,
    }
