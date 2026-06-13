from fastapi import FastAPI, UploadFile, File, Form
from profiler import profile_dataset
from cleaner import clean_dataset
from target_analyzer import analyze_columns
from trainer import train_models
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow the frontend (port 3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Algotrix backend is running!"}


@app.get("/profile-test")
def profile_test():
    report = profile_dataset("sample.csv")
    return report


@app.post("/profile")
async def profile(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    contents = await file.read()
    with open("temp_upload.csv", "wb") as f:
        f.write(contents)

    # Profile the saved file
    report = profile_dataset("temp_upload.csv")
    return report


@app.post("/clean")
async def clean(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    contents = await file.read()
    with open("temp_clean.csv", "wb") as f:
        f.write(contents)

    # Clean the dataset
    report = clean_dataset("temp_clean.csv")
    return report


@app.post("/analyze-target")
async def analyze_target(file: UploadFile = File(...)):
    contents = await file.read()
    with open("temp_target.csv", "wb") as f:
        f.write(contents)

    result = analyze_columns("temp_target.csv")
    return result
@app.post("/train")
async def train(file: UploadFile = File(...), target_column: str = Form(...)):
    contents = await file.read()
    with open("temp_train.csv", "wb") as f:
        f.write(contents)
    report = train_models("temp_train.csv", target_column)
    return report
