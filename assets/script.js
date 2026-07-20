/* 巡 MEGURU 共通スクリプト / v7 外部化（2026-07-20）
   4言語ページで共有。defer で読み込むためDOM構築後に実行される。 */
const header = document.getElementById('siteHeader');
const floatingCta = document.getElementById('floatingCta');
const heroEl = document.querySelector('.hero');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 50);
  floatingCta.classList.toggle('visible', y > window.innerHeight * 0.6);
  // Detach hero color when leaving hero
  const heroBottom = heroEl ? heroEl.offsetTop + heroEl.offsetHeight - 80 : 0;
  header.classList.toggle('is-on-hero', y < heroBottom);
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// v6: 平面図ハイライトは純CSSアニメーション（Walking Dot）に切替済み — JS不要

// v4: Hokusai wave reveal on scroll into Story section
const storyWave = document.getElementById('storyWave');
if (storyWave) {
  const waveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        storyWave.classList.add('visible');
      } else {
        // Reset when leaving so re-entry re-triggers reveal
        if (entry.boundingClientRect.top > 0) {
          storyWave.classList.remove('visible');
        }
      }
    });
  }, { threshold: 0.25 });
  waveObserver.observe(storyWave);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// v6: DETAILS「もっと見る」ボタン（初期8枚→最大16枚）
const detailsGrid = document.getElementById('detailsGrid');
const detailsMoreWrap = document.getElementById('detailsMoreWrap');
const detailsMoreBtn = document.getElementById('detailsMoreBtn');
if (detailsGrid && detailsMoreBtn) {
  const totalImgs = detailsGrid.querySelectorAll('img').length;
  // 写真が8枚以下ならボタン不要
  if (totalImgs <= 8) {
    detailsMoreWrap.style.display = 'none';
  }
  detailsMoreBtn.addEventListener('click', () => {
    const isOpen = detailsGrid.classList.toggle('show-all');
    detailsMoreBtn.textContent = isOpen ? '閉じる ↑' : 'もっと見る ↓';
    detailsMoreBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (!isOpen) {
      // 閉じる時、グリッド先頭へスムーススクロール（下のスペースに取り残されないため）
      const y = detailsGrid.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
}

// v6: DETAILS Lightbox（クリックで拡大表示）
const lightboxEl = document.getElementById('lightbox');
if (lightboxEl) {
  const lightboxImg = lightboxEl.querySelector('img');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryImgs = document.querySelectorAll('.details__grid img');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxEl.classList.add('open');
    lightboxEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightboxEl.classList.remove('open');
    lightboxEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // 描画完了後にsrcをクリア（フェードアウトを綺麗に見せるため遅延）
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  galleryImgs.forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
  lightboxEl.addEventListener('click', (e) => {
    if (e.target === lightboxEl || e.target === lightboxClose) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxEl.classList.contains('open')) closeLightbox();
  });
}
