"""
============================================================
  main.py  —  Sudharshan Portfolio — FastAPI Backend
  Admin panel changes → SQLite DB → live for everyone!
============================================================
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Any, Optional
import sqlite3, json, os

# ── App setup ──────────────────────────────────────────────
app = FastAPI(title="Sudharshan Portfolio")

app.mount("/static",  StaticFiles(directory="static"),  name="static")
templates = Jinja2Templates(directory="templates")

DB_PATH = "portfolio.db"

# ── Default data (same as your original data.js) ───────────
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
         "desc":"Web-based CRMS using Python & Flask to help law enforcement maintain secure, centralized digital records — replacing paper-based systems entirely.",
         "tech":"Python,Flask,MySQL,HTML/CSS","github":"https://github.com/sudharshan970","demo":""},
        {"id":3,"icon":"🎙️","title":"Storytelling Audio Generative AI",
         "desc":"AI application generating immersive audio stories from text using NLG and TTS technologies with voice selection, background music, and theme customization.",
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

# ── Database setup ─────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS portfolio (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )
    """)
    # Seed defaults if empty
    for k in ALL_KEYS:
        existing = conn.execute("SELECT key FROM portfolio WHERE key=?", (k,)).fetchone()
        if not existing:
            conn.execute("INSERT INTO portfolio (key,value) VALUES (?,?)",
                         (k, json.dumps(DEFAULTS.get(k))))
    conn.commit()
    conn.close()

init_db()

# ── Helpers ────────────────────────────────────────────────
def db_get(key: str):
    conn = get_db()
    row = conn.execute("SELECT value FROM portfolio WHERE key=?", (key,)).fetchone()
    conn.close()
    return json.loads(row["value"]) if row else DEFAULTS.get(key)

def db_set(key: str, value: Any):
    conn = get_db()
    conn.execute("INSERT OR REPLACE INTO portfolio (key,value) VALUES (?,?)",
                 (key, json.dumps(value)))
    conn.commit()
    conn.close()

def get_all_state():
    return {k: db_get(k) for k in ALL_KEYS}

# ── Routes ─────────────────────────────────────────────────

@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Get all portfolio state (called by frontend on load)
@app.get("/api/state")
async def get_state():
    return JSONResponse(get_all_state())

# Save any single key
class SavePayload(BaseModel):
    key: str
    value: Any

@app.post("/api/save")
async def save_key(payload: SavePayload):
    if payload.key not in ALL_KEYS:
        raise HTTPException(status_code=400, detail="Invalid key")
    db_set(payload.key, payload.value)
    return {"ok": True, "key": payload.key}

# Get next ID
@app.get("/api/next-id")
async def next_id():
    current = db_get("nextId") or 200
    new_id  = current + 1
    db_set("nextId", new_id)
    return {"id": new_id}

# Reset all to defaults
@app.post("/api/reset")
async def reset_all():
    for k in ALL_KEYS:
        db_set(k, DEFAULTS.get(k))
    return {"ok": True}

# Health check (for Render.com)
@app.get("/health")
async def health():
    return {"status": "ok"}
