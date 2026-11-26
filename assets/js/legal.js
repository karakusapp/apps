(() => {
  const bar = document.querySelector('.progress');
  const links = [...document.querySelectorAll('.toc a')];
  const heads = links.map((a) => document.getElementById(a.hash.slice(1))).filter(Boolean);

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    let current = heads[0];
    for (const h of heads) if (h.getBoundingClientRect().top < 140) current = h;
    links.forEach((a) => a.classList.toggle('active', current && a.hash === '#' + current.id));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelector('[data-top]')?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
