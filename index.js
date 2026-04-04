/* ══════════════════════════════════════════════════════════════
   TANNU KUMARI — Interactive Scripts
   Hacker Mode + Clean Light Theme
══════════════════════════════════════════════════════════════ */

/* ─── COPYRIGHT YEAR ─────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── THEME TOGGLE ───────────────────────────────────────────── */
(function () {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  // Read saved theme or default to hacker
  let currentTheme = localStorage.getItem('portfolio-theme') || 'hacker';

  function applyTheme(theme) {
    currentTheme = theme;
    html.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  // Apply on load
  applyTheme(currentTheme);

  // Toggle on click — multiple selectors for safety
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var next = currentTheme === 'hacker' ? 'light' : 'hacker';
      applyTheme(next);

      // Re-init canvas
      if (window._canvasSwitchTheme) {
        window._canvasSwitchTheme(next);
      }
    });
  }

  // Expose globally so HTML onclick can also call it
  window.toggleTheme = function () {
    var next = currentTheme === 'hacker' ? 'light' : 'hacker';
    applyTheme(next);
    if (window._canvasSwitchTheme) {
      window._canvasSwitchTheme(next);
    }
  };
})();

/* ─── CUSTOM CURSOR ──────────────────────────────────────────── */
(function () {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.14;
    followerY += (mouseY - followerY) * 0.14;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.querySelectorAll('a, button, .project-card, .skill-category, .social-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─── NAVBAR SCROLL ──────────────────────────────────────────── */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
})();

/* ─── HAMBURGER MENU ─────────────────────────────────────────── */
(function () {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

/* ─── HERO CANVAS — MATRIX RAIN (hacker) / PARTICLES (light) ── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, animId;
  let mode = document.documentElement.getAttribute('data-theme') || 'hacker';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── MATRIX RAIN ──────────────────────
  const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]';
  const FONT_SIZE = 14;
  let columns, drops;

  function initMatrix() {
    columns = Math.floor(W / FONT_SIZE);
    drops = Array.from({ length: columns }, () => Math.random() * -100);
  }
  initMatrix();

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = FONT_SIZE + 'px JetBrains Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;

      if (Math.random() > 0.96) {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
      } else if (Math.random() > 0.5) {
        ctx.fillStyle = 'rgba(0, 255, 65, 0.9)';
      } else {
        ctx.fillStyle = 'rgba(0, 255, 65, 0.35)';
      }

      ctx.fillText(char, x, y);

      if (y > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  // ── PARTICLE FIELD (light mode) ──────
  let particles = [];
  const COLORS_LIGHT = ['rgba(99,102,241,', 'rgba(139,92,246,', 'rgba(124,58,237,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = COLORS_LIGHT[Math.floor(Math.random() * COLORS_LIGHT.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 80);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.06;
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // ── ANIMATION LOOP ───────────────────
  function loop() {
    if (mode === 'hacker') {
      drawMatrix();
    } else {
      drawParticles();
    }
    animId = requestAnimationFrame(loop);
  }

  function switchTheme(theme) {
    mode = theme;
    cancelAnimationFrame(animId);
    ctx.clearRect(0, 0, W, H);
    if (theme === 'hacker') {
      initMatrix();
    } else {
      initParticles();
    }
    loop();
  }

  // Expose for theme toggle
  window._canvasSwitchTheme = switchTheme;

  // Start
  switchTheme(mode);
})();

/* ─── ROLE TEXT ROTATOR ──────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.role-item');
  if (!items.length) return;
  let current = 0;

  setInterval(() => {
    items[current].classList.remove('active');
    current = (current + 1) % items.length;
    items[current].classList.add('active');
  }, 2800);
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────────── */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
})();

/* ─── TILT EFFECT ON PROJECT CARDS ───────────────────────────── */
(function () {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── SHELF GALLERY ARROW BUTTONS ───────────────────────────── */
(function () {
  const gallery = document.getElementById('shelfGallery');
  const prev    = document.getElementById('shelfPrev');
  const next    = document.getElementById('shelfNext');
  if (!gallery || !prev || !next) return;

  const STEP = 170;

  next.addEventListener('click', (e) => {
    e.stopPropagation();
    gallery.scrollBy({ left: STEP, behavior: 'smooth' });
  });

  prev.addEventListener('click', (e) => {
    e.stopPropagation();
    gallery.scrollBy({ left: -STEP, behavior: 'smooth' });
  });
})();

/* ─── DRAG-TO-SCROLL for SHELF GALLERY ──────────────────────── */
(function () {
  document.querySelectorAll('.shelf-gallery').forEach(gallery => {
    let isDown = false, startX = 0, scrollLeft = 0;

    gallery.addEventListener('mousedown', e => {
      isDown = true;
      gallery.style.userSelect = 'none';
      startX = e.pageX - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
    });

    gallery.addEventListener('mouseleave', () => { isDown = false; gallery.style.userSelect = ''; });
    gallery.addEventListener('mouseup',    () => { isDown = false; gallery.style.userSelect = ''; });

    gallery.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - gallery.offsetLeft;
      const walk = (x - startX) * 1.4;
      gallery.scrollLeft = scrollLeft - walk;
    });
  });
})();

/* ─── SMOOTH ACTIVE NAV HIGHLIGHT ────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
    });
  });
})();
