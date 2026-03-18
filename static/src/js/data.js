/* ============================================================
   data.js  —  Talks to FastAPI backend (SQLite database)
   Admin panel changes → Python API → DB → live for everyone!
============================================================ */

/* ============================================================
   DEFAULT DATA (used as fallback while API loads)
============================================================ */
const DEFAULTS = {
  hero: {
    name:     "Thepalle Sudharshan Kumar",
    greeting: "Hello, It's Me",
    badge:    "Open to Data Science & ML Roles | Immediate Joiner",
    desc:     "A passionate Data Scientist & ML Engineer specializing in predictive modeling, fraud detection systems, and AI-powered applications. Transforming complex data into actionable insights.",
    titles:   "Data Scientist,ML Engineer,Python Developer,AI Enthusiast",
    linkedin: "https://www.linkedin.com/in/thepalle-sudharshan-a19263351",
    github:   "https://github.com/sudharshan970"
  },
  about: {
    text: "A passionate and results-driven Data Science Intern and BCA graduate specializing in Machine Learning, predictive modeling, and data analytics.\n\nExperienced in developing fraud detection systems, AI-powered storytelling applications, and data-driven web solutions.\n\nEager to contribute to innovative teams and solve real-world problems using AI and data science. Based in Bangalore, India — available for immediate joining.",
    stat1_num: "3+",   stat1_label: "Projects Built",
    stat2_num: "95%",  stat2_label: "ML Accuracy",
    stat3_num: "BCA",  stat3_label: "Degree",
    stat4_num: "2025", stat4_label: "Graduate"
  },
  skills: [
    { id:1,  name:"Python",               category:"Programming",       level:92 },
    { id:2,  name:"C / C++",              category:"Programming",       level:75 },
    { id:3,  name:"SQL / MySQL",           category:"Programming",       level:80 },
    { id:4,  name:"Scikit-learn",          category:"Machine Learning",  level:88 },
    { id:5,  name:"PyTorch",              category:"Machine Learning",  level:72 },
    { id:6,  name:"Pandas / NumPy",       category:"Machine Learning",  level:90 },
    { id:7,  name:"Matplotlib / Seaborn", category:"Visualization",     level:88 },
    { id:8,  name:"Power BI",             category:"Visualization",     level:70 },
    { id:9,  name:"Flask",                category:"Frameworks & Web",  level:82 },
    { id:10, name:"React JS",             category:"Frameworks & Web",  level:72 },
    { id:11, name:"HTML / CSS",           category:"Frameworks & Web",  level:85 }
  ],
  projects: [
    { id:1, icon:"🔍", title:"Fraud Detection System",
      desc:"ML-powered financial fraud detection using Logistic Regression & Random Forest.",
      tech:"Python,Scikit-learn,Pandas,Seaborn", github:"https://github.com/sudharshan970", demo:"" },
    { id:2, icon:"🏛️", title:"Crime Record Management System",
      desc:"Web-based CRMS using Python & Flask for secure, centralized digital records.",
      tech:"Python,Flask,MySQL,HTML/CSS", github:"https://github.com/sudharshan970", demo:"" },
    { id:3, icon:"🎙️", title:"Storytelling Audio Generative AI",
      desc:"AI application generating immersive audio stories from text using NLG and TTS.",
      tech:"Python,NLG,TTS,Generative AI", github:"https://github.com/sudharshan970", demo:"" }
  ],
  experience: [
    { id:1, role:"Data Science Intern", company:"Techciti", location:"Bangalore",
      duration:"March 2025 – April 2025",
      points:"Developed a machine learning model in Python to detect fraudulent financial transactions\nTrained and evaluated Logistic Regression and Random Forest models achieving high accuracy\nUtilized Matplotlib and Seaborn to visualize transaction patterns and gain insights\nDemonstrated practical application of machine learning for financial fraud detection" }
  ],
  education: [
    { id:1, degree:"Bachelor of Computer Applications", school:"Bangalore University, Bangalore", year:"Sep 2022 – 2025", icon:"🎓" },
    { id:2, degree:"Pre University Course", school:"Florence PU College, Bangalore", year:"Completed June 2022", icon:"📚" }
  ],
  contactInfo: {
    email:"thepallisudharshan@gmail.com", phone:"+91 9705831484", location:"Bangalore, India",
    linkedin:"https://www.linkedin.com/in/thepalle-sudharshan-a19263351",
    github:"https://github.com/sudharshan970",
    heading:"Ready to work together?",
    desc:"I'm actively looking for Data Science and Machine Learning roles. Whether you have a project in mind or just want to connect — let's talk!"
  }
};

/* ============================================================
   STATE — starts with defaults, API overwrites on load
============================================================ */
const STATE = {
  hero:          { ...DEFAULTS.hero },
  about:         { ...DEFAULTS.about },
  skills:        [...DEFAULTS.skills],
  projects:      [...DEFAULTS.projects],
  experience:    [...DEFAULTS.experience],
  education:     [...DEFAULTS.education],
  contactInfo:   { ...DEFAULTS.contactInfo },
  profileImg:    null,
  resumeSrc:     null,
  nextId:        200,
  adminCreds:    { email:'thepallisudharshan@gmail.com', password:'Sudharshan@970' },
  emailjsConfig: { serviceId:'', templateId:'', publicKey:'', recipientEmail:'thepallisudharshan@gmail.com' }
};

/* ============================================================
   Load state from FastAPI backend
============================================================ */
async function loadFromAPI() {
  try {
    const res  = await fetch('/api/state');
    const data = await res.json();
    const keys = ['hero','about','skills','projects','experience','education',
                  'contactInfo','profileImg','resumeSrc','nextId','adminCreds','emailjsConfig'];
    keys.forEach(k => {
      if (data[k] !== undefined && data[k] !== null) STATE[k] = data[k];
    });
    console.log('✅ State loaded from Python backend');
  } catch(e) {
    console.warn('⚠️ Could not reach API, using defaults:', e);
  }
  if (typeof renderAll === 'function') renderAll();
}

/* ============================================================
   lsSave — saves to FastAPI backend (SQLite)
============================================================ */
async function lsSave(key, val) {
  STATE[key] = val;
  try {
    await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value: val })
    });
  } catch(e) {
    console.warn('API save error:', e);
  }
}

/* ============================================================
   getNextId — gets next ID from backend
============================================================ */
async function getNextId() {
  try {
    const res  = await fetch('/api/next-id');
    const data = await res.json();
    STATE.nextId = data.id;
    return data.id;
  } catch(e) {
    STATE.nextId++;
    return STATE.nextId;
  }
}

/* ============================================================
   resetAllData — resets everything to defaults
============================================================ */
async function resetAllData() {
  if (!confirm('Reset ALL portfolio data to defaults? This cannot be undone.')) return;
  try {
    await fetch('/api/reset', { method: 'POST' });
  } catch(e) {}
  location.reload();
}

/* ---- Start loading from API ---- */
loadFromAPI();
