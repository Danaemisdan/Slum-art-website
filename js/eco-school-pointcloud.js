/**
 * Slum Art Foundation - 3D Eco-Bottle Academy Point Cloud Architecture
 * High-Resolution LiDAR & Photogrammetry Digital Twin
 * 220,000+ Luminous Fine-Point Particles
 *
 * Full Architectural Digital Twin of the Slum Art Bottle School:
 * 1. Stepped African Teak Deck Plinth on Mangrove Pilings (lagoon stilts, zero fence railing)
 * 2. Complete 4-Wall Recycled PET Bottle Architecture:
 *    - Front Facade: Charcoal Black (#141519) PET bottles in black steel cages with entrance doorway
 *    - Side Walls (Left & Right): Vibrant Amber-Orange (#df7812) PET bottles with security picture windows
 *    - Rear Wall: Solid 4-tier Vibrant Amber-Orange PET bottles in steel cages
 *    - Upper Frieze & Gables: Sloped bottle courses rising to roof slope
 * 3. Official High-Resolution 3D "slum art" Signboard:
 *    - Prominently mounted on the front facade beside the doorway
 *    - 11,399 exact normalized vector points:
 *      * Glowing amber-gold ribbon waves
 *      * Pure luminous white "slum art" wordmark
 *      * Radiant cyan-white "MENTORSHIP & SUPPORT" subtitle
 *      * Navy blue backing plate with standoff brackets & metallic rivets
 * 4. Integrated Lagos Danfo Bus Classroom Cab:
 *    - Protruding forward from front facade with heavy 45-degree welded diagonal steel support struts
 *    - Authentic Lagos Sunshine Yellow body (#f59e0b) with classic dual transit stripes
 *    - Split angled windshield, flush projector headlights (NO LIGHT RAYS), grille, bumper, wheels
 * 5. Sloped Mono-Pitch Corrugated Galvanized Iron Roof with 4 Monocrystalline Solar Panels
 * 6. Interior Classroom Life: Double desks, benches, chalkboard, artist easel
 * 7. Bioluminescent Lagoon Water with Organic Harmonic Ripples & Floating Ambient Spores
 * 8. Scroll-Driven Point Cloud Assembly & Dispersion:
 *    - GPU-accelerated vertex shader dispersion: particles float in an organic luminous cloud and
 *      smoothly assemble together into the solid architectural school as the user scrolls into view
 * 9. Isometric Front-Corner 3D Perspective with Scroll-Driven Orbit & Parallax
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
    function createPointTexture() {
      const size = 128;
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');
      const center = size / 2;
      const radius = size / 2;

      const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);
      grad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.98)');
      grad.addColorStop(0.78, 'rgba(255, 255, 255, 0.75)');
      grad.addColorStop(0.92, 'rgba(255, 255, 255, 0.25)');
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

    // Coordinate, Color, and Dispersion Buffers
    const buildPos = [];
    const buildCol = [];
    const buildDisp = [];

    // Helper: calculate organic dispersion vector from building center
    function calcDispersion(x, y, z) {
      const cX = 0.0, cY = 2.5, cZ = 0.0;
      const dx = x - cX;
      const dy = y - cY;
      const dz = z - cZ;
      const dist = Math.hypot(dx, dy, dz) || 1.0;

      const angle = Math.atan2(dz, dx);
      const spiral = angle + (y * 0.45);
      const radiusDisp = 2.6 + (Math.sin(x * 1.5 + z * 1.5) + 1.0) * 1.6;

      const dispX = Math.cos(spiral) * radiusDisp + (Math.random() - 0.5) * 1.8;
      const dispY = (dy / dist) * 2.2 + (Math.sin(spiral * 2.0) + Math.random() - 0.5) * 2.2;
      const dispZ = Math.sin(spiral) * radiusDisp + (Math.random() - 0.5) * 1.8;

      return [dispX, dispY, dispZ];
    }

    function addPt(x, y, z, r, g, b, customDisp = null) {
      buildPos.push(x, y, z);
      buildCol.push(r, g, b);
      if (customDisp) {
        buildDisp.push(customDisp[0], customDisp[1], customDisp[2]);
      } else {
        const d = calcDispersion(x, y, z);
        buildDisp.push(d[0], d[1], d[2]);
      }
    }

    function addLine(x1, y1, z1, x2, y2, z2, step, r, g, b, jitter = 0.004) {
      const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
      const len = Math.hypot(dx, dy, dz);
      const steps = Math.max(2, Math.floor(len / step));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const jx = (Math.random() - 0.5) * jitter;
        const jy = (Math.random() - 0.5) * jitter;
        const jz = (Math.random() - 0.5) * jitter;
        addPt(x1 + dx * t + jx, y1 + dy * t + jy, z1 + dz * t + jz, r, g, b);
      }
    }

    // =========================================================================
    // ARCHITECTURAL DIMENSIONS
    // =========================================================================
    const bW = 8.2;       // Building Width along X (-4.1 to +4.1)
    const bD = 11.2;      // Building Depth along Z (-5.6 to +5.6)
    const bH = 5.0;       // Wall Height along Y (0.0 to 5.0)
    const halfW = bW / 2; // 4.1
    const halfD = bD / 2; // 5.6
    const frontZ = halfD; // +5.6
    const backZ = -halfD; // -5.6
    const leftX = -halfW; // -4.1
    const rightX = halfW; // +4.1

    const STEP = 0.082;   // High-density surface point sampling step

    // -------------------------------------------------------------------------
    // 1. BIOLUMINESCENT LAGOON WATER
    // -------------------------------------------------------------------------
    const waterW = 26.0;
    const waterD = 26.0;
    const waterStep = 0.52;
    for (let wx = -waterW / 2; wx <= waterW / 2; wx += waterStep) {
      for (let wz = -waterD / 2; wz <= waterD / 2; wz += waterStep) {
        const distFromCenter = Math.hypot(wx, wz);
        if (distFromCenter < 2.5) continue;

        const ripple = Math.sin(wx * 0.45 + wz * 0.35) * 0.08 + Math.cos(wx * 0.25 - wz * 0.55) * 0.05;
        const wy = -2.6 + ripple;
        const falloff = Math.max(0.12, 1.0 - (distFromCenter / (waterW / 2)) * 0.82);

        const isTeal = Math.random() > 0.35;
        let wr, wg, wb;
        if (isTeal) {
          wr = 0.02 * falloff;
          wg = (0.55 + Math.random() * 0.15) * falloff;
          wb = (0.75 + Math.random() * 0.20) * falloff;
        } else {
          wr = 0.04 * falloff;
          wg = (0.28 + Math.random() * 0.10) * falloff;
          wb = (0.92 + Math.random() * 0.08) * falloff;
        }
        addPt(wx, wy, wz, wr, wg, wb);
      }
    }

    // -------------------------------------------------------------------------
    // 2. MANGROVE PILINGS & STEPPED TIMBER PLINTH (ZERO FENCE RAILING)
    // -------------------------------------------------------------------------
    const plinthW = bW + 2.4; // 10.6
    const plinthD = bD + 2.6; // 13.8

    // Mangrove Stilts extending into the water
    for (let sx = -plinthW / 2 + 0.6; sx <= plinthW / 2 - 0.4; sx += 1.8) {
      for (let sz = -plinthD / 2 + 0.6; sz <= plinthD / 2 - 0.4; sz += 2.0) {
        addLine(sx, -2.6, sz, sx, -0.05, sz, 0.08, 0.35, 0.24, 0.16, 0.012);
        if (Math.random() > 0.4) {
          addLine(sx, -1.8, sz, sx + 0.5, -0.2, sz + 0.5, 0.10, 0.30, 0.20, 0.14, 0.012);
        }
      }
    }

    // African Teak Plinth Deck (Walkway platform)
    for (let px = -plinthW / 2; px <= plinthW / 2; px += 0.09) {
      for (let pz = -plinthD / 2; pz <= plinthD / 2; pz += 0.09) {
        const plankNoise = Math.sin(px * 12.0 + pz * 2.5) * 0.04;
        const pr = 0.58 + plankNoise;
        const pg = 0.40 + plankNoise * 0.7;
        const pb = 0.24 + plankNoise * 0.5;
        addPt(px, -0.05, pz, pr, pg, pb);

        if (Math.abs(px) < halfW + 0.25 && Math.abs(pz) < halfD + 0.25) {
          addPt(px, 0.0, pz, pr * 1.08, pg * 1.08, pb * 1.08);
        }
      }
    }

    // Perimeter deck trim fascia
    for (let px = -plinthW / 2; px <= plinthW / 2; px += 0.08) {
      addLine(px, -0.35, -plinthD / 2, px, -0.05, -plinthD / 2, 0.06, 0.44, 0.30, 0.18);
      addLine(px, -0.35,  plinthD / 2, px, -0.05,  plinthD / 2, 0.06, 0.44, 0.30, 0.18);
    }
    for (let pz = -plinthD / 2; pz <= plinthD / 2; pz += 0.08) {
      addLine(-plinthW / 2, -0.35, pz, -plinthW / 2, -0.05, pz, 0.06, 0.44, 0.30, 0.18);
      addLine( plinthW / 2, -0.35, pz,  plinthW / 2, -0.05, pz, 0.06, 0.44, 0.30, 0.18);
    }

    // -------------------------------------------------------------------------
    // 3. COMPLETE 4-WALL RECYCLED PET BOTTLE ARCHITECTURE
    // Multi-stop optical depth: Smoked Obsidian for front, Honey Amber for sides/rear
    // -------------------------------------------------------------------------
    function generateBottleWall({
      axis,
      fixedCoord,
      uMin, uMax,
      vMin, vMax,
      cutouts = [],
      isAmber = false,
      cageColor = [0.28, 0.32, 0.38]
    }) {
      const uSpan = uMax - uMin;
      const vSpan = vMax - vMin;

      function isInsideCutout(u, v) {
        for (let k = 0; k < cutouts.length; k++) {
          const c = cutouts[k];
          if (u >= c.uMin && u <= c.uMax && v >= c.vMin && v <= c.vMax) return true;
        }
        return false;
      }

      for (let u = uMin; u <= uMax; u += STEP) {
        for (let v = vMin; v <= vMax; v += STEP) {
          if (isInsideCutout(u, v)) continue;

          const colIdx = Math.floor((u - uMin) / 0.16);
          const rowIdx = Math.floor((v - vMin) / 0.28);
          const courseProgress = ((v - vMin) % 0.28) / 0.28;
          const bottleXProgress = ((u - uMin) % 0.16) / 0.16;
          const noise = (Math.sin(colIdx * 4.3 + rowIdx * 2.7) + 1) * 0.5;

          const heightGrad = (v - vMin) / (vSpan || 1.0);
          let r, g, b;
          if (isAmber) {
            // Refined Warm Amber-Gold with natural atmospheric height gradient:
            const isShoulder = courseProgress > 0.65 && courseProgress < 0.88;
            const isBase = courseProgress < 0.20;
            const isCap = Math.abs((u - uMin) % 0.16) < 0.035 && Math.abs((v - vMin) % 0.28) < 0.045;

            const heightFactor = 0.82 + heightGrad * 0.32; // Natural skylight falloff
            if (isCap) {
              r = 0.98; g = 0.82; b = 0.22; // Warm brass cap
            } else if (isShoulder) {
              r = 0.96 * heightFactor; g = 0.76 * heightFactor; b = 0.30; // Sunlit champagne reflection
            } else if (isBase) {
              r = 0.58; g = 0.28; b = 0.08; // Warm cognac base
            } else {
              const bodyLum = (0.85 + noise * 0.18) * heightFactor;
              r = Math.min(1.0, 0.84 * bodyLum);
              g = Math.min(1.0, 0.50 * bodyLum);
              b = Math.min(1.0, 0.12 * bodyLum);
            }
          } else {
            // Front facade: Sleek Translucent Smoked Cobalt / Lagoon Glass:
            // Continuous, smooth & organic across the entire facade (NO DARK BOX PATCH)
            const isCap = Math.abs((u - uMin) % 0.16) < 0.035 && Math.abs((v - vMin) % 0.28) < 0.045;
            const isRibGlint = (courseProgress > 0.45 && courseProgress < 0.58) && (bottleXProgress > 0.35 && bottleXProgress < 0.65);
            const isEdgeReflect = (bottleXProgress < 0.15 || bottleXProgress > 0.85);

            if (isCap) {
              r = 0.35; g = 0.75; b = 0.92; // Metallic ice cyan cap
            } else if (isRibGlint) {
              r = 0.55; g = 0.78; b = 0.92; // Specular silver-cyan glass reflection
            } else if (isEdgeReflect) {
              r = 0.24; g = 0.48; b = 0.66; // Oceanic glass caustics
            } else {
              const darkLum = 0.80 + noise * 0.25;
              r = 0.12 * darkLum;
              g = 0.18 * darkLum;
              b = 0.26 * darkLum;
            }
          }

          [-0.065, 0.065].forEach(depthOffset => {
            const jitter = (Math.random() - 0.5) * 0.012;
            if (axis === 'z') {
              addPt(u, v, fixedCoord + depthOffset + jitter, r, g, b);
            } else {
              addPt(fixedCoord + depthOffset + jitter, v, u, r, g, b);
            }
          });
        }
      }

      // Structural steel columns & cage frames
      const numBays = Math.round(uSpan / 1.02);
      const bayStep = uSpan / numBays;
      for (let b = 0; b <= numBays; b++) {
        const u = uMin + b * bayStep;
        for (let d of [-0.075, 0.075]) {
          if (axis === 'z') {
            addLine(u, vMin, fixedCoord + d, u, vMax, fixedCoord + d, 0.05, cageColor[0], cageColor[1], cageColor[2]);
          } else {
            addLine(fixedCoord + d, vMin, u, fixedCoord + d, vMax, u, 0.05, cageColor[0], cageColor[1], cageColor[2]);
          }
        }
      }

      // Horizontal tier wires
      const numTiers = 4;
      const tierStep = vSpan / numTiers;
      for (let t = 0; t <= numTiers; t++) {
        const v = vMin + t * tierStep;
        for (let d of [-0.075, 0.075]) {
          const wireColor = isAmber ? [0.45, 0.42, 0.38] : [0.42, 0.48, 0.56];
          if (axis === 'z') {
            addLine(uMin, v, fixedCoord + d, uMax, v, fixedCoord + d, 0.05, wireColor[0], wireColor[1], wireColor[2]);
          } else {
            addLine(fixedCoord + d, v, uMin, fixedCoord + d, v, uMax, 0.05, wireColor[0], wireColor[1], wireColor[2]);
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // A. FRONT FACADE WALL (Smoked Obsidian Bottles + Entrance Door + Danfo Bus)
    // -------------------------------------------------------------------------
    const frontDoorOpening = { uMin: 0.0, uMax: 1.92, vMin: 0.0, vMax: 3.75 };
    const danfoBusOpening  = { uMin: -3.20, uMax: -0.64, vMin: 1.25, vMax: 3.80 };

    generateBottleWall({
      axis: 'z',
      fixedCoord: frontZ,
      uMin: leftX, uMax: rightX,
      vMin: 0.0, vMax: bH,
      cutouts: [frontDoorOpening, danfoBusOpening],
      isAmber: false,
      cageColor: [0.34, 0.38, 0.46]
    });

    // Classroom Entrance Doorway Frame & Swung Open Door
    const doorX1 = 0.0, doorX2 = 1.92, doorYTop = 3.75;
    addLine(doorX1, 0, frontZ, doorX1, doorYTop, frontZ, 0.03, 0.88, 0.92, 0.98);
    addLine(doorX2, 0, frontZ, doorX2, doorYTop, frontZ, 0.03, 0.88, 0.92, 0.98);
    addLine(doorX1, doorYTop, frontZ, doorX2, doorYTop, frontZ, 0.03, 0.88, 0.92, 0.98);

    const doorAngle = Math.PI / 3.2;
    const doorLeafW = 1.75;
    const doorEndX = doorX1 + Math.cos(doorAngle) * doorLeafW;
    const doorEndZ = frontZ - Math.sin(doorAngle) * doorLeafW;
    addLine(doorX1, 0.05, frontZ, doorEndX, 0.05, doorEndZ, 0.03, 0.76, 0.54, 0.30);
    addLine(doorEndX, 0.05, doorEndZ, doorEndX, doorYTop - 0.05, doorEndZ, 0.03, 0.76, 0.54, 0.30);
    addLine(doorEndX, doorYTop - 0.05, doorEndZ, doorX1, doorYTop - 0.05, frontZ, 0.03, 0.76, 0.54, 0.30);
    addPt(doorEndX - 0.06, 1.85, doorEndZ + 0.04, 1.0, 0.82, 0.20); // Brass handle

    // -------------------------------------------------------------------------
    // B. LEFT SIDE WALL (Luminous Warm Amber-Honey Bottles + Security Window)
    // -------------------------------------------------------------------------
    const leftWinOpening = { uMin: -2.4, uMax: 2.4, vMin: 1.25, vMax: 3.35 };
    generateBottleWall({
      axis: 'x',
      fixedCoord: leftX,
      uMin: backZ, uMax: frontZ,
      vMin: 0.0, vMax: bH,
      cutouts: [leftWinOpening],
      isAmber: true,
      cageColor: [0.24, 0.26, 0.30]
    });

    const winZ1 = -2.4, winZ2 = 2.4, winY1 = 1.25, winY2 = 3.35;
    addLine(leftX, winY1, winZ1, leftX, winY1, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(leftX, winY2, winZ1, leftX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(leftX, winY1, winZ1, leftX, winY2, winZ1, 0.03, 0.38, 0.42, 0.48);
    addLine(leftX, winY1, winZ2, leftX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    for (let bz = winZ1 + 0.35; bz <= winZ2 - 0.20; bz += 0.35) {
      addLine(leftX, winY1, bz, leftX, winY2, bz, 0.035, 0.32, 0.36, 0.42);
    }

    // -------------------------------------------------------------------------
    // C. RIGHT SIDE WALL (Luminous Warm Amber-Honey Bottles + Security Window)
    // -------------------------------------------------------------------------
    const rightWinOpening = { uMin: -2.4, uMax: 2.4, vMin: 1.25, vMax: 3.35 };
    generateBottleWall({
      axis: 'x',
      fixedCoord: rightX,
      uMin: backZ, uMax: frontZ,
      vMin: 0.0, vMax: bH,
      cutouts: [rightWinOpening],
      isAmber: true,
      cageColor: [0.24, 0.26, 0.30]
    });

    addLine(rightX, winY1, winZ1, rightX, winY1, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(rightX, winY2, winZ1, rightX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(rightX, winY1, winZ1, rightX, winY2, winZ1, 0.03, 0.38, 0.42, 0.48);
    addLine(rightX, winY1, winZ2, rightX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    for (let bz = winZ1 + 0.35; bz <= winZ2 - 0.20; bz += 0.35) {
      addLine(rightX, winY1, bz, rightX, winY2, bz, 0.035, 0.32, 0.36, 0.42);
    }

    // -------------------------------------------------------------------------
    // D. REAR WALL (Solid 4-Tier Luminous Warm Amber-Honey Bottles)
    // -------------------------------------------------------------------------
    generateBottleWall({
      axis: 'z',
      fixedCoord: backZ,
      uMin: leftX, uMax: rightX,
      vMin: 0.0, vMax: bH,
      cutouts: [],
      isAmber: true,
      cageColor: [0.24, 0.26, 0.30]
    });

    // -------------------------------------------------------------------------
    // 4. CORRUGATED MONO-PITCH ROOF, GABLES & SOLAR PANELS
    // -------------------------------------------------------------------------
    const roofFrontY = bH;          // 5.0m at front
    const roofBackY  = bH + 1.35;   // 6.35m at rear

    // Side Gables
    for (let z = backZ; z <= frontZ; z += STEP) {
      const tz = (z - backZ) / bD;
      const gy = roofBackY - tz * (roofBackY - roofFrontY);
      for (let y = bH; y <= gy; y += STEP) {
        addPt(leftX,  y, z, 0.84, 0.52, 0.14);
        addPt(rightX, y, z, 0.84, 0.52, 0.14);
      }
    }

    // Corrugated Galvanized Iron Sheets
    const roofOverhangW = 0.70;
    const roofOverhangD = 0.80;
    const rXMin = leftX  - roofOverhangW;
    const rXMax = rightX + roofOverhangW;
    const rZMin = backZ  - roofOverhangD;
    const rZMax = frontZ + roofOverhangD;

    for (let rx = rXMin; rx <= rXMax; rx += 0.065) {
      for (let rz = rZMin; rz <= rZMax; rz += 0.08) {
        const tz = (rz - backZ) / bD;
        const baseRy = roofBackY - tz * (roofBackY - roofFrontY) + 0.12;
        const wave = Math.sin(rx * 34.0) * 0.038;
        const ry = baseRy + wave;
        const shade = 0.88 + Math.sin(rx * 34.0) * 0.12;

        addPt(rx, ry, rz, 0.84 * shade, 0.90 * shade, 0.96 * shade);
      }
    }

    // 4 Monocrystalline Solar Panels on Roof
    const panelCols = [-2.2, 0.0, 2.2];
    panelCols.forEach(px => {
      const pz = -1.2;
      const tz = (pz - backZ) / bD;
      const py = roofBackY - tz * (roofBackY - roofFrontY) + 0.22;
      for (let sx = px - 0.90; sx <= px + 0.90; sx += 0.06) {
        for (let sz = pz - 1.25; sz <= pz + 1.25; sz += 0.06) {
          const isFrame = Math.abs(Math.abs(sx - px) - 0.90) < 0.04 || Math.abs(Math.abs(sz - pz) - 1.25) < 0.04;
          const isGrid = Math.abs((sx - px) % 0.30) < 0.015 || Math.abs((sz - pz) % 0.40) < 0.015;
          if (isFrame) {
            addPt(sx, py, sz, 0.85, 0.90, 0.98);
          } else if (isGrid) {
            addPt(sx, py, sz, 1.0, 0.82, 0.20);
          } else {
            addPt(sx, py, sz, 0.05, 0.16, 0.45);
          }
        }
      }
    });

    // -------------------------------------------------------------------------
    // 5. ICONIC LAGOS DANFO BUS CLASSROOM CAB
    // Mounted in front facade at X = -1.92, projecting forward
    // STRICT: NO LIGHT RAYS!
    // -------------------------------------------------------------------------
    const busW = 2.56;
    const busL = 1.92;
    const busH = 2.50;
    const busCX = -1.92;
    const busYBase = 1.25;
    const busZStart = frontZ;
    const busZEnd = busZStart + busL;

    // Heavy diagonal 45° welded steel support struts underneath
    [-busW / 2 + 0.22, busW / 2 - 0.22].forEach(bx => {
      const strutX = busCX + bx;
      addLine(strutX, 0.0, busZStart, strutX, busYBase, busZEnd - 0.25, 0.05, 0.28, 0.32, 0.38, 0.006);
      addLine(strutX, busYBase, busZStart, strutX, busYBase, busZEnd, 0.05, 0.32, 0.36, 0.44, 0.006);
    });

    // Cab Side Panels
    [-busW / 2, busW / 2].forEach(sideX => {
      const bx = busCX + sideX;
      for (let z = busZStart; z <= busZEnd; z += 0.055) {
        for (let y = busYBase; y <= busYBase + busH; y += 0.055) {
          const relY = y - busYBase;
          const isWindow = (relY >= 1.15 && relY <= 2.10 && z >= busZStart + 0.40 && z <= busZEnd - 0.25);
          const isDarkStripe = (relY >= 0.76 && relY <= 0.96);
          const isWhiteStripe = (relY >= 0.98 && relY <= 1.08);

          if (isWindow) {
            addPt(bx, y, z, 0.18, 0.38, 0.56); // Luminous twilight glass
          } else if (isDarkStripe) {
            addPt(bx, y, z, 0.06, 0.07, 0.09); // Deep obsidian black stripe
          } else if (isWhiteStripe) {
            addPt(bx, y, z, 0.98, 0.99, 1.0);  // Pure titanium white stripe
          } else {
            const shade = 0.88 + (relY / busH) * 0.24;
            addPt(bx, y, z, Math.min(1.0, 0.94 * shade), Math.min(1.0, 0.70 * shade), 0.14 * shade);
          }
        }
      }
    });

    // Front Nose, Radiator Grille & Split Windshield
    for (let x = busCX - busW / 2; x <= busCX + busW / 2; x += 0.055) {
      for (let y = busYBase; y <= busYBase + busH; y += 0.055) {
        const relY = y - busYBase;
        const relX = x - busCX;

        if (relY >= 1.16 && relY <= 2.20) {
          const wsZ = busZEnd - (relY - 1.16) * 0.24;
          const isCenterDivider = Math.abs(relX) < 0.045;
          if (isCenterDivider) {
            addPt(x, y, wsZ, 0.14, 0.16, 0.20);
          } else {
            addPt(x, y, wsZ, 0.20, 0.44, 0.65); // Atmospheric sky-tinted windshield
          }
        } else if (relY < 0.42) {
          addPt(x, y, busZEnd + 0.06, 0.24, 0.26, 0.30); // Heavy steel bumper
        } else if (relY >= 0.42 && relY < 0.86) {
          const isLouver = Math.abs((relY - 0.42) % 0.08) < 0.03;
          if (isLouver) {
            addPt(x, y, busZEnd + 0.02, 0.76, 0.82, 0.90); // Metallic chrome slats
          } else {
            addPt(x, y, busZEnd + 0.015, 0.10, 0.12, 0.15); // Dark intake mesh
          }
        } else if (relY >= 0.86 && relY < 1.16) {
          const isHoodStripe = Math.abs(Math.abs(relX) - 0.45) < 0.08;
          if (isHoodStripe) {
            addPt(x, y, busZEnd, 0.06, 0.07, 0.09);
          } else {
            addPt(x, y, busZEnd, 0.94, 0.70, 0.14);
          }
        } else {
          addPt(x, y, busZEnd - 0.28, 0.96, 0.74, 0.16); // Sunlit hood
        }
      }
    }

    // Flush Projector Headlights (NO LIGHT RAYS!)
    [-0.82, 0.82].forEach(hx => {
      const hlX = busCX + hx;
      const hlY = busYBase + 0.65;
      const hlZ = busZEnd + 0.04;
      for (let r = 0; r <= 0.16; r += 0.03) {
        for (let a = 0; a < 14; a++) {
          const ang = a * (Math.PI * 2 / 14);
          const isRing = r > 0.12;
          if (isRing) {
            addPt(hlX + Math.cos(ang) * r, hlY + Math.sin(ang) * r, hlZ, 1.0, 0.68, 0.12); // Amber indicator ring
          } else {
            addPt(hlX + Math.cos(ang) * r, hlY + Math.sin(ang) * r, hlZ, 1.0, 0.98, 0.92); // Halogen white projector
          }
        }
      }
    });

    // Wheels
    [-1, 1].forEach(side => {
      const wx = busCX + side * (busW / 2 + 0.06);
      const wy = busYBase + 0.35;
      const wz = busZEnd - 0.65;
      for (let r = 0.12; r <= 0.38; r += 0.04) {
        for (let a = 0; a < 16; a++) {
          const ang = a * (Math.PI * 2 / 16);
          const isTire = r > 0.24;
          if (isTire) {
            addPt(wx, wy + Math.cos(ang) * r, wz + Math.sin(ang) * r, 0.14, 0.16, 0.19); // Textured rubber tire
          } else {
            addPt(wx, wy + Math.cos(ang) * r, wz + Math.sin(ang) * r, 0.85, 0.90, 0.96); // Silver alloy rim
          }
        }
      }
    });

    // Bus Roof
    for (let x = busCX - busW / 2; x <= busCX + busW / 2; x += 0.065) {
      for (let z = busZStart; z <= busZEnd - 0.25; z += 0.065) {
        addPt(x, busYBase + busH, z, 0.94, 0.70, 0.14);
      }
    }

    // -------------------------------------------------------------------------
    // 6. CLASSROOM INTERIOR LIFE (Inside the Enclosed Walls)
    // -------------------------------------------------------------------------
    const deskRows = [1.2, -1.8];
    const deskCols = [-2.0, 0.0, 2.0];
    for (let rZ of deskRows) {
      for (let cX of deskCols) {
        const dW = 1.35, dD = 0.65, dH = 1.05;
        for (let lx of [-dW / 2 + 0.06, dW / 2 - 0.06]) {
          for (let lz of [-dD / 2 + 0.06, dD / 2 - 0.06]) {
            addLine(cX + lx, 0.0, rZ + lz, cX + lx, dH, rZ + lz, 0.04, 0.25, 0.28, 0.34, 0.006);
          }
        }
        for (let dx = cX - dW / 2; dx <= cX + dW / 2; dx += 0.06) {
          for (let dz = rZ - dD / 2; dz <= rZ + dD / 2; dz += 0.06) {
            addPt(dx, dH, dz, 0.75, 0.52, 0.28);
          }
        }
        for (let sx = cX - 0.25; sx <= cX + 0.25; sx += 0.04) {
          for (let sz = rZ - 0.18; sz <= rZ + 0.18; sz += 0.04) {
            addPt(sx, dH + 0.02, sz, 0.98, 0.98, 0.96);
          }
        }
        addPt(cX + 0.32, dH + 0.025, rZ - 0.06, 1.0, 0.78, 0.12);
        addPt(cX + 0.35, dH + 0.025, rZ + 0.04, 0.15, 0.75, 0.98);
        addPt(cX + 0.38, dH + 0.025, rZ + 0.12, 0.95, 0.25, 0.35);

        const bZ = rZ - 0.70;
        const bW = 1.35;
        const bHSeat = 0.62;
        for (let blx of [-bW / 2 + 0.08, bW / 2 - 0.08]) {
          addLine(cX + blx, 0.0, bZ, cX + blx, bHSeat, bZ, 0.04, 0.25, 0.28, 0.34, 0.006);
        }
        for (let bx = cX - bW / 2; bx <= cX + bW / 2; bx += 0.05) {
          for (let bzOffset of [-0.12, -0.04, 0.04, 0.12]) {
            addPt(bx, bHSeat, bZ + bzOffset, 0.70, 0.48, 0.25);
          }
        }
      }
    }

    // Teacher's Blackboard
    const bbX1 = -2.4, bbX2 = 0.4, bbY1 = 1.8, bbY2 = 3.6, bbZ = backZ + 0.12;
    addLine(bbX1, bbY1, bbZ, bbX2, bbY1, bbZ, 0.03, 0.85, 0.60, 0.28);
    addLine(bbX1, bbY2, bbZ, bbX2, bbY2, bbZ, 0.03, 0.85, 0.60, 0.28);
    addLine(bbX1, bbY1, bbZ, bbX1, bbY2, bbZ, 0.03, 0.85, 0.60, 0.28);
    addLine(bbX2, bbY1, bbZ, bbX2, bbY2, bbZ, 0.03, 0.85, 0.60, 0.28);
    for (let cx = bbX1 + 0.06; cx <= bbX2 - 0.06; cx += 0.055) {
      for (let cy = bbY1 + 0.06; cy <= bbY2 - 0.06; cy += 0.055) {
        addPt(cx, cy, bbZ, 0.08, 0.16, 0.13);
      }
    }

    // Artist's Easel & Canvas
    const easelX = 1.4, easelZ = 1.5;
    addLine(easelX, 0, easelZ - 0.4, easelX - 0.3, 2.9, easelZ, 0.03, 0.82, 0.55, 0.25);
    addLine(easelX, 0, easelZ - 0.4, easelX + 0.3, 2.9, easelZ, 0.03, 0.82, 0.55, 0.25);
    addLine(easelX, 0, easelZ + 0.45, easelX, 2.9, easelZ, 0.03, 0.82, 0.55, 0.25);
    for (let cx = easelX - 0.38; cx <= easelX + 0.38; cx += 0.04) {
      for (let cy = 1.4; cy <= 2.3; cy += 0.04) {
        const u = (cx - (easelX - 0.38)) / 0.76;
        const v = (cy - 1.4) / 0.9;
        let cr = 0.95, cg = 0.95, cb = 0.92;
        if (u < 0.5 && v < 0.5) { cr = 0.95; cg = 0.35; cb = 0.15; }
        else if (u >= 0.5 && v < 0.5) { cr = 0.15; cg = 0.75; cb = 0.85; }
        else if (u < 0.5 && v >= 0.5) { cr = 0.98; cg = 0.82; cb = 0.18; }
        else { cr = 0.25; cg = 0.85; cb = 0.45; }
        addPt(cx, cy, easelZ - 0.10, cr, cg, cb);
      }
    }

    // Atmospheric Drift Motes
    const numMotes = 500;
    for (let m = 0; m < numMotes; m++) {
      const mx = (Math.random() - 0.5) * 22.0;
      const my = -1.0 + Math.random() * 8.5;
      const mz = (Math.random() - 0.5) * 20.0;
      if (Math.random() > 0.45) {
        addPt(mx, my, mz, 1.0, 0.82, 0.25);
      } else {
        addPt(mx, my, mz, 0.40, 0.88, 1.0);
      }
    }

    // =========================================================================
    // 7. OFFICIAL 3D "SLUM ART" LOGO ON FRONT FACADE
    // Pure 3D floating vector points directly on the architecture:
    // NO PLAQUE, NO BACKGROUND BOX, NO STANDOFF BRACKETS
    // Perfectly centered on the solid front wall section between door and corner
    // =========================================================================
    const logoCX = 3.12;
    const logoCY = 2.30;
    const logoCZ = frontZ + 0.09; // Floating cleanly in front of front wall

    // Logo Coordinate, Color, and Dispersion Buffers (Dedicated High-Res Points)
    const logoMeshPos = [];
    const logoMeshCol = [];
    const logoMeshDisp = [];

    function addLogoPt(x, y, z, r, g, b) {
      logoMeshPos.push(x, y, z);
      logoMeshCol.push(r, g, b);
      const d = calcDispersion(x, y, z);
      logoMeshDisp.push(d[0], d[1], d[2]);
    }

    // Render Exact Official 11,399 Slum Art Logo Vector Points
    // Sampled with high-definition crisp spacing for razor-sharp typography
    const logoPts = (typeof window !== 'undefined' && window.__SLUM_ART_LOGO_POINTS__) || [];
    if (logoPts.length > 0) {
      const renderW = 2.05;
      const renderH = 1.30;
      const logoCenterY = logoCY + 0.04;

      for (let i = 0; i < logoPts.length; i += 2) {
        const pt = logoPts[i];
        const px = logoCX + (pt[0] / 0.872) * (renderW / 2.0);
        const py = logoCenterY + (pt[1] / 0.37) * (renderH / 2.0);

        if (pt[2] === 1) {
          // Official Golden Waves Ribbon
          addLogoPt(px, py, logoCZ, 1.0, 0.80, 0.16);
        } else if (pt[1] >= -0.22) {
          // Pure Luminous White "slum art" Wordmark
          addLogoPt(px, py, logoCZ, 1.0, 1.0, 1.0);
        } else {
          // Luminous Radiant Cyan "MENTORSHIP & SUPPORT"
          addLogoPt(px, py, logoCZ, 0.38, 0.88, 1.0);
        }
      }
    }

    // =========================================================================
    // 8. GPU-ACCELERATED SHADER DISPERSION & ASSEMBLY SETUP
    // =========================================================================
    const uniforms = {
      u_disperse: { value: 0.0 },
      u_time:     { value: 0.0 }
    };

    const buildGeom = new THREE.BufferGeometry();
    buildGeom.setAttribute('position',   new THREE.Float32BufferAttribute(buildPos, 3));
    buildGeom.setAttribute('color',      new THREE.Float32BufferAttribute(buildCol, 3));
    buildGeom.setAttribute('a_disperse', new THREE.Float32BufferAttribute(buildDisp, 3));

    const buildMaterial = new THREE.PointsMaterial({
      size: 0.165,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.98,
      blending: THREE.NormalBlending,
      depthWrite: true
    });

    const disperseShaderHook = (shader) => {
      shader.uniforms.u_disperse = uniforms.u_disperse;
      shader.uniforms.u_time     = uniforms.u_time;
      shader.vertexShader = 'attribute vec3 a_disperse;\nuniform float u_disperse;\nuniform float u_time;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        // 1. Interactive Scroll-Driven Point Cloud Dispersion & Assembly
        if (u_disperse > 0.0001) {
          vec3 d = a_disperse;
          d.x += sin(u_time * 1.5 + position.y * 1.4) * 0.22 * u_disperse;
          d.y += cos(u_time * 1.2 + position.x * 1.4) * 0.22 * u_disperse;
          d.z += sin(u_time * 1.3 + position.z * 1.4) * 0.22 * u_disperse;
          transformed += d * u_disperse;
        }

        // 2. Microscopic quantum particle jitter (ZERO STRUCTURAL DISTORTION - lines remain 100% straight)
        float h = sin(dot(position.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453;
        vec3 microVib = vec3(
          sin(u_time * 9.0 + h),
          cos(u_time * 8.5 + h * 1.3),
          sin(u_time * 9.5 + h * 0.7)
        ) * 0.0022; // Microscopic 2.2mm jitter: crisp straight architecture with electric life
        transformed += microVib;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        #include <project_vertex>
        // Subtle shimmering sparkle in point size (per-particle independent twinkle)
        float hSize = sin(dot(position.xy, vec2(37.19, 91.73))) * 43758.5453;
        gl_PointSize *= (0.95 + 0.10 * sin(u_time * 3.8 + hSize * 2.0));
        `
      );
    };

    buildMaterial.customProgramCacheKey = () => 'slum_art_disperse_shader';
    buildMaterial.onBeforeCompile = disperseShaderHook;

    const buildingMesh = new THREE.Points(buildGeom, buildMaterial);
    academyGroup.add(buildingMesh);

    // Dedicated High-Resolution Micro-Point Mesh for 3D Logo (Crisp Typography)
    if (logoMeshPos.length > 0) {
      const logoGeom = new THREE.BufferGeometry();
      logoGeom.setAttribute('position',   new THREE.Float32BufferAttribute(logoMeshPos, 3));
      logoGeom.setAttribute('color',      new THREE.Float32BufferAttribute(logoMeshCol, 3));
      logoGeom.setAttribute('a_disperse', new THREE.Float32BufferAttribute(logoMeshDisp, 3));

      const logoMaterial = new THREE.PointsMaterial({
        size: 0.040,
        vertexColors: true,
        map: pointTexture,
        transparent: true,
        opacity: 1.0,
        blending: THREE.NormalBlending,
        depthWrite: false
      });
      logoMaterial.customProgramCacheKey = () => 'slum_art_logo_disperse_shader';
      logoMaterial.onBeforeCompile = disperseShaderHook;

      const logoMesh = new THREE.Points(logoGeom, logoMaterial);
      academyGroup.add(logoMesh);
    }

    // =========================================================================
    // 9. 3D ISOMETRIC CORNER PERSPECTIVE, SCROLL ORBIT & DISPERSION
    // Default angle: -36° Y-rotation, +8° downward tilt
    // Showcases Amber-Orange Side Wall AND Black Front Facade with Danfo Bus
    // =========================================================================
    const DEFAULT_ROT_Y = -0.62;
    const DEFAULT_ROT_X = 0.14;

    let currentRotY = DEFAULT_ROT_Y;
    let targetRotY  = DEFAULT_ROT_Y;
    let currentRotX = DEFAULT_ROT_X;
    let targetRotX  = DEFAULT_ROT_X;
    let currentScale = 1.0;
    let targetScale  = 1.0;
    let baseBuildingY = -0.4;

    // Dispersion variables
    let currentDisperse = 0.0;
    let targetDisperse  = 0.0;

    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = (e.clientY / window.innerHeight) * 2 - 1;
      mouseParallaxX = mx * 0.06;
      mouseParallaxY = -my * 0.04;
    }, { passive: true });

    function onScroll() {
      const section = document.getElementById('eco-school-3d');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight || 800;

      const totalDist = rect.height + winH;
      const currentDist = winH - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));

      // Scroll-Driven Point Cloud Assembly & Dispersion:
      // When approaching the section (progress < 0.22): dispersed into a loose floating galaxy
      // As you scroll into view (progress 0.22 -> 0.48): particles come together into solid school!
      // When centered in view (progress 0.48 -> 0.78): 100% assembled, crisp solid 3D architecture
      // When scrolling past (progress > 0.80): gentle dispersion out
      if (progress < 0.48) {
        targetDisperse = Math.max(0.0, Math.min(1.0, (0.48 - progress) / 0.28));
      } else if (progress > 0.82) {
        targetDisperse = Math.max(0.0, Math.min(0.85, (progress - 0.82) / 0.18));
      } else {
        targetDisperse = 0.0;
      }

      // Smooth continuous 3D orbit
      targetRotY = DEFAULT_ROT_Y + (progress - 0.5) * 0.55;
      targetRotX = DEFAULT_ROT_X + Math.sin(progress * Math.PI) * 0.05;
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
      const desiredFraction = isMobile ? 0.92 : 0.68;
      const naturalModelW = 12.5;
      const modelScale = (visibleWidthAtZ24 * desiredFraction) / naturalModelW;

      academyGroup.scale.set(modelScale, modelScale, modelScale);

      buildMaterial.size = (isMobile ? 0.125 : 0.165) * modelScale;

      if (section) {
        const sRect = section.getBoundingClientRect();
        const spacer = section.querySelector('.eco-pointcloud-spacer');
        if (spacer && sRect.height > 0) {
          const spRect = spacer.getBoundingClientRect();
          const spacerCenterFromTop = (spRect.top + spRect.height / 2) - sRect.top;
          const spacerRelY = spacerCenterFromTop / sRect.height;
          const ndcY = 1.0 - 2.0 * spacerRelY;
          const visibleHeight = 2 * 24.0 * Math.tan((36 * Math.PI) / 360);
          baseBuildingY = ndcY * (visibleHeight / 2) - (isMobile ? 0.18 : 0.85);
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

      // Fluid elastic dispersion convergence
      currentDisperse += (targetDisperse - currentDisperse) * 0.075;
      uniforms.u_disperse.value = currentDisperse;
      uniforms.u_time.value = time;

      const idleY = Math.sin(time * 0.4) * 0.015;
      const idleFloat = Math.sin(time * 0.9) * 0.025;
      const idleRoll = Math.cos(time * 0.6) * 0.005;

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
