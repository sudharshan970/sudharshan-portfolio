# 🚀 Sudharshan Portfolio — Python/FastAPI Version

> A full-stack portfolio website with admin panel powered by **FastAPI + SQLite**.
> Admin panel changes reflect **instantly** for everyone visiting the live site!

---

## 🌐 Live Demo
> Add your Render.com URL here after deployment

---

## 🗂️ Project Structure

```
sudharshan-portfolio-python/
├── main.py                  ← FastAPI backend (API + routes)
├── portfolio.db             ← SQLite database (auto-created)
├── requirements.txt         ← Python dependencies
├── render.yaml              ← Render.com deploy config
├── README.md                ← This file
├── templates/
│   └── index.html           ← Your portfolio page (Jinja2)
└── static/
    ├── assets/
    │   ├── profile.jpg      ← Your profile photo
    │   └── resume.pdf       ← Your resume
    └── src/
        ├── css/             ← All CSS files
        └── js/
            ├── data.js      ← Talks to FastAPI backend
            ├── admin.js     ← Admin panel logic
            ├── render.js    ← Renders all sections
            ├── animations.js
            ├── assets_inline.js
            └── emailjs.config.js
```

---

## 💻 How to Run Locally (VS Code)

### Step 1 — Open project in VS Code
```
File → Open Folder → select sudharshan-portfolio-python folder
```

### Step 2 — Open Terminal in VS Code
```
Terminal → New Terminal   (or press Ctrl + `)
```

### Step 3 — Create virtual environment
```bash
python -m venv venv
```

### Step 4 — Activate virtual environment
**Windows:**
```bash
venv\Scripts\activate
```
**Mac/Linux:**
```bash
source venv/bin/activate
```

### Step 5 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 6 — Run the server
```bash
uvicorn main:app --reload
```

### Step 7 — Open in browser
```
http://127.0.0.1:8000
```

✅ Your portfolio is running locally!
Admin panel: click **⚙ Admin** in the navbar
Login: `thepallisudharshan@gmail.com` / `Sudharshan@970`

---

## 🌍 How to Deploy on Render.com (FREE — Live for Everyone)

### Step 1 — Push this project to GitHub
1. Create a new repo on GitHub (e.g. `sudharshan-portfolio-python`)
2. Upload all files manually (drag & drop)
3. Commit

### Step 2 — Create Render account
1. Go to **render.com**
2. Sign up with your GitHub account

### Step 3 — Create a new Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo
3. Fill in:
   - **Name:** `sudharshan-portfolio`
   - **Environment:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Click **"Create Web Service"**

### Step 4 — Add a Disk (so database saves permanently)
1. Go to your service → **"Disks"** tab
2. Click **"Add Disk"**
3. Mount Path: `/opt/render/project/src`
4. Size: 1 GB (free)
5. Save

### Step 5 — Deploy!
Render will automatically build and deploy.
Your live URL will be:
```
https://sudharshan-portfolio.onrender.com
```

---

## ✏️ How the Admin Panel Works

1. Open your live website
2. Click **⚙ Admin** in the navbar
3. Login with your credentials
4. Make any changes (add projects, update skills, change bio etc.)
5. Click **Save**
6. ✅ Changes are saved to SQLite database on Render
7. ✅ Everyone visiting the site sees the update instantly!

---

## 📬 Setting Up EmailJS (Contact Form)

1. Go to **emailjs.com** → Sign up FREE
2. Add Service → Gmail → connect your Gmail
3. Create Template with:
   - Subject: `New Portfolio Message from {{from_name}}`
   - Body: `Name: {{from_name}} | Email: {{from_email}} | Message: {{message}}`
4. Get your Service ID, Template ID, Public Key
5. In Admin Panel → Settings → EmailJS Configuration → paste your keys → Save

---

## ⚠️ Note on Render Free Plan

- ✅ Completely free
- ⚠️ Server sleeps after 15 minutes of inactivity
- ⏱️ First visit after sleep takes ~30 seconds to wake up
- ✅ After that it runs normally and fast

---

## 🔑 Default Admin Credentials
- **Email:** thepallisudharshan@gmail.com
- **Password:** Sudharshan@970
- *Change anytime via Admin → Settings*
