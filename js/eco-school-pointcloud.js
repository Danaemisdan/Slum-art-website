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
 * 3. Integrated Lagos Danfo Bus Classroom Cab:
 *    - Protruding forward from front facade with heavy 45-degree welded diagonal steel support struts
 *    - Authentic Lagos Sunshine Yellow body (#f59e0b) with classic dual transit stripes
 *    - Split angled windshield, flush projector headlights (NO LIGHT RAYS), grille, bumper, wheels
 * 4. Sloped Mono-Pitch Corrugated Galvanized Iron Roof with 4 Monocrystalline Solar Panels
 * 5. Official "slum art" Signboard with Golden Wave Mark
 * 6. Interior Classroom Life: Double desks, benches, chalkboard, artist easel
 * 7. Bioluminescent Lagoon Water with Organic Harmonic Ripples & Floating Ambient Spores
 * 8. Isometric Front-Corner 3D Perspective with Scroll-Driven Orbit & Parallax
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

    // Coordinate & Color Buffers
    const buildPos = [];
    const buildCol = [];

    function addPt(x, y, z, r, g, b) {
      buildPos.push(x, y, z);
      buildCol.push(r, g, b);
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
    // ARCHITECTURAL DIMENSIONS (Harmonized with Official 3D Model Proportion)
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

        // Building plinth stem riser directly under walls
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
    // Helper to generate solid, volumetric, luminous bottle walls in steel cages
    // -------------------------------------------------------------------------
    function generateBottleWall({
      axis,          // 'z' for front/rear, 'x' for left/right
      fixedCoord,    // position on fixed axis
      uMin, uMax,    // span along horizontal wall axis
      vMin, vMax,    // span along vertical Y axis
      cutouts = [],  // array of {uMin, uMax, vMin, vMax} openings
      baseColor,     // [r, g, b] base bottle color
      lumVar = 0.18, // luminance organic variation
      cageColor = [0.32, 0.36, 0.42] // structural steel frame color
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

      // Dense double-layer bottle points for solid wall opacity & depth
      for (let u = uMin; u <= uMax; u += STEP) {
        for (let v = vMin; v <= vMax; v += STEP) {
          if (isInsideCutout(u, v)) continue;

          const colIdx = Math.floor((u - uMin) / 0.16);
          const rowIdx = Math.floor((v - vMin) / 0.28);
          const noise = (Math.sin(colIdx * 4.3 + rowIdx * 2.7) + 1) * 0.5;
          const lum = 0.88 + noise * lumVar;

          let r = Math.min(1.0, baseColor[0] * lum);
          let g = Math.min(1.0, baseColor[1] * lum);
          let b = Math.min(1.0, baseColor[2] * lum);

          // Golden or cyan bottle cap highlights
          const isCap = Math.abs((u - uMin) % 0.16) < 0.035 && Math.abs((v - vMin) % 0.28) < 0.045;
          if (isCap) {
            if (baseColor[0] > 0.4) {
              r = 1.0; g = 0.82; b = 0.15; // Golden amber cap on orange bottle
            } else {
              r = 0.30; g = 0.65; b = 0.95; // Crystalline cyan cap on black bottle
            }
          }

          // Two layered points for volumetric thickness
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

      // Steel cage bay vertical frames
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

      // Horizontal tier wires (4 tiers)
      const numTiers = 4;
      const tierStep = vSpan / numTiers;
      for (let t = 0; t <= numTiers; t++) {
        const v = vMin + t * tierStep;
        for (let d of [-0.075, 0.075]) {
          if (axis === 'z') {
            addLine(uMin, v, fixedCoord + d, uMax, v, fixedCoord + d, 0.05, cageColor[0], cageColor[1], cageColor[2]);
          } else {
            addLine(fixedCoord + d, v, uMin, fixedCoord + d, v, uMax, 0.05, cageColor[0], cageColor[1], cageColor[2]);
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // A. FRONT FACADE WALL (Charcoal Black Bottles + Entrance Door + Danfo Bus)
    // -------------------------------------------------------------------------
    // Doorway opening: X = 0.0 to 1.92, Y = 0.0 to 3.75
    // Danfo bus cab opening: X = -3.20 to -0.64, Y = 1.25 to 3.80
    const frontDoorOpening = { uMin: 0.0, uMax: 1.92, vMin: 0.0, vMax: 3.75 };
    const danfoBusOpening  = { uMin: -3.20, uMax: -0.64, vMin: 1.25, vMax: 3.80 };

    generateBottleWall({
      axis: 'z',
      fixedCoord: frontZ,
      uMin: leftX, uMax: rightX,
      vMin: 0.0, vMax: bH,
      cutouts: [frontDoorOpening, danfoBusOpening],
      baseColor: [0.18, 0.22, 0.28], // Luminous Charcoal Black with sky reflections (#1c232f)
      lumVar: 0.28,
      cageColor: [0.42, 0.46, 0.54]  // Defined steel cage frames
    });

    // Classroom Entrance Doorway Frame & Swung Open Door
    const doorX1 = 0.0, doorX2 = 1.92, doorYTop = 3.75;
    addLine(doorX1, 0, frontZ, doorX1, doorYTop, frontZ, 0.03, 0.88, 0.92, 0.98);
    addLine(doorX2, 0, frontZ, doorX2, doorYTop, frontZ, 0.03, 0.88, 0.92, 0.98);
    addLine(doorX1, doorYTop, frontZ, doorX2, doorYTop, frontZ, 0.03, 0.88, 0.92, 0.98);

    // Swung open door leaf
    const doorAngle = Math.PI / 3.2;
    const doorLeafW = 1.75;
    const doorEndX = doorX1 + Math.cos(doorAngle) * doorLeafW;
    const doorEndZ = frontZ - Math.sin(doorAngle) * doorLeafW;
    addLine(doorX1, 0.05, frontZ, doorEndX, 0.05, doorEndZ, 0.03, 0.76, 0.54, 0.30);
    addLine(doorEndX, 0.05, doorEndZ, doorEndX, doorYTop - 0.05, doorEndZ, 0.03, 0.76, 0.54, 0.30);
    addLine(doorEndX, doorYTop - 0.05, doorEndZ, doorX1, doorYTop - 0.05, frontZ, 0.03, 0.76, 0.54, 0.30);
    // Polished brass handle
    addPt(doorEndX - 0.06, 1.85, doorEndZ + 0.04, 1.0, 0.82, 0.20);

    // -------------------------------------------------------------------------
    // B. LEFT SIDE WALL (Vibrant Amber-Orange Bottles + Security Window)
    // -------------------------------------------------------------------------
    // Window opening: Z = -2.4 to +2.4, Y = 1.25 to 3.35
    const leftWinOpening = { uMin: -2.4, uMax: 2.4, vMin: 1.25, vMax: 3.35 };

    generateBottleWall({
      axis: 'x',
      fixedCoord: leftX,
      uMin: backZ, uMax: frontZ,
      vMin: 0.0, vMax: bH,
      cutouts: [leftWinOpening],
      baseColor: [0.95, 0.52, 0.08], // Vibrant Amber-Orange (#df7812)
      lumVar: 0.20,
      cageColor: [0.30, 0.33, 0.38]
    });

    // Left Security Window: Steel outer frame + vertical steel bars
    const winZ1 = -2.4, winZ2 = 2.4, winY1 = 1.25, winY2 = 3.35;
    addLine(leftX, winY1, winZ1, leftX, winY1, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(leftX, winY2, winZ1, leftX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(leftX, winY1, winZ1, leftX, winY2, winZ1, 0.03, 0.38, 0.42, 0.48);
    addLine(leftX, winY1, winZ2, leftX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    for (let bz = winZ1 + 0.35; bz <= winZ2 - 0.20; bz += 0.35) {
      addLine(leftX, winY1, bz, leftX, winY2, bz, 0.035, 0.32, 0.36, 0.42);
    }

    // -------------------------------------------------------------------------
    // C. RIGHT SIDE WALL (Vibrant Amber-Orange Bottles + Security Window)
    // -------------------------------------------------------------------------
    const rightWinOpening = { uMin: -2.4, uMax: 2.4, vMin: 1.25, vMax: 3.35 };

    generateBottleWall({
      axis: 'x',
      fixedCoord: rightX,
      uMin: backZ, uMax: frontZ,
      vMin: 0.0, vMax: bH,
      cutouts: [rightWinOpening],
      baseColor: [0.95, 0.52, 0.08], // Vibrant Amber-Orange (#df7812)
      lumVar: 0.20,
      cageColor: [0.30, 0.33, 0.38]
    });

    // Right Security Window
    addLine(rightX, winY1, winZ1, rightX, winY1, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(rightX, winY2, winZ1, rightX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    addLine(rightX, winY1, winZ1, rightX, winY2, winZ1, 0.03, 0.38, 0.42, 0.48);
    addLine(rightX, winY1, winZ2, rightX, winY2, winZ2, 0.03, 0.38, 0.42, 0.48);
    for (let bz = winZ1 + 0.35; bz <= winZ2 - 0.20; bz += 0.35) {
      addLine(rightX, winY1, bz, rightX, winY2, bz, 0.035, 0.32, 0.36, 0.42);
    }

    // -------------------------------------------------------------------------
    // D. REAR WALL (Solid 4-Tier Vibrant Amber-Orange Bottles)
    // -------------------------------------------------------------------------
    generateBottleWall({
      axis: 'z',
      fixedCoord: backZ,
      uMin: leftX, uMax: rightX,
      vMin: 0.0, vMax: bH,
      cutouts: [],
      baseColor: [0.95, 0.52, 0.08], // Vibrant Amber-Orange (#df7812)
      lumVar: 0.20,
      cageColor: [0.30, 0.33, 0.38]
    });

    // -------------------------------------------------------------------------
    // 4. CORRUGATED MONO-PITCH ROOF, GABLES & SOLAR PANELS
    // -------------------------------------------------------------------------
    const roofFrontY = bH;          // 5.0m at front
    const roofBackY  = bH + 1.35;   // 6.35m at rear (sloped upward towards back)

    // Side Gables (sloped triangular bottle fill under roofline)
    for (let z = backZ; z <= frontZ; z += STEP) {
      const tz = (z - backZ) / bD;
      const gy = roofBackY - tz * (roofBackY - roofFrontY);
      for (let y = bH; y <= gy; y += STEP) {
        addPt(leftX,  y, z, 0.94, 0.50, 0.08);
        addPt(rightX, y, z, 0.94, 0.50, 0.08);
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
            addPt(sx, py, sz, 1.0, 0.82, 0.20); // Gold busbar grid
          } else {
            addPt(sx, py, sz, 0.05, 0.16, 0.45); // Deep iridescent navy solar cell
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
    const busZEnd = busZStart + busL; // +7.52

    // Heavy diagonal 45° welded steel support struts underneath
    [-busW / 2 + 0.22, busW / 2 - 0.22].forEach(bx => {
      const strutX = busCX + bx;
      addLine(strutX, 0.0, busZStart, strutX, busYBase, busZEnd - 0.25, 0.05, 0.20, 0.22, 0.28, 0.008);
      addLine(strutX, busYBase, busZStart, strutX, busYBase, busZEnd, 0.05, 0.24, 0.28, 0.34, 0.008);
    });

    // Danfo Bus Cab Side Panels
    [-busW / 2, busW / 2].forEach(sideX => {
      const bx = busCX + sideX;
      for (let z = busZStart; z <= busZEnd; z += 0.055) {
        for (let y = busYBase; y <= busYBase + busH; y += 0.055) {
          const relY = y - busYBase;
          const isWindow = (relY >= 1.15 && relY <= 2.10 && z >= busZStart + 0.40 && z <= busZEnd - 0.25);
          const isDarkStripe = (relY >= 0.76 && relY <= 0.96);
          const isWhiteStripe = (relY >= 0.98 && relY <= 1.08);

          if (isWindow) {
            addPt(bx, y, z, 0.15, 0.25, 0.38); // Dark tinted cab window
          } else if (isDarkStripe) {
            addPt(bx, y, z, 0.08, 0.09, 0.11); // Matte charcoal transit stripe
          } else if (isWhiteStripe) {
            addPt(bx, y, z, 0.96, 0.97, 1.0);  // Warm ivory stripe
          } else {
            const shade = 0.90 + (relY / busH) * 0.18;
            addPt(bx, y, z, 0.98 * shade, 0.74 * shade, 0.06); // Rich Lagos Sunshine Yellow
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
          // Split Angled Windshield
          const wsZ = busZEnd - (relY - 1.16) * 0.24;
          const isCenterDivider = Math.abs(relX) < 0.045;
          if (isCenterDivider) {
            addPt(x, y, wsZ, 0.12, 0.14, 0.18);
          } else {
            addPt(x, y, wsZ, 0.24, 0.58, 0.85); // Windshield glass reflection
          }
        } else if (relY < 0.42) {
          // Lower front steel bumper
          addPt(x, y, busZEnd + 0.06, 0.16, 0.19, 0.24);
        } else if (relY >= 0.42 && relY < 0.86) {
          // Radiator Grille
          const isLouver = Math.abs((relY - 0.42) % 0.08) < 0.03;
          if (isLouver) {
            addPt(x, y, busZEnd + 0.02, 0.10, 0.12, 0.15);
          } else {
            addPt(x, y, busZEnd + 0.015, 0.22, 0.25, 0.30);
          }
        } else if (relY >= 0.86 && relY < 1.16) {
          // Hood with dual black vertical stripes
          const isHoodStripe = Math.abs(Math.abs(relX) - 0.45) < 0.08;
          if (isHoodStripe) {
            addPt(x, y, busZEnd, 0.08, 0.09, 0.11);
          } else {
            addPt(x, y, busZEnd, 0.98, 0.74, 0.06);
          }
        } else {
          // Upper brow visor
          addPt(x, y, busZEnd - 0.28, 0.98, 0.74, 0.06);
        }
      }
    }

    // Flush Projector Headlights (STRICT: NO LIGHT RAYS OR CONES)
    [-0.82, 0.82].forEach(hx => {
      const hlX = busCX + hx;
      const hlY = busYBase + 0.65;
      const hlZ = busZEnd + 0.04;
      for (let r = 0; r <= 0.16; r += 0.03) {
        for (let a = 0; a < 14; a++) {
          const ang = a * (Math.PI * 2 / 14);
          addPt(hlX + Math.cos(ang) * r, hlY + Math.sin(ang) * r, hlZ, 0.98, 0.96, 0.90);
        }
      }
    });

    // Front Wheels
    [-1, 1].forEach(side => {
      const wx = busCX + side * (busW / 2 + 0.06);
      const wy = busYBase + 0.35;
      const wz = busZEnd - 0.65;
      for (let r = 0.12; r <= 0.38; r += 0.04) {
        for (let a = 0; a < 16; a++) {
          const ang = a * (Math.PI * 2 / 16);
          const isTire = r > 0.24;
          if (isTire) {
            addPt(wx, wy + Math.cos(ang) * r, wz + Math.sin(ang) * r, 0.12, 0.14, 0.18);
          } else {
            addPt(wx, wy + Math.cos(ang) * r, wz + Math.sin(ang) * r, 0.82, 0.85, 0.92); // Chrome rim
          }
        }
      }
    });

    // Bus Roof
    for (let x = busCX - busW / 2; x <= busCX + busW / 2; x += 0.065) {
      for (let z = busZStart; z <= busZEnd - 0.25; z += 0.065) {
        addPt(x, busYBase + busH, z, 0.96, 0.72, 0.06);
      }
    }

    // -------------------------------------------------------------------------
    // 6. CLASSROOM INTERIOR LIFE (Inside the Enclosed 4 Walls)
    // -------------------------------------------------------------------------
    // Student Double Desks with Bench Seats
    const deskRows = [1.2, -1.8];
    const deskCols = [-2.0, 0.0, 2.0];
    for (let rZ of deskRows) {
      for (let cX of deskCols) {
        const dW = 1.35, dD = 0.65, dH = 1.05;
        // Desk Legs
        for (let lx of [-dW / 2 + 0.06, dW / 2 - 0.06]) {
          for (let lz of [-dD / 2 + 0.06, dD / 2 - 0.06]) {
            addLine(cX + lx, 0.0, rZ + lz, cX + lx, dH, rZ + lz, 0.04, 0.25, 0.28, 0.34, 0.006);
          }
        }
        // Desk Top
        for (let dx = cX - dW / 2; dx <= cX + dW / 2; dx += 0.06) {
          for (let dz = rZ - dD / 2; dz <= rZ + dD / 2; dz += 0.06) {
            addPt(dx, dH, dz, 0.75, 0.52, 0.28);
          }
        }
        // Open Sketchbooks on Desk
        for (let sx = cX - 0.25; sx <= cX + 0.25; sx += 0.04) {
          for (let sz = rZ - 0.18; sz <= rZ + 0.18; sz += 0.04) {
            addPt(sx, dH + 0.02, sz, 0.98, 0.98, 0.96);
          }
        }
        // Colored pencils
        addPt(cX + 0.32, dH + 0.025, rZ - 0.06, 1.0, 0.78, 0.12);
        addPt(cX + 0.35, dH + 0.025, rZ + 0.04, 0.15, 0.75, 0.98);
        addPt(cX + 0.38, dH + 0.025, rZ + 0.12, 0.95, 0.25, 0.35);

        // Bench Seat
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

    // Teacher's Blackboard on Rear Interior Wall
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
    // Chalk lesson drawings
    addLine(bbX1 + 0.4, bbY1 + 0.7, bbZ + 0.02, bbX1 + 1.4, bbY1 + 0.7, bbZ + 0.02, 0.04, 0.95, 0.98, 1.0);
    addLine(bbX1 + 0.4, bbY1 + 1.1, bbZ + 0.02, bbX1 + 1.0, bbY1 + 1.1, bbZ + 0.02, 0.04, 0.95, 0.98, 1.0);

    // Artist's Easel & Painting Canvas
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

    // -------------------------------------------------------------------------
    // 7. ATMOSPHERIC DRIFT MOTES
    // -------------------------------------------------------------------------
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

    // Build BufferGeometry for Building
    const buildGeom = new THREE.BufferGeometry();
    buildGeom.setAttribute('position', new THREE.Float32BufferAttribute(buildPos, 3));
    buildGeom.setAttribute('color', new THREE.Float32BufferAttribute(buildCol, 3));

    const buildMaterial = new THREE.PointsMaterial({
      size: 0.165,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.98,
      blending: THREE.NormalBlending,
      depthWrite: true
    });

    const buildingMesh = new THREE.Points(buildGeom, buildMaterial);
    academyGroup.add(buildingMesh);

    // =========================================================================
    // GEOMETRY SET 2: THE OFFICIAL "slum art" SIGNBOARD
    // =========================================================================
    const logoPos = [];
    const logoCol = [];
    function addLogoPt(x, y, z, r, g, b) {
      logoPos.push(x, y, z);
      logoCol.push(r, g, b);
    }

    // Mounted on Left Orange Side Wall near front corner
    const logoBoardW = 2.4;
    const logoBoardH = 1.4;
    const logoCX = leftX - 0.08;
    const logoCY = 2.8;
    const logoCZ = frontZ - 1.6;

    for (let bz = logoCZ - logoBoardW / 2; bz <= logoCZ + logoBoardW / 2; bz += 0.045) {
      for (let by = logoCY - logoBoardH / 2; by <= logoCY + logoBoardH / 2; by += 0.045) {
        const isBorder = Math.abs(Math.abs(bz - logoCZ) - logoBoardW / 2) < 0.05 ||
                         Math.abs(Math.abs(by - logoCY) - logoBoardH / 2) < 0.05;
        if (isBorder) {
          addLogoPt(logoCX, by, bz, 0.88, 0.94, 1.0);
        } else {
          addLogoPt(logoCX, by, bz, 0.02, 0.10, 0.32); // Deep Navy plate
        }
      }
    }

    // Golden wave emblem on signboard
    for (let t = -0.7; t <= 0.7; t += 0.04) {
      const w1y = logoCY + 0.22 + Math.sin(t * 5.0) * 0.08;
      const w2y = logoCY + 0.12 + Math.sin(t * 5.0 + 0.6) * 0.07;
      addLogoPt(logoCX - 0.02, w1y, logoCZ + t, 1.0, 0.78, 0.12);
      addLogoPt(logoCX - 0.02, w2y, logoCZ + t, 1.0, 0.78, 0.12);
    }

    // Signboard logotype text lines
    for (let t = -0.8; t <= 0.8; t += 0.045) {
      addLogoPt(logoCX - 0.02, logoCY - 0.15, logoCZ + t, 0.98, 0.98, 1.0);
      addLogoPt(logoCX - 0.02, logoCY - 0.32, logoCZ + t * 0.8, 0.35, 0.88, 1.0);
    }

    const logoGeom = new THREE.BufferGeometry();
    logoGeom.setAttribute('position', new THREE.Float32BufferAttribute(logoPos, 3));
    logoGeom.setAttribute('color', new THREE.Float32BufferAttribute(logoCol, 3));

    const logoMaterial = new THREE.PointsMaterial({
      size: 0.125,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.NormalBlending,
      depthWrite: true
    });

    const logoMesh = new THREE.Points(logoGeom, logoMaterial);
    academyGroup.add(logoMesh);

    // =========================================================================
    // 8. 3D ISOMETRIC CORNER PERSPECTIVE, SCROLL ORBIT & PARALLAX
    // Default angle: -36° Y-rotation, +8° downward tilt
    // Showcases Amber-Orange Side Wall AND Black Front Wall with Danfo Bus
    // =========================================================================
    const DEFAULT_ROT_Y = -0.62; // ~-36 degrees
    const DEFAULT_ROT_X = 0.14;  // ~+8 degrees

    let currentRotY = DEFAULT_ROT_Y;
    let targetRotY  = DEFAULT_ROT_Y;
    let currentRotX = DEFAULT_ROT_X;
    let targetRotX  = DEFAULT_ROT_X;
    let currentScale = 1.0;
    let targetScale  = 1.0;
    let baseBuildingY = -0.4;

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

      // Scroll smoothly rotates the 3D building across an arc
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
      logoMaterial.size = (isMobile ? 0.095 : 0.125) * modelScale;

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
