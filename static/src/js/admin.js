/* ============================================================
   admin.js
   Full Admin Panel — login, CRUD, file uploads, save/load
============================================================ */

/* ============================================================
   OPEN / CLOSE ADMIN
============================================================ */
function openAdmin() {
  document.getElementById('admin-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  adminOpen = true;
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
  document.body.style.overflow = '';
  adminOpen = false;
  renderAll();
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }, 150);
}

/* ============================================================
   LOGIN / LOGOUT
============================================================ */
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;

  if (email === STATE.adminCreds.email && pass === STATE.adminCreds.password) {
    document.getElementById('admin-login').style.display    = 'none';
    document.getElementById('admin-dashboard').classList.add('show');
    loadAllAdminFields();
    renderAdminTables();
    renderDashCards();
    loadSettingsPanel();
  } else {
    const errEl = document.getElementById('login-error');
    errEl.style.display = 'block';
    errEl.textContent = 'Invalid email or password.';
    document.getElementById('login-password').value = '';
    // Shake the login box
    const box = document.querySelector('.login-box');
    box.style.animation = 'shake 0.4s ease';
    setTimeout(() => box.style.animation = '', 500);
  }
}

// Allow pressing Enter in password field
document.addEventListener('DOMContentLoaded', () => {
  const pw = document.getElementById('login-password');
  if (pw) pw.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
});

function adminLogout() {
  document.getElementById('admin-login').style.display = '';
  document.getElementById('admin-dashboard').classList.remove('show');
  document.getElementById('login-email').value    = '';
  document.getElementById('login-password').value = '';
  document.getElementById('login-error').style.display = 'none';
  closeAdmin();
}

/* ============================================================
   PANEL SWITCHING
============================================================ */
function switchPanel(name, el) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (el) el.classList.add('active');
}

/* ============================================================
   DASHBOARD CARDS
============================================================ */
function renderDashCards() {
  document.getElementById('dash-cards').innerHTML = `
    <div class="dash-card"><div class="dash-card-icon">🚀</div>
      <div class="dash-card-num">${STATE.projects.length}</div>
      <div class="dash-card-label">Projects</div></div>
    <div class="dash-card"><div class="dash-card-icon">🧠</div>
      <div class="dash-card-num">${STATE.skills.length}</div>
      <div class="dash-card-label">Skills</div></div>
    <div class="dash-card"><div class="dash-card-icon">💼</div>
      <div class="dash-card-num">${STATE.experience.length}</div>
      <div class="dash-card-label">Experiences</div></div>
    <div class="dash-card"><div class="dash-card-icon">🎓</div>
      <div class="dash-card-num">${STATE.education.length}</div>
      <div class="dash-card-label">Education</div></div>
  `;
}

/* ============================================================
   LOAD ALL FORM FIELDS
============================================================ */
function loadAllAdminFields() {
  const h = STATE.hero;
  document.getElementById('a-hero-name').value     = h.name;
  document.getElementById('a-hero-greeting').value = h.greeting;
  document.getElementById('a-hero-badge').value    = h.badge;
  document.getElementById('a-hero-desc').value     = h.desc;
  document.getElementById('a-hero-titles').value   = h.titles;
  document.getElementById('a-hero-linkedin').value = h.linkedin;
  document.getElementById('a-hero-github').value   = h.github;

  const a = STATE.about;
  document.getElementById('a-about-text').value   = a.text;
  document.getElementById('a-stat1-num').value    = a.stat1_num;
  document.getElementById('a-stat1-label').value  = a.stat1_label;
  document.getElementById('a-stat2-num').value    = a.stat2_num;
  document.getElementById('a-stat2-label').value  = a.stat2_label;
  document.getElementById('a-stat3-num').value    = a.stat3_num;
  document.getElementById('a-stat3-label').value  = a.stat3_label;
  document.getElementById('a-stat4-num').value    = a.stat4_num;
  document.getElementById('a-stat4-label').value  = a.stat4_label;

  const c = STATE.contactInfo;
  document.getElementById('a-ci-email').value    = c.email;
  document.getElementById('a-ci-phone').value    = c.phone;
  document.getElementById('a-ci-location').value = c.location;
  document.getElementById('a-ci-linkedin').value = c.linkedin;
  document.getElementById('a-ci-github').value   = c.github;
  document.getElementById('a-ci-heading').value  = c.heading;
  document.getElementById('a-ci-desc').value     = c.desc;

  renderProfileImg();
  renderResume();
  // Update admin resume preview iframe
  const adminIframe = document.getElementById('admin-resume-iframe');
  if (adminIframe) adminIframe.src = STATE.resumeSrc || 'assets/resume.pdf';
}

/* ============================================================
   SAVE — HERO
============================================================ */
function saveHero() {
  STATE.hero = {
    name:     document.getElementById('a-hero-name').value.trim(),
    greeting: document.getElementById('a-hero-greeting').value.trim(),
    badge:    document.getElementById('a-hero-badge').value.trim(),
    desc:     document.getElementById('a-hero-desc').value.trim(),
    titles:   document.getElementById('a-hero-titles').value.trim(),
    linkedin: document.getElementById('a-hero-linkedin').value.trim(),
    github:   document.getElementById('a-hero-github').value.trim()
  };
  lsSave('hero', STATE.hero);
  showToast('✅ Hero section saved!');
}

/* ============================================================
   SAVE — ABOUT
============================================================ */
function saveAbout() {
  STATE.about = {
    text:        document.getElementById('a-about-text').value,
    stat1_num:   document.getElementById('a-stat1-num').value.trim(),
    stat1_label: document.getElementById('a-stat1-label').value.trim(),
    stat2_num:   document.getElementById('a-stat2-num').value.trim(),
    stat2_label: document.getElementById('a-stat2-label').value.trim(),
    stat3_num:   document.getElementById('a-stat3-num').value.trim(),
    stat3_label: document.getElementById('a-stat3-label').value.trim(),
    stat4_num:   document.getElementById('a-stat4-num').value.trim(),
    stat4_label: document.getElementById('a-stat4-label').value.trim()
  };
  lsSave('about', STATE.about);
  showToast('✅ About section saved!');
}

/* ============================================================
   SKILLS TABLE + CRUD
============================================================ */
function renderSkillsTable() {
  document.getElementById('skills-tbody').innerHTML = STATE.skills.map(s => `
    <tr>
      <td><strong style="color:var(--text)">${s.name}</strong></td>
      <td><span class="badge-skill">${s.category}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1;height:4px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;max-width:100px">
            <div style="height:100%;width:${s.level}%;background:linear-gradient(to right,var(--cyan),var(--purple));border-radius:2px"></div>
          </div>
          <span style="color:var(--cyan);font-family:var(--font-mono);font-size:.72rem">${s.level}%</span>
        </div>
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-edit"   onclick="editSkill(${s.id})">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteSkill(${s.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openSkillModal(reset = true) {
  if (reset) {
    document.getElementById('m-skill-id').value    = '';
    document.getElementById('m-skill-name').value  = '';
    document.getElementById('m-skill-cat').value   = 'Programming';
    document.getElementById('m-skill-level').value = 80;
    document.getElementById('m-skill-val').textContent = '80%';
    document.getElementById('modal-skill-title').textContent = 'Add Skill';
  }
  document.getElementById('modal-skill').classList.add('open');
}

function editSkill(id) {
  const s = STATE.skills.find(x => x.id === id);
  if (!s) return;
  document.getElementById('m-skill-id').value    = s.id;
  document.getElementById('m-skill-name').value  = s.name;
  document.getElementById('m-skill-cat').value   = s.category;
  document.getElementById('m-skill-level').value = s.level;
  document.getElementById('m-skill-val').textContent = s.level + '%';
  document.getElementById('modal-skill-title').textContent = 'Edit Skill';
  document.getElementById('modal-skill').classList.add('open');
}

async function saveSkill() {
  const id   = parseInt(document.getElementById('m-skill-id').value) || 0;
  const name = document.getElementById('m-skill-name').value.trim();
  if (!name) { showToast('Enter a skill name', 'error'); return; }

  const skill = {
    id:       id || getNextId(),
    name,
    category: document.getElementById('m-skill-cat').value,
    level:    parseInt(document.getElementById('m-skill-level').value)
  };

  if (id) {
    const i = STATE.skills.findIndex(s => s.id === id);
    if (i > -1) STATE.skills[i] = skill;
  } else {
    STATE.skills.push(skill);
  }

  lsSave('skills', STATE.skills);
  closeModal('skill');
  renderSkillsTable();
  renderDashCards();
  showToast(id ? '✅ Skill updated!' : '✅ Skill added!');
}

function deleteSkill(id) {
  if (!confirm('Delete this skill?')) return;
  STATE.skills = STATE.skills.filter(s => s.id !== id);
  lsSave('skills', STATE.skills);
  renderSkillsTable();
  renderDashCards();
  showToast('🗑️ Skill deleted');
}

/* ============================================================
   PROJECTS TABLE + CRUD
============================================================ */
function renderProjectsTable() {
  document.getElementById('projects-tbody').innerHTML = STATE.projects.map(p => `
    <tr>
      <td>
        <span style="font-size:1.1rem;margin-right:8px">${p.icon || '🚀'}</span>
        <strong style="color:var(--text)">${p.title}</strong>
      </td>
      <td>
        <div style="display:flex;flex-wrap:wrap;gap:4px">
          ${p.tech.split(',').slice(0,3).map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}
        </div>
      </td>
      <td>
        ${p.github ? `<a href="${p.github}" target="_blank" style="color:var(--cyan);font-size:.78rem">GitHub ↗</a>` : '—'}
      </td>
      <td>
        <div class="table-actions">
          <button class="btn-edit"   onclick="editProject(${p.id})">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteProject(${p.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editProject(id) {
  const p = STATE.projects.find(x => x.id === id);
  if (!p) return;
  document.getElementById('m-proj-id').value     = p.id;
  document.getElementById('m-proj-icon').value   = p.icon;
  document.getElementById('m-proj-title').value  = p.title;
  document.getElementById('m-proj-desc').value   = p.desc;
  document.getElementById('m-proj-tech').value   = p.tech;
  document.getElementById('m-proj-github').value = p.github;
  document.getElementById('m-proj-demo').value   = p.demo;
  document.getElementById('modal-project-title').textContent = 'Edit Project';
  document.getElementById('modal-project').classList.add('open');
}

function openProjectModal() {
  ['m-proj-id','m-proj-icon','m-proj-title','m-proj-desc','m-proj-tech','m-proj-github','m-proj-demo']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('modal-project-title').textContent = 'Add Project';
  document.getElementById('modal-project').classList.add('open');
}

async function saveProject() {
  const id    = parseInt(document.getElementById('m-proj-id').value) || 0;
  const title = document.getElementById('m-proj-title').value.trim();
  if (!title) { showToast('Enter a project title', 'error'); return; }

  const proj = {
    id:     id || await getNextId(),
    icon:   document.getElementById('m-proj-icon').value.trim()   || '🚀',
    title,
    desc:   document.getElementById('m-proj-desc').value.trim(),
    tech:   document.getElementById('m-proj-tech').value.trim(),
    github: document.getElementById('m-proj-github').value.trim(),
    demo:   document.getElementById('m-proj-demo').value.trim()
  };

  if (id) {
    const i = STATE.projects.findIndex(p => p.id === id);
    if (i > -1) STATE.projects[i] = proj;
  } else {
    STATE.projects.push(proj);
  }

  lsSave('projects', STATE.projects);
  closeModal('project');
  renderProjectsTable();
  renderDashCards();
  showToast(id ? '✅ Project updated!' : '✅ Project added!');
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  STATE.projects = STATE.projects.filter(p => p.id !== id);
  lsSave('projects', STATE.projects);
  renderProjectsTable();
  renderDashCards();
  showToast('🗑️ Project deleted');
}

/* ============================================================
   EXPERIENCE TABLE + CRUD
============================================================ */
function renderExpTable() {
  document.getElementById('exp-tbody').innerHTML = STATE.experience.map(e => `
    <tr>
      <td><strong style="color:var(--text)">${e.role}</strong></td>
      <td style="color:var(--cyan)">${e.company}</td>
      <td style="color:var(--muted);font-family:var(--font-mono);font-size:.72rem">${e.duration}</td>
      <td>
        <div class="table-actions">
          <button class="btn-edit"   onclick="editExp(${e.id})">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteExp(${e.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openExpModal() {
  ['m-exp-id','m-exp-role','m-exp-company','m-exp-location','m-exp-duration','m-exp-points']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('modal-exp-title').textContent = 'Add Experience';
  document.getElementById('modal-exp').classList.add('open');
}

function editExp(id) {
  const e = STATE.experience.find(x => x.id === id);
  if (!e) return;
  document.getElementById('m-exp-id').value       = e.id;
  document.getElementById('m-exp-role').value     = e.role;
  document.getElementById('m-exp-company').value  = e.company;
  document.getElementById('m-exp-location').value = e.location;
  document.getElementById('m-exp-duration').value = e.duration;
  document.getElementById('m-exp-points').value   = e.points;
  document.getElementById('modal-exp-title').textContent = 'Edit Experience';
  document.getElementById('modal-exp').classList.add('open');
}

async function saveExp() {
  const id   = parseInt(document.getElementById('m-exp-id').value) || 0;
  const role = document.getElementById('m-exp-role').value.trim();
  if (!role) { showToast('Enter a role title', 'error'); return; }

  const exp = {
    id:       id || getNextId(),
    role,
    company:  document.getElementById('m-exp-company').value.trim(),
    location: document.getElementById('m-exp-location').value.trim(),
    duration: document.getElementById('m-exp-duration').value.trim(),
    points:   document.getElementById('m-exp-points').value.trim()
  };

  if (id) {
    const i = STATE.experience.findIndex(e => e.id === id);
    if (i > -1) STATE.experience[i] = exp;
  } else {
    STATE.experience.push(exp);
  }

  lsSave('experience', STATE.experience);
  closeModal('exp');
  renderExpTable();
  renderDashCards();
  showToast(id ? '✅ Experience updated!' : '✅ Experience added!');
}

function deleteExp(id) {
  if (!confirm('Delete this experience entry?')) return;
  STATE.experience = STATE.experience.filter(e => e.id !== id);
  lsSave('experience', STATE.experience);
  renderExpTable();
  renderDashCards();
  showToast('🗑️ Experience deleted');
}

/* ============================================================
   EDUCATION TABLE + CRUD
============================================================ */
function renderEduTable() {
  document.getElementById('edu-tbody').innerHTML = STATE.education.map(e => `
    <tr>
      <td>
        <span style="font-size:1.1rem;margin-right:8px">${e.icon || '🎓'}</span>
        <strong style="color:var(--text)">${e.degree}</strong>
      </td>
      <td style="color:var(--cyan)">${e.school}</td>
      <td style="color:var(--muted);font-family:var(--font-mono);font-size:.72rem">${e.year}</td>
      <td>
        <div class="table-actions">
          <button class="btn-edit"   onclick="editEdu(${e.id})">✏️ Edit</button>
          <button class="btn-delete" onclick="deleteEdu(${e.id})">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openEduModal() {
  ['m-edu-id','m-edu-degree','m-edu-school','m-edu-year','m-edu-icon']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('modal-edu-title').textContent = 'Add Education';
  document.getElementById('modal-edu').classList.add('open');
}

function editEdu(id) {
  const e = STATE.education.find(x => x.id === id);
  if (!e) return;
  document.getElementById('m-edu-id').value     = e.id;
  document.getElementById('m-edu-degree').value = e.degree;
  document.getElementById('m-edu-school').value = e.school;
  document.getElementById('m-edu-year').value   = e.year;
  document.getElementById('m-edu-icon').value   = e.icon;
  document.getElementById('modal-edu-title').textContent = 'Edit Education';
  document.getElementById('modal-edu').classList.add('open');
}

async function saveEdu() {
  const id     = parseInt(document.getElementById('m-edu-id').value) || 0;
  const degree = document.getElementById('m-edu-degree').value.trim();
  if (!degree) { showToast('Enter a degree name', 'error'); return; }

  const edu = {
    id:     id || await getNextId(),
    degree,
    school: document.getElementById('m-edu-school').value.trim(),
    year:   document.getElementById('m-edu-year').value.trim(),
    icon:   document.getElementById('m-edu-icon').value.trim() || '🎓'
  };

  if (id) {
    const i = STATE.education.findIndex(e => e.id === id);
    if (i > -1) STATE.education[i] = edu;
  } else {
    STATE.education.push(edu);
  }

  lsSave('education', STATE.education);
  closeModal('edu');
  renderEduTable();
  renderDashCards();
  showToast(id ? '✅ Education updated!' : '✅ Education added!');
}

function deleteEdu(id) {
  if (!confirm('Delete this education entry?')) return;
  STATE.education = STATE.education.filter(e => e.id !== id);
  lsSave('education', STATE.education);
  renderEduTable();
  renderDashCards();
  showToast('🗑️ Education deleted');
}

/* ============================================================
   FILE UPLOADS
============================================================ */
let _pendingResume  = null;
let _pendingProfile = null;

function handleResumeUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') { showToast('Please select a PDF file', 'error'); return; }
  if (file.size > 5 * 1024 * 1024)    { showToast('File too large (max 5MB)', 'error');  return; }

  const reader = new FileReader();
  reader.onload = e => {
    _pendingResume = e.target.result;
    const prev = document.getElementById('resume-upload-preview');
    prev.style.display  = 'block';
    prev.textContent    = '📄 ' + file.name + ' — ready to save';
    const iframe = document.getElementById('admin-resume-iframe');
    if (iframe) iframe.src = _pendingResume;
  };
  reader.readAsDataURL(file);
}

function saveResume() {
  if (!_pendingResume) { showToast('No file selected', 'error'); return; }
  STATE.resumeSrc = _pendingResume;
  lsSave('resumeSrc', STATE.resumeSrc);
  _pendingResume = null;
  renderResume();
  showToast('✅ Resume updated!');
}

function handleProfileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) { showToast('Image too large (max 4MB)', 'error'); return; }

  const reader = new FileReader();
  reader.onload = e => {
    _pendingProfile = e.target.result;
    const prev = document.getElementById('profile-upload-preview');
    prev.style.display = 'block';
    prev.textContent   = '🖼️ ' + file.name + ' — ready to save';
    document.getElementById('profile-preview-admin').src = _pendingProfile;
  };
  reader.readAsDataURL(file);
}

function saveProfile() {
  if (!_pendingProfile) { showToast('No image selected', 'error'); return; }
  STATE.profileImg = _pendingProfile;
  lsSave('profileImg', STATE.profileImg);
  _pendingProfile = null;
  document.getElementById('main-profile-img').src = STATE.profileImg;
  showToast('✅ Profile photo updated!');
}

/* ============================================================
   CONTACT INFO SAVE
============================================================ */
function saveContactInfo() {
  STATE.contactInfo = {
    email:    document.getElementById('a-ci-email').value.trim(),
    phone:    document.getElementById('a-ci-phone').value.trim(),
    location: document.getElementById('a-ci-location').value.trim(),
    linkedin: document.getElementById('a-ci-linkedin').value.trim(),
    github:   document.getElementById('a-ci-github').value.trim(),
    heading:  document.getElementById('a-ci-heading').value.trim(),
    desc:     document.getElementById('a-ci-desc').value.trim()
  };
  lsSave('contactInfo', STATE.contactInfo);
  showToast('✅ Contact info saved!');
}

/* ============================================================
   RENDER ALL ADMIN TABLES
============================================================ */
function renderAdminTables() {
  renderSkillsTable();
  renderProjectsTable();
  renderExpTable();
  renderEduTable();
}

/* ============================================================
   MODAL HELPERS
============================================================ */
function closeModal(type) {
  document.getElementById('modal-' + type).classList.remove('open');
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});

/* ============================================================
   SETTINGS PANEL
============================================================ */

/* ---- Load current values into settings form ---- */
function loadSettingsPanel() {
  // Current email
  const emailDisplay = document.getElementById('current-email-display');
  if (emailDisplay) emailDisplay.textContent = STATE.adminCreds.email;

  // EmailJS fields
  const cfg = STATE.emailjsConfig;

  // Prefer values saved in localStorage over the static config file
  const svcId  = (cfg.serviceId  && cfg.serviceId  !== 'YOUR_SERVICE_ID')  ? cfg.serviceId  : (typeof EMAILJS_SERVICE_ID  !== 'undefined' && EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID'  ? EMAILJS_SERVICE_ID  : '');
  const tplId  = (cfg.templateId && cfg.templateId !== 'YOUR_TEMPLATE_ID') ? cfg.templateId : (typeof EMAILJS_TEMPLATE_ID !== 'undefined' && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' ? EMAILJS_TEMPLATE_ID : '');
  const pubKey = (cfg.publicKey  && cfg.publicKey  !== 'YOUR_PUBLIC_KEY')  ? cfg.publicKey  : (typeof EMAILJS_PUBLIC_KEY  !== 'undefined' && EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY'  ? EMAILJS_PUBLIC_KEY  : '');

  const svc  = document.getElementById('s-ejs-service');
  const tpl  = document.getElementById('s-ejs-template');
  const pub  = document.getElementById('s-ejs-pubkey');
  const rec  = document.getElementById('s-ejs-recipient');
  if (svc) svc.value = svcId;
  if (tpl) tpl.value = tplId;
  if (pub) pub.value = pubKey;
  if (rec) rec.value = cfg.recipientEmail || 'thepallisudharshan@gmail.com';

  updateEmailJSStatusBadge(svcId, tplId, pubKey);

  // Password strength meter listener
  const newPassInput = document.getElementById('s-new-pass');
  if (newPassInput) {
    newPassInput.addEventListener('input', function() {
      updatePassStrength(this.value);
    });
  }
}

/* ---- EmailJS status badge ---- */
function updateEmailJSStatusBadge(svc, tpl, pub) {
  const badge = document.getElementById('emailjs-status-badge');
  if (!badge) return;
  const configured = svc && tpl && pub;
  if (configured) {
    badge.textContent = '✅ Configured';
    badge.style.cssText = 'margin-left:auto;padding:4px 12px;border-radius:20px;font-family:var(--font-mono);font-size:.62rem;background:rgba(57,255,20,.08);border:1px solid rgba(57,255,20,.3);color:#39ff14;';
  } else {
    badge.textContent = '⚠️ Not Set Up';
    badge.style.cssText = 'margin-left:auto;padding:4px 12px;border-radius:20px;font-family:var(--font-mono);font-size:.62rem;background:rgba(255,45,120,.08);border:1px solid rgba(255,45,120,.3);color:var(--pink);';
  }
}

/* ---- Password strength meter ---- */
function updatePassStrength(pass) {
  const bar   = document.getElementById('pass-strength-bar');
  const label = document.getElementById('pass-strength-label');
  if (!bar || !label) return;

  let score = 0;
  if (pass.length >= 6)  score++;
  if (pass.length >= 10) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  const levels = [
    { pct: '0%',   color: '',                                           text: '—',          style: 'color:var(--muted)' },
    { pct: '20%',  color: '#ff2d78',                                    text: 'Very Weak',  style: 'color:#ff2d78' },
    { pct: '40%',  color: '#ff9500',                                    text: 'Weak',       style: 'color:#ff9500' },
    { pct: '60%',  color: '#ffcc00',                                    text: 'Fair',       style: 'color:#ffcc00' },
    { pct: '80%',  color: '#39ff14',                                    text: 'Strong',     style: 'color:#39ff14' },
    { pct: '100%', color: 'linear-gradient(to right,#39ff14,#00d4ff)',  text: 'Very Strong',style: 'color:#00d4ff' }
  ];

  const lvl = levels[Math.min(score, 5)];
  bar.style.width      = lvl.pct;
  bar.style.background = lvl.color;
  label.textContent    = lvl.text;
  label.style.cssText  = lvl.style + ';font-family:var(--font-mono);font-size:.65rem;';
}

/* ---- Toggle password visibility ---- */
function togglePassVis(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

/* ---- Save new admin email ---- */
function saveAdminEmail() {
  const newEmail  = document.getElementById('s-new-email').value.trim();
  const confirmPw = document.getElementById('s-email-confirm-pass').value;

  if (!newEmail) {
    showToast('Please enter a new email address', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  if (!confirmPw) {
    showToast('Please enter your current password to confirm', 'error');
    return;
  }
  if (confirmPw !== STATE.adminCreds.password) {
    showToast('❌ Incorrect current password', 'error');
    document.getElementById('s-email-confirm-pass').style.borderColor = 'var(--pink)';
    setTimeout(() => document.getElementById('s-email-confirm-pass').style.borderColor = '', 1500);
    return;
  }
  if (newEmail === STATE.adminCreds.email) {
    showToast('That is already your current email', 'error');
    return;
  }

  STATE.adminCreds.email = newEmail;
  lsSave('adminCreds', STATE.adminCreds);

  document.getElementById('current-email-display').textContent = newEmail;
  document.getElementById('s-new-email').value = '';
  document.getElementById('s-email-confirm-pass').value = '';
  showToast('✅ Admin email updated! Use it next login.', 'success');
}

/* ---- Save new admin password ---- */
function saveAdminPassword() {
  const currentPw = document.getElementById('s-current-pass').value;
  const newPw     = document.getElementById('s-new-pass').value;
  const confirmPw = document.getElementById('s-confirm-pass').value;

  if (!currentPw) {
    showToast('Enter your current password', 'error');
    return;
  }
  if (currentPw !== STATE.adminCreds.password) {
    showToast('❌ Current password is incorrect', 'error');
    document.getElementById('s-current-pass').style.borderColor = 'var(--pink)';
    setTimeout(() => document.getElementById('s-current-pass').style.borderColor = '', 1500);
    return;
  }
  if (!newPw || newPw.length < 6) {
    showToast('New password must be at least 6 characters', 'error');
    return;
  }
  if (newPw !== confirmPw) {
    showToast('❌ New passwords do not match', 'error');
    document.getElementById('s-confirm-pass').style.borderColor = 'var(--pink)';
    setTimeout(() => document.getElementById('s-confirm-pass').style.borderColor = '', 1500);
    return;
  }
  if (newPw === currentPw) {
    showToast('New password must be different from current', 'error');
    return;
  }

  STATE.adminCreds.password = newPw;
  lsSave('adminCreds', STATE.adminCreds);

  document.getElementById('s-current-pass').value = '';
  document.getElementById('s-new-pass').value     = '';
  document.getElementById('s-confirm-pass').value = '';
  updatePassStrength('');
  showToast('✅ Password updated! Use it next login.', 'success');
}

/* ---- Save EmailJS configuration ---- */
function saveEmailJSConfig() {
  const svcId   = document.getElementById('s-ejs-service').value.trim();
  const tplId   = document.getElementById('s-ejs-template').value.trim();
  const pubKey  = document.getElementById('s-ejs-pubkey').value.trim();
  const recip   = document.getElementById('s-ejs-recipient').value.trim();

  if (!svcId || !tplId || !pubKey) {
    showToast('Please fill in all three EmailJS fields', 'error');
    return;
  }
  if (recip && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recip)) {
    showToast('Please enter a valid recipient email', 'error');
    return;
  }

  STATE.emailjsConfig = {
    serviceId:      svcId,
    templateId:     tplId,
    publicKey:      pubKey,
    recipientEmail: recip || 'thepallisudharshan@gmail.com'
  };
  lsSave('emailjsConfig', STATE.emailjsConfig);

  // Update the live runtime variables so contact form works immediately
  window.EMAILJS_SERVICE_ID_LIVE  = svcId;
  window.EMAILJS_TEMPLATE_ID_LIVE = tplId;
  window.EMAILJS_PUBLIC_KEY_LIVE  = pubKey;

  updateEmailJSStatusBadge(svcId, tplId, pubKey);

  // Also update the recipient shown in contact form
  const destEl = document.querySelector('[data-emailjs-dest]');
  if (destEl) destEl.textContent = recip;

  showToast('✅ EmailJS config saved! Contact form is live.', 'success');
}
