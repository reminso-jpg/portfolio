/* ============================================================
   Dental Pro — script.js
   ============================================================ */

/* ── Nav: scroll shadow + sticky state ── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile burger menu ── */
(function initBurger() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const toggle = () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';

    /* Animate burger → ✕ */
    const spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  };

  burger.addEventListener('click', toggle);

  /* Close menu when any link inside it is clicked */
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    })
  );

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) toggle();
  });
})();

/* ── Scroll-reveal via IntersectionObserver ── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  /* Если браузер не поддерживает IO — сразу делаем видимыми */
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); /* наблюдаем один раз */
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();

/* ── Smooth scroll for anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── Form: phone mask ── */
(function initPhoneMask() {
  const phoneInput = document.getElementById('phone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '');

    if (val.startsWith('8')) val = '7' + val.slice(1);
    if (!val.startsWith('7') && val.length > 0) val = '7' + val;

    val = val.slice(0, 11);

    let formatted = '';
    if (val.length > 0)  formatted  = '+7';
    if (val.length > 1)  formatted += ' (' + val.slice(1, 4);
    if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
    if (val.length >= 7) formatted += '-' + val.slice(7, 9);
    if (val.length >= 9) formatted += '-' + val.slice(9, 11);

    this.value = formatted;
  });
})();

/* ── Form: min date = today ── */
(function initDateMin() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
})();

/* ── Form: submit handler ── */
(function initForm() {
  const form = document.querySelector('form[action="#"]');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name  = form.querySelector('#name');
    const phone = form.querySelector('#phone');

    /* Простая валидация */
    let valid = true;

    [name, phone].forEach(field => {
      if (!field) return;
      const empty = !field.value.trim();
      field.style.borderColor = empty ? '#e53e3e' : '';
      if (empty) valid = false;
    });

    if (!valid) return;

    /* Имитируем отправку */
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Отправляем…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Заявка отправлена!';
      btn.style.background = '#2d8a4e';
      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 900);
  });
})();

/* ── Card tilt on hover (desktop) ── */
(function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return; /* пропускаем тач */

  const cards = document.querySelectorAll('.service-card, .feature-card, .service-item');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 3;
      const rotY   =  dx * 3;

      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
