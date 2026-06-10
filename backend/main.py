from fastapi import FastAPI, UploadFile, File
from profiler import profile_dataset

app = FastAPI()


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
