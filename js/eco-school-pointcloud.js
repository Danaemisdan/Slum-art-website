/**
 * Slum Art Foundation - 3D Eco-Bottle Academy Point Cloud Architecture
 * High-Resolution Architectural LiDAR & Photogrammetry Digital Twin
 * ~320,000+ Luminous Fine-Point Particles
 *
 * Real Architectural Model of the Slum Art Bottle School:
 * 1. Sturdy Mangrove Lagoon Pilings & Reclaimed African Teak Platform with Safety Railing
 * 2. Heavy-Gauge Structural Steel Skeleton: Box columns, perimeter beams, and A-frame roof trusses
 * 3. Organic High-Density Recycled PET Bottle Gabion Walls:
 *    - Translucent sea-glass teal, radiant emerald-aqua, and sunlit amber-gold caps
 *    - Signature upper frieze of rich cobalt-ultramarine water bottles (official Slum Art architecture)
 *    - Organic stratified point dispersion (Poisson-like LiDAR surface sampling, ZERO rigid raster tracks)
 * 4. Classroom Architecture & Interior Life:
 *    - Open main entrance doorway with inward-swung door and brass handle
 *    - Steel-framed multi-pane picture windows
 *    - 6 student double-desks with bench seats, open sketchbooks with colorful art marks
 *    - Teacher's chalkboard with lesson diagrams, artist's tripod easel with canvas painting
 *    - Hanging recycled bottle canopy matrix suspended from the ceiling
 * 5. Iconic Lagos Danfo Bus Classroom Annex:
 *    - Authentic rich Lagos sunshine yellow-gold (#F59E0B / #D97706)
 *    - Classic dual transit stripes (matte charcoal & warm ivory)
 *    - Aerodynamic front hood, split windshield, radiator grille, chrome rim wheels
 *    - High-res concentric projector headlights flush with fascia (NO LIGHT RAYS OR CONES)
 *    - Ruby rear taillights & interior passenger bench seating
 * 6. Pitched Corrugated Roof with 6 Monocrystalline Rooftop Solar Panels (deep iridescent navy & gold busbars)
 * 7. Official High-Res "slum art" Signboard (11,399 exact normalized vector points on navy acrylic plate)
 * 8. Ethereal Bioluminescent Lagoon Water with dual-harmonic organic wave ripples
 * 9. Cinematic atmospheric drift motes & interactive mouse parallax tilt
 */

(function () {
  'use strict';

  function initEcoPointCloud() {
    const container = document.getElementById('ecoPointCloudContainer');
    const canvas = document.getElementById('ecoPointCloudCanvas');

    if (!container || !canvas || typeof THREE === 'undefined') {
      return;
    }

    // 1. Scene Setup
    const scene = new THREE.Scene();

    const getDimensions = () => {
      const section = document.getElementById('eco-school-3d');
      const w = (section && section.clientWidth) || container.clientWidth || window.innerWidth;
      const h = (section && section.clientHeight) || container.clientHeight || 1200;
      return { w, h };
    };

    const dims = getDimensions();
    const camera = new THREE.PerspectiveCamera(36, dims.w / dims.h, 0.1, 200);
    camera.position.set(0, 0, 24.0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(dims.w, dims.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. High-Precision Crisp Multi-Stop Circular Point Sprite
    // Ultra-crisp pinpoint core with soft exponential atmospheric halo (subpixel brilliance, ZERO boxiness)
    function createPointTexture() {
      const size = 64;
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');
      const center = size / 2;
      const radius = size / 2;

      const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);
      grad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.28, 'rgba(255, 255, 255, 0.96)');
      grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.60)');
      grad.addColorStop(0.80, 'rgba(255, 255, 255, 0.18)');
      grad.addColorStop(0.96, 'rgba(255, 255, 255, 0.02)');
      grad.addColorStop(1.00, 'rgba(255, 255, 255, 0.0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(cvs);
      texture.needsUpdate = true;
      return texture;
    }

    const pointTexture = createPointTexture();

    // 3. Parent Group for Unified Orbit & Scaling
    const academyGroup = new THREE.Group();
    scene.add(academyGroup);

    // Coordinate & Color Buffers
    const buildPos = [];
    const buildCol = [];

    function addPt(x, y, z, r, g, b) {
      buildPos.push(x, y, z);
      buildCol.push(r, g, b);
    }

    // Helper: Micro-jittered organic line (avoids rigid pixel rows)
    function addLine(x1, y1, z1, x2, y2, z2, step, r, g, b, jitter = 0.008) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dz = z2 - z1;
      const len = Math.hypot(dx, dy, dz);
      const steps = Math.max(2, Math.floor(len / step));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const jx = jitter ? (Math.random() - 0.5) * jitter : 0;
        const jy = jitter ? (Math.random() - 0.5) * jitter : 0;
        const jz = jitter ? (Math.random() - 0.5) * jitter : 0;
        addPt(x1 + dx * t + jx, y1 + dy * t + jy, z1 + dz * t + jz, r, g, b);
      }
    }

    // =========================================================================
    // ARCHITECTURAL DIMENSIONS
    // =========================================================================
    const bW = 10.8;      // Building Width
    const bD = 6.8;       // Building Depth
    const bH = 3.5;       // Wall Height
    const frontZ = bD / 2;
    const backZ = -bD / 2;
    const leftX = -bW / 2;
    const rightX = bW / 2;

    // -------------------------------------------------------------------------
    // 1. FOUNDATION PILINGS & MANGROVE STILTS (LAGOON PLATFORM)
    // -------------------------------------------------------------------------
    const stiltXs = [-5.2, -3.2, -1.2, 0.8, 2.8, 5.0];
    const stiltZs = [-3.8, -1.9, 0.0, 1.9, 3.8, 4.8];

    for (let px of stiltXs) {
      for (let pz of stiltZs) {
        if (px > 2.5 && pz > 1.2 && pz < 4.6) continue; // Danfo substructure zone

        // Dense organic bark cylinder with natural spiral & radius variation
        for (let py = -0.05; py >= -2.4; py -= 0.035) {
          const numRings = 12;
          for (let a = 0; a < numRings; a++) {
            const ang = a * (Math.PI * 2 / numRings) + (py * 0.6) + (Math.random() - 0.5) * 0.08;
            const rad = 0.13 + Math.sin(py * 4 + a) * 0.018 + (Math.random() - 0.5) * 0.008;
            const sx = px + Math.cos(ang) * rad;
            const sz = pz + Math.sin(ang) * rad;

            // Weathered dark African teak with subtle waterline mossy green patina near water
            const isNearWater = py <= -0.8 && py >= -1.6;
            let br = 0.24 + Math.random() * 0.06;
            let bg = 0.15 + Math.random() * 0.04;
            let bb = 0.09 + Math.random() * 0.03;

            if (isNearWater && Math.random() > 0.40) {
              // Wet lagoon moss highlight
              br = 0.06 + Math.random() * 0.04;
              bg = 0.36 + Math.random() * 0.08;
              bb = 0.24 + Math.random() * 0.05;
            }

            addPt(sx, py, sz, br, bg, bb);
          }
        }
      }
    }

    // Diagonal Cross-Bracing Ties between Pilings (Dark Timber Struts)
    for (let i = 0; i < stiltXs.length - 1; i++) {
      const xA = stiltXs[i], xB = stiltXs[i + 1];
      for (let pz of [-3.8, 0.0, 3.8]) {
        addLine(xA, -0.4, pz, xB, -1.8, pz, 0.03, 0.28, 0.18, 0.10, 0.015);
        addLine(xA, -1.8, pz, xB, -0.4, pz, 0.03, 0.28, 0.18, 0.10, 0.015);
      }
    }

    // -------------------------------------------------------------------------
    // 2. TIMBER DECK PLATFORM & SAFETY PERIMETER RAILING
    // -------------------------------------------------------------------------
    const deckW = 13.8;
    const deckD = 9.8;
    const deckY = -0.04;

    // High-Resolution Reclaimed African Teak Deck Sampling (Rich, warm, organic planks)
    const plankW = 0.18;
    const numPlanks = Math.floor(deckW / plankW);
    const startX = -deckW / 2;

    for (let p = 0; p < numPlanks; p++) {
      const plX1 = startX + p * plankW;
      const plX2 = plX1 + plankW - 0.015;
      const isOutside = Math.abs(plX1 + plankW / 2) > bW / 2 - 0.25;

      const plankZSteps = 95;
      for (let s = 0; s < plankZSteps; s++) {
        const z = -deckD / 2 + (s / plankZSteps) * deckD;
        if (!isOutside && z >= backZ + 0.2 && z <= frontZ - 0.2) continue; // Interior teak floor handled separately

        for (let ox = 0.12; ox <= 0.88; ox += 0.12) {
          const px = plX1 + ox * (plX2 - plX1) + (Math.random() - 0.5) * 0.008;
          const pz = z + (Math.random() - 0.5) * 0.018;

          const grainNoise = Math.sin(px * 12 + pz * 18) * 0.06 + Math.cos(pz * 35) * 0.03;
          // Warm golden teak / weathered honey mahogany
          const wr = 0.60 + grainNoise;
          const wg = 0.38 + grainNoise * 0.65;
          const wb = 0.18 + grainNoise * 0.45;

          addPt(px, deckY + (Math.random() - 0.5) * 0.006, pz, wr, wg, wb);
        }

        // Fastener nail studs along joist lines
        if (Math.abs(z % 0.8) < 0.04) {
          addPt(plX1 + 0.03, deckY + 0.004, z, 0.20, 0.13, 0.09);
          addPt(plX2 - 0.03, deckY + 0.004, z, 0.20, 0.13, 0.09);
        }
      }
    }

    // Deck Perimeter Rim Joist
    addLine(-deckW / 2, deckY, -deckD / 2, deckW / 2, deckY, -deckD / 2, 0.02, 0.42, 0.26, 0.14, 0.008);
    addLine(deckW / 2, deckY, -deckD / 2, deckW / 2, deckY, deckD / 2, 0.02, 0.42, 0.26, 0.14, 0.008);
    addLine(deckW / 2, deckY, deckD / 2, -deckW / 2, deckY, deckD / 2, 0.02, 0.42, 0.26, 0.14, 0.008);
    addLine(-deckW / 2, deckY, deckD / 2, -deckW / 2, deckY, -deckD / 2, 0.02, 0.42, 0.26, 0.14, 0.008);

    // Perimeter Safety Railing (Posts and 2 Horizontal Guardrails)
    const railH1 = 0.45;
    const railH2 = 0.90;
    const railR = 0.82, railG = 0.62, railB = 0.32;

    const railPoints = [];
    for (let rx = -deckW / 2 + 0.1; rx <= deckW / 2 - 0.1; rx += 0.95) {
      railPoints.push([rx, -deckD / 2 + 0.1], [rx, deckD / 2 - 0.1]);
    }
    for (let rz = -deckD / 2 + 0.1; rz <= deckD / 2 - 0.1; rz += 0.95) {
      railPoints.push([-deckW / 2 + 0.1, rz], [deckW / 2 - 0.1, rz]);
    }

    for (let pt of railPoints) {
      if (Math.abs(pt[1] - (deckD / 2 - 0.1)) < 0.1 && pt[0] >= -0.7 && pt[0] <= 1.0) continue;
      addLine(pt[0], deckY, pt[1], pt[0], deckY + railH2, pt[1], 0.018, railR, railG, railB, 0.006);
    }

    addLine(-deckW / 2 + 0.1, deckY + railH1, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH1, -deckD / 2 + 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(-deckW / 2 + 0.1, deckY + railH2, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH2, -deckD / 2 + 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(-deckW / 2 + 0.1, deckY + railH1, -deckD / 2 + 0.1, -deckW / 2 + 0.1, deckY + railH1, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(-deckW / 2 + 0.1, deckY + railH2, -deckD / 2 + 0.1, -deckW / 2 + 0.1, deckY + railH2, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(deckW / 2 - 0.1, deckY + railH1, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH1, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(deckW / 2 - 0.1, deckY + railH2, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH2, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(-deckW / 2 + 0.1, deckY + railH1, deckD / 2 - 0.1, -0.7, deckY + railH1, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(-deckW / 2 + 0.1, deckY + railH2, deckD / 2 - 0.1, -0.7, deckY + railH2, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(1.0, deckY + railH1, deckD / 2 - 0.1, deckW / 2 - 0.1, deckY + railH1, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);
    addLine(1.0, deckY + railH2, deckD / 2 - 0.1, deckW / 2 - 0.1, deckY + railH2, deckD / 2 - 0.1, 0.02, railR, railG, railB, 0.006);

    // -------------------------------------------------------------------------
    // 3. HEAVY-GAUGE STRUCTURAL STEEL SKELETON
    // -------------------------------------------------------------------------
    const steelR = 0.40, steelG = 0.48, steelB = 0.62;
    const colStep = 0.022;
    const bayXs = [-5.4, -3.2, -1.0, 1.0, 3.2, 5.4];

    for (let cx of bayXs) {
      for (let cz of [backZ, frontZ]) {
        if (cx >= 2.0 && cx <= 4.6 && cz === frontZ) continue;
        for (let cy = 0; cy <= bH; cy += colStep) {
          const j = (Math.random() - 0.5) * 0.006;
          addPt(cx - 0.04 + j, cy, cz - 0.04 + j, steelR, steelG, steelB);
          addPt(cx + 0.04 + j, cy, cz - 0.04 + j, steelR, steelG, steelB);
          addPt(cx + 0.04 + j, cy, cz + 0.04 + j, steelR, steelG, steelB);
          addPt(cx - 0.04 + j, cy, cz + 0.04 + j, steelR, steelG, steelB);
        }
      }
    }
    for (let cz of [-1.1, 1.1]) {
      for (let cx of [leftX, rightX]) {
        for (let cy = 0; cy <= bH; cy += colStep) {
          const j = (Math.random() - 0.5) * 0.006;
          addPt(cx - 0.04 + j, cy, cz - 0.04 + j, steelR, steelG, steelB);
          addPt(cx + 0.04 + j, cy, cz - 0.04 + j, steelR, steelG, steelB);
          addPt(cx + 0.04 + j, cy, cz + 0.04 + j, steelR, steelG, steelB);
          addPt(cx - 0.04 + j, cy, cz + 0.04 + j, steelR, steelG, steelB);
        }
      }
    }

    addLine(leftX, 0.05, frontZ, -0.65, 0.05, frontZ, 0.018, steelR, steelG, steelB);
    addLine(0.85, 0.05, frontZ, 2.2, 0.05, frontZ, 0.018, steelR, steelG, steelB);
    addLine(leftX, 0.05, backZ, rightX, 0.05, backZ, 0.018, steelR, steelG, steelB);
    addLine(leftX, bH, frontZ, rightX, bH, frontZ, 0.018, steelR, steelG, steelB);
    addLine(leftX, bH, backZ, rightX, bH, backZ, 0.018, steelR, steelG, steelB);
    addLine(leftX, bH, backZ, leftX, bH, frontZ, 0.018, steelR, steelG, steelB);
    addLine(rightX, bH, backZ, rightX, bH, frontZ, 0.018, steelR, steelG, steelB);

    const ridgeY = 4.35;
    const ridgeZ = 0.0;
    addLine(leftX - 0.35, ridgeY, ridgeZ, rightX + 0.35, ridgeY, ridgeZ, 0.018, 0.58, 0.68, 0.82, 0.006);

    for (let tx of bayXs) {
      addLine(tx, bH, frontZ + 0.25, tx, ridgeY, ridgeZ, 0.018, steelR, steelG, steelB, 0.006);
      addLine(tx, bH, backZ - 0.25, tx, ridgeY, ridgeZ, 0.018, steelR, steelG, steelB, 0.006);
      addLine(tx, bH, backZ, tx, bH, frontZ, 0.025, steelR, steelG, steelB, 0.008);
      addLine(tx, bH, ridgeZ, tx, ridgeY, ridgeZ, 0.018, steelR, steelG, steelB, 0.006);
      addLine(tx, bH, -1.7, tx, bH + (ridgeY - bH) * 0.5, -0.85, 0.018, steelR, steelG, steelB, 0.006);
      addLine(tx, bH, 1.7, tx, bH + (ridgeY - bH) * 0.5, 0.85, 0.018, steelR, steelG, steelB, 0.006);
    }

    // -------------------------------------------------------------------------
    // 4. ORGANIC HIGH-DENSITY RECYCLED PET BOTTLE WALLS (LIDAR ABSTRACTION)
    // Non-grid organic point cloud distribution — eliminates cheap Euclidean rasters
    // -------------------------------------------------------------------------
    function generateOrganicBottleWall(xMin, xMax, zFixed, isFront, isBack) {
      const colSpacing = 0.075; // Ultra-dense 7.5cm per bottle course
      const rowSpacing = 0.155; // Staggered running bond courses

      const numCols = Math.floor((xMax - xMin) / colSpacing);
      const numRows = Math.floor(bH / rowSpacing);

      for (let r = 0; r < numRows; r++) {
        const by = r * rowSpacing + rowSpacing / 2;
        const rowStagger = (r % 2 === 0 ? 0 : colSpacing / 2);

        for (let c = 0; c < numCols; c++) {
          const bx = xMin + c * colSpacing + rowStagger + (Math.random() - 0.5) * 0.014;

          if (isFront && bx >= -0.70 && bx <= 0.90 && by <= 2.65) continue;
          if (isFront && bx >= 2.2 && bx <= 4.85 && by <= 2.5) continue;
          if (isBack && bx >= -3.8 && bx <= -1.2 && by >= 1.2 && by <= 2.5) continue;

          const isBlueTopRow = by >= 2.72; // Official signature upper frieze of cobalt blue bottles

          let rVal, gVal, bVal;
          if (isBlueTopRow) {
            // Deep royal cobalt/ultramarine (#1d4ed8 / #2563eb)
            const blueVar = Math.random() * 0.14;
            rVal = 0.06 + blueVar * 0.4;
            gVal = 0.30 + blueVar;
            bVal = 0.94 + blueVar * 0.5;
          } else {
            const paletteChoice = Math.random();
            if (paletteChoice < 0.52) {
              // Deep sea-glass teal (#0d9488 / #14b8a6)
              rVal = 0.05 + Math.random() * 0.06;
              gVal = 0.65 + Math.random() * 0.14;
              bVal = 0.70 + Math.random() * 0.16;
            } else if (paletteChoice < 0.84) {
              // Radiant aqua-cyan (#06b6d4 / #38bdf8)
              rVal = 0.14 + Math.random() * 0.08;
              gVal = 0.76 + Math.random() * 0.12;
              bVal = 0.90 + Math.random() * 0.08;
            } else {
              // Crystalline sunlit highlight
              rVal = 0.85 + Math.random() * 0.12;
              gVal = 0.95 + Math.random() * 0.05;
              bVal = 1.0;
            }
          }

          // Sample 3D Bottle Volume
          const numBottlePoints = 20;
          for (let p = 0; p < numBottlePoints; p++) {
            const theta = Math.random() * Math.PI * 2;
            const h = (Math.random() - 0.5) * 0.13;
            const rad = 0.038 + (Math.random() - 0.5) * 0.008;

            const px = bx + Math.cos(theta) * rad;
            const py = by + h;
            const pz = zFixed + Math.sin(theta) * rad + (Math.random() - 0.5) * 0.02;

            const shade = 0.88 + (py / bH) * 0.22;
            addPt(px, py, pz, Math.min(1.0, rVal * shade), Math.min(1.0, gVal * shade), Math.min(1.0, bVal * shade));
          }

          // Bottle Neck & Cap
          const capZ = zFixed + (isFront ? 0.065 : (isBack ? -0.065 : 0.065));
          if (isBlueTopRow) {
            addPt(bx + (Math.random() - 0.5) * 0.02, by + 0.08, capZ, 0.95, 0.98, 1.0);
            addPt(bx + (Math.random() - 0.5) * 0.02, by + 0.095, capZ, 0.95, 0.98, 1.0);
          } else {
            // Warm golden amber caps (#f59e0b / #fbbf24)
            addPt(bx + (Math.random() - 0.5) * 0.02, by + 0.08, capZ, 1.0, 0.74, 0.14);
            addPt(bx + (Math.random() - 0.5) * 0.02, by + 0.095, capZ, 1.0, 0.84, 0.22);
          }
        }
      }

      for (let y = 0.20; y <= bH; y += 0.30) {
        if (isFront && y <= 2.65) {
          addLine(xMin, y, zFixed + 0.06, -0.70, y, zFixed + 0.06, 0.035, 0.38, 0.48, 0.58, 0.008);
          addLine(0.90, y, zFixed + 0.06, xMax, y, zFixed + 0.06, 0.035, 0.38, 0.48, 0.58, 0.008);
        } else {
          addLine(xMin, y, zFixed + 0.06, xMax, y, zFixed + 0.06, 0.035, 0.38, 0.48, 0.58, 0.008);
        }
      }
    }

    function generateOrganicSideBottleWall(xFixed, zMin, zMax, hasWindow) {
      const colSpacing = 0.075;
      const rowSpacing = 0.155;
      const numCols = Math.floor((zMax - zMin) / colSpacing);
      const numRows = Math.floor(bH / rowSpacing);

      for (let r = 0; r < numRows; r++) {
        const by = r * rowSpacing + rowSpacing / 2;
        const rowStagger = (r % 2 === 0 ? 0 : colSpacing / 2);

        for (let c = 0; c < numCols; c++) {
          const bz = zMin + c * colSpacing + rowStagger + (Math.random() - 0.5) * 0.014;

          if (hasWindow && bz >= -1.25 && bz <= 1.25 && by >= 1.05 && by <= 2.55) continue;

          const isBlueTopRow = by >= 2.72;
          let rVal, gVal, bVal;
          if (isBlueTopRow) {
            rVal = 0.06; gVal = 0.30; bVal = 0.94;
          } else {
            const paletteChoice = Math.random();
            if (paletteChoice < 0.52) {
              rVal = 0.05; gVal = 0.65; bVal = 0.70;
            } else if (paletteChoice < 0.85) {
              rVal = 0.16; gVal = 0.78; bVal = 0.90;
            } else {
              rVal = 0.85; gVal = 0.96; bVal = 1.0;
            }
          }

          const numBottlePoints = 20;
          for (let p = 0; p < numBottlePoints; p++) {
            const theta = Math.random() * Math.PI * 2;
            const h = (Math.random() - 0.5) * 0.13;
            const rad = 0.038 + (Math.random() - 0.5) * 0.008;

            const px = xFixed + Math.cos(theta) * rad + (Math.random() - 0.5) * 0.02;
            const py = by + h;
            const pz = bz + Math.sin(theta) * rad;

            addPt(px, py, pz, rVal, gVal, bVal);
          }

          const capX = xFixed + (xFixed < 0 ? -0.065 : 0.065);
          if (isBlueTopRow) {
            addPt(capX, by + 0.08, bz + (Math.random() - 0.5) * 0.02, 0.95, 0.98, 1.0);
          } else {
            addPt(capX, by + 0.08, bz + (Math.random() - 0.5) * 0.02, 1.0, 0.74, 0.14);
          }
        }
      }

      for (let y = 0.20; y <= bH; y += 0.30) {
        addLine(xFixed + 0.06, y, zMin, xFixed + 0.06, y, zMax, 0.035, 0.38, 0.48, 0.58, 0.008);
      }
    }

    // Build All Exterior Walls
    generateOrganicBottleWall(leftX, -0.70, frontZ, true, false);
    generateOrganicBottleWall(0.90, 2.2, frontZ, true, false);
    generateOrganicBottleWall(leftX, rightX, backZ, false, true);
    generateOrganicSideBottleWall(leftX, backZ, frontZ, true);
    generateOrganicSideBottleWall(rightX, backZ, 1.0, false);

    // -------------------------------------------------------------------------
    // 5. CLASSROOM ENTRANCE & WINDOWS
    // -------------------------------------------------------------------------
    const doorX1 = -0.70, doorX2 = 0.90, doorYTop = 2.65;
    addLine(doorX1, 0, frontZ, doorX1, doorYTop, frontZ, 0.018, 0.88, 0.94, 1.0, 0.006);
    addLine(doorX2, 0, frontZ, doorX2, doorYTop, frontZ, 0.018, 0.88, 0.94, 1.0, 0.006);
    addLine(doorX1, doorYTop, frontZ, doorX2, doorYTop, frontZ, 0.018, 0.88, 0.94, 1.0, 0.006);
    addLine(doorX1, 0.04, frontZ + 0.12, doorX2, 0.04, frontZ + 0.12, 0.018, 0.98, 0.82, 0.25, 0.006);

    const doorW = 0.78;
    const doorAngle = Math.PI / 4;
    const doorEndX = doorX1 + Math.cos(doorAngle) * doorW;
    const doorEndZ = frontZ - Math.sin(doorAngle) * doorW;
    addLine(doorX1, 0.05, frontZ, doorEndX, 0.05, doorEndZ, 0.018, 0.78, 0.88, 0.98, 0.006);
    addLine(doorEndX, 0.05, doorEndZ, doorEndX, doorYTop - 0.05, doorEndZ, 0.018, 0.78, 0.88, 0.98, 0.006);
    addLine(doorEndX, doorYTop - 0.05, doorEndZ, doorX1, doorYTop - 0.05, frontZ, 0.018, 0.78, 0.88, 0.98, 0.006);
    addPt(doorEndX - 0.04, 1.15, doorEndZ + 0.04, 1.0, 0.85, 0.22); // Polished brass door handle

    const winZ1 = -1.25, winZ2 = 1.25, winY1 = 1.05, winY2 = 2.55;
    addLine(leftX, winY1, winZ1, leftX, winY1, winZ2, 0.018, 0.85, 0.94, 1.0, 0.006);
    addLine(leftX, winY2, winZ1, leftX, winY2, winZ2, 0.018, 0.85, 0.94, 1.0, 0.006);
    addLine(leftX, winY1, winZ1, leftX, winY2, winZ1, 0.018, 0.85, 0.94, 1.0, 0.006);
    addLine(leftX, winY1, winZ2, leftX, winY2, winZ2, 0.018, 0.85, 0.94, 1.0, 0.006);
    addLine(leftX, (winY1 + winY2) / 2, winZ1, leftX, (winY1 + winY2) / 2, winZ2, 0.018, 0.85, 0.94, 1.0, 0.006);
    addLine(leftX, winY1, (winZ1 + winZ2) / 2, leftX, winY2, (winZ1 + winZ2) / 2, 0.018, 0.85, 0.94, 1.0, 0.006);

    for (let i = 0; i < 340; i++) {
      const gz = winZ1 + 0.08 + Math.random() * (winZ2 - winZ1 - 0.16);
      const gy = winY1 + 0.08 + Math.random() * (winY2 - winY1 - 0.16);
      addPt(leftX, gy, gz, 0.40, 0.82, 0.98);
    }

    // -------------------------------------------------------------------------
    // 6. CLASSROOM INTERIOR LIFE (DESKS, BENCHES, CHALKBOARD, EASEL, CANOPY)
    // -------------------------------------------------------------------------
    for (let fx = leftX + 0.2; fx <= rightX - 0.2; fx += 0.08) {
      for (let fz = backZ + 0.2; fz <= frontZ - 0.2; fz += 0.055) {
        const fNoise = Math.sin(fx * 4 + fz * 8) * 0.03;
        addPt(fx + (Math.random() - 0.5) * 0.01, 0.02, fz + (Math.random() - 0.5) * 0.01,
              0.64 + fNoise, 0.44 + fNoise * 0.5, 0.24 + fNoise * 0.3);
      }
    }

    const deskRows = [0.8, -0.9];
    const deskCols = [-3.8, -2.4, -1.0];

    for (let rZ of deskRows) {
      for (let cX of deskCols) {
        const dW = 0.85;
        const dD = 0.45;
        const dH = 0.74;

        for (let lx of [-dW / 2 + 0.04, dW / 2 - 0.04]) {
          for (let lz of [-dD / 2 + 0.04, dD / 2 - 0.04]) {
            addLine(cX + lx, 0.02, rZ + lz, cX + lx, dH, rZ + lz, 0.02, 0.24, 0.28, 0.34, 0.005);
          }
        }
        for (let dx = cX - dW / 2; dx <= cX + dW / 2; dx += 0.03) {
          for (let dz = rZ - dD / 2; dz <= rZ + dD / 2; dz += 0.03) {
            addPt(dx, dH, dz, 0.78, 0.56, 0.30);
          }
        }
        for (let sx = cX - 0.16; sx <= cX + 0.16; sx += 0.02) {
          for (let sz = rZ - 0.11; sz <= rZ + 0.11; sz += 0.02) {
            addPt(sx, dH + 0.015, sz, 0.98, 0.98, 0.96);
          }
        }
        addPt(cX + 0.20, dH + 0.016, rZ - 0.04, 1.0, 0.78, 0.12);
        addPt(cX + 0.22, dH + 0.016, rZ + 0.02, 0.15, 0.75, 0.98);
        addPt(cX + 0.24, dH + 0.016, rZ + 0.08, 0.95, 0.25, 0.35);

        const bZ = rZ - 0.48;
        const bW = 0.85;
        const bSeatH = 0.44;
        for (let blx of [-bW / 2 + 0.05, bW / 2 - 0.05]) {
          addLine(cX + blx, 0.02, bZ, cX + blx, bSeatH, bZ, 0.02, 0.24, 0.28, 0.34, 0.005);
        }
        for (let bx = cX - bW / 2; bx <= cX + bW / 2; bx += 0.025) {
          for (let bzOffset of [-0.08, -0.02, 0.04, 0.08]) {
            addPt(bx, bSeatH, bZ + bzOffset, 0.72, 0.50, 0.26);
          }
        }
      }
    }

    const cbX1 = -3.8, cbX2 = -1.2, cbY1 = 1.2, cbY2 = 2.5, cbZ = backZ + 0.08;
    addLine(cbX1, cbY1, cbZ, cbX2, cbY1, cbZ, 0.018, 0.85, 0.60, 0.28, 0.006);
    addLine(cbX1, cbY2, cbZ, cbX2, cbY2, cbZ, 0.018, 0.85, 0.60, 0.28, 0.006);
    addLine(cbX1, cbY1, cbZ, cbX1, cbY2, cbZ, 0.018, 0.85, 0.60, 0.28, 0.006);
    addLine(cbX2, cbY1, cbZ, cbX2, cbY2, cbZ, 0.018, 0.85, 0.60, 0.28, 0.006);
    for (let cx = cbX1 + 0.04; cx <= cbX2 - 0.04; cx += 0.035) {
      for (let cy = cbY1 + 0.04; cy <= cbY2 - 0.04; cy += 0.035) {
        addPt(cx, cy, cbZ, 0.08, 0.16, 0.13);
      }
    }
    addLine(cbX1 + 0.3, cbY1 + 0.5, cbZ + 0.01, cbX1 + 1.1, cbY1 + 0.5, cbZ + 0.01, 0.025, 0.95, 0.98, 1.0);
    addLine(cbX1 + 0.3, cbY1 + 0.8, cbZ + 0.01, cbX1 + 0.8, cbY1 + 0.8, cbZ + 0.01, 0.025, 0.95, 0.98, 1.0);

    const easelX = 0.5, easelZ = 0.8;
    addLine(easelX, 0, easelZ - 0.3, easelX - 0.2, 2.1, easelZ, 0.02, 0.82, 0.55, 0.25, 0.006);
    addLine(easelX, 0, easelZ - 0.3, easelX + 0.2, 2.1, easelZ, 0.02, 0.82, 0.55, 0.25, 0.006);
    addLine(easelX, 0, easelZ + 0.35, easelX, 2.1, easelZ, 0.02, 0.82, 0.55, 0.25, 0.006);
    for (let cx = easelX - 0.25; cx <= easelX + 0.25; cx += 0.025) {
      for (let cy = 0.95; cy <= 1.55; cy += 0.025) {
        const u = (cx - (easelX - 0.25)) / 0.5;
        const v = (cy - 0.95) / 0.6;
        let cr = 0.95, cg = 0.95, cb = 0.92;
        if (u < 0.5 && v < 0.5) { cr = 0.95; cg = 0.35; cb = 0.15; }
        else if (u >= 0.5 && v < 0.5) { cr = 0.15; cg = 0.75; cb = 0.85; }
        else if (u < 0.5 && v >= 0.5) { cr = 0.98; cg = 0.82; cb = 0.18; }
        else { cr = 0.25; cg = 0.85; cb = 0.45; }
        addPt(cx, cy, easelZ - 0.08, cr, cg, cb);
      }
    }

    for (let hx = leftX + 0.6; hx <= rightX - 0.6; hx += 0.28) {
      for (let hz = backZ + 0.6; hz <= frontZ - 0.6; hz += 0.28) {
        const wave = Math.sin(hx * 1.5 + hz * 1.2) * 0.15;
        const hy = bH - 0.35 + wave;
        addPt(hx, hy, hz, 0.12, 0.55, 0.92);
        addPt(hx, hy - 0.08, hz, 0.95, 0.78, 0.15);
      }
    }

    // -------------------------------------------------------------------------
    // 7. THE SOLID ICONIC LAGOS DANFO BUS CLASSROOM ANNEX
    // -------------------------------------------------------------------------
    const busX1 = 2.4, busX2 = 4.8;
    const busZ1 = 0.6, busZ2 = 5.2;
    const busY1 = 0.25, busY2 = 2.25;
    const busCX = (busX1 + busX2) / 2;
    const busW = busX2 - busX1;

    // Authentic Lagos Danfo Golden Yellow (#F59E0B / #D97706)
    const danfoYellowR = 0.98, danfoYellowG = 0.74, danfoYellowB = 0.08;
    const danfoDarkStripeR = 0.10, danfoDarkStripeG = 0.12, danfoDarkStripeB = 0.16;
    const danfoWhiteStripeR = 0.96, danfoWhiteStripeG = 0.97, danfoWhiteStripeB = 1.0;

    // High-Resolution Body Panels with Dual Black-and-White Transit Stripes
    for (let z = busZ1; z <= busZ2; z += 0.032) {
      for (let y = busY1; y <= busY2; y += 0.032) {
        const isBlackStripe = y >= 0.80 && y <= 0.92;
        const isWhiteStripe = y >= 0.94 && y <= 1.04;
        const isSideWindow = (y >= 1.15 && y <= 1.85 && z >= 1.0 && z <= 4.4);

        for (let bx of [busX1, busX2]) {
          const jx = (Math.random() - 0.5) * 0.008;
          const jy = (Math.random() - 0.5) * 0.008;
          const jz = (Math.random() - 0.5) * 0.008;

          if (isSideWindow) {
            const isWindowSash = Math.abs(z % 0.85) < 0.025 || Math.abs(y - 1.15) < 0.02 || Math.abs(y - 1.85) < 0.02;
            if (isWindowSash) {
              addPt(bx + jx, y + jy, z + jz, 0.22, 0.26, 0.32);
            } else if (Math.random() > 0.42) {
              addPt(bx + jx, y + jy, z + jz, 0.34, 0.80, 0.96);
            }
            continue;
          }

          if (isBlackStripe) {
            addPt(bx + jx, y + jy, z + jz, danfoDarkStripeR, danfoDarkStripeG, danfoDarkStripeB);
          } else if (isWhiteStripe) {
            addPt(bx + jx, y + jy, z + jz, danfoWhiteStripeR, danfoWhiteStripeG, danfoWhiteStripeB);
          } else {
            const shade = 0.94 + (y / busY2) * 0.16;
            addPt(bx + jx, y + jy, z + jz, danfoYellowR * shade, danfoYellowG * shade, danfoYellowB * shade);
          }
        }
      }
    }

    // High-Resolution Curved Front Face & Windshield (z = busZ2 = 5.2)
    for (let x = busX1; x <= busX2; x += 0.030) {
      for (let y = busY1; y <= busY2; y += 0.030) {
        const jx = (Math.random() - 0.5) * 0.008;
        const jy = (Math.random() - 0.5) * 0.008;

        const isWindshield = y >= 1.15 && y <= 1.95 && x >= busX1 + 0.15 && x <= busX2 - 0.15;
        const isGrille = y >= 0.50 && y <= 0.75 && x >= busCX - 0.6 && x <= busCX + 0.6;
        const isBumper = y >= 0.25 && y <= 0.42;

        if (isWindshield) {
          const isCenterPillar = Math.abs(x - busCX) < 0.035;
          const isBorder = x <= busX1 + 0.18 || x >= busX2 - 0.18 || y <= 1.18 || y >= 1.92;
          if (isCenterPillar || isBorder) {
            addPt(x + jx, y + jy, busZ2, 0.18, 0.22, 0.28);
          } else if (Math.random() > 0.38) {
            addPt(x + jx, y + jy, busZ2, 0.36, 0.84, 0.98);
          }
        } else if (isGrille) {
          addPt(x + jx, y + jy, busZ2 + 0.02, 0.12, 0.14, 0.18);
          if (Math.hypot(x - busCX, y - 0.62) < 0.12) {
            addPt(x + jx, y + jy, busZ2 + 0.035, 0.95, 0.96, 0.98);
          }
        } else if (isBumper) {
          addPt(x + jx, y + jy, busZ2 + 0.04, 0.88, 0.92, 0.98);
        } else {
          addPt(x + jx, y + jy, busZ2, danfoYellowR, danfoYellowG, danfoYellowB);
        }
      }
    }

    // High-Resolution Concentric Projector Headlights (FLUSH, ZERO LIGHT RAYS OR CONES)
    const headlampXs = [busX1 + 0.45, busX2 - 0.45];
    for (let hx of headlampXs) {
      for (let a = 0; a < 24; a++) {
        const ang = a * (Math.PI * 2 / 24);
        const rx = hx + Math.cos(ang) * 0.14;
        const ry = 0.70 + Math.sin(ang) * 0.14;
        addPt(rx, ry, busZ2 + 0.03, 0.90, 0.94, 1.0);
      }
      for (let r = 0.02; r <= 0.12; r += 0.018) {
        const numP = Math.floor(r * 130);
        for (let p = 0; p < numP; p++) {
          const ang = p * (Math.PI * 2 / numP);
          const rx = hx + Math.cos(ang) * r;
          const ry = 0.70 + Math.sin(ang) * r;
          const isCenterBulb = r <= 0.04;
          if (isCenterBulb) {
            addPt(rx, ry, busZ2 + 0.045, 1.0, 1.0, 0.98);
          } else {
            addPt(rx, ry, busZ2 + 0.038, 1.0, 0.88, 0.35);
          }
        }
      }
    }

    // Amber Turn Indicator Lamps on Front Corners
    for (let bx of [busX1 + 0.15, busX2 - 0.15]) {
      for (let a = 0; a < 10; a++) {
        const ang = a * (Math.PI * 2 / 10);
        addPt(bx + Math.cos(ang) * 0.04, 0.58 + Math.sin(ang) * 0.04, busZ2 + 0.025, 1.0, 0.65, 0.05);
      }
    }

    // Rear Ruby-Red Taillights
    for (let bx of [busX1 + 0.25, busX2 - 0.25]) {
      for (let a = 0; a < 14; a++) {
        const ang = a * (Math.PI * 2 / 14);
        for (let r = 0.02; r <= 0.08; r += 0.02) {
          addPt(bx + Math.cos(ang) * r, 0.65 + Math.sin(ang) * r, busZ1 - 0.02, 0.96, 0.14, 0.18);
        }
      }
    }

    // High-Resolution Curved Bus Roof & Rooftop Luggage Rails
    for (let z = busZ1; z <= busZ2; z += 0.032) {
      for (let x = busX1; x <= busX2; x += 0.032) {
        const arch = Math.sin(((x - busX1) / busW) * Math.PI) * 0.18;
        const jx = (Math.random() - 0.5) * 0.006;
        const jz = (Math.random() - 0.5) * 0.006;
        addPt(x + jx, busY2 + arch, z + jz, danfoYellowR * 1.04, danfoYellowG * 1.04, danfoYellowB * 1.04);
      }
      addPt(busX1 + 0.12, busY2 + 0.22, z, 0.88, 0.92, 0.98);
      addPt(busX2 - 0.12, busY2 + 0.22, z, 0.88, 0.92, 0.98);
    }

    // 4 Detailed 3D Bus Wheels with Chrome Rim Points
    const wheelXs = [busX1 - 0.02, busX2 + 0.02];
    const wheelZs = [1.5, 4.3];

    for (let wx of wheelXs) {
      for (let wz of wheelZs) {
        for (let a = 0; a < 24; a++) {
          const ang = a * (Math.PI * 2 / 24);
          for (let wr = 0.05; wr <= 0.35; wr += 0.022) {
            const wy = 0.34 + Math.sin(ang) * wr;
            const wzPos = wz + Math.cos(ang) * wr;
            const isTire = wr > 0.20;
            if (isTire) {
              addPt(wx, wy, wzPos, 0.10, 0.12, 0.15);
            } else {
              addPt(wx, wy, wzPos, 0.90, 0.95, 1.0);
            }
          }
        }
        addPt(wx, 0.34, wz, 1.0, 0.80, 0.12);
      }
    }

    // -------------------------------------------------------------------------
    // 8. SOLID PITCHED CORRUGATED ROOF & ROOFTOP SOLAR PANEL ARRAY
    // -------------------------------------------------------------------------
    const roofOverhangX = 0.45;
    const roofOverhangZ = 0.45;
    const roofZMin = backZ - roofOverhangZ;
    const roofZMax = frontZ + roofOverhangZ;

    for (let rx = leftX - roofOverhangX; rx <= rightX + roofOverhangX; rx += 0.034) {
      for (let rz = roofZMin; rz <= roofZMax; rz += 0.034) {
        const tSlope = 1.0 - Math.abs(rz - ridgeZ) / (bD / 2 + roofOverhangZ);
        const ry = bH + tSlope * (ridgeY - bH);
        const corrugation = Math.sin(rx * 35) * 0.024;
        const jx = (Math.random() - 0.5) * 0.006;
        const jz = (Math.random() - 0.5) * 0.006;

        const isPeak = corrugation > 0.012;
        let cr = isPeak ? 0.74 : 0.50;
        let cg = isPeak ? 0.80 : 0.56;
        let cb = isPeak ? 0.90 : 0.66;
        addPt(rx + jx, ry + corrugation, rz + jz, cr, cg, cb);
      }
    }

    for (let rx = leftX - roofOverhangX; rx <= rightX + roofOverhangX; rx += 0.025) {
      addPt(rx, bH, roofZMax, 0.88, 0.94, 1.0);
      addPt(rx, bH, roofZMin, 0.88, 0.94, 1.0);
    }
    for (let rz = roofZMin; rz <= roofZMax; rz += 0.025) {
      const tSlope = 1.0 - Math.abs(rz - ridgeZ) / (bD / 2 + roofOverhangZ);
      const ry = bH + tSlope * (ridgeY - bH);
      addPt(leftX - roofOverhangX, ry, rz, 0.88, 0.94, 1.0);
      addPt(rightX + roofOverhangX, ry, rz, 0.88, 0.94, 1.0);
    }

    const solarPanelDefs = [
      { x1: -3.6, x2: -1.8, z1: 0.5, z2: 1.5 },
      { x1: -1.6, x2: 0.2,  z1: 0.5, z2: 1.5 },
      { x1: 0.4,  x2: 2.2,  z1: 0.5, z2: 1.5 },
      { x1: -3.6, x2: -1.8, z1: 1.7, z2: 2.7 },
      { x1: -1.6, x2: 0.2,  z1: 1.7, z2: 2.7 },
      { x1: 0.4,  x2: 2.2,  z1: 1.7, z2: 2.7 }
    ];

    for (let panel of solarPanelDefs) {
      for (let px = panel.x1; px <= panel.x2; px += 0.025) {
        for (let pz = panel.z1; pz <= panel.z2; pz += 0.025) {
          const tSlope = 1.0 - Math.abs(pz - ridgeZ) / (bD / 2 + roofOverhangZ);
          const py = bH + tSlope * (ridgeY - bH) + 0.055;

          const isBorder = px <= panel.x1 + 0.035 || px >= panel.x2 - 0.035 || pz <= panel.z1 + 0.035 || pz >= panel.z2 - 0.035;
          const isGridBusbar = Math.abs((px - panel.x1) % 0.35) < 0.018 || Math.abs((pz - panel.z1) % 0.30) < 0.018;

          if (isBorder) {
            addPt(px, py + 0.01, pz, 0.95, 0.98, 1.0);
          } else if (isGridBusbar) {
            addPt(px, py + 0.008, pz, 1.0, 0.82, 0.20);
          } else {
            addPt(px, py, pz, 0.08, 0.20, 0.58);
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // 9. BIOLUMINESCENT LAGOON WATER SURFACE WITH ORGANIC WAVE HARMONICS
    // -------------------------------------------------------------------------
    for (let wx = -13.5; wx <= 13.5; wx += 0.20) {
      for (let wz = -12.0; wz <= 12.0; wz += 0.20) {
        const wave = Math.sin(wx * 0.65 + wz * 0.45) * 0.028 + Math.cos(wx * 1.1 - wz * 0.85) * 0.018;
        const wy = -1.25 + wave;
        const jx = (Math.random() - 0.5) * 0.03;
        const jz = (Math.random() - 0.5) * 0.03;

        const isSparkle = Math.random() > 0.88;
        if (isSparkle) {
          addPt(wx + jx, wy, wz + jz, 0.35, 0.88, 1.0);
        } else {
          const depth = Math.sin(wx * 0.2 + wz * 0.3) * 0.15;
          addPt(wx + jx, wy, wz + jz, 0.04, 0.28 + depth * 0.5, 0.52 + depth);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 10. ATMOSPHERIC DRIFT MOTES (LUMINOUS AMBIENT SPORES)
    // -------------------------------------------------------------------------
    const numMotes = 1500;
    for (let m = 0; m < numMotes; m++) {
      const mx = (Math.random() - 0.5) * 16.0;
      const my = -0.5 + Math.random() * 5.5;
      const mz = (Math.random() - 0.5) * 14.0;

      const isGoldMote = Math.random() > 0.45;
      if (isGoldMote) {
        addPt(mx, my, mz, 1.0, 0.82, 0.25);
      } else {
        addPt(mx, my, mz, 0.40, 0.88, 1.0);
      }
    }

    // Build High-Resolution BufferGeometry for the Academy
    const buildGeom = new THREE.BufferGeometry();
    buildGeom.setAttribute('position', new THREE.Float32BufferAttribute(buildPos, 3));
    buildGeom.setAttribute('color', new THREE.Float32BufferAttribute(buildCol, 3));

    const buildMaterial = new THREE.PointsMaterial({
      size: 0.082,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const buildingMesh = new THREE.Points(buildGeom, buildMaterial);
    academyGroup.add(buildingMesh);

    // =========================================================================
    // GEOMETRY SET 2: THE OFFICIAL HIGH-RES "slum art" SIGNBOARD
    // =========================================================================
    const logoPos = [];
    const logoCol = [];
    function addLogoPt(x, y, z, r, g, b) {
      logoPos.push(x, y, z);
      logoCol.push(r, g, b);
    }

    const logoBoardW = 3.6;
    const logoBoardH = 1.85;
    const logoCX = -3.2;
    const logoCY = 2.05;
    const logoCZ = frontZ + 0.12;

    for (let bx = logoCX - logoBoardW / 2; bx <= logoCX + logoBoardW / 2; bx += 0.032) {
      for (let by = logoCY - logoBoardH / 2; by <= logoCY + logoBoardH / 2; by += 0.032) {
        const isBorder = Math.abs(Math.abs(bx - logoCX) - logoBoardW / 2) < 0.04 ||
                         Math.abs(Math.abs(by - logoCY) - logoBoardH / 2) < 0.04;
        if (isBorder) {
          addLogoPt(bx, by, logoCZ - 0.01, 0.88, 0.94, 1.0);
        } else {
          addLogoPt(bx, by, logoCZ - 0.02, 0.02, 0.10, 0.32);
        }
      }
    }

    const cornerOffsets = [
      [-logoBoardW / 2 + 0.15, -logoBoardH / 2 + 0.15],
      [logoBoardW / 2 - 0.15, -logoBoardH / 2 + 0.15],
      [-logoBoardW / 2 + 0.15, logoBoardH / 2 - 0.15],
      [logoBoardW / 2 - 0.15, logoBoardH / 2 - 0.15]
    ];
    for (let [ox, oy] of cornerOffsets) {
      for (let a = 0; a < 10; a++) {
        const ang = a * (Math.PI * 2 / 10);
        addLogoPt(logoCX + ox + Math.cos(ang) * 0.045, logoCY + oy + Math.sin(ang) * 0.045, logoCZ + 0.02, 0.98, 0.98, 1.0);
      }
    }

    const logoPts = (typeof window !== 'undefined' && window.__SLUM_ART_LOGO_POINTS__) || [];
    if (logoPts.length > 0) {
      const renderW = 3.0;
      const renderH = 1.25;
      const logoCenterY = logoCY + 0.16;

      for (let i = 0; i < logoPts.length; i++) {
        const pt = logoPts[i];
        const px = logoCX + (pt[0] / 0.872) * (renderW / 2.0);
        const py = logoCenterY + (pt[1] / 0.37) * (renderH / 2.0);
        const pz = logoCZ;

        if (pt[2] === 1) {
          addLogoPt(px, py, pz, 1.0, 0.76, 0.12);
        } else {
          addLogoPt(px, py, pz, 1.0, 1.0, 1.0);
        }
      }
    }

    const subY = logoCY - 0.62;
    for (let sx = logoCX - 1.45; sx <= logoCX + 1.45; sx += 0.032) {
      if (Math.random() > 0.08) {
        addLogoPt(sx, subY, logoCZ + 0.015, 0.35, 0.90, 1.0);
      }
    }

    const logoGeom = new THREE.BufferGeometry();
    logoGeom.setAttribute('position', new THREE.Float32BufferAttribute(logoPos, 3));
    logoGeom.setAttribute('color', new THREE.Float32BufferAttribute(logoCol, 3));

    const logoMaterial = new THREE.PointsMaterial({
      size: 0.062,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const logoMesh = new THREE.Points(logoGeom, logoMaterial);
    academyGroup.add(logoMesh);

    // =========================================================================
    // 4. TRANSFORMS, SCROLL-DRIVEN ORBIT & MOUSE PARALLAX
    // =========================================================================
    let currentRotY = 0.08;
    let targetRotY = 0.08;
    let currentRotX = 0.04;
    let targetRotX = 0.04;
    let currentScale = 1.0;
    let targetScale = 1.0;
    let baseBuildingY = -0.5;

    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = (e.clientY / window.innerHeight) * 2 - 1;
      mouseParallaxX = mx * 0.045;
      mouseParallaxY = -my * 0.030;
    }, { passive: true });

    function onScroll() {
      const section = document.getElementById('eco-school-3d');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight || 800;

      const totalDist = rect.height + winH;
      const currentDist = winH - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));

      targetRotY = -0.06 + progress * 0.32;
      targetRotX = 0.03 + Math.sin(progress * Math.PI) * 0.04;
      targetScale = 0.98 + Math.sin(progress * Math.PI) * 0.04;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function onResize() {
      const d = getDimensions();
      const section = document.getElementById('eco-school-3d');
      const isMobile = d.w < 768;

      camera.aspect = d.w / d.h;
      camera.fov = 36;
      camera.position.set(0, 0, 24.0);
      camera.updateProjectionMatrix();

      renderer.setSize(d.w, d.h);

      const visibleWidthAtZ24 = (2 * 24.0 * Math.tan((36 * Math.PI) / 360)) * camera.aspect;
      const desiredFraction = isMobile ? 0.90 : 0.65;
      const naturalModelW = 11.8;
      const modelScale = (visibleWidthAtZ24 * desiredFraction) / naturalModelW;

      academyGroup.scale.set(modelScale, modelScale, modelScale);

      // Calibrated Razor-Sharp Point Sizes
      buildMaterial.size = (isMobile ? 0.072 : 0.088) * modelScale;
      logoMaterial.size = (isMobile ? 0.052 : 0.062) * modelScale;

      if (section) {
        const sRect = section.getBoundingClientRect();
        const spacer = section.querySelector('.eco-pointcloud-spacer');
        if (spacer && sRect.height > 0) {
          const spRect = spacer.getBoundingClientRect();
          const spacerCenterFromTop = (spRect.top + spRect.height / 2) - sRect.top;
          const spacerRelY = spacerCenterFromTop / sRect.height;
          const ndcY = 1.0 - 2.0 * spacerRelY;
          const visibleHeight = 2 * 24.0 * Math.tan((36 * Math.PI) / 360);
          baseBuildingY = ndcY * (visibleHeight / 2) - (isMobile ? 0.10 : 0.35);
        }
      }
    }

    window.addEventListener('resize', onResize);
    onResize();

    let clock = new THREE.Clock();
    let isVisible = true;

    if ('IntersectionObserver' in window) {
      const section = document.getElementById('eco-school-3d');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.02 });
      if (section) observer.observe(section);
    }

    function animate() {
      requestAnimationFrame(animate);

      if (!isVisible) return;

      const time = clock.getElapsedTime();

      const idleY = Math.sin(time * 0.4) * 0.012;
      const idleFloat = Math.sin(time * 1.0) * 0.025;
      const idleRoll = Math.cos(time * 0.7) * 0.006;

      currentRotY += (targetRotY + idleY + mouseParallaxX - currentRotY) * 0.06;
      currentRotX += (targetRotX + mouseParallaxY - currentRotX) * 0.06;
      currentScale += (targetScale - currentScale) * 0.06;

      academyGroup.rotation.y = currentRotY;
      academyGroup.rotation.x = currentRotX;
      academyGroup.rotation.z = idleRoll;
      academyGroup.position.y = baseBuildingY + idleFloat;

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
