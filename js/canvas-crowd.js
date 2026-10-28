/**
 * Skiper39 Canvas Crowd Component • 21st.dev Inspired Implementation
 * Adapted for Slum Art Foundation
 * Powered by HTML5 Canvas & GSAP timelines
 */

(function () {
  'use strict';

  function initCanvasCrowd() {
    const canvas = document.getElementById('skiperCrowdCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof gsap === 'undefined') {
      console.warn('GSAP library not loaded. Canvas crowd deferred.');
      return;
    }

    const config = {
      src: 'assets/images/peeps/all-peeps.png',
      rows: 15,
      cols: 7,
    };

    // UTILS
    const randomRange = (min, max) => min + Math.random() * (max - min);
    const randomIndex = (array) => (randomRange(0, array.length) | 0);
    const removeFromArray = (array, i) => array.splice(i, 1)[0];
    const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const PEEP_SCALE = 0.8;

    const resetPeep = ({ stage, peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      // Stagger vertical anchor depth so characters overlap naturally near the baseline
      const depthOffset = Math.random() * 35;
      const startY = stage.height - peep.height + depthOffset;
      let startX;
      let endX;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width + peep.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = -peep.width;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }) => {
      const { startX, startY, endX } = props;
      // Slower, smooth walking speeds
      const xDuration = randomRange(12, 22);
      const yDuration = randomRange(0.24, 0.35);

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.7, 1.3));
      
      // Horizontal translation
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: 'none',
        },
        0
      );

      // Bobbing walking motion
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: Math.floor(xDuration / yDuration),
          yoyo: true,
          y: startY - 8,
          ease: 'power1.inOut',
        },
        0
      );

      return tl;
    };

    const walks = [normalWalk];

    // FACTORY FUNCTIONS
    const createPeep = ({ image, rect }) => {
      const peep = {
        image,
        rect,
        width: rect[2] * PEEP_SCALE,
        height: rect[3] * PEEP_SCALE,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        render: (c) => {
          c.save();
          c.translate(peep.x, peep.y);
          c.scale(peep.scaleX, 1);
          c.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height
          );
          c.restore();
        },
      };

      return peep;
    };

    // MAIN
    const img = new Image();
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps = [];
    const availablePeeps = [];
    const crowd = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          })
        );
      }
    };

    const removePeepFromCrowd = (peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) return null;
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const initCrowd = () => {
      // Spawn initial crowd distributed across the canvas
      const maxPeepsToSpawn = Math.min(availablePeeps.length, 25);
      for (let i = 0; i < maxPeepsToSpawn; i++) {
        const peep = addPeepToCrowd();
        if (peep && peep.walk) {
          peep.walk.progress(Math.random());
        }
      }
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      for (let i = 0; i < crowd.length; i++) {
        crowd[i].render(ctx);
      }

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      stage.width = rect.width;
      stage.height = rect.height;

      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.onerror = () => {
      console.warn('Canvas crowd sprite sheet failed to load:', config.src);
    };
    img.src = config.src;

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
  }

  // Spotlight card mouse movement effect (21st.dev style)
  function initSpotlightCards() {
    const cards = document.querySelectorAll('.spotlight-card, .program-card, .welfare-card, .cause-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  // Animated Number Counter Ticker (21st.dev style)
  function initNumberCounters() {
    const counters = document.querySelectorAll('.count-up');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target || el.textContent.replace(/[^\d.]/g, ''));
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const isDecimal = String(target).includes('.');
          
          let start = 0;
          const duration = 1600;
          const startTime = performance.now();

          function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = start + (target - start) * easeOut;

            if (isDecimal) {
              el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
            } else {
              el.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
            }

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            }
          }

          requestAnimationFrame(step);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach((c) => observer.observe(c));
  }


  // 21st.dev Tideline CTA Component Logic (Designed by @ham7a311)
  function initTidelineCta() {
    const sections = document.querySelectorAll('.tlc, .tlc-section');
    if (!sections.length) return;

    sections.forEach((section) => {
      function updateMetrics() {
        const h = section.offsetHeight || 750;
        section.style.setProperty('--tlc-h', `${h}px`);
        const p = parseFloat(getComputedStyle(section).getPropertyValue('--tlc-p')) || 0.5;
        section.style.setProperty('--tlc-top', `${((1 - p) * h).toFixed(1)}px`);
      }

      updateMetrics();
      window.addEventListener('resize', updateMetrics);

      if (window.ResizeObserver) {
        const ro = new ResizeObserver(updateMetrics);
        ro.observe(section);
      }

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          section.setAttribute('data-seen', 'true');
          const target = parseFloat(section.style.getPropertyValue('--tlc-target')) || 0.5;
          section.style.setProperty('--tlc-p', target);
          updateMetrics();
          observer.disconnect();
        }
      }, { threshold: 0.15 });

      observer.observe(section);
    });
  }

  // Initialize all enhancements on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCanvasCrowd();
      initSpotlightCards();
      initNumberCounters();
      initTidelineCta();
    });
  } else {
    initCanvasCrowd();
    initSpotlightCards();
    initNumberCounters();
      initTidelineCta();
  }

})();
