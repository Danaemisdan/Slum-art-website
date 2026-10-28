/**
 * ===================================================================
 * SKETCH TEXTAREA COMPONENT (21st.dev @kanchanasw / doodle-ui)
 * Dynamic Hand-Drawn Wobbly Border with Rough.js, Random Seed Redraw,
 * Character Counter, Auto-Resize, and Organic Sketch Fallback.
 * ===================================================================
 */

(function () {
  'use strict';

  function initSketchTextareas() {
    const wraps = document.querySelectorAll('.sketch-textarea-wrap');
    if (!wraps.length) return;

    wraps.forEach((wrap) => {
      // Avoid double initialization
      if (wrap.dataset.sketchInit === 'true') return;
      wrap.dataset.sketchInit = 'true';

      const textarea = wrap.querySelector('textarea.sketch-textarea') || wrap.querySelector('textarea');
      let svg = wrap.querySelector('.sketch-textarea-svg');
      let counterCurrent = wrap.querySelector('.sketch-current');
      let charCountEl = wrap.querySelector('.sketch-char-count');
      const maxChars = parseInt(wrap.dataset.maxChars || '1000', 10);

      // Create SVG if not present
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.className.baseVal = 'sketch-textarea-svg';
        svg.setAttribute('aria-hidden', 'true');
        wrap.insertBefore(svg, wrap.firstChild);
      }

      if (!textarea) return;

      // Ensure class
      if (!textarea.classList.contains('sketch-textarea')) {
        textarea.classList.add('sketch-textarea');
      }

      // Add doodle pencil pin indicator if missing
      if (!wrap.querySelector('.sketch-doodle-pin')) {
        const pin = document.createElement('div');
        pin.className = 'sketch-doodle-pin';
        pin.innerHTML = '<i class="fas fa-pencil" style="font-size: 0.85rem;"></i>';
        wrap.appendChild(pin);
      }

      let isFocused = false;
      let isHovered = false;

      // Procedural fallback path if rough.js is not loaded
      function drawFallbackWobblyRect(w, h, strokeColor, strokeWidth) {
        const pad = 4;
        const x1 = pad, y1 = pad;
        const x2 = w - pad, y2 = pad;
        const x3 = w - pad, y3 = h - pad;
        const x4 = pad, y4 = h - pad;
        
        // Random micro jitters
        const r = (scale = 1.8) => (Math.random() - 0.5) * scale;

        const d1 = `M ${x1 + r()} ${y1 + r()} Q ${(x1 + x2)/2 + r(2.5)} ${y1 + r(2.5)}, ${x2 + r()} ${y2 + r()} ` +
                   `Q ${x2 + r(2.5)} ${(y2 + y3)/2 + r(2.5)}, ${x3 + r()} ${y3 + r()} ` +
                   `Q ${(x3 + x4)/2 + r(2.5)} ${y3 + r(2.5)}, ${x4 + r()} ${y4 + r()} ` +
                   `Q ${x4 + r(2.5)} ${(y4 + y1)/2 + r(2.5)}, ${x1 + r()} ${y1 + r()} Z`;

        const d2 = `M ${x1 + r()} ${y1 + r()} Q ${(x1 + x2)/2 + r(1.5)} ${y1 + r(1.5)}, ${x2 + r()} ${y2 + r()} ` +
                   `Q ${x2 + r(1.5)} ${(y2 + y3)/2 + r(1.5)}, ${x3 + r()} ${y3 + r()} ` +
                   `Q ${(x3 + x4)/2 + r(1.5)} ${y3 + r(1.5)}, ${x4 + r()} ${y4 + r()} ` +
                   `Q ${x4 + r(1.5)} ${(y4 + y1)/2 + r(1.5)}, ${x1 + r()} ${y1 + r()} Z`;

        return `
          <path d="${d1}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
          <path d="${d2}" fill="none" stroke="${strokeColor}" stroke-width="${Math.max(1, strokeWidth - 0.6)}" opacity="0.6" stroke-linecap="round" stroke-linejoin="round" />
        `;
      }

      function drawBorder() {
        const width = wrap.clientWidth;
        // The border wraps the textarea area
        const height = textarea.offsetHeight + (wrap.classList.contains('no-footer') ? 8 : 4);
        if (width <= 0 || height <= 0) return;

        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.width = width + 'px';
        svg.style.height = height + 'px';

        // Clear previous SVG contents
        while (svg.firstChild) {
          svg.removeChild(svg.firstChild);
        }

        const strokeColor = isFocused ? '#e06927' : (isHovered ? '#f59e0b' : '#94a3b8');
        const strokeWidth = isFocused ? 2.2 : (isHovered ? 1.8 : 1.4);
        const roughness = isFocused ? 1.6 : 1.1;
        const bowing = isFocused ? 1.3 : 0.8;

        if (window.rough && typeof window.rough.svg === 'function') {
          try {
            const rc = window.rough.svg(svg);
            const seed = Math.floor(Math.random() * 100000);
            
            // Draw main hand-drawn sketchy box
            const rectNode = rc.rectangle(4, 4, width - 8, height - 8, {
              roughness: roughness,
              bowing: bowing,
              stroke: strokeColor,
              strokeWidth: strokeWidth,
              seed: seed,
              curveFitting: 0.95
            });
            svg.appendChild(rectNode);

            // If focused, draw an energetic little sketch corner accent / doodle squiggle
            if (isFocused) {
              const accentSeed = Math.floor(Math.random() * 100000);
              // Top-left double tick
              const tick1 = rc.line(10, 3, 26, 3, {
                stroke: '#f59e0b',
                strokeWidth: 1.6,
                roughness: 1.8,
                seed: accentSeed
              });
              // Bottom-right double tick
              const tick2 = rc.line(width - 28, height - 3, width - 10, height - 3, {
                stroke: '#f59e0b',
                strokeWidth: 1.6,
                roughness: 1.8,
                seed: accentSeed + 1
              });
              svg.appendChild(tick1);
              svg.appendChild(tick2);
            }
          } catch (err) {
            console.warn('Rough.js drawing error, using procedural SVG fallback:', err);
            svg.innerHTML = drawFallbackWobblyRect(width, height, strokeColor, strokeWidth);
          }
        } else {
          // Procedural SVG hand-drawn fallback
          svg.innerHTML = drawFallbackWobblyRect(width, height, strokeColor, strokeWidth);
        }
      }

      function updateCharCount() {
        const len = textarea.value.length;
        if (counterCurrent) {
          counterCurrent.textContent = len;
        }
        if (charCountEl) {
          if (len >= maxChars) {
            charCountEl.classList.add('at-limit');
            charCountEl.classList.remove('near-limit');
          } else if (len >= maxChars * 0.85) {
            charCountEl.classList.add('near-limit');
            charCountEl.classList.remove('at-limit');
          } else {
            charCountEl.classList.remove('near-limit', 'at-limit');
          }
        }
      }

      // Events
      textarea.addEventListener('focus', () => {
        isFocused = true;
        wrap.classList.add('is-focused');
        drawBorder();
      });

      textarea.addEventListener('blur', () => {
        isFocused = false;
        wrap.classList.remove('is-focused');
        drawBorder();
      });

      wrap.addEventListener('mouseenter', () => {
        if (!isFocused) {
          isHovered = true;
          drawBorder();
        }
      });

      wrap.addEventListener('mouseleave', () => {
        if (!isFocused) {
          isHovered = false;
          drawBorder();
        }
      });

      textarea.addEventListener('input', () => {
        updateCharCount();
        // Optional auto-grow
        if (wrap.dataset.autoGrow === 'true') {
          textarea.style.height = 'auto';
          textarea.style.height = Math.max(100, textarea.scrollHeight) + 'px';
          drawBorder();
        }
      });

      // Resize observer to redraw border if textarea is manually resized
      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
          drawBorder();
        });
        ro.observe(textarea);
      }

      // Initial render & count
      updateCharCount();
      // Defer border draw slightly to guarantee bounding layout is complete
      setTimeout(drawBorder, 50);
      window.addEventListener('resize', debounce(drawBorder, 100));
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Expose globally
  window.initSketchTextareas = initSketchTextareas;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSketchTextareas);
  } else {
    initSketchTextareas();
  }
})();
