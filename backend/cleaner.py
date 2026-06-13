import pandas as pd


def clean_dataset(file_path: str):
    # Read the CSV file
    df = pd.read_csv(file_path)

    # Keep track of what we did (transparency)
    actions = []

    # 1) Remove duplicate rows
    duplicates_before = int(df.duplicated().sum())
    if duplicates_before > 0:
        df = df.drop_duplicates()
        actions.append(f"Removed {duplicates_before} duplicate row(s).")

    # 2) Handle missing values, column by column
    for col in df.columns:
        missing_count = int(df[col].isnull().sum())
        if missing_count == 0:
            continue  # nothing to fix in this column

        if pd.api.types.is_numeric_dtype(df[col]):
            # Numeric column -> fill with median
            median_value = df[col].median()
            df[col] = df[col].fillna(median_value)
            actions.append(
                f"Column '{col}': filled {missing_count} missing value(s) with median ({median_value})."
            )
        else:
            # Text/categorical column -> fill with mode (most common value)
            mode_value = df[col].mode()[0]
            df[col] = df[col].fillna(mode_value)
            actions.append(
                f"Column '{col}': filled {missing_count} missing value(s) with most common value ('{mode_value}')."
            )

    # Save the cleaned dataset
    cleaned_path = "cleaned_dataset.csv"
    df.to_csv(cleaned_path, index=False)

    # Build the cleaning report
    report = {
        "actions": actions,
        "rows_after_cleaning": len(df),
        "columns_after_cleaning": len(df.columns),
        "cleaned_file": cleaned_path,
    }

    return report
