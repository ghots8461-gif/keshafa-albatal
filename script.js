
(() => {
  const $ = (selector) => document.querySelector(selector);

  const menuBtn = $('#menuBtn');
  const nav = $('#nav');
  const year = $('#year');
  const progress = $('#scrollProgress');
  const topBtn = $('#backToTop');

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // قائمة الموبايل
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');

      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute(
        'aria-label',
        open ? 'إغلاق القائمة' : 'فتح القائمة'
      );
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', event => {
      if (
        !nav.contains(event.target) &&
        !menuBtn.contains(event.target)
      ) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // معرض الصور
  const items = [...document.querySelectorAll('.gallery-item')];
  const box = $('#lightbox');
  const image = $('#lightboxImage');
  const caption = $('#lightboxCaption');
  const counter = $('#lightboxCounter');

  let index = 0;

  function showImage(i) {
    if (!items.length || !image) return;

    index = (i + items.length) % items.length;

    const item = items[index];
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-caption strong');

    image.src = item.dataset.image || (img && img.src) || '';
    image.alt = img ? img.alt : 'صورة مكبرة';

    if (caption) {
      caption.textContent = title ? title.textContent : '';
    }

    if (counter) {
      counter.textContent = `${index + 1} / ${items.length}`;
    }
  }

  function openLightbox(i) {
    if (!box) return;

    showImage(i);
    box.classList.add('open');
    box.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!box) return;

    box.classList.remove('open');
    box.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  $('#closeLightbox')?.addEventListener('click', closeLightbox);

  $('#prevImage')?.addEventListener('click', () => {
    showImage(index - 1);
  });

  $('#nextImage')?.addEventListener('click', () => {
    showImage(index + 1);
  });

  box?.addEventListener('click', event => {
    if (event.target === box) closeLightbox();
  });

  document.addEventListener('keydown', event => {
    if (!box?.classList.contains('open')) return;

    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showImage(index - 1);
    if (event.key === 'ArrowLeft') showImage(index + 1);
  });

  // حركة ظهور الأقسام
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(element => observer.observe(element));
  } else {
    reveals.forEach(element => {
      element.classList.add('revealed');
    });
  }

  // شريط التقدم وزر العودة للأعلى
  function handleScroll() {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    if (progress) {
      progress.style.width =
        (maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0) + '%';
    }

    topBtn?.classList.toggle('visible', window.scrollY > 450);

    let active = 'home';

    document.querySelectorAll('main section[id]').forEach(section => {
      if (window.scrollY >= section.offsetTop - 150) {
        active = section.id;
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + active
      );
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  topBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
