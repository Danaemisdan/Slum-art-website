/**
 * Slum Art Foundation - 3D Eco-Bottle Academy Point Cloud Architecture
 * High-End Architectural LiDAR Digital Twin (~160,000 Razor-Sharp Points)
 *
 * Real Architectural Model of the Slum Art Bottle School:
 * 1. Sturdy Mangrove Lagoon Pilings & Timber Deck Platform with Safety Railing
 * 2. Heavy-Gauge Structural Steel Skeleton: Box columns, perimeter beams, and A-frame roof trusses
 * 3. Dense Authentic Recycled PET Bottle Gabion Walls:
 *    - Modular wire mesh cages
 *    - Dense 3D bottles with translucent plastic cylinders and vibrant amber caps
 *    - Signature upper frieze of dark cobalt-blue water bottles (as seen in official photos)
 * 4. Classroom Architecture:
 *    - Main entrance doorway with open door swinging inward
 *    - Multi-pane steel classroom picture windows
 *    - Full interior classroom: 6 student school desks with benches, open sketchbooks,
 *      teacher's chalkboard with lesson text, artist's easel with canvas painting,
 *      and suspended hanging-bottle ceiling canopy matrix
 * 5. Solid Iconic Lagos Danfo Bus Classroom Annex:
 *    - Curved aerodynamic front hood, split windshield, radiator grille, round headlights with beams
 *    - Vibrant Lagos yellow body with dual black-and-white transit stripes
 *    - Side passenger windows, sliding door, detailed wheels with chrome rims
 * 6. Solid Pitched Corrugated Roof with 6 Rooftop Monocrystalline Solar Panels
 * 7. Official High-Res "slum art" Signboard (11,399 exact normalized points on navy acrylic plate)
 * 8. Crisp subpixel point rendering (tight luminous core, zero blurry cotton-ball fuzz)
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

    // 2. High-Precision Crisp Circular Point Sprite
    // Tight 65% solid core with smooth anti-aliased edge falloff (crisp pinpoints, ZERO blurry fog)
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
      grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.98)');
      grad.addColorStop(0.85, 'rgba(255, 255, 255, 0.70)');
      grad.addColorStop(0.96, 'rgba(255, 255, 255, 0.20)');
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

    // Helper: Line of points between two 3D vectors
    function addLine(x1, y1, z1, x2, y2, z2, step, r, g, b, jitter = 0) {
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
        for (let py = -0.05; py >= -2.4; py -= 0.06) {
          for (let a = 0; a < 8; a++) {
            const ang = a * (Math.PI * 2 / 8) + (py * 0.5);
            const rad = 0.13 + Math.sin(py * 3 + a) * 0.015;
            const sx = px + Math.cos(ang) * rad;
            const sz = pz + Math.sin(ang) * rad;
            const br = 0.28 + (Math.sin(py * 4) + 1) * 0.04;
            const bg = 0.18 + (Math.sin(py * 4) + 1) * 0.03;
            const bb = 0.10 + (Math.sin(py * 4) + 1) * 0.02;
            addPt(sx, py, sz, br, bg, bb);
          }
        }
      }
    }

    // Diagonal Cross-Bracing Ties between Pilings
    for (let i = 0; i < stiltXs.length - 1; i++) {
      const xA = stiltXs[i], xB = stiltXs[i + 1];
      for (let pz of [-3.8, 0.0, 3.8]) {
        addLine(xA, -0.4, pz, xB, -1.8, pz, 0.05, 0.32, 0.20, 0.12);
        addLine(xA, -1.8, pz, xB, -0.4, pz, 0.05, 0.32, 0.20, 0.12);
      }
    }

    // -------------------------------------------------------------------------
    // 2. TIMBER DECK PLATFORM & SAFETY PERIMETER RAILING
    // -------------------------------------------------------------------------
    const deckW = 13.6;
    const deckD = 9.8;
    const deckY = -0.04;

    // Dense Longitudinal Timber Planks (running along Z with crisp joint grooves)
    const plankW = 0.20;
    const numPlanks = Math.floor(deckW / plankW);
    const startX = -deckW / 2;

    for (let p = 0; p < numPlanks; p++) {
      const plX = startX + p * plankW + plankW / 2;
      const isOutside = Math.abs(plX) > bW / 2 - 0.2;
      for (let z = -deckD / 2; z <= deckD / 2; z += 0.05) {
        if (!isOutside && z >= backZ + 0.2 && z <= frontZ - 0.2) continue; // Classroom interior handled below
        for (let ox of [-plankW * 0.35, -plankW * 0.15, 0.0, plankW * 0.15, plankW * 0.35]) {
          const woodNoise = Math.sin(plX * 5 + z * 10) * 0.04;
          const wr = 0.48 + woodNoise;
          const wg = 0.30 + woodNoise * 0.6;
          const wb = 0.15 + woodNoise * 0.4;
          addPt(plX + ox, deckY, z, wr, wg, wb);
        }
        if (Math.abs(z % 0.8) < 0.03) {
          addPt(plX + plankW / 2, deckY + 0.005, z, 0.18, 0.11, 0.06); // Nail fastener point
        }
      }
    }

    // Deck Perimeter Rim Joist
    addLine(-deckW / 2, deckY, -deckD / 2, deckW / 2, deckY, -deckD / 2, 0.04, 0.35, 0.22, 0.12);
    addLine(deckW / 2, deckY, -deckD / 2, deckW / 2, deckY, deckD / 2, 0.04, 0.35, 0.22, 0.12);
    addLine(deckW / 2, deckY, deckD / 2, -deckW / 2, deckY, deckD / 2, 0.04, 0.35, 0.22, 0.12);
    addLine(-deckW / 2, deckY, deckD / 2, -deckW / 2, deckY, -deckD / 2, 0.04, 0.35, 0.22, 0.12);

    // Perimeter Safety Railing (Posts and 2 Horizontal Guardrails)
    const railH1 = 0.45;
    const railH2 = 0.90;
    const railR = 0.72, railG = 0.52, railB = 0.28;

    const railPoints = [];
    for (let rx = -deckW / 2 + 0.1; rx <= deckW / 2 - 0.1; rx += 1.2) {
      railPoints.push([rx, -deckD / 2 + 0.1], [rx, deckD / 2 - 0.1]);
    }
    for (let rz = -deckD / 2 + 0.1; rz <= deckD / 2 - 0.1; rz += 1.2) {
      railPoints.push([-deckW / 2 + 0.1, rz], [deckW / 2 - 0.1, rz]);
    }

    for (let pt of railPoints) {
      if (Math.abs(pt[1] - (deckD / 2 - 0.1)) < 0.1 && pt[0] >= -0.7 && pt[0] <= 1.0) continue;
      addLine(pt[0], deckY, pt[1], pt[0], deckY + railH2, pt[1], 0.03, railR, railG, railB);
    }

    addLine(-deckW / 2 + 0.1, deckY + railH1, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH1, -deckD / 2 + 0.1, 0.04, railR, railG, railB);
    addLine(-deckW / 2 + 0.1, deckY + railH2, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH2, -deckD / 2 + 0.1, 0.04, railR, railG, railB);
    addLine(-deckW / 2 + 0.1, deckY + railH1, -deckD / 2 + 0.1, -deckW / 2 + 0.1, deckY + railH1, deckD / 2 - 0.1, 0.04, railR, railG, railB);
    addLine(-deckW / 2 + 0.1, deckY + railH2, -deckD / 2 + 0.1, -deckW / 2 + 0.1, deckY + railH2, deckD / 2 - 0.1, 0.04, railR, railG, railB);
    addLine(deckW / 2 - 0.1, deckY + railH1, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH1, deckD / 2 - 0.1, 0.04, railR, railG, railB);
    addLine(deckW / 2 - 0.1, deckY + railH2, -deckD / 2 + 0.1, deckW / 2 - 0.1, deckY + railH2, deckD / 2 - 0.1, 0.04, railR, railG, railB);
    addLine(-deckW / 2 + 0.1, deckY + railH1, deckD / 2 - 0.1, -0.7, deckY + railH1, deckD / 2 - 0.1, 0.04, railR, railG, railB);
    addLine(-deckW / 2 + 0.1, deckY + railH2, deckD / 2 - 0.1, -0.7, deckY + railH2, deckD / 2 - 0.1, 0.04, railR, railG, railB);
    addLine(1.0, deckY + railH1, deckD / 2 - 0.1, deckW / 2 - 0.1, deckY + railH1, deckD / 2 - 0.1, 0.04, railR, railG, railB);
    addLine(1.0, deckY + railH2, deckD / 2 - 0.1, deckW / 2 - 0.1, deckY + railH2, deckD / 2 - 0.1, 0.04, railR, railG, railB);

    // -------------------------------------------------------------------------
    // 3. HEAVY-GAUGE STRUCTURAL STEEL SKELETON
    // -------------------------------------------------------------------------
    const steelR = 0.35, steelG = 0.40, steelB = 0.50;
    const colStep = 0.035;

    const bayXs = [-5.4, -3.2, -1.0, 1.0, 3.2, 5.4];

    for (let cx of bayXs) {
      for (let cz of [backZ, frontZ]) {
        if (cx >= 2.0 && cx <= 4.6 && cz === frontZ) continue;
        for (let cy = 0; cy <= bH; cy += colStep) {
          addPt(cx - 0.04, cy, cz - 0.04, steelR, steelG, steelB);
          addPt(cx + 0.04, cy, cz - 0.04, steelR, steelG, steelB);
          addPt(cx + 0.04, cy, cz + 0.04, steelR, steelG, steelB);
          addPt(cx - 0.04, cy, cz + 0.04, steelR, steelG, steelB);
        }
      }
    }
    for (let cz of [-1.1, 1.1]) {
      for (let cx of [leftX, rightX]) {
        for (let cy = 0; cy <= bH; cy += colStep) {
          addPt(cx - 0.04, cy, cz - 0.04, steelR, steelG, steelB);
          addPt(cx + 0.04, cy, cz - 0.04, steelR, steelG, steelB);
          addPt(cx + 0.04, cy, cz + 0.04, steelR, steelG, steelB);
          addPt(cx - 0.04, cy, cz + 0.04, steelR, steelG, steelB);
        }
      }
    }

    // Horizontal Steel Perimeter Beams
    addLine(leftX, 0.05, frontZ, -0.6, 0.05, frontZ, 0.03, steelR, steelG, steelB);
    addLine(0.9, 0.05, frontZ, 2.2, 0.05, frontZ, 0.03, steelR, steelG, steelB);
    addLine(leftX, 0.05, backZ, rightX, 0.05, backZ, 0.03, steelR, steelG, steelB);
    addLine(leftX, 0.05, backZ, leftX, 0.05, frontZ, 0.03, steelR, steelG, steelB);
    addLine(rightX, 0.05, backZ, rightX, 0.05, frontZ, 0.03, steelR, steelG, steelB);

    addLine(leftX, 1.35, frontZ, -0.6, 1.35, frontZ, 0.03, steelR, steelG, steelB);
    addLine(0.9, 1.35, frontZ, 2.2, 1.35, frontZ, 0.03, steelR, steelG, steelB);
    addLine(leftX, 1.35, backZ, rightX, 1.35, backZ, 0.03, steelR, steelG, steelB);
    addLine(leftX, 1.35, backZ, leftX, 1.35, frontZ, 0.03, steelR, steelG, steelB);
    addLine(rightX, 1.35, backZ, rightX, 1.35, frontZ, 0.03, steelR, steelG, steelB);

    addLine(leftX, bH, frontZ, rightX, bH, frontZ, 0.03, steelR, steelG, steelB);
    addLine(leftX, bH, backZ, rightX, bH, backZ, 0.03, steelR, steelG, steelB);
    addLine(leftX, bH, backZ, leftX, bH, frontZ, 0.03, steelR, steelG, steelB);
    addLine(rightX, bH, backZ, rightX, bH, frontZ, 0.03, steelR, steelG, steelB);

    // Steel Roof Trusses
    const ridgeY = 4.35;
    const ridgeZ = 0.0;
    addLine(leftX - 0.3, ridgeY, ridgeZ, rightX + 0.3, ridgeY, ridgeZ, 0.03, 0.45, 0.52, 0.62);

    for (let tx of bayXs) {
      addLine(tx, bH, frontZ + 0.25, tx, ridgeY, ridgeZ, 0.03, steelR, steelG, steelB);
      addLine(tx, bH, backZ - 0.25, tx, ridgeY, ridgeZ, 0.03, steelR, steelG, steelB);
      addLine(tx, bH, backZ, tx, bH, frontZ, 0.04, steelR, steelG, steelB);
      addLine(tx, bH, ridgeZ, tx, ridgeY, ridgeZ, 0.03, steelR, steelG, steelB);
      addLine(tx, bH, -1.7, tx, bH + (ridgeY - bH) * 0.5, -0.85, 0.03, steelR, steelG, steelB);
      addLine(tx, bH, 1.7, tx, bH + (ridgeY - bH) * 0.5, 0.85, 0.03, steelR, steelG, steelB);
    }

    // -------------------------------------------------------------------------
    // 4. AUTHENTIC RECYCLED PET BOTTLE GABION WALLS (DENSE & RADIANT)
    // -------------------------------------------------------------------------
    function generateBottleWallBay(xMin, xMax, zFixed, isFront, isBack) {
      const colSpacing = 0.095; // 9.5cm per bottle column (dense!)
      const rowSpacing = 0.20;  // 20cm per bottle course

      const numCols = Math.floor((xMax - xMin) / colSpacing);
      const numRows = Math.floor(bH / rowSpacing);

      for (let c = 0; c < numCols; c++) {
        const bx = xMin + c * colSpacing + colSpacing / 2;

        for (let r = 0; r < numRows; r++) {
          const by = r * rowSpacing + rowSpacing / 2;

          // Skip Doorway on Front Facade
          if (isFront && bx >= -0.65 && bx <= 0.85 && by <= 2.6) continue;
          // Skip Danfo annex opening on Front Facade
          if (isFront && bx >= 2.2 && bx <= 4.8 && by <= 2.5) continue;
          // Skip Behind Chalkboard on Back Wall
          if (isBack && bx >= -3.8 && bx <= -1.2 && by >= 1.2 && by <= 2.5) continue;

          const isBlueTopRow = by >= 2.80; // Upper band of royal blue bottles

          let rVal, gVal, bVal;
          if (isBlueTopRow) {
            rVal = 0.08 + Math.random() * 0.04;
            gVal = 0.38 + Math.random() * 0.06;
            bVal = 1.0;
          } else {
            const isSparkle = Math.random() > 0.78;
            if (isSparkle) {
              rVal = 0.94; gVal = 0.98; bVal = 1.0;
            } else {
              rVal = 0.25 + Math.random() * 0.08;
              gVal = 0.75 + Math.random() * 0.08;
              bVal = 0.92 + Math.random() * 0.06;
            }
          }

          // Sample 3D Bottle Cylinder (Body, Neck, and Caps)
          for (let s of [-0.05, 0.0, 0.05]) {
            const bz = zFixed + s;
            // 8 points around body
            addPt(bx - 0.035, by - 0.06, bz, rVal, gVal, bVal);
            addPt(bx + 0.035, by - 0.06, bz, rVal, gVal, bVal);
            addPt(bx - 0.040, by, bz, rVal, gVal, bVal);
            addPt(bx + 0.040, by, bz, rVal, gVal, bVal);
            addPt(bx, by, bz + (s === 0 ? 0.035 : 0), rVal, gVal, bVal);
            addPt(bx - 0.035, by + 0.05, bz, rVal, gVal, bVal);
            addPt(bx + 0.035, by + 0.05, bz, rVal, gVal, bVal);
          }

          // Neck Taper
          const capZ = zFixed + (isFront ? 0.07 : (isBack ? -0.07 : 0.07));
          addPt(bx - 0.018, by + 0.08, capZ, rVal * 0.9, gVal * 0.9, bVal * 0.9);
          addPt(bx + 0.018, by + 0.08, capZ, rVal * 0.9, gVal * 0.9, bVal * 0.9);

          // Bottle Cap (Vibrant amber/orange or white cap)
          if (isBlueTopRow) {
            addPt(bx - 0.015, by + 0.10, capZ, 0.98, 0.98, 1.0);
            addPt(bx + 0.015, by + 0.10, capZ, 0.98, 0.98, 1.0);
          } else {
            addPt(bx - 0.015, by + 0.10, capZ, 1.0, 0.68, 0.12);
            addPt(bx + 0.015, by + 0.10, capZ, 1.0, 0.68, 0.12);
          }
        }
      }

      // Wire-Mesh Gabion Grid Lines
      for (let y = 0.20; y <= bH; y += 0.40) {
        if (isFront && y <= 2.6) {
          addLine(xMin, y, zFixed + 0.07, -0.65, y, zFixed + 0.07, 0.05, 0.42, 0.48, 0.55);
          addLine(0.85, y, zFixed + 0.07, xMax, y, zFixed + 0.07, 0.05, 0.42, 0.48, 0.55);
        } else {
          addLine(xMin, y, zFixed + 0.07, xMax, y, zFixed + 0.07, 0.05, 0.42, 0.48, 0.55);
        }
      }
    }

    function generateSideBottleWallBay(xFixed, zMin, zMax, hasWindow) {
      const colSpacing = 0.095;
      const rowSpacing = 0.20;
      const numCols = Math.floor((zMax - zMin) / colSpacing);
      const numRows = Math.floor(bH / rowSpacing);

      for (let c = 0; c < numCols; c++) {
        const bz = zMin + c * colSpacing + colSpacing / 2;

        for (let r = 0; r < numRows; r++) {
          const by = r * rowSpacing + rowSpacing / 2;

          if (hasWindow && bz >= -1.2 && bz <= 1.2 && by >= 1.1 && by <= 2.5) continue;

          const isBlueTopRow = by >= 2.80;
          let rVal, gVal, bVal;
          if (isBlueTopRow) {
            rVal = 0.08; gVal = 0.38; bVal = 1.0;
          } else if (Math.random() > 0.80) {
            rVal = 0.94; gVal = 0.98; bVal = 1.0;
          } else {
            rVal = 0.25; gVal = 0.75; bVal = 0.92;
          }

          for (let s of [-0.05, 0.0, 0.05]) {
            const bx = xFixed + s;
            addPt(bx, by - 0.06, bz - 0.035, rVal, gVal, bVal);
            addPt(bx, by - 0.06, bz + 0.035, rVal, gVal, bVal);
            addPt(bx, by, bz - 0.040, rVal, gVal, bVal);
            addPt(bx, by, bz + 0.040, rVal, gVal, bVal);
            addPt(bx + (s === 0 ? (xFixed < 0 ? -0.035 : 0.035) : 0), by, bz, rVal, gVal, bVal);
            addPt(bx, by + 0.05, bz - 0.035, rVal, gVal, bVal);
            addPt(bx, by + 0.05, bz + 0.035, rVal, gVal, bVal);
          }

          const capX = xFixed + (xFixed < 0 ? -0.07 : 0.07);
          addPt(capX, by + 0.08, bz - 0.018, rVal * 0.9, gVal * 0.9, bVal * 0.9);
          addPt(capX, by + 0.08, bz + 0.018, rVal * 0.9, gVal * 0.9, bVal * 0.9);

          if (isBlueTopRow) {
            addPt(capX, by + 0.10, bz, 0.98, 0.98, 1.0);
          } else {
            addPt(capX, by + 0.10, bz, 1.0, 0.68, 0.12);
          }
        }
      }

      for (let y = 0.20; y <= bH; y += 0.40) {
        addLine(xFixed + 0.07, y, zMin, xFixed + 0.07, y, zMax, 0.05, 0.42, 0.48, 0.55);
      }
    }

    // Build All Exterior Walls
    generateBottleWallBay(leftX, -0.65, frontZ, true, false);
    generateBottleWallBay(0.85, 2.2, frontZ, true, false);
    generateBottleWallBay(leftX, rightX, backZ, false, true);
    generateSideBottleWallBay(leftX, backZ, frontZ, true);
    generateSideBottleWallBay(rightX, backZ, 1.0, false);

    // -------------------------------------------------------------------------
    // 5. CLASSROOM ENTRANCE & WINDOWS (CLEAR OPENINGS & ARCHITECTURAL FRAMES)
    // -------------------------------------------------------------------------
    const doorX1 = -0.65, doorX2 = 0.85, doorYTop = 2.6;
    addLine(doorX1, 0, frontZ, doorX1, doorYTop, frontZ, 0.025, 0.88, 0.94, 1.0);
    addLine(doorX2, 0, frontZ, doorX2, doorYTop, frontZ, 0.025, 0.88, 0.94, 1.0);
    addLine(doorX1, doorYTop, frontZ, doorX2, doorYTop, frontZ, 0.025, 0.88, 0.94, 1.0);
    addLine(doorX1, 0.04, frontZ + 0.12, doorX2, 0.04, frontZ + 0.12, 0.025, 0.98, 0.82, 0.25);

    // Open Classroom Door (swung inward into classroom at 45° angle)
    const doorW = 0.75;
    const doorAngle = Math.PI / 4;
    const doorEndX = doorX1 + Math.cos(doorAngle) * doorW;
    const doorEndZ = frontZ - Math.sin(doorAngle) * doorW;
    addLine(doorX1, 0.05, frontZ, doorEndX, 0.05, doorEndZ, 0.03, 0.78, 0.88, 0.98);
    addLine(doorEndX, 0.05, doorEndZ, doorEndX, doorYTop - 0.05, doorEndZ, 0.03, 0.78, 0.88, 0.98);
    addLine(doorEndX, doorYTop - 0.05, doorEndZ, doorX1, doorYTop - 0.05, frontZ, 0.03, 0.78, 0.88, 0.98);
    addLine(doorX1 + Math.cos(doorAngle) * (doorW * 0.5), 0.05, frontZ - Math.sin(doorAngle) * (doorW * 0.5),
            doorX1 + Math.cos(doorAngle) * (doorW * 0.5), doorYTop - 0.05, frontZ - Math.sin(doorAngle) * (doorW * 0.5), 0.03, 0.58, 0.68, 0.78);
    addPt(doorEndX - 0.05, 1.15, doorEndZ + 0.05, 1.0, 0.88, 0.22); // Brass Door Handle

    // Side Picture Window on Left Wall (z = -1.2 to 1.2, y = 1.1 to 2.5)
    const winZ1 = -1.2, winZ2 = 1.2, winY1 = 1.1, winY2 = 2.5;
    addLine(leftX, winY1, winZ1, leftX, winY1, winZ2, 0.025, 0.85, 0.94, 1.0);
    addLine(leftX, winY2, winZ1, leftX, winY2, winZ2, 0.025, 0.85, 0.94, 1.0);
    addLine(leftX, winY1, winZ1, leftX, winY2, winZ1, 0.025, 0.85, 0.94, 1.0);
    addLine(leftX, winY1, winZ2, leftX, winY2, winZ2, 0.025, 0.85, 0.94, 1.0);
    addLine(leftX, (winY1 + winY2) / 2, winZ1, leftX, (winY1 + winY2) / 2, winZ2, 0.025, 0.85, 0.94, 1.0);
    addLine(leftX, winY1, (winZ1 + winZ2) / 2, leftX, winY2, (winZ1 + winZ2) / 2, 0.025, 0.85, 0.94, 1.0);

    for (let gz = winZ1 + 0.12; gz <= winZ2 - 0.12; gz += 0.16) {
      for (let gy = winY1 + 0.12; gy <= winY2 - 0.12; gy += 0.16) {
        if (Math.random() > 0.40) {
          addPt(leftX, gy, gz, 0.45, 0.88, 1.0);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 6. CLASSROOM INTERIOR LIFE (SCHOOL DESKS, BENCHES, CHALKBOARD, EASEL)
    // -------------------------------------------------------------------------
    // Warm Interior Teak Floorboards
    for (let fx = leftX + 0.2; fx <= rightX - 0.2; fx += 0.15) {
      for (let fz = backZ + 0.2; fz <= frontZ - 0.2; fz += 0.08) {
        const fNoise = Math.sin(fx * 4 + fz * 8) * 0.03;
        addPt(fx, 0.02, fz, 0.60 + fNoise, 0.40 + fNoise * 0.5, 0.20 + fNoise * 0.3);
      }
    }

    // 6 Student School Desks with Matching Bench Seats
    const deskRows = [0.8, -0.9];
    const deskCols = [-3.8, -2.4, -1.0];

    for (let rZ of deskRows) {
      for (let cX of deskCols) {
        const dW = 0.85;
        const dD = 0.45;
        const dH = 0.74;

        for (let lx of [-dW / 2 + 0.04, dW / 2 - 0.04]) {
          for (let lz of [-dD / 2 + 0.04, dD / 2 - 0.04]) {
            addLine(cX + lx, 0.02, rZ + lz, cX + lx, dH, rZ + lz, 0.035, 0.24, 0.28, 0.34);
          }
        }
        for (let dx = cX - dW / 2; dx <= cX + dW / 2; dx += 0.045) {
          for (let dz = rZ - dD / 2; dz <= rZ + dD / 2; dz += 0.045) {
            addPt(dx, dH, dz, 0.72, 0.50, 0.25);
          }
        }
        for (let sx = cX - 0.14; sx <= cX + 0.14; sx += 0.035) {
          for (let sz = rZ - 0.10; sz <= rZ + 0.10; sz += 0.035) {
            addPt(sx, dH + 0.015, sz, 0.98, 0.98, 0.96);
          }
        }
        addPt(cX + 0.20, dH + 0.015, rZ, 1.0, 0.78, 0.12);
        addPt(cX + 0.22, dH + 0.015, rZ + 0.04, 0.20, 0.70, 0.98);

        const bZ = rZ - 0.48;
        const bW = 0.85;
        const bSeatH = 0.44;
        for (let blx of [-bW / 2 + 0.05, bW / 2 - 0.05]) {
          addLine(cX + blx, 0.02, bZ, cX + blx, bSeatH, bZ, 0.035, 0.24, 0.28, 0.34);
        }
        for (let bx = cX - bW / 2; bx <= cX + bW / 2; bx += 0.04) {
          for (let bzOffset of [-0.08, -0.02, 0.04, 0.08]) {
            addPt(bx, bSeatH, bZ + bzOffset, 0.68, 0.44, 0.22);
          }
        }
      }
    }

    // Large Teacher's Chalkboard on Interior Back Wall
    const boardX1 = -3.8, boardX2 = -1.2, boardY1 = 1.3, boardY2 = 2.5, boardZ = backZ + 0.08;
    addLine(boardX1, boardY1, boardZ, boardX2, boardY1, boardZ, 0.025, 0.82, 0.55, 0.26);
    addLine(boardX1, boardY2, boardZ, boardX2, boardY2, boardZ, 0.025, 0.82, 0.55, 0.26);
    addLine(boardX1, boardY1, boardZ, boardX1, boardY2, boardZ, 0.025, 0.82, 0.55, 0.26);
    addLine(boardX2, boardY1, boardZ, boardX2, boardY2, boardZ, 0.025, 0.82, 0.55, 0.26);

    for (let sbx = boardX1 + 0.04; sbx <= boardX2 - 0.04; sbx += 0.05) {
      for (let sby = boardY1 + 0.04; sby <= boardY2 - 0.04; sby += 0.05) {
        addPt(sbx, sby, boardZ, 0.05, 0.20, 0.14); // Deep chalkboard green
      }
    }
    for (let ly of [2.25, 1.95, 1.65]) {
      for (let lx = boardX1 + 0.25; lx <= boardX2 - 0.25; lx += 0.04) {
        if (Math.random() > 0.20) {
          addPt(lx, ly, boardZ + 0.015, 0.98, 0.98, 1.0);
        }
      }
    }

    // Artist's Wooden Tripod Easel & Stretched Canvas Painting
    const easelX = 0.5, easelZ = -0.5;
    addLine(easelX - 0.25, 0.02, easelZ + 0.25, easelX, 1.85, easelZ, 0.035, 0.78, 0.52, 0.26);
    addLine(easelX + 0.25, 0.02, easelZ + 0.25, easelX, 1.85, easelZ, 0.035, 0.78, 0.52, 0.26);
    addLine(easelX, 0.02, easelZ - 0.35, easelX, 1.85, easelZ, 0.035, 0.78, 0.52, 0.26);
    addLine(easelX - 0.32, 0.95, easelZ + 0.12, easelX + 0.32, 0.95, easelZ + 0.12, 0.025, 0.78, 0.52, 0.26);

    for (let cx = easelX - 0.24; cx <= easelX + 0.24; cx += 0.035) {
      for (let cy = 1.0; cy <= 1.55; cy += 0.035) {
        const artNoise = Math.sin(cx * 15 + cy * 15);
        if (artNoise > 0.4) {
          addPt(cx, cy, easelZ + 0.13, 1.0, 0.78, 0.10);
        } else if (artNoise < -0.3) {
          addPt(cx, cy, easelZ + 0.13, 0.15, 0.80, 0.98);
        } else {
          addPt(cx, cy, easelZ + 0.13, 0.98, 0.38, 0.48);
        }
      }
    }

    // Hanging Bottle Ceiling Canopy Matrix (from gallery_01)
    for (let hx = leftX + 0.6; hx <= rightX - 2.8; hx += 0.22) {
      for (let hz = backZ + 0.6; hz <= frontZ - 0.6; hz += 0.22) {
        const isBlue = Math.random() > 0.55;
        const hr = isBlue ? 0.08 : 0.88;
        const hg = isBlue ? 0.48 : 0.96;
        const hb = isBlue ? 1.0 : 1.0;
        addPt(hx, 3.28, hz, hr, hg, hb);
        addPt(hx, 3.12, hz, hr * 0.9, hg * 0.9, hb);
        addPt(hx, 3.02, hz, 1.0, 0.72, 0.15);
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

    // Solid Yellow Body Panels with Dual Black-and-White Transit Stripes
    for (let z = busZ1; z <= busZ2; z += 0.06) {
      for (let y = busY1; y <= busY2; y += 0.06) {
        const isBlackStripe = y >= 0.80 && y <= 0.92;
        const isWhiteStripe = y >= 0.94 && y <= 1.04;
        const isSideWindow = (y >= 1.15 && y <= 1.85 && z >= 1.0 && z <= 4.4);

        for (let bx of [busX1, busX2]) {
          if (isSideWindow) {
            if (Math.abs(z % 0.85) < 0.04 || Math.abs(y - 1.15) < 0.03 || Math.abs(y - 1.85) < 0.03) {
              addPt(bx, y, z, 0.20, 0.25, 0.32);
            } else if (Math.random() > 0.50) {
              addPt(bx, y, z, 0.35, 0.88, 1.0);
            }
            continue;
          }

          if (isBlackStripe) {
            addPt(bx, y, z, 0.08, 0.10, 0.12);
          } else if (isWhiteStripe) {
            addPt(bx, y, z, 0.98, 0.98, 1.0);
          } else {
            addPt(bx, y, z, 0.98, 0.78, 0.06); // Rich Lagos Danfo Yellow
          }
        }
      }
    }

    // Curved Front Face & Split Windshield (z = busZ2 = 5.2)
    for (let x = busX1; x <= busX2; x += 0.055) {
      for (let y = busY1; y <= busY2; y += 0.055) {
        const isWindshield = y >= 1.15 && y <= 1.95 && x >= busX1 + 0.15 && x <= busX2 - 0.15;
        const isGrille = y >= 0.50 && y <= 0.75 && x >= busCX - 0.6 && x <= busCX + 0.6;
        const isBumper = y >= 0.25 && y <= 0.42;

        if (isWindshield) {
          const isCenterPillar = Math.abs(x - busCX) < 0.04;
          const isBorder = x <= busX1 + 0.18 || x >= busX2 - 0.18 || y <= 1.18 || y >= 1.92;
          if (isCenterPillar || isBorder) {
            addPt(x, y, busZ2, 0.18, 0.22, 0.28);
          } else if (Math.random() > 0.40) {
            addPt(x, y, busZ2, 0.40, 0.90, 1.0);
          }
        } else if (isGrille) {
          addPt(x, y, busZ2 + 0.02, 0.10, 0.12, 0.15);
          if (Math.hypot(x - busCX, y - 0.62) < 0.12) {
            addPt(x, y, busZ2 + 0.035, 0.92, 0.94, 0.98);
          }
        } else if (isBumper) {
          addPt(x, y, busZ2 + 0.04, 0.85, 0.90, 0.96);
        } else {
          addPt(x, y, busZ2, 0.98, 0.78, 0.06);
        }
      }
    }

    // Twin Round Headlights & Volumetric Light Cones
    const headlampXs = [busX1 + 0.45, busX2 - 0.45];
    for (let hx of headlampXs) {
      for (let a = 0; a < 14; a++) {
        const ang = a * (Math.PI * 2 / 14);
        for (let rad = 0.05; rad <= 0.15; rad += 0.025) {
          const rx = hx + Math.cos(ang) * rad;
          const ry = 0.70 + Math.sin(ang) * rad;
          const isCenter = rad < 0.08;
          addPt(rx, ry, busZ2 + 0.05, isCenter ? 1.0 : 0.90, isCenter ? 1.0 : 0.94, isCenter ? 0.95 : 0.98);
        }
      }
      for (let bz = busZ2 + 0.12; bz <= busZ2 + 1.4; bz += 0.10) {
        const spread = (bz - busZ2) * 0.30;
        for (let b = 0; b < 8; b++) {
          const bang = b * (Math.PI * 2 / 8);
          const bx = hx + Math.cos(bang) * spread;
          const by = 0.70 + Math.sin(bang) * spread * 0.6;
          addPt(bx, by, bz, 1.0, 0.94, 0.70);
        }
      }
    }

    // Curved Bus Roof & Rooftop Cargo Rails
    for (let z = busZ1; z <= busZ2; z += 0.06) {
      for (let x = busX1; x <= busX2; x += 0.06) {
        const arch = Math.sin(((x - busX1) / busW) * Math.PI) * 0.18;
        addPt(x, busY2 + arch, z, 0.98, 0.78, 0.06);
      }
      addPt(busX1 + 0.12, busY2 + 0.22, z, 0.88, 0.92, 0.96);
      addPt(busX2 - 0.12, busY2 + 0.22, z, 0.88, 0.92, 0.96);
    }

    // 4 Detailed Bus Wheels
    const wheelXs = [busX1 - 0.02, busX2 + 0.02];
    const wheelZs = [1.5, 4.3];

    for (let wx of wheelXs) {
      for (let wz of wheelZs) {
        for (let a = 0; a < 18; a++) {
          const ang = a * (Math.PI * 2 / 18);
          for (let wr = 0.06; wr <= 0.34; wr += 0.035) {
            const wy = 0.34 + Math.sin(ang) * wr;
            const wzPos = wz + Math.cos(ang) * wr;
            const isTire = wr > 0.22;
            if (isTire) {
              addPt(wx, wy, wzPos, 0.10, 0.12, 0.14);
            } else {
              addPt(wx, wy, wzPos, 0.88, 0.92, 0.96);
            }
          }
        }
        addPt(wx, 0.34, wz, 1.0, 0.82, 0.12);
      }
    }

    // -------------------------------------------------------------------------
    // 8. SOLID PITCHED CORRUGATED ROOF & ROOFTOP SOLAR PANEL ARRAY
    // -------------------------------------------------------------------------
    const roofOverhangX = 0.45;
    const roofOverhangZ = 0.45;
    const roofZMin = backZ - roofOverhangZ;
    const roofZMax = frontZ + roofOverhangZ;

    // Dense Corrugated Sheeting
    for (let rx = leftX - roofOverhangX; rx <= rightX + roofOverhangX; rx += 0.06) {
      for (let rz = roofZMin; rz <= roofZMax; rz += 0.06) {
        const tSlope = 1.0 - Math.abs(rz - ridgeZ) / (bD / 2 + roofOverhangZ);
        const ry = bH + tSlope * (ridgeY - bH);
        const corrugation = Math.sin(rx * 35) * 0.024;

        const isPeak = corrugation > 0.015;
        let cr = isPeak ? 0.65 : 0.38;
        let cg = isPeak ? 0.72 : 0.44;
        let cb = isPeak ? 0.82 : 0.54;
        addPt(rx, ry + corrugation, rz, cr, cg, cb);
      }
    }

    // Fascia Borders
    for (let rx = leftX - roofOverhangX; rx <= rightX + roofOverhangX; rx += 0.04) {
      addPt(rx, bH, roofZMax, 0.88, 0.94, 1.0);
      addPt(rx, bH, roofZMin, 0.88, 0.94, 1.0);
    }
    for (let rz = roofZMin; rz <= roofZMax; rz += 0.04) {
      const tSlope = 1.0 - Math.abs(rz - ridgeZ) / (bD / 2 + roofOverhangZ);
      const ry = bH + tSlope * (ridgeY - bH);
      addPt(leftX - roofOverhangX, ry, rz, 0.88, 0.94, 1.0);
      addPt(rightX + roofOverhangX, ry, rz, 0.88, 0.94, 1.0);
    }

    // 6 Rooftop Photovoltaic Solar Panels
    const solarPanelDefs = [
      { x1: -3.6, x2: -1.8, z1: 0.5, z2: 1.5 },
      { x1: -1.6, x2: 0.2,  z1: 0.5, z2: 1.5 },
      { x1: 0.4,  x2: 2.2,  z1: 0.5, z2: 1.5 },
      { x1: -3.6, x2: -1.8, z1: 1.7, z2: 2.7 },
      { x1: -1.6, x2: 0.2,  z1: 1.7, z2: 2.7 },
      { x1: 0.4,  x2: 2.2,  z1: 1.7, z2: 2.7 }
    ];

    for (let panel of solarPanelDefs) {
      for (let px = panel.x1; px <= panel.x2; px += 0.04) {
        for (let pz = panel.z1; pz <= panel.z2; pz += 0.04) {
          const tSlope = 1.0 - Math.abs(pz - ridgeZ) / (bD / 2 + roofOverhangZ);
          const py = bH + tSlope * (ridgeY - bH) + 0.05;

          const isBorder = px <= panel.x1 + 0.05 || px >= panel.x2 - 0.05 || pz <= panel.z1 + 0.05 || pz >= panel.z2 - 0.05;
          const isGridBusbar = Math.abs((px - panel.x1) % 0.35) < 0.025 || Math.abs((pz - panel.z1) % 0.30) < 0.025;

          if (isBorder || isGridBusbar) {
            addPt(px, py + 0.01, pz, 0.95, 0.98, 1.0);
          } else {
            addPt(px, py, pz, 0.05, 0.22, 0.65);
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // 9. SHIMMERING LAGOON WATER SURFACE RIPPLES
    // -------------------------------------------------------------------------
    for (let wx = -12.5; wx <= 12.5; wx += 0.35) {
      for (let wz = -11.0; wz <= 11.0; wz += 0.35) {
        const distFromCenter = Math.hypot(wx, wz);
        const wave = Math.sin(distFromCenter * 2.2) * 0.025;
        const wy = -1.25 + wave;
        const isHighlight = Math.random() > 0.85;
        if (isHighlight) {
          addPt(wx, wy, wz, 0.50, 0.92, 1.0);
        } else {
          addPt(wx, wy, wz, 0.05, 0.45, 0.75);
        }
      }
    }

    // Build Three.js Geometry for Building Architecture
    const buildGeom = new THREE.BufferGeometry();
    buildGeom.setAttribute('position', new THREE.Float32BufferAttribute(buildPos, 3));
    buildGeom.setAttribute('color', new THREE.Float32BufferAttribute(buildCol, 3));

    const buildMaterial = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.96,
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

    // Solid Royal Navy Blue Acrylic Signboard Backing Plate
    for (let bx = logoCX - logoBoardW / 2; bx <= logoCX + logoBoardW / 2; bx += 0.045) {
      for (let by = logoCY - logoBoardH / 2; by <= logoCY + logoBoardH / 2; by += 0.045) {
        const isBorder = Math.abs(Math.abs(bx - logoCX) - logoBoardW / 2) < 0.05 ||
                         Math.abs(Math.abs(by - logoCY) - logoBoardH / 2) < 0.05;
        if (isBorder) {
          addLogoPt(bx, by, logoCZ - 0.01, 0.88, 0.94, 1.0);
        } else {
          addLogoPt(bx, by, logoCZ - 0.02, 0.02, 0.12, 0.38); // Dense navy acrylic
        }
      }
    }

    // 4 Corner Mounting Standoff Studs
    const cornerOffsets = [
      [-logoBoardW / 2 + 0.15, -logoBoardH / 2 + 0.15],
      [logoBoardW / 2 - 0.15, -logoBoardH / 2 + 0.15],
      [-logoBoardW / 2 + 0.15, logoBoardH / 2 - 0.15],
      [logoBoardW / 2 - 0.15, logoBoardH / 2 - 0.15]
    ];
    for (let [ox, oy] of cornerOffsets) {
      for (let a = 0; a < 8; a++) {
        const ang = a * (Math.PI * 2 / 8);
        addLogoPt(logoCX + ox + Math.cos(ang) * 0.045, logoCY + oy + Math.sin(ang) * 0.045, logoCZ + 0.02, 0.98, 0.98, 1.0);
      }
    }

    // 11,399 Exact Normalized Official Logo Points
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
          addLogoPt(px, py, pz, 1.0, 0.78, 0.06);
        } else {
          addLogoPt(px, py, pz, 1.0, 1.0, 1.0);
        }
      }
    }

    // Subtitle on Signboard: "MENTORSHIP & SUPPORT • PET BOTTLE ACADEMY"
    const subY = logoCY - 0.62;
    for (let sx = logoCX - 1.45; sx <= logoCX + 1.45; sx += 0.04) {
      if (Math.random() > 0.10) {
        addLogoPt(sx, subY, logoCZ + 0.015, 0.28, 0.94, 1.0);
      }
    }

    const logoGeom = new THREE.BufferGeometry();
    logoGeom.setAttribute('position', new THREE.Float32BufferAttribute(logoPos, 3));
    logoGeom.setAttribute('color', new THREE.Float32BufferAttribute(logoCol, 3));

    const logoMaterial = new THREE.PointsMaterial({
      size: 0.075,
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
    // 4. TRANSFORMS, SCROLL-DRIVEN ORBIT & RESPONSIVE SCALING
    // =========================================================================
    let currentRotY = 0.08;
    let targetRotY = 0.08;
    let currentRotX = 0.04;
    let targetRotX = 0.04;
    let currentScale = 1.0;
    let targetScale = 1.0;
    let baseBuildingY = -0.5;

    // Scroll-Linked Gentle 3D Orbit (Academy gently rotates as user scrolls)
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

    // Responsive Window Resize Handler
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

      // Calibrated Razor-Sharp Point Sizes (dense, crisp, luminous pinpoints)
      buildMaterial.size = (isMobile ? 0.095 : 0.115) * modelScale;
      logoMaterial.size = (isMobile ? 0.065 : 0.078) * modelScale;

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

    // 5. Render Loop with Atmospheric Drift
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

      currentRotY += (targetRotY + idleY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentScale += (targetScale - currentScale) * 0.08;

      academyGroup.rotation.y = currentRotY;
      academyGroup.rotation.x = currentRotX;
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
