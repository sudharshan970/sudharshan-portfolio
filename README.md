# 🚀 Sudharshan Portfolio — Python/FastAPI Version

> Full-stack portfolio website with admin panel powered by **FastAPI + JSONBin**.
> Admin panel changes reflect **instantly** for everyone visiting the live site!

---

## 🌐 Live Demo
👉 **[https://sudharshan-portfolio-o6b2.onrender.com](https://sudharshan-portfolio-o6b2.onrender.com)**

---

## 🗂️ Project Structure

```
sudharshan-portfolio-python/
├── main.py                  ← FastAPI backend (API + JSONBin)
├── requirements.txt         ← Python dependencies
├── render.yaml              ← Render.com deploy config
├── README.md                ← This file
├── templates/
│   └── index.html           ← Portfolio page
└── static/
    ├── assets/
    │   ├── profile.jpg
    │   └── resume.pdf
    └── src/
        ├── css/
        └── js/
```

---

## 💻 How to Run Locally (VS Code)

### Step 1 — Open Terminal in VS Code
```
Ctrl + `
```

### Step 2 — Create & activate virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4 — Run the server
```bash
uvicorn main:app --reload
```

### Step 5 — Open browser
```
http://127.0.0.1:8000
```

---

## 🔑 Admin Panel Login
- **URL:** Click ⚙ Admin in navbar
- **Email:** 
- **Password:** 

---

## ✏️ How Admin Panel Works
1. Open live website
2. Click **⚙ Admin** in navbar
3. Login → make changes → click **Save**
4. ✅ Changes saved to JSONBin database
5. ✅ Everyone sees updates instantly!

---

## 📬 EmailJS Setup (Contact Form)
1. Go to **emailjs.com** → Sign up FREE
2. Add Service → Gmail → connect Gmail
3. Create Template
4. Admin Panel → Settings → EmailJS → paste keys → Save

---

## 🌍 Deployed on Render.com (Free)
- Live URL: https://sudharshan-portfolio-o6b2.onrender.com
- ⚠️ Free plan sleeps after 15 mins inactivity — first load takes ~30 seconds
