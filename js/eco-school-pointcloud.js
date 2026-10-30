/**
 * Slum Art Foundation - 3D Eco-Bottle Academy Point Cloud Architecture
 * High-End Architectural LiDAR Digital Twin:
 * Features the exact official "slum art" logo rendered in 11,000+ razor-sharp luminous points,
 * wire-mesh gabion recycled bottle walls, solar canopy, and illuminated Danfo classroom.
 * Rendered directly on the site background with smooth scroll-driven orbit.
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

    // 2. High-Quality Circular Bokeh Point Sprite (Smooth circular point, zero square pixel artifacts)
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
      grad.addColorStop(0.95, 'rgba(255, 255, 255, 0.05)');
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
    // Uses uniform surface distribution to eliminate moiré lines, combs, and grid artifacts
    const buildPos = [];
    const buildCol = [];
    function addBuildPoint(x, y, z, r, g, b) {
      buildPos.push(x, y, z);
      buildCol.push(r, g, b);
    }

    const bW = 9.4;  // building width
    const bD = 6.2;  // building depth
    const bH = 3.6;  // building wall height
    const frontZ = bD / 2;
    const backZ = -bD / 2;

    // A. Floating Timber Pontoon Deck & Lagoon Stilts
    // Uniform planar sampling — ZERO vertical stick or cross-hatch lines
    const deckW = 12.0;
    const deckD = 9.4;
    for (let i = 0; i < 3200; i++) {
      const x = (Math.random() - 0.5) * deckW;
      const z = (Math.random() - 0.5) * deckD + 0.3;
      const y = -0.45 + (Math.random() - 0.5) * 0.03;

      // Refined teak, walnut, and warm mahogany timber tones
      const isPlankJoint = Math.abs(x % 0.8) < 0.04;
      let br = isPlankJoint ? 0.30 : (0.52 + Math.random() * 0.08);
      let bg = isPlankJoint ? 0.18 : (0.32 + Math.random() * 0.06);
      let bb = isPlankJoint ? 0.08 : (0.15 + Math.random() * 0.04);

      addBuildPoint(x, y, z, br, bg, bb);

      // Deck thickness layer
      if (Math.random() > 0.6) {
        addBuildPoint(x, y - 0.25, z, br * 0.65, bg * 0.65, bb * 0.65);
      }
    }

    // Foundation Mangrove Stilts (Lagoon pilings beneath deck)
    for (let px of [-4.8, -1.8, 1.8, 4.8]) {
      for (let pz of [-3.6, 0, 3.6, 4.6]) {
        for (let py = -0.45; py >= -2.2; py -= 0.12) {
          for (let a = 0; a < 6; a++) {
            const ang = a * (Math.PI * 2 / 6) + (Math.random() - 0.5) * 0.2;
            const r = 0.14 + (Math.random() - 0.5) * 0.02;
            addBuildPoint(px + Math.cos(ang) * r, py, pz + Math.sin(ang) * r, 0.26, 0.16, 0.09);
          }
        }
      }
    }

    // B. Authentic Wire-Mesh Gabion Recycled Bottle Walls
    // Sampled with organic bottle columns & courses (no rigid moiré scanlines)

    // B1. Side Walls (Left and Right)
    for (let wallX of [-bW / 2, bW / 2]) {
      for (let i = 0; i < 2800; i++) {
        const y = Math.random() * bH;
        const z = (Math.random() - 0.5) * bD;

        // Window openings (clean negative space)
        if (y >= 1.2 && y <= 2.6 && z >= -1.4 && z <= 1.4) {
          // Window frame outline points
          if (Math.abs(y - 1.2) < 0.10 || Math.abs(y - 2.6) < 0.10 || Math.abs(z - -1.4) < 0.10 || Math.abs(z - 1.4) < 0.10) {
            addBuildPoint(wallX, y, z, 0.75, 0.88, 0.98);
          }
          continue;
        }

        // Bottle depth volume (inner & outer surface of wall)
        const depthOffset = (Math.random() - 0.5) * 0.16;
        const px = wallX + depthOffset;

        // Crystalline Cyan, Aquamarine & Diamond White bottle glow
        const isHighlight = Math.random() > 0.82;
        let cr = 0.20, cg = 0.65, cb = 0.88;
        if (isHighlight) { cr = 0.88; cg = 0.96; cb = 1.0; }

        // Subtle warm bottle cap course accents
        if (Math.abs(y % 0.5) < 0.05) {
          cr = 0.92; cg = 0.70; cb = 0.18; // Warm amber cap
        }

        addBuildPoint(px, y, z, cr, cg, cb);
      }
    }

    // B2. Back Wall
    for (let i = 0; i < 3000; i++) {
      const x = (Math.random() - 0.5) * bW;
      const y = Math.random() * bH;
      const depthOffset = (Math.random() - 0.5) * 0.14;
      const pz = backZ + depthOffset;

      const isHighlight = Math.random() > 0.85;
      let cr = 0.16, cg = 0.55, cb = 0.76;
      if (isHighlight) { cr = 0.75; cg = 0.90; cb = 0.98; }
      addBuildPoint(x, y, pz, cr, cg, cb);
    }

    // B3. Front Facade Wall with Danfo Opening & Main Entrance
    for (let i = 0; i < 3200; i++) {
      const x = (Math.random() - 0.5) * bW;
      const y = Math.random() * bH;

      // Danfo Bus Annex Bay (Front Right)
      if (x >= 1.2 && x <= 4.2 && y <= 2.8) continue;

      // Main Entrance Doorway (Front Center)
      if (x >= -0.7 && x <= 0.7 && y <= 2.5) {
        if (Math.abs(y - 2.5) < 0.10 || Math.abs(x - -0.7) < 0.10 || Math.abs(x - 0.7) < 0.10) {
          addBuildPoint(x, y, frontZ + 0.02, 0.85, 0.92, 0.98);
        }
        continue;
      }

      const depthOffset = (Math.random() - 0.5) * 0.12;
      const pz = frontZ + depthOffset;

      // Top row blue bottles under rafters (authentic to photo)
      const isTopRow = y >= bH - 0.45;
      let cr = 0.22, cg = 0.68, cb = 0.88;
      if (isTopRow) {
        cr = 0.08; cg = 0.36; cb = 0.95; // Deep royal blue
      } else if (Math.random() > 0.82) {
        cr = 0.88; cg = 0.95; cb = 1.0; // Diamond white
      }
      addBuildPoint(x, y, pz, cr, cg, cb);
    }

    // C. The Danfo Bus Classroom Annex
    // Rendered with refined warm amber-gold architectural contour points (NOT a flat yellow Lego cube)
    const busCX = 2.7;
    const busZMin = 2.2;
    const busZMax = 5.2;
    const busW = 2.3;
    const busH = 2.2;

    for (let i = 0; i < 2600; i++) {
      // Sample bus surface
      const face = Math.floor(Math.random() * 5);
      let bx, by, bz;
      if (face === 0) { // Front face (windshield)
        bx = busCX + (Math.random() - 0.5) * busW;
        by = 0.2 + Math.random() * busH;
        bz = busZMax;
      } else if (face === 1 || face === 2) { // Sides
        bx = face === 1 ? busCX - busW / 2 : busCX + busW / 2;
        by = 0.2 + Math.random() * busH;
        bz = busZMin + Math.random() * (busZMax - busZMin);
      } else { // Roof
        bx = busCX + (Math.random() - 0.5) * busW;
        by = 0.2 + busH;
        bz = busZMin + Math.random() * (busZMax - busZMin);
      }

      // Windshield & side passenger windows (luminescent cyan glass)
      const isWindshield = Math.abs(bz - busZMax) < 0.1 && by >= 1.1 && by <= 1.95 && Math.abs(bx - busCX) <= 0.95;
      const isSideWindow = Math.abs(Math.abs(bx - busCX) - busW / 2) < 0.1 && by >= 1.1 && by <= 1.90 && bz >= 2.6 && bz <= 4.6;
      // Dual Transit Stripes
      const isStripe = (by >= 0.78 && by <= 0.90) || (by >= 0.96 && by <= 1.06);

      if (isWindshield || isSideWindow) {
        addBuildPoint(bx, by, bz, 0.25, 0.88, 0.98);
      } else if (isStripe) {
        addBuildPoint(bx, by, bz, 0.12, 0.16, 0.22);
      } else {
        // Refined architectural warm amber-gold (harmonious with academy)
        addBuildPoint(bx, by, bz, 0.95, 0.75, 0.12);
      }
    }

    // Danfo Headlights & Warm Light Cones
    for (let hx of [busCX - 0.8, busCX + 0.8]) {
      for (let a = 0; a < 8; a++) {
        const ang = a * (Math.PI * 2 / 8);
        for (let hr = 0.04; hr <= 0.14; hr += 0.05) {
          addBuildPoint(hx + Math.cos(ang) * hr, 0.65 + Math.sin(ang) * hr, busZMax + 0.05, 1.0, 1.0, 0.95);
        }
      }
      for (let beamZ = busZMax + 0.15; beamZ <= busZMax + 0.8; beamZ += 0.15) {
        const spread = (beamZ - busZMax) * 0.28;
        for (let b = 0; b < 4; b++) {
          const bang = b * (Math.PI * 2 / 4);
          addBuildPoint(hx + Math.cos(bang) * spread, 0.65 + Math.sin(bang) * spread, beamZ, 0.95, 0.88, 0.55);
        }
      }
    }

    // Bus Wheels
    for (let wx of [busCX - 1.18, busCX + 1.18]) {
      for (let wz of [2.8, 4.4]) {
        for (let a = 0; a < 10; a++) {
          const ang = a * (Math.PI * 2 / 10);
          for (let wr = 0.09; wr <= 0.30; wr += 0.08) {
            const isRim = wr < 0.18;
            addBuildPoint(wx, 0.32 + Math.sin(ang) * wr, wz + Math.cos(ang) * wr, isRim ? 0.75 : 0.15, isRim ? 0.78 : 0.18, isRim ? 0.85 : 0.22);
          }
        }
      }
    }

    // D. Hanging Bottle Ceiling Matrix (gallery_01)
    for (let i = 0; i < 900; i++) {
      const cx = (Math.random() - 0.5) * (bW - 0.8);
      const cz = (Math.random() - 0.5) * (bD - 0.8);
      addBuildPoint(cx, bH - 0.12, cz, 0.22, 0.75, 0.92);
      if (Math.random() > 0.5) {
        addBuildPoint(cx, bH - 0.34, cz, 0.95, 0.70, 0.15);
      }
    }

    // E. Interior Classroom Desks & Blackboard
    for (let dx = -3.6; dx <= -0.4; dx += 1.2) {
      for (let dz = -2.2; dz <= 1.6; dz += 1.3) {
        for (let i = 0; i < 20; i++) {
          const tx = (Math.random() - 0.5) * 0.5;
          const tz = (Math.random() - 0.5) * 0.3;
          addBuildPoint(dx + tx, 0.95, dz + tz, 0.65, 0.42, 0.18);
        }
      }
    }

    // Interior Blackboard
    for (let i = 0; i < 180; i++) {
      const bx = -3.0 + Math.random() * 1.8;
      const by = 1.2 + Math.random() * 1.2;
      addBuildPoint(bx, by, bD / 2 - 0.08, 0.08, 0.18, 0.15);
    }

    // F. Sleek Continuous Roof Canopy & Solar Array
    // UNIFORM POISSON SURFACE SAMPLING — ZERO DIAGONAL COMB TEETH OR WEIRD LINES!
    const roofW = bW + 0.4;
    const roofD = bD + 0.4;
    for (let i = 0; i < 3000; i++) {
      const rx = (Math.random() - 0.5) * roofW;
      const rz = (Math.random() - 0.5) * roofD;
      const slope = (rz / bD) * 0.25; // Gentle architectural slope
      const ry = bH + 0.28 + slope + (Math.random() - 0.5) * 0.02;

      // Solar Panel Area (Central sapphire silicon cells)
      const isSolar = Math.abs(rx) <= 3.0 && rz >= -1.8 && rz <= 1.8;
      if (isSolar) {
        const isGrid = (Math.abs(rx % 0.8) < 0.04) || (Math.abs(rz % 0.65) < 0.04);
        if (isGrid) {
          addBuildPoint(rx, ry + 0.04, rz, 0.92, 0.95, 1.0); // Silver busbar grid
        } else {
          addBuildPoint(rx, ry + 0.04, rz, 0.08, 0.45, 0.92); // Deep sapphire solar
        }
      } else {
        // Dark titanium / zinc canopy with soft metallic sheen
        addBuildPoint(rx, ry, rz, 0.42 + Math.random() * 0.06, 0.48 + Math.random() * 0.06, 0.58 + Math.random() * 0.06);
      }
    }

    // Clean, crisp eave border defining the roof perimeter
    for (let eX = -roofW / 2; eX <= roofW / 2; eX += 0.15) {
      for (let eZ of [-roofD / 2, roofD / 2]) {
        const slope = (eZ / bD) * 0.25;
        addBuildPoint(eX, bH + 0.28 + slope, eZ, 0.75, 0.85, 0.95);
      }
    }
    for (let eZ = -roofD / 2; eZ <= roofD / 2; eZ += 0.15) {
      for (let eX of [-roofW / 2, roofW / 2]) {
        const slope = (eZ / bD) * 0.25;
        addBuildPoint(eX, bH + 0.28 + slope, eZ, 0.75, 0.85, 0.95);
      }
    }

    // G. Shimmering Lagoon Water Surface Ripples
    for (let i = 0; i < 2200; i++) {
      const wx = (Math.random() - 0.5) * 24;
      const wz = (Math.random() - 0.5) * 22;
      const wy = -1.2 + (Math.random() - 0.5) * 0.03;
      addBuildPoint(wx, wy, wz, 0.04, 0.45 + Math.random() * 0.18, 0.75 + Math.random() * 0.15);
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

    // Deep Royal Navy Blue Acrylic Signboard Backing Plate
    for (let bx = logoCX - logoBoardW / 2; bx <= logoCX + logoBoardW / 2; bx += 0.08) {
      for (let by = logoCY - logoBoardH / 2; by <= logoCY + logoBoardH / 2; by += 0.08) {
        const isBorder = Math.abs(Math.abs(bx - logoCX) - logoBoardW / 2) < 0.08 ||
                         Math.abs(Math.abs(by - logoCY) - logoBoardH / 2) < 0.08;
        if (isBorder) {
          addLogoPoint(bx, by, logoCZ - 0.015, 0.85, 0.92, 1.0);
        } else if (Math.random() > 0.35) {
          addLogoPoint(bx, by, logoCZ - 0.02, 0.04, 0.16, 0.42);
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
