FROM python:3.11-slim

WORKDIR /app

# Requirements install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Saara backend code copy karo
COPY . .

# HF Spaces port 7860 use karta hai
EXPOSE 7860

# FastAPI start
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
