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

    // ===================================================================
    // MAGIC DONATION & LIQUID GOLD ENGINE
    // Crowd members donate one-by-one with staggered delay; coins arc up
    // to fill SLUM ART FOUNDATION with shimmering liquid gold
    // ===================================================================
    const donationCoins = [];
    const sparkParticles = [];
    const floatingBadges = [];
    const splashRings = [];

    let liquidFillPercent = 0;
    let targetFillPercent = 0;
    let totalDonationPot = 1420;
    let totalDonationCount = 142;
    let lastAutoDonationTime = performance.now();
    let nextDonationDelay = 1000;
    let isCelebration = false;
    let lastFrameTime = performance.now();
    let hasReachedFooter = false;
    let isFooterVisible = false;

    function updateLiquidDom(percent) {
      const goldEl = document.getElementById('skiperWatermarkGold');
      if (goldEl) {
        goldEl.style.setProperty('--liquid-fill', `${percent.toFixed(1)}%`);
        goldEl.style.opacity = percent > 0.4 ? '1' : '0';
      }
      const meterEl = document.getElementById('footerMeterFill');
      if (meterEl) {
        meterEl.style.width = `${percent.toFixed(1)}%`;
      }
      const percentEl = document.getElementById('footerPercentDisplay');
      if (percentEl) {
        percentEl.textContent = `${Math.round(percent)}%`;
      }
    }

    function updateCounterDom() {
      const potEl = document.getElementById('footerPotDisplay');
      if (potEl) {
        potEl.textContent = `$${totalDonationPot.toLocaleString()}`;
      }
      const countEl = document.getElementById('footerPledgesCount');
      if (countEl) {
        countEl.textContent = `${totalDonationCount.toLocaleString()}`;
      }
    }

    function drawGoldCoin(c, x, y, rot) {
      c.save();
      c.translate(x, y);
      c.rotate(rot);

      // Radial Golden Halo
      const glow = c.createRadialGradient(0, 0, 2, 0, 0, 16);
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      glow.addColorStop(0.4, 'rgba(245, 158, 11, 0.55)');
      glow.addColorStop(1, 'rgba(217, 119, 6, 0)');
      c.fillStyle = glow;
      c.beginPath();
      c.arc(0, 0, 16, 0, Math.PI * 2);
      c.fill();

      // Coin Outer Rim
      c.fillStyle = '#f59e0b';
      c.beginPath();
      c.arc(0, 0, 8, 0, Math.PI * 2);
      c.fill();

      // Coin Specular Highlight
      c.fillStyle = '#fef08a';
      c.beginPath();
      c.arc(-2, -2, 4.5, 0, Math.PI * 2);
      c.fill();

      // Currency Sign
      c.fillStyle = '#78350f';
      c.font = 'bold 9px sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('$', 0, 0);

      c.restore();
    }

    function drawFloatingBadge(c, b) {
      c.save();
      c.globalAlpha = Math.max(0, Math.min(1, b.alpha));
      c.fillStyle = 'rgba(15, 23, 42, 0.88)';
      c.strokeStyle = '#f59e0b';
      c.lineWidth = 1.2;

      const bw = 38;
      const bh = 22;
      const bx = b.x - bw / 2;
      const by = b.y - bh / 2;

      c.beginPath();
      if (typeof c.roundRect === 'function') {
        c.roundRect(bx, by, bw, bh, 11);
      } else {
        c.rect(bx, by, bw, bh);
      }
      c.fill();
      c.stroke();

      c.fillStyle = '#fde047';
      c.font = 'bold 11px sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(b.text, b.x, b.y);

      c.restore();
    }

    function createSplashAt(x, y) {
      // Expanding Golden Shockwave Ring
      splashRings.push({
        x,
        y,
        radius: 3,
        expandSpeed: 1.8,
        width: 2.5,
        alpha: 1,
        decay: 0.05
      });

      // Radiating Gold Sparks
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.8;
        sparkParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2.5,
          alpha: 1,
          color: Math.random() > 0.3 ? '#fde047' : '#ffffff',
          decay: 0.035 + Math.random() * 0.035
        });
      }
    }

    function triggerCelebration() {
      isCelebration = true;
      const goldEl = document.getElementById('skiperWatermarkGold');
      if (goldEl) goldEl.classList.add('celebrating');
      const leadEl = document.getElementById('magicLeadText');
      if (leadEl) {
        leadEl.innerHTML = '<strong>Community Goal Achieved! 100% Empowered — Thank You!</strong>';
      }

      // Golden fireworks across letters
      for (let i = 0; i < 50; i++) {
        const fx = stage.width * (0.12 + Math.random() * 0.76);
        const fy = stage.height * (0.12 + Math.random() * 0.16);
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        sparkParticles.push({
          x: fx,
          y: fy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.6,
          size: 2 + Math.random() * 3.5,
          alpha: 1,
          color: ['#fef08a', '#fbbf24', '#f59e0b', '#ffffff'][Math.floor(Math.random() * 4)],
          decay: 0.012 + Math.random() * 0.01
        });
      }

      setTimeout(() => {
        if (goldEl) goldEl.classList.remove('celebrating');
        if (leadEl) {
          leadEl.innerHTML = 'Every donation helps us <span class="magic-kicker-gold">build a greater future together</span>';
        }
        targetFillPercent = 0;
        isCelebration = false;
      }, 6500);
    }

    function triggerDonation(peep, customAmount) {
      if (!peep) return;
      const amount = customAmount || [1, 2, 5, 10, 1][Math.floor(Math.random() * 5)];
      const now = performance.now();
      peep.lastDonated = now;

      // Peep joyful hop
      if (peep.anchorY) {
        gsap.to(peep, {
          y: peep.anchorY - 14,
          duration: 0.22,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        });
      }

      const isRight = peep.scaleX === 1;
      const startX = isRight ? peep.x + peep.width * 0.5 : peep.x - peep.width * 0.5;
      const startY = peep.y + peep.height * 0.35;

      const targetX = stage.width * (0.12 + Math.random() * 0.76);
      const targetY = stage.height * (0.15 + Math.random() * 0.14);

      floatingBadges.push({
        x: startX,
        y: peep.y - 12,
        text: `+$${amount}`,
        alpha: 1,
        vy: -1.2,
        life: 0,
        maxLife: 48
      });

      donationCoins.push({
        startX,
        startY,
        targetX,
        targetY,
        x: startX,
        y: startY,
        arcHeight: 70 + Math.random() * 60,
        progress: 0,
        duration: 0.95 + Math.random() * 0.25,
        amount,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 6 + Math.random() * 8
      });
    }

    function launchDirectCoin(x, y, amount = 5) {
      donationCoins.push({
        startX: x,
        startY: y,
        targetX: stage.width * (0.15 + Math.random() * 0.7),
        targetY: stage.height * (0.15 + Math.random() * 0.12),
        x,
        y,
        arcHeight: 90,
        progress: 0,
        duration: 0.85,
        amount,
        rotation: 0,
        rotSpeed: 8
      });
    }

    function updateAndRenderDonations(c, dt) {
      const now = performance.now();

      // 1. Auto-trigger crowd donations one-by-one ONLY after the user scrolls to the bottom
      if (!hasReachedFooter || !isFooterVisible) {
        lastAutoDonationTime = now;
      } else if (now - lastAutoDonationTime > nextDonationDelay && crowd.length > 0) {
        lastAutoDonationTime = now;
        nextDonationDelay = 1600 + Math.random() * 1100;

        const visiblePeeps = crowd.filter((p) => {
          const px = p.scaleX === 1 ? p.x : p.x - p.width;
          return px > 40 && px < stage.width - 80 && (!p.lastDonated || now - p.lastDonated > 6500);
        });

        if (visiblePeeps.length > 0) {
          const chosen = visiblePeeps[Math.floor(Math.random() * visiblePeeps.length)];
          triggerDonation(chosen);
        }
      }

      // 2. Smoothly interpolate liquid level
      liquidFillPercent += (targetFillPercent - liquidFillPercent) * 0.08;
      updateLiquidDom(liquidFillPercent);

      // 3. Update & render flying coins
      for (let i = donationCoins.length - 1; i >= 0; i--) {
        const coin = donationCoins[i];
        coin.progress += dt / coin.duration;
        coin.rotation += coin.rotSpeed * dt;

        const t = Math.min(coin.progress, 1);
        const curX = coin.startX + (coin.targetX - coin.startX) * t;
        const curY = coin.startY + (coin.targetY - coin.startY) * t - Math.sin(t * Math.PI) * coin.arcHeight;
        coin.x = curX;
        coin.y = curY;

        // Golden spark trail
        if (Math.random() > 0.2) {
          sparkParticles.push({
            x: curX + (Math.random() - 0.5) * 6,
            y: curY + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 + 0.4,
            size: 1.5 + Math.random() * 2.5,
            alpha: 1,
            color: Math.random() > 0.35 ? '#fbbf24' : '#ffffff',
            decay: 0.03 + Math.random() * 0.03
          });
        }

        drawGoldCoin(c, coin.x, coin.y, coin.rotation);

        if (coin.progress >= 1) {
          donationCoins.splice(i, 1);
          createSplashAt(coin.targetX, coin.targetY);

          targetFillPercent = Math.min(100, targetFillPercent + coin.amount * 0.9);
          totalDonationPot += coin.amount;
          totalDonationCount += 1;
          updateCounterDom();

          if (targetFillPercent >= 100 && !isCelebration) {
            triggerCelebration();
          }
        }
      }

      // 4. Update & render splash shockwaves
      for (let i = splashRings.length - 1; i >= 0; i--) {
        const ring = splashRings[i];
        ring.radius += ring.expandSpeed;
        ring.alpha -= ring.decay;
        if (ring.alpha <= 0) {
          splashRings.splice(i, 1);
          continue;
        }
        c.save();
        c.strokeStyle = `rgba(251, 191, 36, ${ring.alpha})`;
        c.lineWidth = ring.width;
        c.beginPath();
        c.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        c.stroke();
        c.restore();
      }

      // 5. Update & render sparkling particles
      for (let i = sparkParticles.length - 1; i >= 0; i--) {
        const p = sparkParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          sparkParticles.splice(i, 1);
          continue;
        }
        c.save();
        c.globalAlpha = Math.max(0, p.alpha);
        c.fillStyle = p.color;
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }

      // 6. Update & render floating badges
      for (let i = floatingBadges.length - 1; i >= 0; i--) {
        const b = floatingBadges[i];
        b.y += b.vy;
        b.life++;
        b.alpha = 1 - b.life / b.maxLife;
        if (b.life >= b.maxLife) {
          floatingBadges.splice(i, 1);
          continue;
        }
        drawFloatingBadge(c, b);
      }
    }

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
      const now = performance.now();
      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      // 1. Render all walking crowd characters
      for (let i = 0; i < crowd.length; i++) {
        crowd[i].render(ctx);
      }

      // 2. Update and render magic donation coins, arcs, sparkles & badges
      updateAndRenderDonations(ctx, dt);

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

    function setupScrollTrigger() {
      const footer = document.getElementById('mainFooter') || document.querySelector('.skiper39-footer');
      if (!footer) {
        hasReachedFooter = true;
        isFooterVisible = true;
        return;
      }

      function onEnterBottom() {
        if (!hasReachedFooter) {
          hasReachedFooter = true;
          lastAutoDonationTime = performance.now();
          nextDonationDelay = 800; // brief natural pause before first donation
        }
        isFooterVisible = true;
      }

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isFooterVisible = entry.isIntersecting;
            if (entry.isIntersecting) {
              onEnterBottom();
            }
          });
        }, {
          threshold: 0.12,
          rootMargin: '0px 0px -30px 0px'
        });
        observer.observe(footer);
      }

      function onScrollCheck() {
        const scrollBottom = window.innerHeight + (window.pageYOffset || document.documentElement.scrollTop || 0);
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        if (docHeight - scrollBottom < 450) {
          onEnterBottom();
        }
      }
      window.addEventListener('scroll', onScrollCheck, { passive: true });
      onScrollCheck();
    }

    const init = () => {
      createPeeps();
      resize();
      updateLiquidDom(0);
      setupScrollTrigger();
      gsap.ticker.add(render);

      // Interactive Crowd Click / Tap: closest peep throws gold donation burst
      canvas.addEventListener('click', (e) => {
        hasReachedFooter = true;
        isFooterVisible = true;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        let closest = null;
        let minDist = 180;
        for (let i = 0; i < crowd.length; i++) {
          const p = crowd[i];
          const px = p.scaleX === 1 ? p.x + p.width * 0.5 : p.x - p.width * 0.5;
          const py = p.y + p.height * 0.5;
          const d = Math.hypot(clickX - px, clickY - py);
          if (d < minDist) {
            minDist = d;
            closest = p;
          }
        }

        if (closest) {
          triggerDonation(closest, 5);
          setTimeout(() => triggerDonation(closest, 10), 120);
          setTimeout(() => triggerDonation(closest, 5), 240);
        } else {
          launchDirectCoin(clickX, clickY, 5);
        }
      });
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
