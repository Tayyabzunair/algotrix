import io
import base64

import matplotlib
matplotlib.use("Agg")  # GUI ke bina charts banane ke liye (server par zaroori)
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd


def _fig_to_base64(fig):
    """Ek matplotlib figure ko base64 string mein convert karta hai."""
    buf = io.BytesIO()
    fig.savefig(buf, format="png", bbox_inches="tight", dpi=80)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)  # memory free karo
    return f"data:image/png;base64,{img_base64}"


def generate_eda(file_path: str):
    df = pd.read_csv(file_path)

    charts = []

    # Sirf numeric columns lo (histograms + correlation ke liye)
    numeric_df = df.select_dtypes(include=["number"])

    # 1. HISTOGRAMS — har numeric column ki distribution
    for col in numeric_df.columns:
        fig, ax = plt.subplots(figsize=(5, 3))
        sns.histplot(df[col].dropna(), kde=True, ax=ax, color="#3B82F6")
        ax.set_title(f"Distribution of {col}")
        charts.append({
            "title": f"Distribution of {col}",
            "type": "histogram",
            "image": _fig_to_base64(fig),
        })

    # 2. CORRELATION HEATMAP — kab banayein? jab 2+ numeric columns hon
    if len(numeric_df.columns) >= 2:
        fig, ax = plt.subplots(figsize=(6, 5))
        corr = numeric_df.corr()
        sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f", ax=ax)
        ax.set_title("Correlation Heatmap")
        charts.append({
            "title": "Correlation Heatmap",
            "type": "heatmap",
            "image": _fig_to_base64(fig),
        })

    # 3. MISSING VALUES BAR — kis column mein kitni missing
    missing = df.isna().sum()
    missing = missing[missing > 0]  # sirf wo columns jisme missing hai
    if len(missing) > 0:
        fig, ax = plt.subplots(figsize=(5, 3))
        missing.plot(kind="bar", ax=ax, color="#EF4444")
        ax.set_title("Missing Values per Column")
        ax.set_ylabel("Count")
        charts.append({
            "title": "Missing Values per Column",
            "type": "missing",
            "image": _fig_to_base64(fig),
        })

    return {"charts": charts}
