(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Loader */
  let n = 0;
  const loader = $('#loader'), num = $('#loaderNum'), bar = $('#loaderBar');
  document.body.classList.add('lock');
  const tick = setInterval(() => {
    n += Math.ceil(Math.random() * 7);
    if (n >= 100) {
      n = 100; clearInterval(tick);
      setTimeout(() => { loader.classList.add('done'); document.body.classList.remove('lock'); startCounters(); }, 300);
    }
    num.textContent = n; bar.style.width = n + '%';
  }, 60);

  /* Stars */
  const stars = $('#stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('i');
    s.className = 'star';
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;transform:scale(${Math.random()*1.5+.5})`;
    stars.appendChild(s);
  }

  /* Cursor */
  const cur = $('#cursor');
  addEventListener('mousemove', e => {
    cur.style.opacity = 1;
    cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px';
  });
  $$('a,button,.work,input,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });

  /* Scroll: nav, progress, parallax */
  const nav = $('#nav'), prog = $('#progress'), big = $('#bigText');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 40);
    prog.style.width = (y / h * 100) + '%';
    if (y < innerHeight) big.style.transform = `translate(-50%,calc(-55% + ${y*.25}px))`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  const burger = $('#burger'), links = $('#navLinks');
  burger.addEventListener('click', () => { burger.classList.toggle('open'); links.classList.toggle('open'); });
  $$('a', links).forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); }));

  /* Reveal + skill bars */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('u[data-w]', e.target).forEach(u => u.style.width = u.dataset.w + '%');
    $$('[data-count]', e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });

  /* Counters */
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = +el.dataset.count, t0 = performance.now(), d = 1600;
    const step = t => {
      const p = Math.min((t - t0) / d, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * to);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function startCounters() { $$('.hero__stats [data-count]').forEach(countUp); }

  /* Video modal */
  const modal = $('#modal'), frame = $('#modalFrame');
  const open = url => { frame.src = url + (url.includes('?') ? '&' : '?') + 'autoplay=1'; modal.classList.add('open'); document.body.classList.add('lock'); };
  const close = () => { modal.classList.remove('open'); frame.src = ''; document.body.classList.remove('lock'); };
  $$('.work').forEach(w => w.addEventListener('click', () => open(w.dataset.video)));
  $('#reelBtn').addEventListener('click', e => open(e.currentTarget.dataset.video));
  $('#modalClose').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  /* Form → WhatsApp (ganti nomor di bawah) */
  const WA_NUMBER = '6288210141046';
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const text = `Halo, saya ${f.get('nama')} (${f.get('email')}).\n\n${f.get('pesan')}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    $('#formNote').textContent = 'Membuka WhatsApp...';
    e.target.reset();
  });

  $('#year').textContent = new Date().getFullYear();
})();
