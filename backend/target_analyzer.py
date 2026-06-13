import pandas as pd


def analyze_columns(file_path: str):
    df = pd.read_csv(file_path)
    total_rows = len(df)

    results = []

    for col in df.columns:
        unique_count = int(df[col].nunique())
        missing_count = int(df[col].isnull().sum())
        missing_ratio = missing_count / total_rows if total_rows > 0 else 0
        is_numeric = pd.api.types.is_numeric_dtype(df[col])
        unique_ratio = unique_count / total_rows if total_rows > 0 else 0

        score = 0
        reason = ""
        problem_type = "unknown"

        # Rule 1: Almost all values unique -> looks like an ID, bad target
        if unique_ratio > 0.9 and unique_count > 20:
            score = 5
            reason = "Almost all values are unique (looks like an identifier/ID). Not suitable as a target."

        # Rule 2: Only one unique value -> nothing to predict
        elif unique_count <= 1:
            score = 5
            reason = "This column has only one value. There is nothing to predict."

        # Rule 3: Text/categorical with few categories -> BEST for classification
        elif not is_numeric and unique_count <= 20:
            score = 95
            problem_type = "classification"
            reason = f"Categorical column with {unique_count} distinct classes — ideal target for a classification problem."

        # Rule 4: Numeric column -> usually a feature, but could be a target
        elif is_numeric:
            if unique_count <= 10:
                # Few distinct numbers -> could be classification labels (0/1, ratings)
                score = 60
                problem_type = "classification"
                reason = f"Numeric column with only {unique_count} distinct values — could be classification labels, but it may also be a feature."
            else:
                # Many varied numbers -> regression candidate, but often a feature
                score = 45
                problem_type = "regression"
                reason = f"Numeric column with {unique_count} varied values — possible regression target, but often used as an input feature."

        # Rule 5: Text with too many categories -> usually a feature/free text
        else:
            score = 25
            reason = f"Has {unique_count} categories (too many) — likely a feature or free text, not a target."

        # Penalty: too many missing values lowers suitability
        if missing_ratio > 0.3:
            score = max(score - 30, 5)
            reason += f" Also, {round(missing_ratio * 100)}% of values are missing, which lowers reliability."

        results.append({
            "name": col,
            "score": score,
            "problem_type": problem_type,
            "unique_values": unique_count,
            "missing_values": missing_count,
            "reason": reason,
        })


    # Sort by score (highest first) so the best target is on top
    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "recommended_target": results[0]["name"] if results else None,
        "columns": results,
    }
