/* 小布主页交互 — 粒子网络 · 打字机 · 滚动动画 · 3D 卡片 */
(function () {
  'use strict';

  /* ---------- 1. 粒子网络背景 ---------- */
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  let W, H, dots = [];
  let COUNT = window.innerWidth < 640 ? 30 : 70; // 移动端减粒子
  const LINK = 130; // 连线距离阈值

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.6 + 0.8
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // 连线
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          const a = (1 - d / LINK) * 0.28;
          ctx.strokeStyle = 'rgba(56, 189, 248, ' + a + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
    // 粒子
    for (const p of dots) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(125, 211, 252, 0.75)';
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }
    requestAnimationFrame(draw);
  }

  resize();
  initDots();
  draw();
  window.addEventListener('resize', () => { resize(); initDots(); });

  /* ---------- 2. 打字机 ---------- */
  const phrases = [
    '全栈开发者',
    '前端工程师',
    '数据可视化实践者',
    '物联网深耕者',
    '把数据变成界面'
  ];
  const typeEl = document.querySelector('.type-line');
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const word = phrases[pi];
    if (!deleting) {
      ci++;
      typeEl.textContent = word.slice(0, ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 1900); return; }
      setTimeout(type, 95);
    } else {
      ci--;
      typeEl.textContent = word.slice(0, ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 350); return; }
      setTimeout(type, 42);
    }
  }
  setTimeout(type, 600);

  /* ---------- 3. 滚动显现 + 技能条 + 数字计数 ---------- */
  const revealables = document.querySelectorAll('.sec, .stats, .footer');
  revealables.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add('in');
      // 技能条填充
      en.target.querySelectorAll('.bar i').forEach(b => {
        const w = b.dataset.w || '0';
        setTimeout(() => { b.style.width = w + '%'; }, 120);
      });
      // 数字滚动
      en.target.querySelectorAll('.num').forEach(n => countUp(n));
      io.unobserve(en.target);
    }
  }, { threshold: 0.18 });

  revealables.forEach(el => io.observe(el));

  function countUp(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const dur = 1100;
    const t0 = performance.now();
    function step(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (target === 100 ? '%' : '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- 4. 卡片 3D 倾斜 ---------- */
  document.querySelectorAll('.card.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(700px) rotateY(' + (px * 10) + 'deg) rotateX(' + (-py * 10) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 5. 淡入优先区 ---------- */
  const hero = document.querySelector('.hero');
  if (hero) hero.classList.add('in');
})();
