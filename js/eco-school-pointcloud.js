/**
 * Slum Art Foundation - 3D Eco-Bottle Academy Point Cloud Architecture
 * High-Resolution Point Cloud: Features the exact official "slum art" logo
 * rendered in 11,000+ razor-sharp luminous points on the academy facade,
 * wire-mesh gabion bottle walls, yellow Danfo bus classroom & solar canopy.
 * Rendered directly on the section page background behind typography.
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
    const camera = new THREE.PerspectiveCamera(38, dims.w / dims.h, 0.1, 200);
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

    // 2. High-Quality Circular Bokeh Point Sprite
    function createPointTexture() {
      const size = 64;
      const cvs = document.createElement('canvas');
      cvs.width = size;
      cvs.height = size;
      const ctx = cvs.getContext('2d');

      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.70, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(0.95, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(cvs);
      texture.needsUpdate = true;
      return texture;
    }

    const pointTexture = createPointTexture();

    // 3. Parent Group for Academy Structure (allows unified scaling & rotation)
    const academyGroup = new THREE.Group();
    scene.add(academyGroup);

    // --- GEOMETRY SET 1: Building Architecture & Landscape ---
    const buildPos = [];
    const buildCol = [];
    function addBuildPoint(x, y, z, r, g, b) {
      buildPos.push(x, y, z);
      buildCol.push(r, g, b);
    }

    const bW = 9.4;  // building width
    const bD = 6.2;  // building depth
    const bH = 3.6;  // building wall height

    // A. Floating Timber Pontoon Deck & Lagoon Stilts
    const deckW = 12.4;
    const deckD = 9.8;
    for (let x = -deckW / 2; x <= deckW / 2; x += 0.20) {
      for (let z = -deckD / 2; z <= deckD / 2 + 0.8; z += 0.20) {
        const jitter = (Math.random() - 0.5) * 0.02;
        const isPlankLine = Math.abs(x % 0.8) < 0.06;
        const br = isPlankLine ? 0.35 : (0.62 + Math.random() * 0.08);
        const bg = isPlankLine ? 0.20 : (0.38 + Math.random() * 0.06);
        const bb = isPlankLine ? 0.10 : (0.16 + Math.random() * 0.04);
        addBuildPoint(x, -0.45 + jitter, z, br, bg, bb);

        if (Math.random() > 0.45) {
          addBuildPoint(x, -0.75 + jitter, z, br * 0.6, bg * 0.6, bb * 0.6);
        }
      }
    }

    // Foundation Stilts (Mangrove pilings)
    for (let px of [-5.0, -1.8, 1.8, 5.0]) {
      for (let pz of [-3.8, 0, 3.8, 4.8]) {
        for (let py = -0.45; py >= -2.4; py -= 0.14) {
          for (let a = 0; a < 6; a++) {
            const ang = a * (Math.PI * 2 / 6);
            addBuildPoint(px + Math.cos(ang) * 0.16, py, pz + Math.sin(ang) * 0.16, 0.32, 0.18, 0.09);
          }
        }
      }
    }

    // B. Authentic Wire-Mesh Gabion PET Bottle Walls
    // B1. Side Walls
    for (let wallX of [-bW / 2, bW / 2]) {
      for (let y = 0; y <= bH; y += 0.16) {
        for (let z = -bD / 2; z <= bD / 2; z += 0.16) {
          // Window openings
          if (y >= 1.2 && y <= 2.6 && z >= -1.4 && z <= 1.4) {
            if (Math.abs(y - 1.2) < 0.12 || Math.abs(y - 2.6) < 0.12 || Math.abs(z - -1.4) < 0.12 || Math.abs(z - 1.4) < 0.12) {
              addBuildPoint(wallX, y, z, 0.90, 0.92, 0.95);
            }
            continue;
          }

          // Metal wire mesh grid
          const isGridWire = (Math.abs(y % 0.6) < 0.06) || (Math.abs(z % 0.6) < 0.06);
          if (isGridWire) {
            addBuildPoint(wallX, y, z, 0.36, 0.42, 0.52);
          }

          // PET bottle ring
          for (let a = 0; a < 3; a++) {
            const ang = a * (Math.PI * 2 / 3);
            const r = 0.07;
            const px = wallX + Math.sin(ang) * r;
            const pz = z + Math.cos(ang) * r;
            const isHighlight = Math.random() > 0.85;
            let cr = 0.28, cg = 0.76, cb = 0.92;
            if (isHighlight) { cr = 0.90; cg = 0.96; cb = 1.0; }
            addBuildPoint(px, y, pz, cr, cg, cb);
          }

          // Bottle Caps
          if (Math.abs(y % 0.48) < 0.06) {
            const capDir = wallX > 0 ? 1 : -1;
            const capHue = Math.abs(z % 0.36);
            let capR = 0.98, capG = 0.60, capB = 0.08;
            if (capHue < 0.12) { capR = 0.92; capG = 0.18; capB = 0.18; }
            else if (capHue > 0.24) { capR = 0.98; capG = 0.98; capB = 0.98; }
            addBuildPoint(wallX + capDir * 0.10, y, z, capR, capG, capB);
          }
        }
      }
    }

    // B2. Back Wall
    const backZ = -bD / 2;
    for (let y = 0; y <= bH; y += 0.16) {
      for (let x = -bW / 2; x <= bW / 2; x += 0.16) {
        const isGridWire = (Math.abs(y % 0.6) < 0.06) || (Math.abs(x % 0.6) < 0.06);
        if (isGridWire) addBuildPoint(x, y, backZ, 0.36, 0.42, 0.52);
        for (let a = 0; a < 3; a++) {
          const ang = a * (Math.PI * 2 / 3);
          const r = 0.07;
          addBuildPoint(x + Math.sin(ang) * r, y, backZ + Math.cos(ang) * r, 0.22, 0.68, 0.85);
        }
      }
    }

    // B3. Front Wall with Danfo Opening & Main Entrance
    const frontZ = bD / 2;
    for (let y = 0; y <= bH; y += 0.15) {
      for (let x = -bW / 2; x <= bW / 2; x += 0.15) {
        // Danfo Bus Classroom Bay
        if (x >= 1.2 && x <= 4.2 && y <= 2.8) continue;
        // Main Entrance Doorway
        if (x >= -0.7 && x <= 0.7 && y <= 2.5) {
          if (Math.abs(y - 2.5) < 0.12 || Math.abs(x - -0.7) < 0.12 || Math.abs(x - 0.7) < 0.12) {
            addBuildPoint(x, y, frontZ + 0.02, 0.92, 0.92, 0.95);
          }
          continue;
        }

        const isGridWire = (Math.abs(y % 0.6) < 0.06) || (Math.abs(x % 0.6) < 0.06);
        if (isGridWire) addBuildPoint(x, y, frontZ, 0.36, 0.42, 0.52);

        for (let a = 0; a < 3; a++) {
          const ang = a * (Math.PI * 2 / 3);
          const r = 0.07;
          const px = x + Math.cos(ang) * r;
          const pz = frontZ + Math.sin(ang) * r;

          // Upper rafter blue bottles
          const isTopRow = y >= bH - 0.4;
          let cr = 0.24, cg = 0.70, cb = 0.88;
          if (isTopRow) { cr = 0.08; cg = 0.35; cb = 0.95; }
          addBuildPoint(px, y, pz, cr, cg, cb);
        }
      }
    }

    // C. The Lagos Yellow Danfo Bus Classroom
    const busCX = 2.7;
    const busZMin = 2.2;
    const busZMax = 5.2;
    const busW = 2.3;
    const busH = 2.2;

    for (let bz = busZMin; bz <= busZMax; bz += 0.09) {
      for (let by = 0.2; by <= 0.2 + busH; by += 0.09) {
        for (let bx = busCX - busW / 2; bx <= busCX + busW / 2; bx += 0.09) {
          const isFrontFace = Math.abs(bz - busZMax) < 0.10;
          const isSideFace = Math.abs(Math.abs(bx - busCX) - busW / 2) < 0.10;
          const isRoofFace = Math.abs(by - (0.2 + busH)) < 0.10;

          if (!isFrontFace && !isSideFace && !isRoofFace) continue;

          // Windshield & side windows
          const isWindshield = isFrontFace && by >= 1.1 && by <= 1.95 && Math.abs(bx - busCX) <= 0.95;
          const isSideWindow = isSideFace && by >= 1.1 && by <= 1.90 && bz >= 2.6 && bz <= 4.6;
          // Dual Black Transit Stripes
          const isStripe = (by >= 0.78 && by <= 0.90) || (by >= 0.96 && by <= 1.06);

          if (isWindshield || isSideWindow) {
            addBuildPoint(bx, by, bz, 0.20, 0.85, 0.98);
          } else if (isStripe) {
            addBuildPoint(bx, by, bz, 0.05, 0.06, 0.09);
          } else {
            // Bright Lagos Danfo Yellow
            addBuildPoint(bx, by, bz, 1.0, 0.82, 0.04);
          }
        }
      }
    }

    // Danfo Headlights & Forward Beams
    for (let hx of [busCX - 0.8, busCX + 0.8]) {
      for (let a = 0; a < 10; a++) {
        const ang = a * (Math.PI * 2 / 10);
        for (let hr = 0.04; hr <= 0.16; hr += 0.05) {
          addBuildPoint(hx + Math.cos(ang) * hr, 0.65 + Math.sin(ang) * hr, busZMax + 0.06, 1.0, 1.0, 0.95);
        }
      }
      for (let beamZ = busZMax + 0.15; beamZ <= busZMax + 0.9; beamZ += 0.15) {
        const spread = (beamZ - busZMax) * 0.30;
        for (let b = 0; b < 4; b++) {
          const bang = b * (Math.PI * 2 / 4);
          addBuildPoint(hx + Math.cos(bang) * spread, 0.65 + Math.sin(bang) * spread, beamZ, 0.98, 0.92, 0.60);
        }
      }
    }

    // Bus Wheels
    for (let wx of [busCX - 1.18, busCX + 1.18]) {
      for (let wz of [2.8, 4.4]) {
        for (let a = 0; a < 12; a++) {
          const ang = a * (Math.PI * 2 / 12);
          for (let wr = 0.09; wr <= 0.32; wr += 0.08) {
            const isRim = wr < 0.18;
            addBuildPoint(wx, 0.32 + Math.sin(ang) * wr, wz + Math.cos(ang) * wr, isRim ? 0.75 : 0.08, isRim ? 0.75 : 0.09, isRim ? 0.78 : 0.12);
          }
        }
      }
    }

    // D. Hanging Bottle Ceiling Matrix Canopy (gallery_01)
    for (let cx = -bW / 2 + 0.4; cx <= bW / 2 - 0.4; cx += 0.25) {
      for (let cz = -bD / 2 + 0.4; cz <= bD / 2 - 0.4; cz += 0.25) {
        if (Math.random() > 0.42) {
          addBuildPoint(cx, bH - 0.12, cz, 0.25, 0.80, 0.95);
          addBuildPoint(cx, bH - 0.34, cz, 0.98, 0.65, 0.15);
        }
      }
    }

    // E. Classroom Interior Desks & Blackboard
    for (let dx = -3.6; dx <= -0.4; dx += 1.2) {
      for (let dz = -2.2; dz <= 1.6; dz += 1.3) {
        for (let tx = -0.30; tx <= 0.30; tx += 0.12) {
          for (let tz = -0.16; tz <= 0.16; tz += 0.12) {
            addBuildPoint(dx + tx, 1.0, dz + tz, 0.72, 0.45, 0.20);
          }
        }
      }
    }

    // Interior Blackboard
    for (let bx = -3.0; bx <= -1.2; bx += 0.08) {
      for (let by = 1.2; by <= 2.4; by += 0.08) {
        addBuildPoint(bx, by, bD / 2 - 0.10, 0.06, 0.14, 0.12);
      }
    }

    // F. Corrugated Zinc Roof & Blue Solar Array
    for (let rx = -bW / 2 - 0.6; rx <= bW / 2 + 0.6; rx += 0.15) {
      for (let rz = -bD / 2 - 0.6; rz <= bD / 2 + 0.6; rz += 0.15) {
        const slope = (rz / bD) * 0.70;
        const ry = bH + 0.42 + slope;
        const corrugation = Math.sin(rx * 9) * 0.04;
        const isSolar = Math.abs(rx) <= 3.2 && rz >= -2.0 && rz <= 2.0;

        if (isSolar) {
          const isGrid = (Math.abs(rx % 0.8) < 0.05) || (Math.abs(rz % 0.65) < 0.05);
          if (isGrid) {
            addBuildPoint(rx, ry + 0.08, rz, 0.95, 0.98, 1.0);
          } else {
            addBuildPoint(rx, ry + 0.08, rz, 0.06, 0.42 + Math.random() * 0.15, 0.98);
          }
        } else {
          addBuildPoint(rx, ry + corrugation, rz, 0.58 + Math.random() * 0.1, 0.62 + Math.random() * 0.1, 0.68 + Math.random() * 0.1);
        }
      }
    }

    // G. Lagoon Water Surface Ripples
    for (let i = 0; i < 3000; i++) {
      const wx = (Math.random() - 0.5) * 26;
      const wz = (Math.random() - 0.5) * 24;
      const wy = -1.2 + (Math.random() - 0.5) * 0.05;
      addBuildPoint(wx, wy, wz, 0.02, 0.52 + Math.random() * 0.22, 0.82 + Math.random() * 0.15);
    }

    const buildGeom = new THREE.BufferGeometry();
    buildGeom.setAttribute('position', new THREE.Float32BufferAttribute(buildPos, 3));
    buildGeom.setAttribute('color', new THREE.Float32BufferAttribute(buildCol, 3));

    const buildMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.92,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const buildingMesh = new THREE.Points(buildGeom, buildMaterial);
    academyGroup.add(buildingMesh);

    // --- GEOMETRY SET 2: The Exact "slum art" High-Res Official Logo Signboard ---
    const logoPos = [];
    const logoCol = [];
    function addLogoPoint(x, y, z, r, g, b) {
      logoPos.push(x, y, z);
      logoCol.push(r, g, b);
    }

    // Signboard on Front Facade (gallery_06)
    const logoBoardW = 3.4;
    const logoBoardH = 1.8;
    const logoCX = -2.7;
    const logoCY = 1.95;
    const logoCZ = frontZ + 0.10;

    // Deep Royal Blue Acrylic Signboard Backing Plate
    for (let bx = logoCX - logoBoardW / 2; bx <= logoCX + logoBoardW / 2; bx += 0.08) {
      for (let by = logoCY - logoBoardH / 2; by <= logoCY + logoBoardH / 2; by += 0.08) {
        const isBorder = Math.abs(Math.abs(bx - logoCX) - logoBoardW / 2) < 0.08 ||
                         Math.abs(Math.abs(by - logoCY) - logoBoardH / 2) < 0.08;
        if (isBorder) {
          addLogoPoint(bx, by, logoCZ - 0.015, 0.82, 0.90, 1.0);
        } else if (Math.random() > 0.35) {
          addLogoPoint(bx, by, logoCZ - 0.02, 0.04, 0.18, 0.48);
        }
      }
    }

    // Mounting Corner Bolts
    for (let mx of [logoCX - logoBoardW / 2 + 0.14, logoCX + logoBoardW / 2 - 0.14]) {
      for (let my of [logoCY - logoBoardH / 2 + 0.14, logoCY + logoBoardH / 2 - 0.14]) {
        for (let a = 0; a < 6; a++) {
          const ang = a * (Math.PI / 3);
          addLogoPoint(mx + Math.cos(ang) * 0.04, my + Math.sin(ang) * 0.04, logoCZ + 0.02, 0.95, 0.95, 1.0);
        }
      }
    }

    // 11,399 Exact Normalized Logo Points from window.__SLUM_ART_LOGO_POINTS__
    const logoPts = (typeof window !== 'undefined' && window.__SLUM_ART_LOGO_POINTS__) || [];
    if (logoPts.length > 0) {
      // Scale maintaining exact 2.36:1 logo aspect ratio
      const renderW = 2.8;
      const renderH = 1.18;
      const logoCenterY = logoCY + 0.14;

      for (let i = 0; i < logoPts.length; i++) {
        const pt = logoPts[i];
        // pt: [nx (-0.872..0.872), ny (-0.367..0.373), is_gold (0 or 1)]
        const px = logoCX + (pt[0] / 0.872) * (renderW / 2.0);
        const py = logoCenterY + (pt[1] / 0.37) * (renderH / 2.0);
        const pz = logoCZ;

        if (pt[2] === 1) {
          // Iconic Golden Brush Stroke over "art"
          addLogoPoint(px, py, pz, 1.0, 0.78, 0.06);
        } else {
          // Pure Brilliant Luminous White letters "slum art"
          addLogoPoint(px, py, pz, 1.0, 1.0, 1.0);
        }
      }
    }

    // Subtitle on Signboard: "MENTORSHIP & SUPPORT • PET BOTTLE ACADEMY"
    const subY = logoCY - 0.60;
    for (let sx = logoCX - 1.3; sx <= logoCX + 1.3; sx += 0.05) {
      if (Math.random() > 0.20) {
        addLogoPoint(sx, subY, logoCZ + 0.01, 0.22, 0.90, 1.0);
      }
    }

    const logoGeom = new THREE.BufferGeometry();
    logoGeom.setAttribute('position', new THREE.Float32BufferAttribute(logoPos, 3));
    logoGeom.setAttribute('color', new THREE.Float32BufferAttribute(logoCol, 3));

    const logoMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const logoMesh = new THREE.Points(logoGeom, logoMaterial);
    academyGroup.add(logoMesh);

    // --- GEOMETRY SET 3: Ambient Golden & Emerald Eco-Stardust Floating Across Full Section Behind Text ---
    const ambPos = [];
    const ambCol = [];
    for (let i = 0; i < 4500; i++) {
      const ex = (Math.random() - 0.5) * 36;
      const ey = -10.0 + Math.random() * 32.0; // Spans vertically across full section height
      const ez = (Math.random() - 0.5) * 28;
      const isGold = Math.random() > 0.42;
      const er = isGold ? 1.0 : 0.12;
      const eg = isGold ? 0.82 : 0.92;
      const eb = isGold ? 0.18 : 0.78;
      ambPos.push(ex, ey, ez);
      ambCol.push(er, eg, eb);
    }

    const ambGeom = new THREE.BufferGeometry();
    ambGeom.setAttribute('position', new THREE.Float32BufferAttribute(ambPos, 3));
    ambGeom.setAttribute('color', new THREE.Float32BufferAttribute(ambCol, 3));

    const ambMaterial = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const ambientMesh = new THREE.Points(ambGeom, ambMaterial);
    scene.add(ambientMesh);

    // 4. Initial Transforms & Smooth State
    let currentRotY = 0.06;
    let targetRotY = 0.06;
    let currentRotX = 0.04;
    let targetRotX = 0.04;
    let currentScale = 1.0;
    let targetScale = 1.0;
    let baseBuildingY = -0.5;

    // 5. Scroll-Linked Gentle 3D Orbit (Logo always remains facing user)
    function onScroll() {
      const section = document.getElementById('eco-school-3d');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const winH = window.innerHeight || 800;

      const totalDist = rect.height + winH;
      const currentDist = winH - rect.top;
      const progress = Math.max(0, Math.min(1, currentDist / totalDist));

      // Gentle orbital pan from -0.05 to +0.22 radians (~15 degrees)
      targetRotY = -0.05 + progress * 0.27;
      targetRotX = 0.03 + Math.sin(progress * Math.PI) * 0.04;
      targetScale = 0.98 + Math.sin(progress * Math.PI) * 0.04;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 6. Responsive Window Resize Handler
    function onResize() {
      const d = getDimensions();
      const section = document.getElementById('eco-school-3d');
      const isMobile = d.w < 768;

      camera.aspect = d.w / d.h;
      camera.fov = 38;
      camera.position.set(0, 0, 24.0);
      camera.updateProjectionMatrix();

      renderer.setSize(d.w, d.h);

      // Calibrated model scale based on horizontal screen width
      const visibleWidthAtZ24 = (2 * 24.0 * Math.tan((38 * Math.PI) / 360)) * camera.aspect;
      const desiredFraction = isMobile ? 0.88 : 0.62;
      const naturalModelW = 10.5;
      const modelScale = (visibleWidthAtZ24 * desiredFraction) / naturalModelW;

      academyGroup.scale.set(modelScale, modelScale, modelScale);

      // Scale point sizes with modelScale to keep point resolution razor-sharp
      buildMaterial.size = (isMobile ? 0.17 : 0.22) * modelScale;
      logoMaterial.size = (isMobile ? 0.075 : 0.09) * modelScale;
      ambMaterial.size = isMobile ? 0.32 : 0.42;

      // Align building Y directly with the center of the .eco-pointcloud-spacer window
      if (section) {
        const sRect = section.getBoundingClientRect();
        const spacer = section.querySelector('.eco-pointcloud-spacer');
        if (spacer && sRect.height > 0) {
          const spRect = spacer.getBoundingClientRect();
          const spacerCenterFromTop = (spRect.top + spRect.height / 2) - sRect.top;
          const spacerRelY = spacerCenterFromTop / sRect.height;
          const ndcY = 1.0 - 2.0 * spacerRelY;
          const visibleHeight = 2 * 24.0 * Math.tan((38 * Math.PI) / 360);
          baseBuildingY = ndcY * (visibleHeight / 2) - (isMobile ? 0.10 : 0.40);
        }
      }
    }

    window.addEventListener('resize', onResize);
    onResize();

    // 7. Render Loop with Atmospheric Drift
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

      // Atmospheric floating drift
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
