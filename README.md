# 🤖 Algotrix — No-Code AutoML Platform

> From raw data to a trained machine learning model in minutes — no code required.

Algotrix is a full-stack web application that automates the entire machine learning workflow. Just upload a CSV file, and Algotrix handles profiling, cleaning, analysis, model training, and tuning — all through a clean, intuitive interface.

🔗 **Live Demo:** [algotrix.vercel.app](https://algotrix.vercel.app)

---

## ✨ Features

- 📊 **Automated Data Profiling** — Instant insights into rows, columns, types, and missing values
- 🧹 **Intelligent Data Cleaning** — Handles duplicates and missing values automatically
- 📈 **Exploratory Data Analysis (EDA)** — Auto-generated histograms, correlation heatmaps, and more
- 🎯 **Smart Target Suggestion** — Recommends the best column to predict, with scoring
- 🤖 **Multi-Model Training** — Trains and compares multiple ML models using cross-validation
- ⚙️ **Hyperparameter Tuning** — Automatically optimizes the best model
- 📥 **One-Click Model Download** — Export your trained model as a `.pkl` file
- 🔐 **Secure Authentication** — Signup, login, and password reset powered by Supabase

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Motion (animations)

**Backend**
- FastAPI (Python)
- Scikit-learn
- Pandas, NumPy, Matplotlib, Seaborn

**Auth & Database**
- Supabase

**Deployment**
- Frontend → Vercel
- Backend → Hugging Face Spaces

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Frontend Setup
```bash

cd frontend
npm install
npm run dev
Create a .env.local file in the frontend folder:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000

Backend Setup
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
The backend will run at http://localhost:8000.
🧠 What I Learned
Building Algotrix was a complete end-to-end journey — designing the UI, engineering the ML pipeline, implementing secure authentication, and deploying both the frontend and backend to production. The biggest takeaway was learning how to ship a real, production-ready product, not just a feature.

📬 Contact
Muhammad Tayyab Zunair
LinkedIn: www.linkedin.com/in/mtayyabzunair
Email: mtayyabzunair@gmail.com
⭐ If you found this project interesting, consider giving it a star!
