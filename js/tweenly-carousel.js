/**
 * ===================================================================
 * 21ST.DEV TWEENLY CURVED CAROUSEL (Designed by @mirukullacode)
 * 3D Cylindrical Field Gallery • Life in Nigeria & Pet Bottle School
 * ===================================================================
 * Features:
 * - True 3D Cylindrical Ring Projection (rotateY, translate3d, perspective)
 * - Full-bleed intro morph (first image starts full-bleed & shrinks into ring)
 * - Interactive pointer drag with inertia/momentum physics
 * - Click-to-center any visible card
 * - Auto-rotation with hover/focus pause
 * - Keyboard arrow navigation (Left / Right)
 * - Responsive cylinder radius & card dimensions
 */

(function () {
  'use strict';

  const FIELD_SLIDES = [
    {
      src: 'assets/images/gallery/gallery_01.jpg',
      title: 'The Pet Bottle Classroom',
      caption: 'Engineered from 10,000 discarded plastic bottles into an eco-haven in Nigeria.',
      tag: 'Eco-Architecture'
    },
    {
      src: 'assets/images/gallery/gallery_02.jpg',
      title: 'Under the Bridge Studio',
      caption: 'Where street children trade vulnerability for fine paintbrushes and boundless creative expression.',
      tag: 'Creative Sanctuary'
    },
    {
      src: 'assets/images/gallery/gallery_03.jpg',
      title: 'Collaborative Genius',
      caption: 'Guinness World Record creators working side-by-side on expansive collaborative canvases.',
      tag: 'World Record Project'
    },
    {
      src: 'assets/images/gallery/gallery_04.jpg',
      title: 'Colors of Resilience',
      caption: 'Transforming discarded plastics and scrap metals into world-class contemporary fine art.',
      tag: 'Recycled Fine Art'
    },
    {
      src: 'assets/images/gallery/gallery_05.jpg',
      title: 'The Youth Atelier',
      caption: 'Structured vocational art mentorship cultivating future master painters, sculptors, and animators.',
      tag: 'Vocational Mentorship'
    },
    {
      src: 'assets/images/gallery/gallery_06.jpg',
      title: 'Nigeria Waterside Outreach',
      caption: 'Outreach canoes bringing art materials, paper, and nutritious hot meals to floating stilt settlements.',
      tag: 'Slum Outreach'
    },
    {
      src: 'assets/images/gallery/gallery_07.jpg',
      title: 'Community Food Clinic',
      caption: 'Nourishing over 200 children daily so their minds remain sharp, energized, and joyful.',
      tag: 'Nutrition & Welfare'
    },
    {
      src: 'assets/images/gallery/gallery_08.jpg',
      title: 'Historic Record Verification',
      caption: 'Official Guinness World Records verification celebrating the world’s largest youth drawings.',
      tag: 'Global Achievement'
    },
    {
      src: 'assets/images/gallery/gallery_09.jpg',
      title: 'Hair-Port Grooming & Care',
      caption: 'Restoring dignity, hygiene, and confidence alongside creative vocational education.',
      tag: 'Welfare Pillar'
    },
    {
      src: 'assets/images/gallery/gallery_10.jpg',
      title: 'The Next Generation',
      caption: 'From underserved slum origins to internationally collected visual storytellers and leaders.',
      tag: 'Empowered Leaders'
    }
  ];

  class TweenlyCurvedCarousel {
    constructor(container) {
      this.container = container;
      this.track = container.querySelector('#tweenlyTrack');
      this.prevBtn = container.querySelector('#tweenlyPrevBtn');
      this.nextBtn = container.querySelector('#tweenlyNextBtn');
      this.indicator = container.querySelector('#tweenlyIndicator');
      this.currIndexEl = container.querySelector('.tweenly-curr-index');
      this.totalCountEl = container.querySelector('.tweenly-total-count');

      this.slides = FIELD_SLIDES;
      this.total = this.slides.length;
      this.currentPos = 0;
      this.targetPos = 0;
      this.introProgress = 0;
      this.hasPlayedIntro = false;

      // Configuration: full-width edge-to-edge curved cylinder
      this.radiusMultiplier = 3.6;
      this.perspective = 1800;
      this.gap = 32;
      this.visibleCards = 8.5;
      this.dim = 0.45;
      this.cardRadius = 18;
      this.autoSpeed = 0.035; // smooth slow auto rotation
      this.isPaused = false;

      // Pointer drag physics
      this.isDragging = false;
      this.startX = 0;
      this.startPos = 0;
      this.lastPoints = [];
      this.glideTween = null;

      this.init();
    }

    init() {
      if (!this.track) return;

      // Set total count in indicator
      if (this.totalCountEl) {
        this.totalCountEl.textContent = String(this.total).padStart(2, '0');
      }

      // Render cards
      this.renderDOM();

      // Cache DOM references
      this.cards = Array.from(this.track.querySelectorAll('.tweenly-card'));
      this.mediaEls = this.cards.map(c => c.querySelector('.tweenly-card-media'));
      this.shadeEls = this.cards.map(c => c.querySelector('.tweenly-card-shade'));
      this.captionEls = this.cards.map(c => c.querySelector('.tweenly-card-caption'));

      // Event listeners
      this.bindEvents();

      // Trigger layout & initial render
      this.updateDimensions();
      this.render();

      // Intro animation on intersection
      this.setupIntroObserver();

      // Start ticker for auto-rotation and smooth interpolation
      this.startTicker();
    }

    renderDOM() {
      this.track.innerHTML = this.slides.map((slide, i) => `
        <div class="tweenly-card" data-index="${i}" role="group" aria-label="${i + 1} of ${this.total}">
          <div class="tweenly-card-media">
            <img src="${slide.src}" alt="${slide.title}" loading="lazy" />
          </div>
          <div class="tweenly-card-shade"></div>
          <div class="tweenly-card-badge">
            <i class="fas fa-sparkles text-amber"></i> ${slide.tag}
          </div>
          <div class="tweenly-card-caption">
            <span class="tweenly-caption-num">${String(i + 1).padStart(2, '0')}</span>
            <h4 class="tweenly-caption-title">${slide.title}</h4>
            <p class="tweenly-caption-desc">${slide.caption}</p>
          </div>
        </div>
      `).join('');
    }

    updateDimensions() {
      const rect = this.container.getBoundingClientRect();
      const w = rect.width || window.innerWidth;
      const h = rect.height || 600;

      this.viewportWidth = w;
      this.viewportHeight = h;

      if (w < 640) {
        this.cardWidth = Math.min(w * 0.78, 300);
      } else if (w < 1024) {
        this.cardWidth = Math.min(w * 0.44, 360);
      } else {
        this.cardWidth = Math.min(Math.max(w * 0.25, 300), 380);
      }

      this.cardHeight = Math.round(this.cardWidth * 1.25);
      this.stepAngle = (this.cardWidth + this.gap) / (Math.max(this.radiusMultiplier, 0.4) * this.cardWidth);
      this.radius = Math.max(this.radiusMultiplier, 0.4) * this.cardWidth;

      // Apply dimensions to cards
      this.cards.forEach(card => {
        card.style.width = `${this.cardWidth}px`;
        card.style.height = `${this.cardHeight}px`;
        card.style.marginLeft = `${-this.cardWidth / 2}px`;
        card.style.marginTop = `${-this.cardHeight / 2}px`;
      });
    }

    render() {
      const K = this.total;
      const ut = this.radius;
      const st = this.stepAngle;
      const S = this.cardRadius;

      for (let i = 0; i < K; i++) {
        const card = this.cards[i];
        let hn = i - this.currentPos;
        // Circular wrap
        hn = ((hn + K / 2) % K + K) % K - K / 2;

        const absDist = Math.abs(hn);
        const angle = hn * st;
        const z = -ut * (1 - Math.cos(angle)); // Smooth concave curve receding into screen

        // Visibility & falloff
        let opacity = Math.max(0, Math.min(1, (this.visibleCards + 0.6 - absDist)));
        if (Math.abs(angle) > 1.6 || Math.abs(hn) > this.visibleCards + 0.5) opacity = 0;

        if (opacity <= 0.005) {
          card.style.visibility = 'hidden';
          continue;
        }

        card.style.visibility = 'visible';
        card.style.opacity = String(opacity);
        card.style.zIndex = String(Math.round(1000 - absDist * 20));

        const x = ut * Math.sin(angle);
        const rotateY = angle * (180 / Math.PI);
        const cardScale = Math.max(0.72, 1 - absDist * 0.05);

        // Natural, zero-distortion 3D transform (viewport handles 1400px perspective)
        card.style.transform = `translate3d(${x.toFixed(2)}px, 0px, ${z.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${cardScale.toFixed(3)})`;
        card.style.borderRadius = `${S}px`;

        // Shade overlay (dim side cards)
        const shade = this.shadeEls[i];
        if (shade) {
          shade.style.opacity = String(Math.min(0.75, this.dim * Math.min(absDist, 2.5) * 0.65));
        }

        // Caption visibility (only active/near card)
        const caption = this.captionEls[i];
        if (caption) {
          caption.style.opacity = String(Math.max(0, 1 - absDist * 1.5));
        }
      }

      // Update active indicator
      const activeIdx = (Math.round(this.currentPos) % K + K) % K;
      if (this.currIndexEl) {
        this.currIndexEl.textContent = String(activeIdx + 1).padStart(2, '0');
      }
    }

    glideTo(target, duration = 0.8) {
      if (window.gsap) {
        if (this.glideTween) this.glideTween.kill();
        const obj = { pos: this.currentPos };
        this.glideTween = window.gsap.to(obj, {
          pos: target,
          duration: duration,
          ease: 'power3.out',
          onUpdate: () => {
            this.currentPos = obj.pos;
            this.targetPos = obj.pos;
            this.render();
          }
        });
      } else {
        this.currentPos = target;
        this.targetPos = target;
        this.render();
      }
    }

    step(direction) {
      const next = Math.round(this.currentPos) + direction;
      this.glideTo(next, 0.75);
    }

    setupIntroObserver() {
      this.introProgress = 1;
      this.hasPlayedIntro = true;
      this.render();
    }

    startTicker() {
      let lastTime = performance.now();

      const tick = (now) => {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        // Auto rotation when not dragging, not paused
        if (!this.isDragging && !this.isPaused && (!this.glideTween || !this.glideTween.isActive())) {
          this.currentPos += this.autoSpeed * dt;
          if (this.currentPos >= this.total * 1000) {
            this.currentPos -= this.total * 1000;
          }
          this.render();
        }

        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }

    bindEvents() {
      // Resize handling
      window.addEventListener('resize', () => {
        this.updateDimensions();
        this.render();
      }, { passive: true });

      // Prev / Next buttons
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.step(-1));
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.step(1));
      }

      // Hover pause on container
      this.container.addEventListener('pointerenter', () => { this.isPaused = true; });
      this.container.addEventListener('pointerleave', () => { this.isPaused = false; });
      this.container.addEventListener('focusin', () => { this.isPaused = true; });
      this.container.addEventListener('focusout', () => { this.isPaused = false; });

      // Keyboard arrow navigation
      this.container.setAttribute('tabindex', '0');
      this.container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.step(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.step(-1);
        }
      });

      // Pointer drag interaction
      const onPointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        if (this.glideTween) this.glideTween.kill();
        this.isDragging = true;
        this.startX = e.clientX;
        this.startPos = this.currentPos;
        this.lastPoints = [{ t: performance.now(), pos: this.currentPos }];

        this.container.setPointerCapture(e.pointerId);
        this.container.classList.add('is-dragging');
      };

      const onPointerMove = (e) => {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.startX;
        const dragFactor = (this.cardWidth + this.gap);
        this.currentPos = this.startPos - (deltaX / dragFactor);

        const now = performance.now();
        this.lastPoints.push({ t: now, pos: this.currentPos });
        this.lastPoints = this.lastPoints.filter(p => now - p.t < 100);

        this.render();
      };

      const onPointerUp = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.container.classList.remove('is-dragging');

        if (this.container.hasPointerCapture(e.pointerId)) {
          this.container.releasePointerCapture(e.pointerId);
        }

        // Calculate flick inertia
        const first = this.lastPoints[0];
        const last = this.lastPoints[this.lastPoints.length - 1];
        const dt = (last && first) ? (last.t - first.t) / 1000 : 0;
        const velocity = (dt > 0.01) ? (last.pos - first.pos) / dt : 0;

        let target = this.currentPos + velocity * 0.35;
        target = Math.round(target);

        const duration = Math.min(1.4, Math.max(0.6, Math.abs(velocity) * 0.25));
        this.glideTo(target, duration);
      };

      this.container.addEventListener('pointerdown', onPointerDown);
      this.container.addEventListener('pointermove', onPointerMove);
      this.container.addEventListener('pointerup', onPointerUp);
      this.container.addEventListener('pointercancel', onPointerUp);

      // Card direct click (clicking a side card centers it!)
      this.track.addEventListener('click', (e) => {
        const card = e.target.closest('.tweenly-card');
        if (!card) return;
        const idx = parseInt(card.dataset.index, 10);
        if (isNaN(idx)) return;

        let hn = idx - this.currentPos;
        hn = ((hn + this.total / 2) % this.total + this.total) % this.total - this.total / 2;

        if (Math.abs(hn) > 0.15) {
          const target = Math.round(this.currentPos + hn);
          this.glideTo(target, 0.7);
        }
      });
    }
  }

  // Initialize on DOM ready
  function initCurvedCarousel() {
    const el = document.getElementById('tweenlyCurvedCarousel');
    if (el) {
      window.curvedCarouselInstance = new TweenlyCurvedCarousel(el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCurvedCarousel);
  } else {
    initCurvedCarousel();
  }

})();
