"""
============================================================
  main.py  —  Sudharshan Portfolio — FastAPI + Supabase
  100% permanent storage — changes never lost!
============================================================
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Any
import json, httpx, os

# ── Supabase Config ────────────────────────────────────────
SUPABASE_URL     = "https://rcyzrpdpdsxuinqmahbb.supabase.co"
SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjeXpycGRwZHN4dWlucW1haGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MzYwMjgsImV4cCI6MjA4OTUxMjAyOH0.zYlgcjpepwbp2JWMF0x3orfsEeswUQjtViH9LkXg4YA"
TABLE_NAME       = "portfolio"

def supa_headers():
    return {
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation"
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

# ── Supabase Helpers ───────────────────────────────────────
async def db_load() -> dict:
    try:
        url = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}?select=key,value"
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.get(url, headers=supa_headers())
            if res.status_code == 200:
                rows = res.json()
                return {row["key"]: json.loads(row["value"]) for row in rows}
            else:
                print(f"Supabase load error: {res.status_code} {res.text}")
    except Exception as e:
        print(f"Supabase load error: {e}")
    return {}

async def db_save(key: str, value: Any) -> bool:
    try:
        url = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}"
        payload = {"key": key, "value": json.dumps(value)}
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.post(url, headers=supa_headers(), json=payload)
            if res.status_code in (200, 201):
                print(f"✅ Saved '{key}' to Supabase")
                return True
            else:
                print(f"Supabase save error {res.status_code}: {res.text}")
    except Exception as e:
        print(f"Supabase save error: {e}")
    return False

# ── Startup ────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    print("🚀 Loading from Supabase...")
    data = await db_load()
    if not data:
        print("🌱 First run — seeding defaults...")
        for k in ALL_KEYS:
            await db_save(k, DEFAULTS.get(k))
        print("✅ Defaults seeded to Supabase!")
    else:
        print(f"✅ Loaded {len(data)} keys from Supabase")

# ── Routes ─────────────────────────────────────────────────
@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/state")
async def get_state():
    data  = await db_load()
    state = {k: data.get(k) if data.get(k) is not None else DEFAULTS.get(k) for k in ALL_KEYS}
    return JSONResponse(state)

class SavePayload(BaseModel):
    key: str
    value: Any

@app.post("/api/save")
async def save_key(payload: SavePayload):
    if payload.key not in ALL_KEYS:
        raise HTTPException(status_code=400, detail="Invalid key")
    success = await db_save(payload.key, payload.value)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to save")
    return {"ok": True, "key": payload.key}

@app.get("/api/next-id")
async def next_id():
    data    = await db_load()
    current = data.get("nextId") or 200
    new_id  = current + 1
    await db_save("nextId", new_id)
    return {"id": new_id}

@app.post("/api/reset")
async def reset_all():
    for k in ALL_KEYS:
        await db_save(k, DEFAULTS.get(k))
    return {"ok": True}

@app.get("/health")
async def health():
    return {"status": "ok"}
