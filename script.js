/* =========================================================
   Wedding Invitation — script.js
   차민호 ♡ 조성경 (2026.10.17)
   Vanilla JS only. Implements motion-spec.md Must/Should items.
   ========================================================= */
(function () {
  'use strict';

  // ---------------------------------------------------------
  // PLACEHOLDERS — 실제 운영 시 아래 값을 채워주세요.
  // ---------------------------------------------------------
  const KAKAO_JS_KEY     = ''; // placeholder: 카카오 JavaScript 키 (https://developers.kakao.com/)
  const RSVP_FORM_URL    = '';
  const GUESTBOOK_URL    = '';
  const SHARE_TITLE      = '차민호 ♡ 조성경 결혼합니다';
  const SHARE_DESC       = '2026년 10월 17일 토요일 오후 4시\n삼청각 일화당';
  const SHARE_IMAGE      = location.origin + '/images/og-thumbnail.png';
  const TARGET_DATE_STR  = '2026-10-17';
  const TARGET_HOUR      = 14;

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced     = () => reducedMotion.matches;
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const haptic = (n) => { try { navigator.vibrate && navigator.vibrate(n); } catch (e) {} };
  let galleryAPI = { count: 0 };
  let activeRsvpFilter = 'all';

  // ---------------------------------------------------------
  // 1. HERO entrance step-in
  // ---------------------------------------------------------
  function setupHero() {
    const hero = $('.hero');
    if (!hero) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add('is-loaded'));
    });
  }

  function setupIntroOverlay(onDone) {
    const overlay = $('#intro-overlay');
    if (!overlay) {
      if (typeof onDone === 'function') onDone();
      return;
    }

    const holdMs = isReduced() ? 220 : 1180;
    window.setTimeout(() => {
      overlay.classList.add('is-leaving');
      document.body.classList.remove('intro-active');
      if (typeof onDone === 'function') onDone();
      window.setTimeout(() => {
        overlay.hidden = true;
      }, isReduced() ? 0 : 560);
    }, holdMs);
  }

  // ---------------------------------------------------------
  // 2. IntersectionObserver fade reveal
  // ---------------------------------------------------------
  function setupReveal() {
    const targets = $$('.reveal');
    if (!targets.length) return;
    if (isReduced()) {
      targets.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(el => io.observe(el));

    // 갤러리 첫 슬라이드 blur reveal
    const firstSlide = $('.gallery-slide:first-child');
    if (firstSlide) firstSlide.classList.add('first-reveal');
  }

  // ---------------------------------------------------------
  // 3. Petals background canvas (motion §1-A)
  // ---------------------------------------------------------
  function setupPetals() {
    if (isReduced()) return;
    const canvas = $('.bg-petals');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0;
    let petals = [];
    let count = 24;
    let running = true;
    let frameCount = 0;
    let measureStart = 0;
    let rafId = null;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    class Petal {
      constructor(init) { this.reset(init); }
      reset(init) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : -30;
        this.size = 8 + Math.random() * 8;             // 8 ~ 16
        this.rot = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.dur = 14000 + Math.random() * 8000;       // 14~22s
        this.start = performance.now() - (init ? Math.random() * this.dur : 0);
        this.swayAmp = 20 + Math.random() * 20;
        this.swayPhase = Math.random() * Math.PI * 2;
        this.opacity = 0.18 + Math.random() * 0.14;    // 0.18 ~ 0.32
        this.color = Math.random() < 0.7 ? '#C9A2A2' : '#A8B59C';
        this.baseX = this.x;
      }
      step(now) {
        const t = (now - this.start) / this.dur;
        if (t > 1) { this.reset(false); return; }
        this.y = -30 + (H + 60) * t;
        this.x = this.baseX + Math.sin(now / 1000 + this.swayPhase) * this.swayAmp;
        this.rot += this.rotSpeed;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.4, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function spawn() {
      petals = Array.from({ length: count }, () => new Petal(true));
    }

    function loop(now) {
      if (running) {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < petals.length; i++) {
          petals[i].step(now);
          petals[i].draw();
        }
        // 5초 후 fps 측정 → 50fps 미만 시 count 절반
        frameCount++;
        if (!measureStart) measureStart = now;
        if (now - measureStart > 5000 && frameCount > 0) {
          const fps = (frameCount / (now - measureStart)) * 1000;
          if (fps < 50 && count > 12) {
            count = 12;
            spawn();
          }
          measureStart = 0;
          frameCount = 0;
        }
      }
      rafId = requestAnimationFrame(loop);
    }

    resize();
    spawn();
    rafId = requestAnimationFrame(loop);
    window.addEventListener('resize', resize, { passive: true });

    // 페이지가 가려지면 일시정지 (배터리/CPU 절약)
    document.addEventListener('visibilitychange', () => {
      running = document.visibilityState !== 'hidden';
    });
  }

  // ---------------------------------------------------------
  // 4. Calendar render + D-day count-up (motion §3-1)
  // ---------------------------------------------------------
  function setupCalendar() {
    const tbl = $('.cal');
    if (!tbl) return;
    const target = new Date(TARGET_DATE_STR + 'T00:00:00');
    const y = target.getFullYear();
    const m = target.getMonth();
    const first = new Date(y, m, 1).getDay();
    const last  = new Date(y, m + 1, 0).getDate();
    const tbody = tbl.querySelector('tbody');

    let html = '<tr>';
    for (let i = 0; i < first; i++) html += '<td></td>';
    for (let d = 1; d <= last; d++) {
      const dow = (first + d - 1) % 7;
      const cls = [];
      if (d === target.getDate()) cls.push('today');
      if (dow === 0) cls.push('sun');
      if (dow === 6) cls.push('sat');
      html += `<td${cls.length ? ` class="${cls.join(' ')}"` : ''}><span>${d}</span></td>`;
      if ((first + d) % 7 === 0 && d !== last) html += '</tr><tr>';
    }
    html += '</tr>';
    tbody.innerHTML = html;

    // D-day 계산: 자정 → 자정 기준으로 정수 일수만 비교 (시각 무관)
    const ddayNum = $('#dday-num');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDay = new Date(y, m, target.getDate(), 0, 0, 0);
    const diff = Math.round((targetDay - today) / (1000 * 60 * 60 * 24));
    const ddayLabel = $('.dday-label');
    const ddayBlock = $('.dday');

    if (diff > 0) {
      ddayNum.dataset.target = String(diff);
      ddayNum.textContent = isReduced() ? String(diff) : '0';
    } else if (diff === 0) {
      ddayBlock.innerHTML = '<span class="script" style="font-size:24px;color:var(--color-primary)">오늘</span><br><span style="font-size:14px;color:var(--color-muted)">저희 두 사람의 약속이 시작됩니다</span>';
      if (ddayLabel) ddayLabel.style.display = 'none';
    } else {
      ddayNum.dataset.target = String(-diff);
      ddayNum.textContent = isReduced() ? String(-diff) : '0';
      if (ddayLabel) ddayLabel.textContent = `함께 걸어가는 날 +`;
      ddayBlock.firstChild.textContent = 'D + ';
    }

    // count-up 애니메이션
    if (!isReduced() && diff !== 0) {
      const onIntersect = (entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          countUp(ddayNum, parseInt(ddayNum.dataset.target, 10), 1400);
          obs.disconnect();
        });
      };
      new IntersectionObserver(onIntersect, { threshold: 0.4 })
        .observe($('#calendar'));
    }
  }

  function countUp(el, target, dur) {
    const start = performance.now();
    function tick(now) {
      const t = clamp((now - start) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------
  // 5. Gallery Grid: click to lightbox + Load More
  // ---------------------------------------------------------
  function setupGallery() {
    const items = $$('.gallery-grid-item');
    if (!items.length) return;
    const N = items.length;
    const batchSize = 9;
    let visibleCount = Math.min(batchSize, N);

    function attachClickHandlers(itemsToAttach) {
      itemsToAttach.forEach((item, i) => {
        const idx = parseInt(item.dataset.index, 10);
        item.addEventListener('click', () => {
          haptic(8);
          openLightbox(idx);
        });
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            haptic(8);
            openLightbox(idx);
          }
        });
      });
    }

    // Attach handlers to all items (visible and hidden)
    attachClickHandlers(items);

    // Load More button: reveal in batches, then hide when fully shown
    const loadMoreBtn = $('#gallery-load-more');
    if (loadMoreBtn) {
      const isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en');
      const loadMoreLabel = isEnglish ? 'View More' : '더 보기';

      const renderGallery = () => {
        items.forEach((item, index) => {
          item.classList.toggle('hidden', index >= visibleCount);
        });

        if (N <= batchSize || visibleCount >= N) {
          loadMoreBtn.style.display = 'none';
          return;
        }

        loadMoreBtn.style.display = '';
        loadMoreBtn.textContent = loadMoreLabel;
        loadMoreBtn.setAttribute('aria-expanded', 'false');
      };

      renderGallery();

      loadMoreBtn.addEventListener('click', () => {
        visibleCount = Math.min(N, visibleCount + batchSize);
        haptic(8);
        renderGallery();
      });
    }

    galleryAPI = { count: N };
  }

  // ---------------------------------------------------------
  // 6. Lightbox (no in-modal zoom; swipe only)
  // ---------------------------------------------------------
  let lightboxAPI = null;
  function setupLightbox() {
    const lb = $('#lightbox');
    const img = $('#lightbox-img');
    const close = $('#lightbox-close');
    const prevBtn = $('#lightbox-prev');
    const nextBtn = $('#lightbox-next');
    if (!lb || !img || !close || !prevBtn || !nextBtn) return;

    const slides = $$('.gallery-grid-item img');
    let touchStartX = null;
    let prevFocus = null;
    let currentIdx = 0;

    function showSlide(i) {
      const total = galleryAPI?.count || slides.length;
      if (!total) return;
      currentIdx = (i + total) % total;
      img.src = slides[currentIdx].src;
      img.alt = slides[currentIdx].alt || '';
    }

    function open(i) {
      currentIdx = i;
      img.src = slides[i].src;
      img.alt = slides[i].alt || '';
      lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      prevFocus = document.activeElement;
      close.focus();
      haptic(15);
    }
    function closeFn() {
      lb.classList.remove('is-open');
      setTimeout(() => {
        lb.hidden = true;
        document.body.style.overflow = '';
        if (prevFocus && prevFocus.focus) prevFocus.focus();
      }, isReduced() ? 0 : 220);
    }

    close.addEventListener('click', closeFn);
    prevBtn.addEventListener('click', () => { if (galleryAPI) { showSlide(currentIdx - 1); haptic(8); } });
    nextBtn.addEventListener('click', () => { if (galleryAPI) { showSlide(currentIdx + 1); haptic(8); } });
    lb.addEventListener('click', (e) => { if (e.target === lb) closeFn(); });
    document.addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeFn();
      if (e.key === 'ArrowLeft' && galleryAPI) {
        showSlide(currentIdx - 1);
      }
      if (e.key === 'ArrowRight' && galleryAPI) {
        showSlide(currentIdx + 1);
      }
    });

    // Swipe navigation only
    img.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    img.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1 || touchStartX === null) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          showSlide(currentIdx + 1);
        } else {
          showSlide(currentIdx - 1);
        }
        touchStartX = null;
      }
    }, { passive: true });

    img.addEventListener('touchend', () => {
      touchStartX = null;
    });

    lightboxAPI = { open };
    window.openLightbox = open; // 갤러리에서 호출
  }

  // local helper bridge
  function openLightbox(i) {
    if (lightboxAPI) lightboxAPI.open(i);
  }

  // ---------------------------------------------------------
  // 7. Copy account number + toast (motion §3-3)
  // ---------------------------------------------------------
  function setupCopy() {
    $$('.copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const txt = btn.dataset.copy || '';
        let ok = false;
        try {
          await navigator.clipboard.writeText(txt);
          ok = true;
        } catch (e) {
          try {
            const ta = document.createElement('textarea');
            ta.value = txt;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            ok = document.execCommand('copy');
            document.body.removeChild(ta);
          } catch (e2) { ok = false; }
        }
        if (ok) {
          btn.classList.add('is-copied');
          haptic(15);
          showToast('계좌번호가 복사되었습니다');
          setTimeout(() => btn.classList.remove('is-copied'), 1400);
        } else {
          showToast('복사에 실패했습니다. 직접 선택해주세요');
        }
      });
    });
  }

  // ---------------------------------------------------------
  // 8. Toast
  // ---------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add('is-visible'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove('is-visible');
      setTimeout(() => { t.hidden = true; }, 320);
    }, 1700);
  }

  // ---------------------------------------------------------
  // 9. Music toggle (motion §3-6)
  // ---------------------------------------------------------
  function setupMusic() {
    const btn = $('#music-toggle');
    const audio = $('#bgm');
    if (!btn || !audio) return;
    audio.volume = 0;

    function fadeVolume(target, dur) {
      const start = audio.volume;
      const t0 = performance.now();
      function tick(now) {
        const t = clamp((now - t0) / dur, 0, 1);
        audio.volume = start + (target - start) * t;
        if (t < 1) requestAnimationFrame(tick);
        else if (target === 0) audio.pause();
      }
      requestAnimationFrame(tick);
    }

    btn.addEventListener('click', async () => {
      btn.classList.remove('is-rippling');
      void btn.offsetWidth;
      btn.classList.add('is-rippling');
      haptic(10);
      try {
        if (audio.paused) {
          await audio.play();
          btn.setAttribute('aria-pressed', 'true');
          fadeVolume(0.4, 1500);
        } else {
          fadeVolume(0, 600);
          btn.setAttribute('aria-pressed', 'false');
        }
      } catch (e) {
        showToast('음원 파일을 찾을 수 없어요. (audio/bgm.mp3)');
      }
    });
  }

  // ---------------------------------------------------------
  // 10. Share (Kakao / link copy) (motion §3-7)
  // ---------------------------------------------------------
  function setupShare() {
    const btnLink  = $('#share-link');
    const btnKakao = $('#share-kakao');

    async function copyLinkWithFallback(url) {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch (e) {
        try {
          const ta = document.createElement('textarea');
          ta.value = url;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          return ok;
        } catch (e2) {
          return false;
        }
      }
    }

    btnLink?.addEventListener('click', async () => {
      const ok = await copyLinkWithFallback(location.href);
      if (ok) {
        haptic(15);
        showToast('청첩장 링크가 복사되었습니다');
      } else {
        showToast('복사에 실패했습니다');
      }
    });

    btnKakao?.addEventListener('click', () => {
      haptic(15);
      // Kakao SDK 사용 가능 시
      if (window.Kakao && KAKAO_JS_KEY) {
        try {
          if (!window.Kakao.isInitialized()) window.Kakao.init(KAKAO_JS_KEY);
          window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: SHARE_TITLE,
              description: SHARE_DESC,
              imageUrl: SHARE_IMAGE,
              link: { mobileWebUrl: location.href, webUrl: location.href }
            },
            buttons: [
              { title: '청첩장 보기', link: { mobileWebUrl: location.href, webUrl: location.href } }
            ]
          });
          return;
        } catch (e) { /* fallthrough */ }
      }
      // Web Share API 폴백
      if (navigator.share) {
        navigator.share({ title: SHARE_TITLE, text: SHARE_DESC, url: location.href }).catch(() => {});
        return;
      }
      // 최종 폴백: 링크 복사
      copyLinkWithFallback(location.href).then((ok) => {
        showToast(ok ? '청첩장 링크가 복사되었습니다' : '복사에 실패했습니다');
      });
    });
  }

  // ---------------------------------------------------------
  // 11. RSVP / Guestbook handling
  // ---------------------------------------------------------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function readStoredEntries(key) {
    const endpoint = key === 'wedding_rsvp_entries' ? '/api/rsvp' : '/api/guestbook';
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'network');
      }
      const payload = await response.json();
      if (Array.isArray(payload.entries)) {
        return payload.entries;
      }
      throw new Error('invalid response payload');
    } catch (e) {
      throw new Error(`read failed: ${e.message || 'unknown error'}`);
    }
  }

  async function writeStoredEntries(key, entries) {
    const endpoint = key === 'wedding_rsvp_entries' ? '/api/rsvp' : '/api/guestbook';
    const body = entries[0] || null;
    if (!body) return [];
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      const message = payload.error || 'save failed';
      const code = payload.code ? String(payload.code) : '';
      throw new Error(code ? `${code}::${message}` : message);
    }
    const payload = await response.json();
    if (Array.isArray(payload.entries)) {
      return payload.entries;
    }
    throw new Error('invalid response payload');
  }

  async function removeStoredEntry(key, id) {
    const endpoint = key === 'wedding_rsvp_entries' ? '/api/rsvp' : '/api/guestbook';
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'delete failed');
    }
    const payload = await response.json();
    if (Array.isArray(payload.entries)) {
      return payload.entries;
    }
    throw new Error('invalid response payload');
  }

  function isManagerView() {
    const params = new URLSearchParams(location.search);
    return params.get('manager') === '1' || params.get('admin') === '1';
  }

  function getAttendanceCategory(entry) {
    const attendance = String(entry.attendance || '').trim();
    if (/불참|미참석|Not attending/i.test(attendance)) return '불참';
    if (/미정|Pending/i.test(attendance)) return '미정';
    if (/참석|Attending/i.test(attendance)) return '참석';
    return '미정';
  }

  function getMealLabel(value) {
    const normalized = String(value || '').trim();
    if (normalized === '1' || /^(O|Y|YES)$/i.test(normalized)) return '식사 예정';
    if (normalized === '-1' || /^(X|N|NO)$/i.test(normalized)) return '식사 안 함';
    if (normalized === '0' || /^미정|PENDING|NOT SURE/i.test(normalized)) return '미정';
    return normalized || '미정';
  }

  function getFilteredRsvpEntries(entries) {
    if (!activeRsvpFilter || activeRsvpFilter === 'all') return entries;
    return entries.filter((entry) => getAttendanceCategory(entry) === activeRsvpFilter);
  }

  function formatRsvpTime(createdAt) {
    try {
      return new Date(createdAt).toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  }

  async function renderRsvpStats() {
    const panel = $('#manager-panel');
    const container = $('#rsvp-stats');
    const list = $('#rsvp-manager-list');
    if (!container) return;
    if (!isManagerView()) {
      panel?.classList.add('is-hidden');
      container.classList.add('is-hidden');
      container.innerHTML = '';
      if (list) list.innerHTML = '';
      return;
    }
    panel?.classList.remove('is-hidden');
    container.classList.remove('is-hidden');

    let storedEntries = [];
    try {
      storedEntries = await readStoredEntries('wedding_rsvp_entries');
    } catch (e) {
      container.innerHTML = '<p class="stats-footnote">RSVP 데이터를 불러오지 못했습니다. Supabase 연결을 확인해 주세요.</p>';
      if (list) list.innerHTML = '<li class="manager-empty">데이터를 불러올 수 없습니다.</li>';
      return;
    }
    const entries = storedEntries
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const attending = entries.filter((entry) => getAttendanceCategory(entry) === '참석').length;
    const declined = entries.filter((entry) => getAttendanceCategory(entry) === '불참').length;
    const pending = entries.filter((entry) => getAttendanceCategory(entry) === '미정').length;
    const totalGuests = entries.reduce((sum, entry) => {
      if (getAttendanceCategory(entry) !== '참석') return sum;
      return sum + 1 + (Number(entry.guests) || 0);
    }, 0);
    const filteredEntries = getFilteredRsvpEntries(entries);

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><strong>${entries.length}</strong><span>총 응답</span></div>
        <div class="stat-card"><strong>${attending}</strong><span>참석</span></div>
        <div class="stat-card"><strong>${declined}</strong><span>미참석</span></div>
        <div class="stat-card"><strong>${pending}</strong><span>미정</span></div>
      </div>
      <p class="stats-footnote">예상 참석 인원: ${totalGuests}명</p>
    `;

    if (list) {
      if (!filteredEntries.length) {
        list.innerHTML = '<li class="manager-empty">아직 표시할 응답이 없어요.</li>';
      } else {
        list.innerHTML = filteredEntries.map((entry) => {
          const attendance = String(entry.attendance || '미정').trim() || '미정';
          const guestCount = Number(entry.guests) || 0;
          const side = String(entry.side || '미선택').trim() || '미선택';
          const meal = getMealLabel(entry.meal);
          const afterparty = String(entry.afterparty || '').trim();
          const summary = [`구분 ${side}`, `동반 ${guestCount}명`, `식사 ${meal}`];
          if (afterparty) summary.push(`애프터 ${afterparty}`);
          return `
            <li>
              <div class="manager-item-top">
                <strong>${escapeHtml(entry.name || '익명')}</strong>
                <div class="manager-item-actions">
                  <span class="manager-chip">${escapeHtml(attendance)}</span>
                  <button class="manager-delete-btn" type="button" data-entry-id="${entry.id}" data-entry-key="wedding_rsvp_entries">삭제</button>
                </div>
              </div>
              <div class="manager-item-meta">
                <span>${escapeHtml(summary.join(' · '))}</span>
                <span>${escapeHtml(formatRsvpTime(entry.createdAt))}</span>
              </div>
            </li>
          `;
        }).join('');
      }
    }

    const tabs = $$('.manager-tab');
    tabs.forEach((button) => {
      const isActive = (button.dataset.filter || 'all') === activeRsvpFilter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  }

  async function renderGuestbookStats() {
    const container = $('#guestbook-stats');
    if (!container) return;
    if (!isManagerView()) {
      container.classList.add('is-hidden');
      container.innerHTML = '';
      return;
    }
    container.classList.remove('is-hidden');
    let entries = [];
    try {
      entries = await readStoredEntries('wedding_guestbook_entries');
    } catch (e) {
      container.innerHTML = '<p class="stats-footnote">방명록 데이터를 불러오지 못했습니다. Supabase 연결을 확인해 주세요.</p>';
      return;
    }
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><strong>${entries.length}</strong><span>총 메시지</span></div>
        <div class="stat-card"><strong>${entries.slice(0, 3).length}</strong><span>최근 메시지</span></div>
      </div>
    `;
  }

  function setupRsvpManagerTabs() {
    const tabs = $$('.manager-tab');
    if (!tabs.length) return;
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activeRsvpFilter = tab.dataset.filter || 'all';
        void renderRsvpStats();
      });
    });
  }

  function setupRSVPAndGuestbook() {
    const body = document.body;
    const rsvpModal = $('#rsvp-modal');
    const rsvpOpenBtn = $('#rsvp-open');
    const rsvpCloseBtn = $('#rsvp-modal-close');
    const rsvpForm = $('#rsvp-form');
    const guestbookForm = $('#guestbook-form');
    const guestbookList = $('#guestbook-list');
    const managerList = $('#rsvp-manager-list');
    const enhancedSelectInstances = [];
    let previousFocusedElement = null;

    function setupEnhancedSelects() {
      // Keep native select behavior in the modal for consistent mobile UX.
      if (!rsvpForm || typeof window.TomSelect !== 'function') return;
      return;
      const selects = Array.from(rsvpForm.querySelectorAll('select'));
      selects.forEach((select) => {
        if (select.dataset.enhanced === 'true') return;
        const instance = new window.TomSelect(select, {
          create: false,
          maxOptions: 20,
          persist: false,
          allowEmptyOption: false,
          copyClassesToDropdown: false,
          render: {
            option(data, escape) {
              return `<div class="ts-opt-row"><span class="ts-opt-dot" aria-hidden="true"></span><span>${escape(data.text)}</span></div>`;
            },
            item(data, escape) {
              return `<div>${escape(data.text)}</div>`;
            }
          }
        });
        select.dataset.enhanced = 'true';
        enhancedSelectInstances.push(instance);
      });
    }

    function getFocusableElements(container) {
      if (!container) return [];
      return Array.from(container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));
    }

    function openRsvpModal() {
      if (!rsvpModal) return;
      previousFocusedElement = document.activeElement;
      rsvpModal.hidden = false;
      requestAnimationFrame(() => rsvpModal.classList.add('is-open'));
      body.classList.add('modal-open');
      const focusables = getFocusableElements(rsvpModal);
      (focusables[0] || rsvpCloseBtn || rsvpModal).focus();
    }

    function closeRsvpModal() {
      if (!rsvpModal || rsvpModal.hidden) return;
      rsvpModal.classList.remove('is-open');
      body.classList.remove('modal-open');
      window.setTimeout(() => {
        rsvpModal.hidden = true;
      }, 220);
      if (previousFocusedElement instanceof HTMLElement) {
        previousFocusedElement.focus();
      } else {
        rsvpOpenBtn?.focus();
      }
    }

    if (rsvpOpenBtn && rsvpModal) {
      rsvpOpenBtn.addEventListener('click', openRsvpModal);
      rsvpCloseBtn?.addEventListener('click', closeRsvpModal);
      rsvpModal.addEventListener('click', (event) => {
        if (event.target === rsvpModal) {
          closeRsvpModal();
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !rsvpModal.hidden) {
          closeRsvpModal();
          return;
        }
        if (event.key !== 'Tab' || rsvpModal.hidden) return;
        const focusables = getFocusableElements(rsvpModal);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      });
    }

    async function submitToEndpoint(endpoint, fields) {
      const payload = new URLSearchParams();
      Object.entries(fields).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload.toString()
        });
        if (!response.ok) throw new Error('request failed');
        return true;
      } catch (e) {
        showToast('메일 전송에 실패했습니다. 잠시 후 다시 시도해 주세요');
        return false;
      }
    }

    if (rsvpForm) {
      rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(rsvpForm);
        const payload = {
          name: String(data.get('name') || '').trim(),
          side: String(data.get('side') || '').trim(),
          attendance: String(data.get('attendance') || '').trim(),
          guests: String(data.get('guests') || '0').trim(),
          meal: String(data.get('meal') || '').trim(),
          afterparty: String(data.get('afterparty') || '초대안함').trim() || '초대안함',
          subject: "Minho & Clair's Wedding Data - RSVP",
          _subject: "Minho & Clair's Wedding Data - RSVP"
        };
        if (!payload.name) {
          showToast('성함을 입력해 주세요');
          return;
        }
        try {
          await writeStoredEntries('wedding_rsvp_entries', [{
            name: payload.name,
            side: payload.side,
            attendance: payload.attendance,
            guests: payload.guests,
            meal: payload.meal,
            afterparty: payload.afterparty,
            createdAt: new Date().toISOString()
          }]);
          void renderRsvpStats();

          rsvpForm.reset();
          enhancedSelectInstances.forEach((instance) => {
            const value = instance.input.value;
            instance.setValue(value, true);
          });
          closeRsvpModal();
          const guestCount = Number(payload.guests) || 0;
          const attendanceLabel = payload.attendance || '참석';
          showToast(`${attendanceLabel} · 동반 ${guestCount}명으로 저장되었습니다`);
        } catch (err) {
          const msg = String(err?.message || '');
          if (msg.includes('RSVP_SCHEMA_MISMATCH')) {
            showToast('서버 RSVP 테이블 업데이트가 필요합니다. 관리자에게 문의해 주세요');
          } else if (msg.includes('Supabase is not configured')) {
            showToast('서버 설정이 아직 완료되지 않았습니다. 잠시 후 다시 시도해 주세요');
          } else {
            showToast('저장에 실패했습니다. 잠시 후 다시 시도해 주세요');
          }
        }
      });
    }

    async function renderGuestbook() {
      if (!guestbookList) return;
      const managerView = isManagerView();
      let entries = [];
      try {
        entries = await readStoredEntries('wedding_guestbook_entries');
      } catch (e) {
        guestbookList.innerHTML = '<li>방명록 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</li>';
        return;
      }
      if (!entries.length) {
        guestbookList.innerHTML = '<li>아직 남겨진 마음이 없어요. 첫 번째 마음을 남겨 주세요.</li>';
        return;
      }
      const sortedEntries = entries
        .slice()
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      guestbookList.innerHTML = sortedEntries.map((entry) => {
        const time = new Date(entry.createdAt).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        const deleteButton = managerView
          ? `<button class="guestbook-delete-btn" type="button" data-entry-id="${entry.id}" data-entry-key="wedding_guestbook_entries">삭제</button>`
          : '';
        return `<li><div class="guestbook-meta"><strong>${escapeHtml(entry.name || '익명')}</strong><div class="guestbook-meta-actions"><span>${escapeHtml(time)}</span>${deleteButton}</div></div><p>${escapeHtml(entry.message || '')}</p></li>`;
      }).join('');
    }

    if (managerList) {
      managerList.addEventListener('click', async (e) => {
        const button = e.target.closest('[data-entry-id]');
        if (!button) return;
        const id = button.getAttribute('data-entry-id');
        const key = button.getAttribute('data-entry-key');
        if (!id || !key) return;
        try {
          await removeStoredEntry(key, id);
          void renderRsvpStats();
          showToast('삭제되었습니다');
        } catch (err) {
          showToast('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요');
        }
      });
    }

    if (guestbookList) {
      guestbookList.addEventListener('click', async (e) => {
        if (!isManagerView()) return;
        const button = e.target.closest('[data-entry-id]');
        if (!button) return;
        const id = button.getAttribute('data-entry-id');
        const key = button.getAttribute('data-entry-key');
        if (!id || !key) return;
        try {
          await removeStoredEntry(key, id);
          await renderGuestbook();
          await renderGuestbookStats();
          showToast('삭제되었습니다');
        } catch (err) {
          showToast('삭제에 실패했습니다. 잠시 후 다시 시도해 주세요');
        }
      });
    }

    if (guestbookForm) {
      guestbookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(guestbookForm);
        const name = String(data.get('name') || '').trim();
        const message = String(data.get('message') || '').trim();
        if (!name || !message) {
          showToast('이름과 메시지를 모두 입력해 주세요');
          return;
        }
        try {
          await writeStoredEntries('wedding_guestbook_entries', [{ name, message, createdAt: new Date().toISOString() }]);
          guestbookForm.reset();
          await renderGuestbook();
          await renderGuestbookStats();
          showToast('방명록에 마음이 저장되었습니다');
        } catch (err) {
          showToast('저장에 실패했습니다. 잠시 후 다시 시도해 주세요');
        }
      });
    }

    setupRsvpManagerTabs();
    setupEnhancedSelects();
    void renderGuestbook();
    void renderRsvpStats();
    void renderGuestbookStats();
  }

  // ---------------------------------------------------------
  // INIT
  // ---------------------------------------------------------
  function init() {
    setupIntroOverlay(setupHero);
    setupReveal();
    setupPetals();
    setupCalendar();
    setupLightbox();
    setupGallery();
    setupCopy();
    setupMusic();
    setupShare();
    setupRSVPAndGuestbook();

    // reduced-motion 변경 시 단순 reload (모션 일관성 보장)
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener('change', () => location.reload());
    } else if (reducedMotion.addListener) {
      reducedMotion.addListener(() => location.reload());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
