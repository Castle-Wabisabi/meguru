/* wp-gsap-animate: meguru 全力版(max) 2026-08-29
   日本語ページ(index.html)専用。assets/script.js（4言語共通の基本動作）の後に読み込む。
   オープニング円相・ScrollSmoother・マルキー・金粉・ピン留め墨入れ・回転リビール・マグネットCTA
   ブランド：生成り×墨×朱（#8B3A2F）＋金（#C9A227）。「巡る」＝円・回転をモチーフに使う。 */
(function () {
  'use strict';

  var curtain = document.getElementById('maxCurtain');
  function dropCurtain() { if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain); }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dropCurtain();
    return;
  }

  var failsafe = setTimeout(dropCurtain, 3500);

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function ensureGsap() {
    var base = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/';
    var p = Promise.resolve();
    if (!window.gsap) p = p.then(function () { return loadScript(base + 'gsap.min.js'); });
    return p.then(function () {
      if (!window.ScrollTrigger) return loadScript(base + 'ScrollTrigger.min.js');
    }).then(function () {
      if (!window.ScrollSmoother) return loadScript(base + 'ScrollSmoother.min.js').catch(function () {});
    });
  }
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  function ST(trigger) { return { trigger: trigger, start: 'top 80%' }; }

  function splitCharsDeep(el) {
    if (!el) return [];
    if (!el.dataset.wgaSplit) {
      el.dataset.wgaSplit = '1';
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            if (/^\s*$/.test(n.textContent)) return;
            var frag = document.createDocumentFragment();
            n.textContent.split('').forEach(function (ch) {
              if (ch === ' ' || ch === '\n' || ch === '\t') { frag.appendChild(document.createTextNode(' ')); return; }
              var s = document.createElement('span');
              s.className = 'wga-ch'; s.style.display = 'inline-block';
              s.textContent = ch;
              frag.appendChild(s);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
        });
      })(el);
    }
    return el.querySelectorAll('.wga-ch');
  }

  var VERMIL = '#8B3A2F', GOLD = '#C9A227', INK = '#1F1F1F';

  function injectStyles() {
    var css = [
      '.max-progress{position:fixed;top:0;left:0;height:3px;width:100%;background:' + VERMIL + ';transform:scaleX(0);transform-origin:left;z-index:1200;pointer-events:none}',
      '.max-marquee{overflow:hidden;padding:24px 0;border-top:1px solid rgba(139,58,47,.25);border-bottom:1px solid rgba(139,58,47,.25);background:transparent}',
      '.max-marquee .max-track{display:flex;white-space:nowrap;will-change:transform}',
      '.max-marquee .max-item{flex:0 0 auto;font-family:"Shippori Mincho","Noto Serif JP",serif;font-size:clamp(18px,2.4vw,28px);letter-spacing:.3em;color:' + VERMIL + ';opacity:.85;padding-right:3.2em}',
      '.max-dust{position:absolute;border-radius:50%;background:' + GOLD + ';pointer-events:none;will-change:transform,opacity}',
      '.scarcity,.final-cta{position:relative;overflow:hidden}',
      '.scene__image{overflow:hidden}',
      '.max-veil{position:absolute;inset:0;background:' + VERMIL + ';z-index:4;pointer-events:none;transform-origin:left}',
      '.pleasure-card__img{position:relative;overflow:hidden}',
      '.max-magnet{will-change:transform}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'max-style'; s.textContent = css;
    document.head.appendChild(s);
  }

  function buildDecor() {
    var bar = document.createElement('div');
    bar.className = 'max-progress'; bar.id = 'maxProgress';
    document.body.appendChild(bar);

    function makeMarquee() {
      var wrap = document.createElement('div');
      wrap.className = 'max-marquee'; wrap.setAttribute('aria-hidden', 'true');
      var track = document.createElement('div');
      track.className = 'max-track';
      for (var i = 0; i < 4; i++) {
        var item = document.createElement('span');
        item.className = 'max-item';
        item.textContent = '巡　—　MEGURU　—　食・街・湯を巡る　—　姫路城下町　—　一日一組　—';
        track.appendChild(item);
      }
      wrap.appendChild(track);
      return wrap;
    }
    var pleasures = document.getElementById('pleasures');
    if (pleasures) pleasures.parentNode.insertBefore(makeMarquee(), pleasures);
    var finalCta = document.querySelector('.final-cta');
    if (finalCta) finalCta.parentNode.insertBefore(makeMarquee(), finalCta);

    function dust(container, count) {
      if (!container) return [];
      var out = [];
      for (var i = 0; i < count; i++) {
        var d = document.createElement('span');
        d.className = 'max-dust';
        var size = 2 + Math.random() * 4;
        d.style.width = size + 'px'; d.style.height = size + 'px';
        d.style.left = (Math.random() * 100) + '%';
        d.style.top = (15 + Math.random() * 75) + '%';
        d.style.opacity = '0';
        container.appendChild(d);
        out.push(d);
      }
      return out;
    }
    return {
      bar: bar,
      scDust: dust(document.querySelector('.scarcity'), 14),
      fcDust: dust(document.querySelector('.final-cta'), 12)
    };
  }

  onReady(function () {
    ensureGsap().then(function () {
      gsap.registerPlugin(ScrollTrigger);
      injectStyles();
      var decor = buildDecor();

      /* 既存のfade-in（IntersectionObserver＋CSS transition）はGSAPと競合するので無効化 */
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
        el.style.transition = 'none';
      });

      /* --- ScrollSmoother --- */
      var header = document.getElementById('siteHeader');
      var floating = document.getElementById('floatingCta');
      var lightbox = document.getElementById('lightbox');
      var smoother = null;
      if (window.ScrollSmoother) {
        gsap.registerPlugin(ScrollSmoother);
        var wrapper = document.createElement('div'); wrapper.id = 'smooth-wrapper';
        var content = document.createElement('div'); content.id = 'smooth-content';
        wrapper.appendChild(content);
        Array.prototype.slice.call(document.body.children).forEach(function (child) {
          if (child === header || child === curtain || child === decor.bar || child === floating || child === lightbox) return;
          if (child.tagName === 'SCRIPT' || child.tagName === 'NOSCRIPT') return;
          content.appendChild(child);
        });
        document.body.appendChild(wrapper);
        smoother = ScrollSmoother.create({ wrapper: wrapper, content: content, smooth: 1.2, effects: false, smoothTouch: false });
        // ライトボックス表示中はスクロールを止める（overflow:hiddenはSmootherに効かないため）
        if (lightbox) {
          new MutationObserver(function () {
            smoother.paused(lightbox.classList.contains('open'));
          }).observe(lightbox, { attributes: true, attributeFilter: ['class'] });
        }
      }

      /* --- オープニング：円相（朱の円）が描かれ「巡」が現れる --- */
      var heroTitle = document.querySelector('.hero__title');
      var heroChars = splitCharsDeep(heroTitle);
      gsap.set(['.hero__lead', '.hero__deeper', '.hero__sub', '.hero__badge'], { opacity: 0 });
      gsap.set(heroChars, { opacity: 0 });

      var open = gsap.timeline({ defaults: { ease: 'power2.out' } });
      if (curtain) {
        var circle = curtain.querySelector('.max-enso circle');
        var circleLen = 2 * Math.PI * 80;
        if (circle) {
          circle.style.strokeDasharray = circleLen;
          circle.style.strokeDashoffset = circleLen;
        }
        open
          .to(circle, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
          .fromTo(curtain.querySelector('.max-curtain-kanji'), { opacity: 0, scale: 0.6, rotation: -30 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.6)' }, '-=0.5')
          .fromTo(curtain.querySelector('.max-curtain-sub'), { opacity: 0, y: 12 }, { opacity: 0.9, y: 0, duration: 0.6 }, '-=0.3')
          .to(curtain, { yPercent: -100, duration: 1.0, ease: 'power4.inOut', delay: 0.4 })
          .add(function () { clearTimeout(failsafe); dropCurtain(); });
      }
      open
        .fromTo('.hero__lead', { opacity: 0, letterSpacing: '0.9em' }, { opacity: 1, letterSpacing: '0.4em', duration: 0.8 }, '-=0.7')
        .fromTo(heroChars, { opacity: 0, rotationX: -90, y: 30 }, { opacity: 1, rotationX: 0, y: 0, duration: 0.7, stagger: 0.05, ease: 'back.out(1.4)' }, '-=0.5')
        .fromTo('.meguru-char', { rotation: -360 }, { rotation: 0, duration: 1.2, ease: 'power3.out' }, '<')
        .fromTo('.hero__deeper', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('.hero__sub', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero__badge', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3');

      gsap.set('.meguru-char', { display: 'inline-block', transformOrigin: '50% 55%' });
      gsap.to('.hero__inner', { opacity: 0, y: -60, scale: 0.97, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });
      gsap.to('.hero__scroll', { y: 10, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true });

      /* --- 背景の巨大漢字（次・巡・姫・壱）：スクロールでゆっくり回りながら流れる --- */
      document.querySelectorAll('.kanji-bg').forEach(function (k) {
        gsap.fromTo(k, { yPercent: 12, rotation: -6 }, { yPercent: -12, rotation: 6, ease: 'none',
          scrollTrigger: { trigger: k.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      /* --- 読み進みバー・マルキー・金粉 --- */
      gsap.to(decor.bar, { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'max', scrub: 0.3 } });
      document.querySelectorAll('.max-marquee .max-track').forEach(function (track) {
        var half = track.scrollWidth / 2;
        gsap.to(track, { x: -half, duration: 22, ease: 'none', repeat: -1,
          modifiers: { x: function (x) { return (parseFloat(x) % half) + 'px'; } } });
      });
      function twinkle(list) {
        list.forEach(function (d) {
          gsap.to(d, { opacity: 0.3 + Math.random() * 0.45, duration: 1 + Math.random() * 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 2 });
          gsap.to(d, { x: 'random(-60,60)', y: 'random(-90,-20)', duration: 'random(6,12)', repeat: -1, yoyo: true, ease: 'sine.inOut', repeatRefresh: true });
        });
      }
      twinkle(decor.scDust); twinkle(decor.fcDust);

      /* --- Concept：ピン留め＋墨が染みるように文字が濃くなる --- */
      var stmt = document.querySelector('.concept__text');
      if (stmt) {
        var eyebrow = document.querySelector('.concept__eyebrow');
        if (eyebrow) gsap.fromTo(eyebrow, { opacity: 0, letterSpacing: '0.8em' }, { opacity: 1, letterSpacing: '0.3em', duration: 0.8, scrollTrigger: ST(eyebrow) });
        var stChars = splitCharsDeep(stmt);
        gsap.fromTo(stChars, { opacity: 0.08 }, { opacity: 1, ease: 'none', stagger: 0.06,
          scrollTrigger: { trigger: stmt, start: 'top 45%', end: '+=600', scrub: 0.4, pin: stmt, pinSpacing: true } });
      }

      /* --- 見出し類：1文字ずつ回転して起き上がる --- */
      document.querySelectorAll('.section-title').forEach(function (title) {
        if (title.closest('.concept')) return;
        var chars = splitCharsDeep(title);
        gsap.set(title, { transformPerspective: 800 });
        gsap.fromTo(chars, { opacity: 0, rotationX: -92, y: 26, transformOrigin: '50% 100% -12px' },
          { opacity: 1, rotationX: 0, y: 0, duration: 0.6, ease: 'back.out(1.5)', stagger: 0.04,
            scrollTrigger: { trigger: title, start: 'top 85%' } });
      });
      document.querySelectorAll('.section-eyebrow').forEach(function (eb) {
        gsap.fromTo(eb, { opacity: 0, letterSpacing: '0.7em' }, { opacity: 1, letterSpacing: '0.28em', duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: eb, start: 'top 88%' } });
      });

      /* --- Story：本文スライド --- */
      gsap.fromTo('.story__text', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2, scrollTrigger: ST('.story__body') });

      /* --- Rooms：平面図はズームイン、シーン6枚は写真リビール＋番号ポップ --- */
      gsap.fromTo('.rooms__plan', { opacity: 0, scale: 0.94, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out', scrollTrigger: ST('.rooms__layout') });
      document.querySelectorAll('.scene').forEach(function (scene, i) {
        var img = scene.querySelector('.scene__image');
        var num = scene.querySelector('.scene__num');
        var tls = gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top 80%' } });
        if (img) {
          var veil = document.createElement('div');
          veil.className = 'max-veil';
          img.style.position = img.style.position || 'relative';
          img.appendChild(veil);
          tls.fromTo(img, { clipPath: 'inset(0 100% 0 0)', scale: 1.08 }, { clipPath: 'inset(0 0% 0 0)', scale: 1, duration: 1.0, ease: 'power3.inOut' })
             .fromTo(veil, { scaleX: 1, transformOrigin: 'left' }, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power3.inOut' }, '-=0.5');
        }
        if (num) tls.fromTo(num, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, '-=0.7');
        tls.fromTo([scene.querySelector('.scene__title'), scene.querySelector('.scene__caption')], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, '-=0.5');
      });

      /* --- DETAILS：サムネイルがポップに --- */
      gsap.fromTo('#detailsGrid img', { opacity: 0, y: 24, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)', stagger: 0.08, scrollTrigger: ST('#detailsGrid') });

      /* --- Pleasures：カード reveal＋漢字（食・街・湯）ズーム --- */
      document.querySelectorAll('.pleasure-card').forEach(function (card, i) {
        var img = card.querySelector('.pleasure-card__img');
        var kanji = card.querySelector('.pleasure-card__kanji');
        var tlp = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 82%' } });
        tlp.fromTo(card, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.12 });
        if (img) tlp.fromTo(img, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'power3.inOut' }, '-=0.5');
        if (kanji) tlp.fromTo(kanji, { opacity: 0, scale: 1.6, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power2.out' }, '-=0.4');
      });

      /* --- Location：旅程の分数カウントアップ＋ブロック登場 --- */
      gsap.fromTo('.location__map', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: ST('.location__map') });
      gsap.fromTo('.travel-item', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15, scrollTrigger: ST('.travel-grid') });
      document.querySelectorAll('.travel-item__time').forEach(function (el) {
        var m = (el.textContent || '').match(/^(\d+)(.*)$/);
        if (!m) return;
        var end = parseInt(m[1], 10), suffix = m[2];
        var obj = { v: 0 };
        gsap.to(obj, { v: end, duration: 1.2, ease: 'power2.out', scrollTrigger: ST('.travel-grid'),
          onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; } });
      });
      gsap.fromTo('.castle-block__inner > *', { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2, scrollTrigger: ST('.castle-block') });
      document.querySelectorAll('.foodwalk-item').forEach(function (item) {
        var tlf = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 85%' } });
        tlf.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
           .fromTo(item.querySelectorAll('li'), { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }, '-=0.3');
      });

      /* --- Scarcity：壱が浮かび、CTAが力強く --- */
      gsap.fromTo('.scarcity__inner > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15, scrollTrigger: ST('.scarcity') });

      /* --- Amenities：アイコンがポップに弾む --- */
      gsap.fromTo('.amenity', { opacity: 0, y: 26, scale: 0.75 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.7)', stagger: 0.06, scrollTrigger: ST('.amenities__grid') });
      gsap.fromTo('.amenities__note', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: ST('.amenities__note') });

      /* --- Access / Final CTA --- */
      gsap.fromTo('.access__grid > *', { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.18, scrollTrigger: ST('.access__grid') });
      gsap.fromTo('.final-cta__inner > *', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.14, scrollTrigger: ST('.final-cta') });

      /* --- マグネットCTA --- */
      document.querySelectorAll('.btn--large, .btn--outline, .header-cta').forEach(function (btn) {
        btn.classList.add('max-magnet');
        var qx = gsap.quickTo(btn, 'x', { duration: 0.35, ease: 'power3.out' });
        var qy = gsap.quickTo(btn, 'y', { duration: 0.35, ease: 'power3.out' });
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          qx((e.clientX - (r.left + r.width / 2)) * 0.3);
          qy((e.clientY - (r.top + r.height / 2)) * 0.3);
        });
        btn.addEventListener('mouseleave', function () { qx(0); qy(0); });
      });

      /* DETAILSの「もっと見る」で高さが変わるので発火位置を再計算 */
      var moreBtn = document.getElementById('detailsMoreBtn');
      if (moreBtn) moreBtn.addEventListener('click', function () { setTimeout(function () { ScrollTrigger.refresh(); }, 350); });

      window.addEventListener('load', function () { ScrollTrigger.refresh(); });

    }).catch(function (e) { clearTimeout(failsafe); dropCurtain(); console.warn('gsap-max: load failed', e); });
  });
})();
/* /wp-gsap-animate */
