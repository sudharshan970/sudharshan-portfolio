/* ============================================================
   animations.js
   Cursor, Particles, Typing effect, Scroll Reveal, Donut Charts
============================================================ */

/* ============================================================
   CUSTOM CURSOR
============================================================ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const glow   = document.getElementById('cursor-glow');

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    glow.style.left   = e.clientX + 'px';
    glow.style.top    = e.clientY + 'px';
  });

  function addHover(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }
  addHover('a, button, .project-card, .skill-category, .stat-card, .metric-card, .edu-card');
}

/* ============================================================
   PARTICLES BACKGROUND
============================================================ */
let adminOpen = false;

function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * canvas.width;
      this.y  = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.4 + 0.3;
      this.o  = Math.random() * 0.4 + 0.1;
      this.c  = Math.random() > 0.5 ? '0,212,255' : '191,90,242';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.o})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (adminOpen) { requestAnimationFrame(animate); return; }

    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================================
   TYPING EFFECT
============================================================ */
window.typingTitles = ['Data Scientist', 'ML Engineer', 'Python Developer', 'AI Enthusiast'];
let tIdx = 0, cIdx = 0, isDeleting = false;

function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  function tick() {
    const titles = window.typingTitles;
    const cur    = titles[tIdx] || 'Data Scientist';

    if (isDeleting) {
      el.textContent = cur.substring(0, cIdx--);
      if (cIdx < 0) {
        isDeleting = false;
        tIdx = (tIdx + 1) % titles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 60);
    } else {
      el.textContent = cur.substring(0, cIdx++);
      if (cIdx > cur.length) {
        isDeleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 90);
    }
  }
  tick();
}

/* ============================================================
   SCROLL REVEAL
============================================================ */
let revealObserver;

function initScrollReveal() {
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when revealed
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ============================================================
   DONUT CHARTS (ML Metrics)
============================================================ */
function drawDonut(canvasId, value, color1, color2) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext('2d');
  const cx = 55, cy = 55, r = 42, lw = 7;

  ctx.clearRect(0, 0, 110, 110);

  // Background ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth   = lw;
  ctx.stroke();

  // Value arc
  const grad  = ctx.createLinearGradient(0, 0, 110, 110);
  grad.addColorStop(0, color1);
  grad.addColorStop(1, color2);
  const angle = (value / 100) * Math.PI * 2 - Math.PI / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, angle);
  ctx.strokeStyle = grad;
  ctx.lineWidth   = lw;
  ctx.lineCap     = 'round';
  ctx.stroke();

  // Glow cap
  ctx.shadowColor = color1;
  ctx.shadowBlur  = 14;
  ctx.beginPath();
  ctx.arc(cx, cy, r, angle - 0.05, angle);
  ctx.strokeStyle = color1;
  ctx.lineWidth   = lw;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function initMetricCharts() {
  const metricsSection = document.getElementById('metrics');
  if (!metricsSection) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          drawDonut('chart-accuracy',  95, '#00d4ff', '#bf5af2');
          drawDonut('chart-precision', 93, '#bf5af2', '#ff2d78');
          drawDonut('chart-recall',    92, '#ff2d78', '#00d4ff');
        }, 300);
      }
    });
  }, { threshold: 0.3 });

  obs.observe(metricsSection);
}

/* ============================================================
   NAVBAR ACTIVE HIGHLIGHT
============================================================ */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });
}

/* ============================================================
   SENDER EMAIL DISPLAY — live updates as user types
============================================================ */
function updateSenderDisplay(val) {
  const el = document.getElementById('cf-sender-display');
  if (!el) return;
  const v = val.trim();
  if (v && isValidEmail(v)) {
    el.textContent = v;
    el.href        = 'mailto:' + v;
    el.style.color = 'var(--purple)';
    el.title       = 'Click to open mail to: ' + v;
    // Make it clickable so Sudharshan can click it in the email too
    el.style.textDecoration = 'underline';
  } else {
    el.textContent          = v || 'your@email.com';
    el.href                 = '#';
    el.style.color          = v ? 'rgba(191,90,242,0.5)' : 'var(--muted)';
    el.style.textDecoration = 'none';
    el.title                = 'Sender email (fill in below)';
  }
}

/* ============================================================
   CONTACT FORM — EmailJS Integration
   Sends message directly to thepallisudharshan@gmail.com
   reply_to = sender's email so Sudharshan can reply with one click
============================================================ */
function handleContactSubmit(btn) {
  const name    = document.getElementById('cf-name').value.trim();
  const email   = document.getElementById('cf-email').value.trim();
  const subject = (document.getElementById('cf-subject') || {}).value || '';
  const msg     = document.getElementById('cf-msg').value.trim();

  /* Basic validation */
  if (!name || !email || !msg) {
    showToast('Please fill in all fields', 'error');
    shakeMissingFields(name, email, msg);
    return;
  }
  if (!isValidEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    document.getElementById('cf-email').style.borderColor = 'var(--pink)';
    return;
  }

  /* Resolve EmailJS keys: Admin Settings panel overrides the static config file */
  const _cfg      = (typeof STATE !== 'undefined' && STATE.emailjsConfig) || {};
  const _svcId    = (_cfg.serviceId  && _cfg.serviceId  !== 'YOUR_SERVICE_ID')  ? _cfg.serviceId
                  : (typeof EMAILJS_SERVICE_ID  !== 'undefined' ? EMAILJS_SERVICE_ID  : '');
  const _tplId    = (_cfg.templateId && _cfg.templateId !== 'YOUR_TEMPLATE_ID') ? _cfg.templateId
                  : (typeof EMAILJS_TEMPLATE_ID !== 'undefined' ? EMAILJS_TEMPLATE_ID : '');
  const _pubKey   = (_cfg.publicKey  && _cfg.publicKey  !== 'YOUR_PUBLIC_KEY')  ? _cfg.publicKey
                  : (typeof EMAILJS_PUBLIC_KEY  !== 'undefined' ? EMAILJS_PUBLIC_KEY  : '');
  const _toEmail  = _cfg.recipientEmail || 'thepallisudharshan@gmail.com';

  if (!_svcId || !_tplId || !_pubKey ||
      _svcId === 'YOUR_SERVICE_ID' || _tplId === 'YOUR_TEMPLATE_ID' || _pubKey === 'YOUR_PUBLIC_KEY') {
    showToast('⚙️ EmailJS not configured — go to Admin → Settings', 'error');
    return;
  }

  /* Sending state */
  btn.disabled      = true;
  btn.textContent   = '⏳ Sending...';
  btn.style.opacity = '0.7';

  /* Send via EmailJS — reply_to ensures Sudharshan can reply directly to sender */
  emailjs.send(
    _svcId,
    _tplId,
    {
      from_name:   name,
      from_email:  email,           // visible sender email
      subject:     subject || ('New Portfolio Message from ' + name),
      message:     msg,
      to_email:    _toEmail,
      reply_to:    email,           // clicking Reply in Gmail goes to sender
      sender_link: 'mailto:' + email  // clickable link in email body
    },
    _pubKey
  )
  .then(() => {
    /* Success */
    btn.textContent      = '✅ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #39ff14, #00d4ff)';
    btn.style.opacity    = '1';
    showToast('✅ Message delivered to Sudharshan!', 'success');

    /* Clear form */
    document.getElementById('cf-name').value    = '';
    document.getElementById('cf-email').value   = '';
    document.getElementById('cf-msg').value     = '';
    if (document.getElementById('cf-subject'))
      document.getElementById('cf-subject').value = '';
    updateSenderDisplay('');

    /* Reset button after 4s */
    setTimeout(() => {
      btn.textContent      = '⚡ Send Message';
      btn.style.background = '';
      btn.disabled         = false;
    }, 4000);
  })
  .catch(err => {
    console.error('EmailJS error:', err);
    btn.textContent      = '❌ Failed — Try Again';
    btn.style.background = 'linear-gradient(135deg, var(--pink), #c0392b)';
    btn.style.opacity    = '1';
    showToast('Failed to send. Check your EmailJS keys.', 'error');

    setTimeout(() => {
      btn.textContent      = '⚡ Send Message';
      btn.style.background = '';
      btn.disabled         = false;
    }, 3500);
  });
}

/* ---- Helpers ---- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeMissingFields(name, email, msg) {
  const fields = [
    { val: name,  id: 'cf-name'  },
    { val: email, id: 'cf-email' },
    { val: msg,   id: 'cf-msg'   }
  ];
  fields.forEach(({ val, id }) => {
    if (!val) {
      const el = document.getElementById(id);
      el.style.borderColor = 'var(--pink)';
      el.style.animation   = 'shake 0.4s ease';
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.animation   = '';
      }, 800);
    }
  });
}

/* Clear red border on user input */
['cf-name','cf-email','cf-msg'].forEach(id => {
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
});

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 3200);
}
