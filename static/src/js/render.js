/* ============================================================
   render.js
   Renders all portfolio sections from STATE data
============================================================ */

function renderAll() {
  renderHero();
  renderAbout();
  renderSkills();
  renderProjects();
  renderExperience();
  renderEducation();
  renderResume();
  renderContact();
  renderProfileImg();
  renderEmailDest();
}

/* ---- HERO ---- */
function renderHero() {
  const h = STATE.hero;
  const el = id => document.getElementById(id);

  el('hero-badge-text').textContent   = h.badge;
  el('hero-greeting-text').textContent = h.greeting;
  el('hero-name-text').textContent     = h.name;
  el('hero-desc-text').textContent     = h.desc;
  el('hero-linkedin-link').href        = h.linkedin;
  el('hero-github-link').href          = h.github;
  el('resume-download-btn').href       = STATE.resumeSrc || 'assets/resume.pdf';
  el('footer-name').textContent        = h.name;

  // Reset typing effect titles
  window.typingTitles = h.titles
    .split(',')
    .map(t => t.trim())
    .filter(Boolean);
  if (!window.typingTitles.length) window.typingTitles = ['Data Scientist'];
}

/* ---- ABOUT ---- */
function renderAbout() {
  const a = STATE.about;
  // Paragraphs
  document.getElementById('about-text-display').innerHTML =
    a.text.split('\n\n').map(p => `<p>${p}</p>`).join('');
  // Stats
  document.getElementById('about-stats-display').innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${a.stat1_num}</div>
      <div class="stat-label">${a.stat1_label}</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${a.stat2_num}</div>
      <div class="stat-label">${a.stat2_label}</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${a.stat3_num}</div>
      <div class="stat-label">${a.stat3_label}</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${a.stat4_num}</div>
      <div class="stat-label">${a.stat4_label}</div>
    </div>
  `;
}

/* ---- SKILLS ---- */
function renderSkills() {
  // Group by category
  const cats = {};
  STATE.skills.forEach(s => {
    if (!cats[s.category]) cats[s.category] = [];
    cats[s.category].push(s);
  });

  document.getElementById('skills-display').innerHTML =
    Object.entries(cats).map(([cat, skills]) => `
      <div class="skill-category">
        <div class="skill-cat-title">${cat}</div>
        ${skills.map(s => `
          <div class="skill-item">
            <div class="skill-info">
              <span class="skill-name">${s.name}</span>
              <span class="skill-pct">${s.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" data-width="${s.level}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('');
}

/* ---- PROJECTS ---- */
const GH_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757
  -1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998
  .108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22
  -.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405
  1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176
  .765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
  0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297
  c0-6.627-5.373-12-12-12"/>
</svg>`;

function renderProjects() {
  document.getElementById('projects-display').innerHTML =
    STATE.projects.map(p => `
      <div class="project-card reveal">
        <div class="project-header">
          <div class="project-icon">${p.icon || '🚀'}</div>
          <div class="project-links">
            ${p.github
              ? `<a href="${p.github}" target="_blank" class="project-link" title="GitHub">${GH_ICON}</a>`
              : ''}
            ${p.demo
              ? `<a href="${p.demo}" target="_blank" class="project-link" title="Live Demo">🔗</a>`
              : ''}
          </div>
        </div>
        <div class="project-body">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="tech-tags">
            ${p.tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');

  // Re-observe new cards for scroll reveal
  document.querySelectorAll('.project-card.reveal').forEach(el => revealObserver.observe(el));
}

/* ---- EXPERIENCE ---- */
function renderExperience() {
  document.getElementById('experience-display').innerHTML =
    STATE.experience.map(e => `
      <div class="timeline-item reveal">
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <div class="timeline-role">${e.role}</div>
          <div class="timeline-company">${e.company.toUpperCase()} · ${e.location.toUpperCase()}</div>
          <div class="timeline-date">📅 ${e.duration}</div>
          <ul class="timeline-points">
            ${e.points.split('\n').filter(Boolean).map(pt => `<li>${pt}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');

  document.querySelectorAll('#experience-display .reveal').forEach(el => revealObserver.observe(el));
}

/* ---- EDUCATION ---- */
function renderEducation() {
  document.getElementById('education-display').innerHTML =
    STATE.education.map(e => `
      <div class="edu-card reveal">
        <div class="edu-icon">${e.icon || '🎓'}</div>
        <div>
          <div class="edu-degree">${e.degree}</div>
          <div class="edu-school">${e.school.toUpperCase()}</div>
          <div class="edu-year">📅 ${e.year}</div>
        </div>
      </div>
    `).join('');

  document.querySelectorAll('#education-display .reveal').forEach(el => revealObserver.observe(el));
}

/* ---- RESUME ---- */
function renderResume() {
  const src = STATE.resumeSrc || 'assets/resume.pdf';
  document.getElementById('resume-iframe').src     = src;
  document.getElementById('resume-dl-btn').href    = src;
  document.getElementById('resume-download-btn').href = src;
}

/* ---- CONTACT ---- */
function renderContact() {
  const c = STATE.contactInfo;
  document.getElementById('contact-heading-display').textContent = c.heading;
  document.getElementById('contact-desc-display').textContent    = c.desc;
  document.getElementById('contact-items-display').innerHTML = `
    <a href="mailto:${c.email}"   class="contact-item"><div class="contact-item-icon">📧</div>${c.email}</a>
    <a href="tel:${c.phone}"      class="contact-item"><div class="contact-item-icon">📱</div>${c.phone}</a>
    <span class="contact-item">  <div class="contact-item-icon">📍</div>${c.location}</span>
    <a href="${c.linkedin}" target="_blank" class="contact-item"><div class="contact-item-icon">💼</div>LinkedIn Profile</a>
    <a href="${c.github}"   target="_blank" class="contact-item"><div class="contact-item-icon">🐙</div>GitHub Profile</a>
  `;
}

/* ---- PROFILE IMAGE ---- */
function renderProfileImg() {
  const src = STATE.profileImg || 'assets/profile.jpg';
  document.getElementById('main-profile-img').src = src;
  const prev = document.getElementById('profile-preview-admin');
  if (prev) prev.src = src;
}

/* ---- Update contact form destination from emailjsConfig ---- */
function renderEmailDest() {
  const dest = document.getElementById('contact-form-dest');
  if (!dest) return;
  const email = (STATE.emailjsConfig && STATE.emailjsConfig.recipientEmail)
    ? STATE.emailjsConfig.recipientEmail
    : 'thepallisudharshan@gmail.com';
  dest.textContent = email;
}
