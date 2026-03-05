/* ═══════════════════════════════════════════════════════
   ZENA NOZAR BAMBOAT — Portfolio Script
   ═══════════════════════════════════════════════════════ */

'use strict';

// ─── FOOTER YEAR ─────────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─── NAV: STICKY SHADOW ───────────────────────────────────────────────────────
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
};
window.addEventListener('scroll', onScroll, { passive: true });

// ─── NAV: MOBILE TOGGLE ───────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
// Close menu when a link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ─── NAV: ACTIVE LINK HIGHLIGHT ───────────────────────────────────────────────
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
const highlightNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

// ─── PROJECT TABS ─────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('aria-controls');
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(p => { p.hidden = true; });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(target).hidden = false;
  });
});

// ─── SCROLL FADE-IN ANIMATION ─────────────────────────────────────────────────
const fadeEls = document.querySelectorAll(
  '.project-card, .case-study, .support-card, .insight-card, .arch-card, .timeline-item, .skill-group, .about-card, .contact-card, .cert-card'
);
const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (i % 4) * 80 + 'ms';
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
fadeEls.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ─── NEURAL NETWORK CANVAS ANIMATION ─────────────────────────────────────────
(function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const W = canvas.width;
  const H = canvas.height;
  const NUM_NODES = 28;
  const CONN_DIST = 140;

  // Build nodes
  const nodes = Array.from({ length: NUM_NODES }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * (prefersReduced ? 0 : 0.55),
    vy: (Math.random() - 0.5) * (prefersReduced ? 0 : 0.55),
    r: 2.5 + Math.random() * 4.5,
    pulse: Math.random() * Math.PI * 2,
  }));

  // Accent colours
  const BLUE_LIGHT = 'rgba(59, 130, 246,';
  const BLUE_MID   = 'rgba(29, 107, 224,';
  const WHITE      = 'rgba(255,255,255,';

  let animId;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONN_DIST) {
          const alpha = (1 - dist / CONN_DIST) * 0.35;
          ctx.strokeStyle = BLUE_LIGHT + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(node => {
      node.pulse += 0.02;
      const glow = 0.6 + 0.4 * Math.sin(node.pulse);

      // Outer glow
      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 4);
      grad.addColorStop(0, BLUE_MID + (glow * 0.35) + ')');
      grad.addColorStop(1, BLUE_MID + '0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = node.r > 5 ? (WHITE + '0.9)') : (BLUE_LIGHT + (glow * 0.85) + ')');
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Move nodes
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > W) node.vx *= -1;
      if (node.y < 0 || node.y > H) node.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  draw();

  // Pause when off-screen (performance)
  const canvasObs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { if (!animId) draw(); }
    else { cancelAnimationFrame(animId); animId = null; }
  });
  canvasObs.observe(canvas);
})();

// ─── SKIP LINK ────────────────────────────────────────────────────────────────
(function addSkipLink() {
  const skip = document.createElement('a');
  skip.href = '#home';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to main content';
  document.body.prepend(skip);
})();
