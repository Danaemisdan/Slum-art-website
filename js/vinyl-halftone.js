/**
 * ===================================================================
 * VINYL HALFTONE PRELOADER & TURNTABLE COMPONENT
 * Inspired by @kedhareswer/components/vinyl-halftone-preloader (21st.dev)
 * Features:
 * - Vintage Halftone Record Sleeve with authentic "The Pet Bottle School" poster
 * - Spinning 33⅓ RPM Vinyl Record with grooves, shine reflection & center label
 * - Interactive Click & Drag Scratching with procedural Web Audio FX
 * - Moving Tonearm with Stylus Needle that drops onto vinyl grooves
 * - Retro Halftone Starburst with comic tempo pulsing
 * - Interactive 7-Page Comic Book Reader Modal (extracted from COMIC BOOK.pdf)
 * ===================================================================
 */

(function () {
  'use strict';

  // Audio Context for Procedural Vinyl Sound FX (Zero external mp3 needed)
  let audioCtx = null;
  let audioEnabled = true;

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playScratchSound(speed = 1.0) {
    if (!audioEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Bandpassed sawtooth wave mimicking vinyl friction
      osc.type = 'sawtooth';
      const baseFreq = 160 * Math.max(0.5, Math.min(2.5, speed));
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(Math.max(60, baseFreq * 0.4), now + 0.14);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playNeedleDropSound() {
    if (!audioEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Soft thump & crackle pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Comic Book Flip Reader Data
  const comicPages = [
    { num: 1, title: 'Official Guinness Attempt Cover', src: 'assets/images/comic/page_1.jpg' },
    { num: 2, title: 'Meet Adetunwase Adenle', src: 'assets/images/comic/page_2.jpg' },
    { num: 3, title: 'A Peep into the Gallery', src: 'assets/images/comic/page_3.jpg' },
    { num: 4, title: 'Why Are We Doing This?', src: 'assets/images/comic/page_4.jpg' },
    { num: 5, title: 'What Are We Working On? (36 PET Bottle Schools)', src: 'assets/images/comic/page_5.jpg' },
    { num: 6, title: 'Why Should You Partner with Us?', src: 'assets/images/comic/page_6.jpg' },
    { num: 7, title: "Let's Build Together", src: 'assets/images/comic/page_7.jpg' }
  ];

  let currentComicPageIndex = 0;

  function initVinylHalftoneComponent() {
    const wrapper = document.querySelector('.vinyl-halftone-container');
    if (!wrapper) return;

    const record = wrapper.querySelector('.vh-record');
    const tonearm = wrapper.querySelector('.vh-tonearm');
    const playBtn = wrapper.querySelector('.vh-play-toggle');
    const statusPill = wrapper.querySelector('.vh-status-pill');
    const rpmCounter = wrapper.querySelector('.vh-rpm-display');
    const soundToggle = wrapper.querySelector('.vh-sound-toggle');
    const needleHead = wrapper.querySelector('.vh-needle-head');

    let isPlaying = true; // Auto-spins smoothly on load
    let isDragging = false;
    let startAngle = 0;
    let currentRotation = 0;
    let lastDragAngle = 0;
    let lastDragTime = 0;
    let animFrameId = null;

    // Center coordinates of the record
    function getRecordCenter() {
      if (!record) return { x: 0, y: 0 };
      const rect = record.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    }

    // Toggle Play / Pause
    function setPlayback(play) {
      isPlaying = play;
      if (wrapper) {
        if (play) {
          wrapper.classList.add('is-playing');
          wrapper.classList.remove('is-paused');
          if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause 33⅓ RPM';
            playBtn.setAttribute('aria-label', 'Pause turntable');
          }
          if (statusPill) {
            statusPill.innerHTML = '<span class="vh-dot vh-dot-live"></span> 33⅓ RPM • STEREO PLAYBACK';
          }
          if (rpmCounter) rpmCounter.textContent = '33.3';
          playNeedleDropSound();
        } else {
          wrapper.classList.remove('is-playing');
          wrapper.classList.add('is-paused');
          if (playBtn) {
            playBtn.innerHTML = '<i class="fas fa-play"></i> Spin Turntable';
            playBtn.setAttribute('aria-label', 'Start turntable');
          }
          if (statusPill) {
            statusPill.innerHTML = '<span class="vh-dot vh-dot-idle"></span> PAUSED (SCRATCH READY)';
          }
          if (rpmCounter) rpmCounter.textContent = '00.0';
        }
      }
    }

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setPlayback(!isPlaying);
      });
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', (e) => {
        e.preventDefault();
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
          soundToggle.innerHTML = '<i class="fas fa-volume-high"></i>';
          soundToggle.setAttribute('title', 'Mute vinyl audio');
          getAudioCtx();
        } else {
          soundToggle.innerHTML = '<i class="fas fa-volume-xmark"></i>';
          soundToggle.setAttribute('title', 'Enable vinyl audio');
        }
      });
    }

    // Scratching Interaction: Click & Drag to Rotate
    function getPointerAngle(e) {
      const center = getRecordCenter();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const dx = clientX - center.x;
      const dy = clientY - center.y;
      return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    if (record) {
      record.addEventListener('mousedown', (e) => {
        isDragging = true;
        record.classList.add('is-scratching');
        wrapper.classList.add('is-scratching-active');
        startAngle = getPointerAngle(e);
        lastDragAngle = startAngle;
        lastDragTime = Date.now();
        getAudioCtx();
        e.preventDefault();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newAngle = getPointerAngle(e);
        const delta = newAngle - lastDragAngle;
        currentRotation += delta;
        lastDragAngle = newAngle;

        // Apply rotation directly
        record.style.transform = `rotate(${currentRotation}deg)`;

        // Calculate velocity for scratch sound pitch
        const now = Date.now();
        const dt = Math.max(1, now - lastDragTime);
        const angularVelocity = Math.abs(delta) / dt;
        lastDragTime = now;

        if (Math.abs(delta) > 3) {
          playScratchSound(angularVelocity * 1.5);
          if (rpmCounter) {
            rpmCounter.textContent = (angularVelocity * 25).toFixed(1);
          }
        }
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        record.classList.remove('is-scratching');
        wrapper.classList.remove('is-scratching-active');
        if (isPlaying) {
          record.style.transform = '';
          if (rpmCounter) rpmCounter.textContent = '33.3';
        }
      });

      // Touch events for mobile
      record.addEventListener('touchstart', (e) => {
        isDragging = true;
        record.classList.add('is-scratching');
        wrapper.classList.add('is-scratching-active');
        startAngle = getPointerAngle(e);
        lastDragAngle = startAngle;
        lastDragTime = Date.now();
        getAudioCtx();
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const newAngle = getPointerAngle(e);
        const delta = newAngle - lastDragAngle;
        currentRotation += delta;
        lastDragAngle = newAngle;
        record.style.transform = `rotate(${currentRotation}deg)`;

        const now = Date.now();
        const dt = Math.max(1, now - lastDragTime);
        const angularVelocity = Math.abs(delta) / dt;
        lastDragTime = now;

        if (Math.abs(delta) > 3) {
          playScratchSound(angularVelocity * 1.5);
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        record.classList.remove('is-scratching');
        wrapper.classList.remove('is-scratching-active');
        if (isPlaying) {
          record.style.transform = '';
        }
      });
    }

    // Default active state
    setPlayback(true);
  }

  // ===================================================================
  // COMIC BOOK FLIP READER MODAL FUNCTIONS
  // ===================================================================
  function openComicBookReader(pageIndex = 0) {
    let modal = document.getElementById('comicBookReaderModal');
    if (!modal) {
      createComicReaderModal();
      modal = document.getElementById('comicBookReaderModal');
    }

    currentComicPageIndex = Math.max(0, Math.min(comicPages.length - 1, pageIndex));
    updateComicReaderDisplay();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeComicBookReader() {
    const modal = document.getElementById('comicBookReaderModal');
    if (modal) {
      modal.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  function nextComicPage() {
    if (currentComicPageIndex < comicPages.length - 1) {
      currentComicPageIndex++;
      updateComicReaderDisplay();
    }
  }

  function prevComicPage() {
    if (currentComicPageIndex > 0) {
      currentComicPageIndex--;
      updateComicReaderDisplay();
    }
  }

  function updateComicReaderDisplay() {
    const page = comicPages[currentComicPageIndex];
    if (!page) return;

    const imgEl = document.getElementById('comicReaderImg');
    const titleEl = document.getElementById('comicReaderTitle');
    const counterEl = document.getElementById('comicReaderCounter');
    const prevBtn = document.getElementById('comicReaderPrev');
    const nextBtn = document.getElementById('comicReaderNext');
    const thumbnailsContainer = document.getElementById('comicReaderThumbs');

    if (imgEl) {
      imgEl.style.opacity = '0.4';
      imgEl.src = page.src;
      imgEl.onload = () => {
        imgEl.style.opacity = '1';
      };
    }

    if (titleEl) {
      titleEl.textContent = page.title;
    }

    if (counterEl) {
      counterEl.textContent = `Page ${page.num} of ${comicPages.length}`;
    }

    if (prevBtn) {
      prevBtn.disabled = currentComicPageIndex === 0;
      prevBtn.style.opacity = currentComicPageIndex === 0 ? '0.35' : '1';
    }

    if (nextBtn) {
      nextBtn.disabled = currentComicPageIndex === comicPages.length - 1;
      nextBtn.style.opacity = currentComicPageIndex === comicPages.length - 1 ? '0.35' : '1';
    }

    // Update thumbnail highlights
    if (thumbnailsContainer) {
      const thumbs = thumbnailsContainer.querySelectorAll('.comic-thumb-btn');
      thumbs.forEach((tb, idx) => {
        if (idx === currentComicPageIndex) {
          tb.classList.add('active');
        } else {
          tb.classList.remove('active');
        }
      });
    }
  }

  function createComicReaderModal() {
    const modal = document.createElement('div');
    modal.id = 'comicBookReaderModal';
    modal.className = 'comic-reader-modal';

    modal.innerHTML = `
      <div class="comic-reader-backdrop" onclick="window.closeComicBookReader()"></div>
      <div class="comic-reader-container">
        <!-- Reader Header -->
        <div class="comic-reader-header">
          <div class="comic-reader-brand">
            <span class="comic-reader-tag"><i class="fas fa-trophy text-amber"></i> Official Guinness Record Attempt</span>
            <h3 class="comic-reader-maintitle" id="comicReaderTitle">Largest Collaborative Comic Book</h3>
          </div>
          <div class="comic-reader-actions">
            <a href="COMIC BOOK.pdf" download="Slum-Art-Collaborative-Comic-Book.pdf" class="btn btn-outline-white btn-sm" title="Download Official High-Res PDF">
              <i class="fas fa-file-pdf text-amber"></i> Download PDF (4.2 MB)
            </a>
            <button class="comic-reader-close-btn" onclick="window.closeComicBookReader()" aria-label="Close reader">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Reader Page Stage -->
        <div class="comic-reader-stage">
          <button class="comic-nav-arrow comic-nav-prev" id="comicReaderPrev" onclick="window.prevComicPage()" aria-label="Previous Page">
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="comic-page-wrapper">
            <img id="comicReaderImg" src="assets/images/comic/page_1.jpg" alt="Comic Book Page" class="comic-page-img">
          </div>

          <button class="comic-nav-arrow comic-nav-next" id="comicReaderNext" onclick="window.nextComicPage()" aria-label="Next Page">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Reader Footer Bar with Thumbnails & Controls -->
        <div class="comic-reader-footer">
          <div class="comic-reader-counter" id="comicReaderCounter">Page 1 of 7</div>
          
          <div class="comic-reader-thumbs" id="comicReaderThumbs">
            ${comicPages.map((p, idx) => `
              <button class="comic-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="window.openComicBookReader(${idx})" title="Go to Page ${p.num}">
                <span>${p.num}</span>
              </button>
            `).join('')}
          </div>

          <div class="comic-reader-cta">
            <button class="btn btn-primary btn-sm" onclick="window.closeComicBookReader(); window.openComicAmbassadorModal();">
              <i class="fas fa-bullhorn"></i> Join Ambassador Surge ($1/mo)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Keyboard navigation (Arrow keys and ESC)
    window.addEventListener('keydown', (e) => {
      const activeModal = document.getElementById('comicBookReaderModal');
      if (!activeModal || !activeModal.classList.contains('active')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextComicPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevComicPage();
      } else if (e.key === 'Escape') {
        closeComicBookReader();
      }
    });
  }

  // Expose Globally
  window.initVinylHalftoneComponent = initVinylHalftoneComponent;
  window.openComicBookReader = openComicBookReader;
  window.closeComicBookReader = closeComicBookReader;
  window.nextComicPage = nextComicPage;
  window.prevComicPage = prevComicPage;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVinylHalftoneComponent);
  } else {
    initVinylHalftoneComponent();
  }
})();
