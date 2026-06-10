import pandas as pd


def profile_dataset(file_path: str):
    # Read the CSV file into a pandas DataFrame
    df = pd.read_csv(file_path)

    # Basic shape: number of rows and columns
    num_rows = len(df)
    num_columns = len(df.columns)

    # Information about each column
    columns_info = []
    for col in df.columns:
        columns_info.append({
            "name": col,
            "dtype": str(df[col].dtype),
            "missing_values": int(df[col].isnull().sum()),
            "unique_values": int(df[col].nunique()),
        })

    # Count duplicate rows
    duplicate_rows = int(df.duplicated().sum())

    # Build the final report
    report = {
        "num_rows": num_rows,
        "num_columns": num_columns,
        "duplicate_rows": duplicate_rows,
        "columns": columns_info,
    }

    return report
