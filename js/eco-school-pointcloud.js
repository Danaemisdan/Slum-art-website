/**
 * Slum Art Foundation - 3D Eco-Bottle School Point Cloud Architecture
 * High-Density Procedural Point Cloud: 60,000+ luminous points representing
 * the 50,000+ upcycled plastic bottles, Danfo bus classroom & solar roof.
 * Rendered directly on the site background with scroll-driven orbit.
 */

(function () {
  'use strict';

  function initEcoPointCloud() {
    const canvas = document.getElementById('ecoPointCloudCanvas');
    const container = document.getElementById('ecoPointCloudContainer');
    if (!canvas || !container) return;

    if (typeof THREE === 'undefined') {
      setTimeout(initEcoPointCloud, 150);
      return;
    }

    // 1. Scene & Transparent Camera Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 620;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 17.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. High-Quality Circular Bokeh Point Sprite
    function createPointTexture() {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');

      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.5)');
      grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.15)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true;
      return texture;
    }

    // 3. Procedural Point Cloud Geometry (60,000+ points)
    const positions = [];
    const colors = [];

    function addPoint(x, y, z, r, g, b) {
      positions.push(x, y, z);
      colors.push(r, g, b);
    }

    // --- A. Floating Timber Foundation Pontoon Deck ---
    const deckW = 15.5;
    const deckD = 12.0;
    for (let x = -deckW / 2; x <= deckW / 2; x += 0.16) {
      for (let z = -deckD / 2; z <= deckD / 2 + 1.2; z += 0.16) {
        const jitter = (Math.random() - 0.5) * 0.04;
        // Warm golden timber plank tones
        const isPlankEdge = Math.abs(x % 0.8) < 0.08;
        const br = isPlankEdge ? 0.38 : (0.58 + Math.random() * 0.15);
        const bg = isPlankEdge ? 0.22 : (0.36 + Math.random() * 0.10);
        const bb = isPlankEdge ? 0.10 : (0.16 + Math.random() * 0.06);

        addPoint(x, -0.6 + jitter, z, br, bg, bb);

        // Pontoon buoyant underbelly
        if (Math.random() > 0.45) {
          addPoint(x, -0.9 + jitter, z, br * 0.65, bg * 0.65, bb * 0.65);
        }
      }
    }

    // Heavy Stilt Pilings into Lagoon
    for (let px of [-6.2, -2.2, 2.2, 6.2]) {
      for (let pz of [-4.5, 0, 4.5, 6.2]) {
        for (let py = -0.6; py >= -2.4; py -= 0.10) {
          for (let a = 0; a < 7; a++) {
            const ang = a * (Math.PI * 2 / 7);
            addPoint(px + Math.cos(ang) * 0.24, py, pz + Math.sin(ang) * 0.24, 0.32, 0.20, 0.10);
          }
        }
      }
    }

    // --- B. Stacked Recycled Plastic Bottle Walls ---
    const bW = 12.8; // building width
    const bD = 9.2;  // building depth
    const bH = 5.2;  // building wall height

    // B1. Side Walls (Stacked Luminous Amber & Golden Plastic Bottles)
    for (let wallX of [-bW / 2, bW / 2]) {
      for (let y = 0; y <= bH; y += 0.14) {
        for (let z = -bD / 2; z <= bD / 2; z += 0.14) {
          // Window openings
          if (y >= 1.6 && y <= 3.6 && z >= -2.2 && z <= 2.2) {
            // Window lintel and frame points
            if (Math.abs(y - 1.6) < 0.15 || Math.abs(y - 3.6) < 0.15 || Math.abs(z - -2.2) < 0.15 || Math.abs(z - 2.2) < 0.15) {
              addPoint(wallX, y, z, 0.95, 0.95, 0.95);
            }
            continue;
          }

          // 8 points around cylindrical bottle circumference
          const numPts = 6;
          for (let a = 0; a < numPts; a++) {
            const ang = a * (Math.PI * 2 / numPts);
            const r = 0.10;
            const px = wallX + Math.sin(ang) * r;
            const pz = z + Math.cos(ang) * r;
            const py = y + (Math.random() - 0.5) * 0.05;

            // Vibrant glowing translucent amber gold bottle colors
            const isHighlight = Math.random() > 0.65;
            const cr = isHighlight ? 1.0 : (0.95 + Math.random() * 0.05);
            const cg = isHighlight ? 0.78 : (0.58 + Math.random() * 0.18);
            const cb = isHighlight ? 0.22 : (0.06 + Math.random() * 0.08);

            addPoint(px, py, pz, cr, cg, cb);
          }

          // Inner row bottle cap
          const capDir = wallX > 0 ? 1 : -1;
          addPoint(wallX + capDir * 0.12, y, z, 0.2, 0.6, 0.95);
        }
      }
    }

    // B2. Front & Back Walls (Stacked Obsidian / Smoky Dark Bottles with Cyan PET Highlights)
    for (let wallZ of [-bD / 2, bD / 2]) {
      const isFront = wallZ > 0;
      for (let y = 0; y <= bH; y += 0.14) {
        for (let x = -bW / 2; x <= bW / 2; x += 0.14) {
          // Front wall opening for protruding Danfo bus classroom
          if (isFront && x >= 0.6 && x <= 4.2 && y <= 3.8) {
            continue; // Danfo bus integrates here!
          }
          // Main classroom door opening
          if (isFront && x >= -3.6 && x <= -1.6 && y <= 3.4) {
            continue;
          }

          const numPts = 5;
          for (let a = 0; a < numPts; a++) {
            const ang = a * (Math.PI * 2 / numPts);
            const r = 0.10;
            const px = x + Math.cos(ang) * r;
            const pz = wallZ + Math.sin(ang) * r;
            const py = y + (Math.random() - 0.5) * 0.05;

            const isAccent = Math.random() > 0.82;
            let cr = 0.22, cg = 0.28, cb = 0.38;
            if (isAccent) {
              // Bright luminous cyan PET glow
              cr = 0.10; cg = 0.92; cb = 0.88;
            }

            addPoint(px, py, pz, cr, cg, cb);
          }
        }
      }
    }

    // --- C. Classroom Interior Desks & Chalkboard ---
    for (let dx = -4.5; dx <= -0.5; dx += 1.2) {
      for (let dz = -3.0; dz <= 2.5; dz += 1.5) {
        // Wooden desk top
        for (let tx = -0.4; tx <= 0.4; tx += 0.12) {
          for (let tz = -0.25; tz <= 0.25; tz += 0.12) {
            addPoint(dx + tx, 1.4, dz + tz, 0.72, 0.48, 0.22);
          }
        }
        // Bench seat
        for (let bx = -0.35; bx <= 0.35; bx += 0.12) {
          addPoint(dx + bx, 0.8, dz - 0.4, 0.65, 0.42, 0.18);
        }
      }
    }

    // Blackboard on front-left wall
    for (let bx = -3.8; bx <= -1.4; bx += 0.08) {
      for (let by = 1.6; by <= 3.2; by += 0.08) {
        addPoint(bx, by, bD / 2 - 0.15, 0.05, 0.15, 0.12);
      }
    }

    // --- D. The Iconic Lagos Danfo Bus Classroom ---
    // Protrudes boldly through front wall: x=0.9 to 3.9, z=4.2 to 7.4, y=0.3 to 3.5
    const busCX = 2.4;
    const busZMin = 4.0;
    const busZMax = 7.3;
    const busW = 3.0;
    const busH = 2.9;

    for (let bz = busZMin; bz <= busZMax; bz += 0.08) {
      for (let by = 0.3; by <= 0.3 + busH; by += 0.08) {
        for (let bx = busCX - busW / 2; bx <= busCX + busW / 2; bx += 0.08) {
          const isFrontFace = Math.abs(bz - busZMax) < 0.10;
          const isSideFace = Math.abs(Math.abs(bx - busCX) - busW / 2) < 0.10;
          const isRoofFace = Math.abs(by - (0.3 + busH)) < 0.10;

          if (!isFrontFace && !isSideFace && !isRoofFace) continue;

          // Windshield glass on front face
          const isWindshield = isFrontFace && by >= 1.6 && by <= 2.7 && Math.abs(bx - busCX) <= 1.25;
          // Side passenger windows
          const isSideWindow = isSideFace && by >= 1.6 && by <= 2.6 && bz >= 4.4 && bz <= 6.8;

          // Dual Iconic Black Transit Stripes
          const isStripe = (by >= 1.15 && by <= 1.32) || (by >= 1.40 && by <= 1.55);

          if (isWindshield || isSideWindow) {
            // Glowing cyan-sky glass points
            addPoint(bx, by, bz, 0.25, 0.85, 0.98);
          } else if (isStripe) {
            // Pitch-black transit stripes
            addPoint(bx, by, bz, 0.04, 0.05, 0.08);
          } else {
            // Brilliant, vibrant Lagos Danfo Yellow
            const yr = 1.0;
            const yg = 0.84 + (Math.random() - 0.5) * 0.08;
            const yb = 0.04;
            addPoint(bx, by, bz, yr, yg, yb);
          }
        }
      }
    }

    // Danfo Dual Radiant Headlights
    for (let hx of [busCX - 1.05, busCX + 1.05]) {
      for (let a = 0; a < 16; a++) {
        const ang = a * (Math.PI * 2 / 16);
        for (let hr = 0.05; hr <= 0.22; hr += 0.06) {
          addPoint(hx + Math.cos(ang) * hr, 0.95 + Math.sin(ang) * hr, busZMax + 0.10, 1.0, 1.0, 0.95);
        }
      }
      // Glowing forward headlight beam cone
      for (let beamZ = busZMax + 0.2; beamZ <= busZMax + 1.4; beamZ += 0.15) {
        const spread = (beamZ - busZMax) * 0.35;
        for (let b = 0; b < 6; b++) {
          const bang = b * (Math.PI * 2 / 6);
          addPoint(hx + Math.cos(bang) * spread, 0.95 + Math.sin(bang) * spread, beamZ, 0.95, 0.90, 0.60);
        }
      }
    }

    // Danfo Wheels & Tires
    for (let wx of [busCX - 1.55, busCX + 1.55]) {
      for (let wz of [5.0, 6.7]) {
        for (let a = 0; a < 18; a++) {
          const ang = a * (Math.PI * 2 / 18);
          for (let wr = 0.12; wr <= 0.48; wr += 0.08) {
            const isRim = wr < 0.26;
            const tr = isRim ? 0.75 : 0.08;
            const tg = isRim ? 0.75 : 0.09;
            const tb = isRim ? 0.78 : 0.12;
            addPoint(wx, 0.45 + Math.sin(ang) * wr, wz + Math.cos(ang) * wr, tr, tg, tb);
          }
        }
      }
    }

    // --- E. Pitched Corrugated Zinc Roof & Solar Panel Array ---
    for (let rx = -bW / 2 - 0.8; rx <= bW / 2 + 0.8; rx += 0.12) {
      for (let rz = -bD / 2 - 0.8; rz <= bD / 2 + 0.8; rz += 0.12) {
        // Natural drainage pitch slope
        const slope = (rz / bD) * 0.85;
        const ry = bH + 0.6 + slope;
        const corrugation = Math.sin(rx * 8) * 0.05;

        // Solar Panels (Center roof array)
        const isSolar = Math.abs(rx) <= 4.2 && rz >= -2.8 && rz <= 2.8;

        if (isSolar) {
          // Deep radiant electric cobalt-blue solar points
          const isGrid = (Math.abs(rx % 1.0) < 0.06) || (Math.abs(rz % 0.8) < 0.06);
          if (isGrid) {
            // White silver collector busbars
            addPoint(rx, ry + 0.12, rz, 0.92, 0.95, 1.0);
          } else {
            addPoint(rx, ry + 0.12, rz, 0.08, 0.45 + Math.random() * 0.15, 0.98);
          }
        } else {
          // Metallic zinc corrugated roof sheets
          const zr = 0.62 + Math.random() * 0.12;
          const zg = 0.66 + Math.random() * 0.12;
          const zb = 0.72 + Math.random() * 0.12;
          addPoint(rx, ry + corrugation, rz, zr, zg, zb);
        }
      }
    }

    // --- F. Lagoon Water Surface Ripples ---
    for (let i = 0; i < 3500; i++) {
      const wx = (Math.random() - 0.5) * 26;
      const wz = (Math.random() - 0.5) * 24;
      const wy = -1.4 + (Math.random() - 0.5) * 0.06;
      // Vibrant aquatic turquoise & cyan lagoon reflections
      addPoint(wx, wy, wz, 0.02, 0.52 + Math.random() * 0.28, 0.82 + Math.random() * 0.18);
    }

    // --- G. Floating Luminous Eco-Embers (Hovering Golden Stardust) ---
    for (let i = 0; i < 2200; i++) {
      const ex = (Math.random() - 0.5) * 22;
      const ey = Math.random() * 8.5;
      const ez = (Math.random() - 0.5) * 18;
      const isGold = Math.random() > 0.45;
      const er = isGold ? 1.0 : 0.15;
      const eg = isGold ? 0.82 : 0.92;
      const eb = isGold ? 0.20 : 0.75;
      addPoint(ex, ey, ez, er, eg, eb);
    }

    // 4. Create BufferGeometry & High-Visibility Points Mesh
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.38, // Significantly denser, luminous points
      vertexColors: true,
      map: createPointTexture(),
      transparent: true,
      opacity: 0.94,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pointCloud = new THREE.Points(geometry, material);
    pointCloud.position.set(0, -1.0, 0);
    scene.add(pointCloud);

    // Initial 3/4 front view showing off the bright Danfo bus and amber bottle walls
    let currentRotY = 0.45;
    let targetRotY = 0.45;
    let currentRotX = 0.10;
    let targetRotX = 0.10;
    let currentScale = 1.0;
    let targetScale = 1.0;

    // 5. Scroll-Linked 360-Degree Orbital Spin
    function onScroll() {
      const section = document.getElementById('eco-school-3d');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight || 800;

      const totalDist = rect.height + winH;
      const currentDist = winH - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));

      // Map scroll progress to full 360-degree rotation
      targetRotY = 0.35 + progress * (Math.PI * 2.2);
      targetRotX = 0.08 + Math.sin(progress * Math.PI) * 0.12;
      targetScale = 0.95 + Math.sin(progress * Math.PI) * 0.10;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 6. Responsive Window Resize Handler
    function onResize() {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      if (w < 768) {
        camera.position.set(0, 1.6, 26.5);
        material.size = 0.38;
      } else {
        camera.position.set(0, 2.2, 17.5);
        material.size = 0.38;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize);
    onResize();

    // 7. Render Loop with Smooth Spring & Idle Breathing
    let clock = new THREE.Clock();
    let isVisible = true;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    function animate() {
      requestAnimationFrame(animate);

      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Gentle floating idle breathing
      const idleY = Math.sin(time * 0.45) * 0.03;
      const idleFloat = Math.sin(time * 1.1) * 0.06;

      currentRotY += (targetRotY + idleY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentScale += (targetScale - currentScale) * 0.08;

      pointCloud.rotation.y = currentRotY;
      pointCloud.rotation.x = currentRotX;
      pointCloud.position.y = -1.0 + idleFloat;
      pointCloud.scale.set(currentScale, currentScale, currentScale);

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEcoPointCloud);
  } else {
    initEcoPointCloud();
  }
})();
