"""
============================================================
  main.py  —  Sudharshan Portfolio — FastAPI + JSONBin
  Admin panel changes → JSONBin (free) → live for everyone!
============================================================
"""
 
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Any
import json, httpx
 
# ── JSONBin Config ─────────────────────────────────────────
JSONBIN_BIN_ID  = "69bac4fdc3097a1dd5383e29"
JSONBIN_API_KEY = "$2a$10$JVPZ1sNJK39HMa0plfrIPu3U/NOgi7fQtm8UUA6fr1Wr0wtvjmWEC"
JSONBIN_URL     = f"https://api.jsonbin.io/v3/b/{JSONBIN_BIN_ID}"
JSONBIN_HEADERS = {
    "Content-Type": "application/json",
    "X-Master-Key": JSONBIN_API_KEY,
    "X-Bin-Versioning": "false"
}
 
# ── App setup ──────────────────────────────────────────────
app = FastAPI(title="Sudharshan Portfolio")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")
 
# ── Default data ───────────────────────────────────────────
DEFAULTS = {
    "hero": {
        "name":     "Thepalle Sudharshan Kumar",
        "greeting": "Hello, It's Me",
        "badge":    "Open to Data Science & ML Roles | Immediate Joiner",
        "desc":     "A passionate Data Scientist & ML Engineer specializing in predictive modeling, fraud detection systems, and AI-powered applications. Transforming complex data into actionable insights.",
        "titles":   "Data Scientist,ML Engineer,Python Developer,AI Enthusiast",
        "linkedin": "https://www.linkedin.com/in/thepalle-sudharshan-a19263351",
        "github":   "https://github.com/sudharshan970"
    },
    "about": {
        "text": "A passionate and results-driven Data Science Intern and BCA graduate specializing in Machine Learning, predictive modeling, and data analytics.\n\nExperienced in developing fraud detection systems, AI-powered storytelling applications, and data-driven web solutions. Skilled in transforming complex datasets into actionable insights using Python, Scikit-learn, and visualization tools.\n\nEager to contribute to innovative teams and solve real-world problems using AI and data science. Based in Bangalore, India — available for immediate joining.",
        "stat1_num": "3+",   "stat1_label": "Projects Built",
        "stat2_num": "95%",  "stat2_label": "ML Accuracy",
        "stat3_num": "BCA",  "stat3_label": "Degree",
        "stat4_num": "2025", "stat4_label": "Graduate"
    },
    "skills": [
        {"id":1,  "name":"Python",               "category":"Programming",      "level":92},
        {"id":2,  "name":"C / C++",              "category":"Programming",      "level":75},
        {"id":3,  "name":"SQL / MySQL",           "category":"Programming",      "level":80},
        {"id":4,  "name":"Scikit-learn",          "category":"Machine Learning", "level":88},
        {"id":5,  "name":"PyTorch",              "category":"Machine Learning", "level":72},
        {"id":6,  "name":"Pandas / NumPy",       "category":"Machine Learning", "level":90},
        {"id":7,  "name":"Matplotlib / Seaborn", "category":"Visualization",    "level":88},
        {"id":8,  "name":"Power BI",             "category":"Visualization",    "level":70},
        {"id":9,  "name":"Flask",                "category":"Frameworks & Web", "level":82},
        {"id":10, "name":"React JS",             "category":"Frameworks & Web", "level":72},
        {"id":11, "name":"HTML / CSS",           "category":"Frameworks & Web", "level":85}
    ],
    "projects": [
        {"id":1,"icon":"🔍","title":"Fraud Detection System",
         "desc":"ML-powered financial fraud detection using Logistic Regression & Random Forest. Achieved high accuracy with feature engineering and EDA-driven insights.",
         "tech":"Python,Scikit-learn,Pandas,Seaborn","github":"https://github.com/sudharshan970","demo":""},
        {"id":2,"icon":"🏛️","title":"Crime Record Management System",
         "desc":"Web-based CRMS using Python & Flask to help law enforcement maintain secure, centralized digital records.",
         "tech":"Python,Flask,MySQL,HTML/CSS","github":"https://github.com/sudharshan970","demo":""},
        {"id":3,"icon":"🎙️","title":"Storytelling Audio Generative AI",
         "desc":"AI application generating immersive audio stories from text using NLG and TTS technologies.",
         "tech":"Python,NLG,TTS,Generative AI","github":"https://github.com/sudharshan970","demo":""}
    ],
    "experience": [
        {"id":1,"role":"Data Science Intern","company":"Techciti","location":"Bangalore",
         "duration":"March 2025 – April 2025",
         "points":"Developed a machine learning model in Python to detect fraudulent financial transactions\nTrained and evaluated Logistic Regression and Random Forest models achieving high accuracy\nUtilized Matplotlib and Seaborn to visualize transaction patterns and gain insights\nDemonstrated practical application of machine learning for financial fraud detection"}
    ],
    "education": [
        {"id":1,"degree":"Bachelor of Computer Applications","school":"Bangalore University, Bangalore","year":"Sep 2022 – 2025","icon":"🎓"},
        {"id":2,"degree":"Pre University Course","school":"Florence PU College, Bangalore","year":"Completed June 2022","icon":"📚"}
    ],
    "contactInfo": {
        "email":"thepallisudharshan@gmail.com","phone":"+91 9705831484","location":"Bangalore, India",
        "linkedin":"https://www.linkedin.com/in/thepalle-sudharshan-a19263351",
        "github":"https://github.com/sudharshan970",
        "heading":"Ready to work together?",
        "desc":"I'm actively looking for Data Science and Machine Learning roles. Whether you have a project in mind or just want to connect — let's talk!"
    },
    "profileImg":    None,
    "resumeSrc":     None,
    "nextId":        200,
    "adminCreds":    {"email":"thepallisudharshan@gmail.com","password":"Sudharshan@970"},
    "emailjsConfig": {"serviceId":"","templateId":"","publicKey":"","recipientEmail":"thepallisudharshan@gmail.com"}
}
 
ALL_KEYS = ["hero","about","skills","projects","experience","education",
            "contactInfo","profileImg","resumeSrc","nextId","adminCreds","emailjsConfig"]
 
# ── In-memory cache (fast reads) ───────────────────────────
_cache: dict = {}
 
# ── JSONBin Helpers ────────────────────────────────────────
async def jsonbin_load() -> dict:
    async with httpx.AsyncClient() as client:
        res  = await client.get(JSONBIN_URL + "/latest", headers=JSONBIN_HEADERS, timeout=10)
        data = res.json().get("record", {})
        return data
 
async def jsonbin_save(data: dict):
    async with httpx.AsyncClient() as client:
        await client.put(JSONBIN_URL, headers=JSONBIN_HEADERS,
                         content=json.dumps(data), timeout=10)
 
# ── Startup ────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    global _cache
    try:
        data = await jsonbin_load()
        if not data or (len(data) == 1 and "initialized" in data):
            _cache = {k: DEFAULTS.get(k) for k in ALL_KEYS}
            await jsonbin_save(_cache)
            print("First run — defaults saved to JSONBin!")
        else:
            _cache = {k: data.get(k, DEFAULTS.get(k)) for k in ALL_KEYS}
            print("Portfolio data loaded from JSONBin")
    except Exception as e:
        print(f"JSONBin unavailable, using defaults: {e}")
        _cache = {k: DEFAULTS.get(k) for k in ALL_KEYS}
 
# ── Routes ─────────────────────────────────────────────────
@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
 
@app.get("/api/state")
async def get_state():
    return JSONResponse(_cache)
 
class SavePayload(BaseModel):
    key: str
    value: Any
 
@app.post("/api/save")
async def save_key(payload: SavePayload):
    if payload.key not in ALL_KEYS:
        raise HTTPException(status_code=400, detail="Invalid key")
    _cache[payload.key] = payload.value
    try:
        await jsonbin_save(_cache)
    except Exception as e:
        print(f"JSONBin save error: {e}")
    return {"ok": True, "key": payload.key}
 
@app.get("/api/next-id")
async def next_id():
    current = _cache.get("nextId") or 200
    new_id  = current + 1
    _cache["nextId"] = new_id
    try:
        await jsonbin_save(_cache)
    except Exception as e:
        print(f"JSONBin save error: {e}")
    return {"id": new_id}
 
@app.post("/api/reset")
async def reset_all():
    global _cache
    _cache = {k: DEFAULTS.get(k) for k in ALL_KEYS}
    await jsonbin_save(_cache)
    return {"ok": True}
 
@app.get("/health")
async def health():
    return {"status": "ok"}
