/**
 * Slum Art Foundation - 3D Eco-Bottle School Point Cloud Architecture
 * Procedural Realistic Point Cloud: 50,000+ luminous points representing
 * the 50,000+ upcycled plastic bottles, Danfo bus classroom & solar roof.
 * Scroll-driven rotation (no interaction needed, turns as user scrolls).
 */

(function () {
  'use strict';

  function initEcoPointCloud() {
    const canvas = document.getElementById('ecoPointCloudCanvas');
    const container = document.getElementById('ecoPointCloudContainer');
    if (!canvas || !container) return;

    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded yet, retrying...');
      setTimeout(initEcoPointCloud, 150);
      return;
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 20);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Generate Circular Bokeh Point Sprite
    function createPointTexture() {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');

      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.1)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(c);
      texture.needsUpdate = true;
      return texture;
    }

    // 3. Build Point Cloud Geometry
    const positions = [];
    const colors = [];
    const sizes = [];

    function addPoint(x, y, z, r, g, b, size = 1.0) {
      positions.push(x, y, z);
      colors.push(r, g, b);
      sizes.push(size);
    }

    // --- A. Floating Timber Foundation Pontoon Deck ---
    const deckW = 15;
    const deckD = 12;
    for (let x = -deckW / 2; x <= deckW / 2; x += 0.28) {
      for (let z = -deckD / 2; z <= deckD / 2 + 1.5; z += 0.28) {
        const jitter = (Math.random() - 0.5) * 0.05;
        // Timber warm brown tones
        const br = 0.42 + Math.random() * 0.12;
        const bg = 0.24 + Math.random() * 0.08;
        const bb = 0.12 + Math.random() * 0.04;
        addPoint(x, -0.6 + jitter, z, br, bg, bb, 0.18);
        if (Math.random() > 0.6) {
          addPoint(x, -0.9 + jitter, z, br * 0.7, bg * 0.7, bb * 0.7, 0.15);
        }
      }
    }

    // Foundation Stilt Piles into Lagoon
    for (let px of [-6, -2, 2, 6]) {
      for (let pz of [-4.5, 0, 4.5, 6.5]) {
        for (let py = -0.6; py >= -2.2; py -= 0.15) {
          for (let a = 0; a < 6; a++) {
            const ang = a * (Math.PI / 3);
            addPoint(px + Math.cos(ang) * 0.22, py, pz + Math.sin(ang) * 0.22, 0.25, 0.15, 0.08, 0.16);
          }
        }
      }
    }

    // --- B. Stacked Recycled Plastic Bottle Walls ---
    const bW = 12.5; // building width
    const bD = 9.0;  // building depth
    const bH = 5.2;  // building wall height

    // B1. Side Walls (Stacked Orange/Amber Plastic Bottles)
    for (let wallX of [-bW / 2, bW / 2]) {
      for (let y = 0; y <= bH; y += 0.28) {
        for (let z = -bD / 2; z <= bD / 2; z += 0.28) {
          // Skip window opening
          if (y >= 1.6 && y <= 3.6 && z >= -2.0 && z <= 2.0) {
            // Window frame points
            if (Math.abs(y - 1.6) < 0.2 || Math.abs(y - 3.6) < 0.2 || Math.abs(z - -2.0) < 0.2 || Math.abs(z - 2.0) < 0.2) {
              addPoint(wallX, y, z, 0.15, 0.15, 0.15, 0.18);
            }
            continue;
          }

          // Bottle profile: 8 points around cylinder body + cap
          const numPts = 6;
          for (let a = 0; a < numPts; a++) {
            const ang = a * (Math.PI * 2 / numPts);
            const r = 0.11;
            const px = wallX + Math.sin(ang) * r;
            const pz = z + Math.cos(ang) * r;
            const py = y + (Math.random() - 0.5) * 0.08;

            // Vibrant translucent amber/orange bottle colors
            const isHighlight = Math.random() > 0.75;
            const cr = isHighlight ? 1.0 : (0.94 + Math.random() * 0.06);
            const cg = isHighlight ? 0.75 : (0.55 + Math.random() * 0.15);
            const cb = isHighlight ? 0.25 : (0.08 + Math.random() * 0.08);

            addPoint(px, py, pz, cr, cg, cb, 0.22);
          }

          // Bottle cap point
          const capDir = wallX > 0 ? 1 : -1;
          addPoint(wallX + capDir * 0.14, y, z, 0.1, 0.4, 0.8, 0.2);
        }
      }
    }

    // B2. Front & Back Walls (Stacked Obsidian / Smoky Dark Bottles with White Bottle Inscriptions)
    for (let wallZ of [-bD / 2, bD / 2]) {
      const isFront = wallZ > 0;
      for (let y = 0; y <= bH; y += 0.28) {
        for (let x = -bW / 2; x <= bW / 2; x += 0.28) {
          // Front wall: leave opening for Danfo bus and entrance
          if (isFront && x >= -0.5 && x <= 4.5 && y <= 3.8) {
            continue; // Danfo bus sits here!
          }
          if (isFront && x >= -3.5 && x <= -1.5 && y <= 3.2) {
            // Entrance doorway
            continue;
          }

          const numPts = 5;
          for (let a = 0; a < numPts; a++) {
            const ang = a * (Math.PI * 2 / numPts);
            const r = 0.11;
            const px = x + Math.cos(ang) * r;
            const pz = wallZ + Math.sin(ang) * r;
            const py = y + (Math.random() - 0.5) * 0.08;

            // Smoky obsidian bottle with subtle teal eco-glow
            const isAccent = Math.random() > 0.88;
            let cr = 0.18, cg = 0.24, cb = 0.32;
            if (isAccent) {
              // Recycled PET cyan/emerald glow
              cr = 0.15; cg = 0.85; cb = 0.75;
            }

            addPoint(px, py, pz, cr, cg, cb, 0.2);
          }
        }
      }
    }

    // --- C. The Iconic Lagos Danfo Bus Classroom Facade ---
    // Protrudes through front wall at x=2.0, z=4.5 to 7.2, y=0.4 to 3.4
    const busCX = 2.0;
    const busZMin = 4.2;
    const busZMax = 7.0;
    const busW = 2.8;
    const busH = 2.7;

    for (let bz = busZMin; bz <= busZMax; bz += 0.18) {
      for (let by = 0.4; by <= 0.4 + busH; by += 0.18) {
        for (let bx = busCX - busW / 2; bx <= busCX + busW / 2; bx += 0.18) {
          const isFrontFace = Math.abs(bz - busZMax) < 0.2;
          const isSideFace = Math.abs(Math.abs(bx - busCX) - busW / 2) < 0.2;
          const isRoofFace = Math.abs(by - (0.4 + busH)) < 0.2;

          if (!isFrontFace && !isSideFace && !isRoofFace) continue;

          // Windshield area on front face
          const isWindshield = isFrontFace && by >= 1.6 && by <= 2.6 && Math.abs(bx - busCX) <= 1.1;

          // Dual Black Transit Stripes
          const isStripe = (by >= 1.1 && by <= 1.35) || (by >= 1.42 && by <= 1.55);

          if (isWindshield) {
            // Glowing cyan windshield glass points
            addPoint(bx, by, bz, 0.22, 0.75, 0.95, 0.26);
          } else if (isStripe) {
            // Black transit stripes
            addPoint(bx, by, bz, 0.06, 0.08, 0.12, 0.2);
          } else {
            // Bright Lagos Danfo Yellow
            const yr = 0.98;
            const yg = 0.82 + (Math.random() - 0.5) * 0.1;
            const yb = 0.12;
            addPoint(bx, by, bz, yr, yg, yb, 0.24);
          }
        }
      }
    }

    // Headlights & Bumper
    for (let hx of [busCX - 0.9, busCX + 0.9]) {
      for (let a = 0; a < 8; a++) {
        const ang = a * (Math.PI * 2 / 8);
        addPoint(hx + Math.cos(ang) * 0.18, 0.95 + Math.sin(ang) * 0.18, busZMax + 0.08, 1.0, 1.0, 0.8, 0.3);
      }
    }

    // Danfo Wheels
    for (let wx of [busCX - 1.45, busCX + 1.45]) {
      for (let a = 0; a < 14; a++) {
        const ang = a * (Math.PI * 2 / 14);
        for (let wr = 0.15; wr <= 0.45; wr += 0.1) {
          addPoint(wx, 0.5 + Math.sin(ang) * wr, 5.8 + Math.cos(ang) * wr, 0.12, 0.14, 0.18, 0.22);
        }
      }
    }

    // --- D. Corrugated Zinc Roof & Solar Panel Array ---
    // Angled pitched roof
    for (let rx = -bW / 2 - 0.8; rx <= bW / 2 + 0.8; rx += 0.22) {
      for (let rz = -bD / 2 - 0.8; rz <= bD / 2 + 0.8; rz += 0.22) {
        // Pitch slope from front (higher) to back (lower)
        const slope = (rz / bD) * 0.9;
        const ry = bH + 0.6 + slope;

        // Corrugated wave jitter
        const corrugation = Math.sin(rx * 6) * 0.06;

        // Solar Panels in center grid
        const isSolar = Math.abs(rx) <= 4.0 && rz >= -2.5 && rz <= 2.5;

        if (isSolar) {
          // Deep crystalline blue solar panel points
          const sr = 0.12 + Math.random() * 0.08;
          const sg = 0.35 + Math.random() * 0.15;
          const sb = 0.92 + Math.random() * 0.08;
          addPoint(rx, ry + 0.12, rz, sr, sg, sb, 0.24);
        } else {
          // Metallic zinc / timber rafters
          const zr = 0.58 + Math.random() * 0.12;
          const zg = 0.62 + Math.random() * 0.12;
          const zb = 0.68 + Math.random() * 0.12;
          addPoint(rx, ry + corrugation, rz, zr, zg, zb, 0.19);
        }
      }
    }

    // --- E. Lagoon Water Surface Ripples ---
    for (let i = 0; i < 2800; i++) {
      const wx = (Math.random() - 0.5) * 24;
      const wz = (Math.random() - 0.5) * 22;
      const wy = -1.4 + (Math.random() - 0.5) * 0.08;
      // Water turquoise / cyan points
      addPoint(wx, wy, wz, 0.02, 0.45 + Math.random() * 0.25, 0.75 + Math.random() * 0.25, 0.16);
    }

    // --- F. Ambient Floating Eco-Sparks (Hovering Luminous Dust) ---
    for (let i = 0; i < 1800; i++) {
      const ex = (Math.random() - 0.5) * 20;
      const ey = Math.random() * 7.5;
      const ez = (Math.random() - 0.5) * 16;
      // Gold and emerald ambient particles
      const isGold = Math.random() > 0.5;
      const er = isGold ? 0.98 : 0.15;
      const eg = isGold ? 0.78 : 0.88;
      const eb = isGold ? 0.18 : 0.65;
      addPoint(ex, ey, ez, er, eg, eb, 0.2 + Math.random() * 0.15);
    }

    // 4. Create BufferGeometry & Points Mesh
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.24,
      vertexColors: true,
      map: createPointTexture(),
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const pointCloud = new THREE.Points(geometry, material);
    // Center point cloud
    pointCloud.position.set(0, -1.2, 0);
    scene.add(pointCloud);

    // Initial angle: 3/4 front view showing the Danfo bus and bottle side wall
    let currentRotY = 0.45;
    let targetRotY = 0.45;
    let currentRotX = 0.12;
    let targetRotX = 0.12;
    let currentScale = 1.0;
    let targetScale = 1.0;

    // 5. Scroll-Linked Animation (No manual drag needed, turns smoothly as user scrolls)
    function onScroll() {
      const section = document.getElementById('eco-school-3d');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight || 800;

      // Calculate normalized scroll progress: 0 when top enters bottom of window, 1 when bottom leaves top
      const totalDist = rect.height + winH;
      const currentDist = winH - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));

      // Map progress to continuous 360-degree rotation showing off:
      // p=0.15..0.35: Front facade + yellow Danfo bus
      // p=0.35..0.65: Side wall of 10,000 stacked orange bottles
      // p=0.65..0.90: Rooftop solar array and rear floating sanctuary
      targetRotY = 0.35 + progress * (Math.PI * 2.2);
      targetRotX = 0.08 + Math.sin(progress * Math.PI) * 0.12;
      targetScale = 0.95 + Math.sin(progress * Math.PI) * 0.1;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 6. Responsive Window Resize Handler
    function onResize() {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 550;
      camera.aspect = w / h;
      // Adjust camera distance for mobile
      if (w < 768) {
        camera.position.z = 24;
      } else {
        camera.position.z = 19;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', onResize);
    onResize();

    // 7. Render Loop with Smooth Spring & Idle Breathing
    let clock = new THREE.Clock();
    let isVisible = true;

    // IntersectionObserver to pause rendering when off-screen
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

      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Continuous subtle idle drift
      const idleY = Math.sin(time * 0.5) * 0.04;
      const idleFloat = Math.sin(time * 1.2) * 0.08;

      // Smooth lerp towards scroll-driven targets
      currentRotY += (targetRotY + idleY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentScale += (targetScale - currentScale) * 0.08;

      pointCloud.rotation.y = currentRotY;
      pointCloud.rotation.x = currentRotX;
      pointCloud.position.y = -1.2 + idleFloat;
      pointCloud.scale.set(currentScale, currentScale, currentScale);

      renderer.render(scene, camera);
    }

    animate();
  }

  // Auto-init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEcoPointCloud);
  } else {
    initEcoPointCloud();
  }
})();
