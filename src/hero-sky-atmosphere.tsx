import React, { useEffect, useRef } from "react"

// ============================================================================
// 1. PROCEDURAL VOLUMETRIC CLOUD SHADER (WebGL / GLSL fBm)
// Inspired by @manuarora700/components/cloud-shader (Aceternity UI)
// Soft drifting procedural cumulus clouds against an airy sky gradient
// ============================================================================

const CLOUD_VS = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const CLOUD_FS = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

// Fast procedural hash
float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// 2D Value Noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// 5-Octave Fractional Brownian Motion with domain rotation
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.52;
  mat2 rot = mat2(0.877, 0.479, -0.479, 0.877);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.08 + vec2(12.3);
    a *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv;
  p.x *= u_resolution.x / u_resolution.y;

  // Horizontal wind drift
  float speed = u_time * 0.022;
  vec2 q = p * 1.65 + vec2(speed, speed * 0.12);

  // Domain warping for organic billowy cumulus clouds
  vec2 warp1 = vec2(fbm(q + vec2(0.0, 0.0)), fbm(q + vec2(4.3, 2.1)));
  vec2 warp2 = vec2(fbm(q + warp1 * 1.25 + vec2(speed * 0.4, 0.0)), fbm(q + warp1 * 0.85));
  float cloudDensity = fbm(q + warp2 * 1.15);

  // Soft billowy cloud contrast
  float cloudShape = smoothstep(0.26, 0.64, cloudDensity);

  // Vertical sky atmosphere:
  // uv.y = 1.0 is the top of screen; uv.y = 0.0 is the bottom (waves).
  // 1) Upper sky clouds: drift gracefully in the top portion (uv.y from 0.48 to 1.0)
  float upperSky = smoothstep(0.46, 0.72, uv.y);
  // 2) Low wave mist: soft wisps hovering just above the waves (uv.y from 0.06 to 0.26)
  float waveMist = smoothstep(0.04, 0.13, uv.y) * (1.0 - smoothstep(0.18, 0.30, uv.y));

  float verticalMask = max(upperSky * 0.95, waveMist * 0.45);
  float cloud = cloudShape * verticalMask;

  // Sky gradient wash in the upper atmosphere:
  // Soft cerulean blue at the top fading seamlessly to transparent near center
  vec3 skyTop = vec3(0.66, 0.80, 0.93);
  vec3 skyMid = vec3(0.84, 0.91, 0.97);
  float skyGradient = smoothstep(0.55, 1.0, uv.y) * 0.40;
  vec3 skyColor = mix(skyMid, skyTop, smoothstep(0.70, 1.0, uv.y));

  // Volumetric cloud colors:
  // - Pure white cloud body
  // - Warm glowing sun amber edge highlights
  // - Atmospheric azure volume for 3D depth
  vec3 cloudWhite = vec3(1.0, 1.0, 1.0);
  vec3 cloudSunRim = vec3(1.0, 0.92, 0.72);
  vec3 cloudShadow = vec3(0.74, 0.85, 0.94);

  vec3 cloudColor = mix(cloudShadow, cloudWhite, smoothstep(0.28, 0.58, cloudDensity));
  cloudColor = mix(cloudColor, cloudSunRim, smoothstep(0.52, 0.76, cloudDensity) * 0.65);

  // Combine sky wash and clouds
  vec3 finalColor = mix(skyColor, cloudColor, smoothstep(0.05, 0.35, cloud));
  float finalAlpha = max(skyGradient, cloud * 0.72);

  // Premultiplied alpha for clean WebGL blending over paper background
  gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha);
}
`

function CloudShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true })
    if (!gl) {
      render2DCloudFallback(canvas)
      return
    }

    const createShader = (type: number, src: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("Cloud shader compile error:", gl.getShaderInfoLog(s))
        gl.deleteShader(s)
        return null
      }
      return s
    }

    const vs = createShader(gl.VERTEX_SHADER, CLOUD_VS)
    const fs = createShader(gl.FRAGMENT_SHADER, CLOUD_FS)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("Cloud shader link error:", gl.getProgramInfoLog(prog))
      return
    }

    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const posLoc = gl.getAttribLocation(prog, "position")
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const resLoc = gl.getUniformLocation(prog, "u_resolution")
    const timeLoc = gl.getUniformLocation(prog, "u_time")

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    let rafId: number
    const startTime = performance.now()

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      const w = rect ? Math.max(300, rect.width) : window.innerWidth
      const h = rect ? Math.max(300, rect.height) : window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
      canvas.width = Math.floor(w * dpr * 0.75)
      canvas.height = Math.floor(h * dpr * 0.75)
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (resLoc) gl.uniform2f(resLoc, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener("resize", resize)

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001
      if (timeLoc) gl.uniform1f(timeLoc, elapsed)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      rafId = requestAnimationFrame(render)
    }

    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-sky-clouds-canvas"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.95,
      }}
      aria-hidden="true"
    />
  )
}

function render2DCloudFallback(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const grad = ctx.createRadialGradient(
    canvas.width * 0.5,
    canvas.height * 0.25,
    40,
    canvas.width * 0.5,
    canvas.height * 0.25,
    canvas.width * 0.65,
  )
  grad.addColorStop(0, "rgba(255, 255, 255, 0.45)")
  grad.addColorStop(0.4, "rgba(224, 235, 245, 0.28)")
  grad.addColorStop(0.8, "rgba(254, 243, 199, 0.18)")
  grad.addColorStop(1, "rgba(250, 248, 245, 0)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// ============================================================================
// 2. BIRD MURMURATION FLOCKING CANVAS
// Inspired by @kedhareswer/components/murmuration-wordmark (21st.dev)
// "just a few no overpopulation" (15 birds total):
// - 7 soaring & skimming gracefully JUST ABOVE THE WAVES
// - 8 wheeling gracefully through the UPPER SKY & CLOUDS
// - Central title exclusion barrier guarantees zero text collision
// ============================================================================

interface Bird {
  x: number
  y: number
  vx: number
  vy: number
  z: number
  band: "waves" | "sky"
  wingPhase: number
  flapSpeed: number
  flapTimer: number
}

function MurmurationBirdsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pointerRef = useRef({ x: -1000, y: -1000, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      width = rect ? Math.max(300, rect.width) : window.innerWidth
      height = rect ? Math.max(300, rect.height) : window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener("resize", resize)

    // "just a few no overpopulation": Exactly 15 birds
    // 7 wave skimmers (just above the waves) and 8 sky wanderers
    const birds: Bird[] = []
    const TOTAL_BIRDS = 15

    for (let i = 0; i < TOTAL_BIRDS; i++) {
      const isWaveBand = i < 7
      const z = 0.40 + Math.random() * 0.60
      const speed = (1.5 + Math.random() * 0.8) * (0.70 + z * 0.30)
      const angle = (Math.random() - 0.5) * 0.30

      const initialY = isWaveBand
        ? height * 0.68 + Math.random() * (height * 0.12)
        : height * 0.08 + Math.random() * (height * 0.22)

      birds.push({
        x: Math.random() * width,
        y: initialY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        z,
        band: isWaveBand ? "waves" : "sky",
        wingPhase: Math.random() * Math.PI * 2,
        flapSpeed: 0.13 + Math.random() * 0.06,
        flapTimer: Math.random() * 5,
      })
    }

    // Interactive pointer evasion (Hawk effect from murmuration-wordmark)
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      let clientX = 0
      let clientY = 0
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ("clientX" in e) {
        clientX = (e as MouseEvent).clientX
        clientY = (e as MouseEvent).clientY
      }
      pointerRef.current.x = clientX - rect.left
      pointerRef.current.y = clientY - rect.top
      pointerRef.current.active = true
    }

    const onPointerLeave = () => {
      pointerRef.current.active = false
    }

    window.addEventListener("mousemove", onPointerMove, { passive: true })
    window.addEventListener("touchmove", onPointerMove, { passive: true })
    window.addEventListener("mouseleave", onPointerLeave)

    let rafId: number
    let lastTime = performance.now()

    const animate = (now: number) => {
      const dt = Math.min(32, now - lastTime)
      lastTime = now

      ctx.clearRect(0, 0, width, height)
      const ptr = pointerRef.current

      // Central Title Card exclusion zone (keeps "slum art" & subtitle 100% clean & clear)
      const cardCenterX = width * 0.5
      const cardCenterY = height * 0.47
      const cardHalfW = Math.min(width * 0.42, 310)
      const cardHalfH = Math.min(height * 0.20, 115)
      const cardRepelRadius = cardHalfW + 50

      // Natural Boids flocking with local neighbor perception
      const NEIGHBOR_RADIUS = 135

      for (let i = 0; i < birds.length; i++) {
        const b = birds[i]

        let sepX = 0
        let sepY = 0
        let localVx = 0
        let localVy = 0
        let localX = 0
        let localY = 0
        let neighborCount = 0

        for (let j = 0; j < birds.length; j++) {
          if (i === j) continue
          const other = birds[j]
          const dx = b.x - other.x
          const dy = b.y - other.y
          const distSq = dx * dx + dy * dy

          if (distSq < NEIGHBOR_RADIUS * NEIGHBOR_RADIUS && distSq > 0) {
            const dist = Math.sqrt(distSq)
            // 1. Separation (avoid crowding)
            const force = (NEIGHBOR_RADIUS - dist) / NEIGHBOR_RADIUS
            sepX += (dx / dist) * force * 0.18
            sepY += (dy / dist) * force * 0.18

            // 2. Alignment & 3. Cohesion within band
            if (b.band === other.band) {
              localVx += other.vx
              localVy += other.vy
              localX += other.x
              localY += other.y
              neighborCount++
            }
          }
        }

        let alignX = 0
        let alignY = 0
        let cohX = 0
        let cohY = 0

        if (neighborCount > 0) {
          localVx /= neighborCount
          localVy /= neighborCount
          localX /= neighborCount
          localY /= neighborCount

          alignX = (localVx - b.vx) * 0.02
          alignY = (localVy - b.vy) * 0.02
          cohX = (localX - b.x) * 0.001
          cohY = (localY - b.y) * 0.001
        }

        // Band altitude retention
        let altitudeForceY = 0
        if (b.band === "waves") {
          // Desired wave skimming corridor: height * 0.67 to 0.82
          const targetY = height * 0.74
          altitudeForceY = (targetY - b.y) * 0.003
          // Updraft just above the dark waves
          if (b.y > height * 0.81) {
            altitudeForceY -= 0.15 * ((b.y - height * 0.81) / (height * 0.19))
          }
        } else {
          // Desired upper sky corridor: height * 0.10 to 0.32
          const targetY = height * 0.20
          altitudeForceY = (targetY - b.y) * 0.0025
          // Keep away from very top
          if (b.y < height * 0.06) {
            altitudeForceY += 0.12 * ((height * 0.06 - b.y) / (height * 0.06))
          }
        }

        // Murmuration wandering waltz
        const wanderTime = now * 0.00045 + i * 0.4
        const wanderX = Math.sin(wanderTime * 1.1) * 0.04
        const wanderY = Math.cos(wanderTime * 0.85) * 0.035

        // Central Title Exclusion Zone: firm elliptical deflect away from text
        let cardDeflectX = 0
        let cardDeflectY = 0
        const cdx = b.x - cardCenterX
        const cdy = (b.y - cardCenterY) * 1.65
        const distToCard = Math.hypot(cdx, cdy)

        if (distToCard < cardRepelRadius && distToCard > 0) {
          const repelRatio = (cardRepelRadius - distToCard) / cardRepelRadius
          const repelForce = repelRatio * 0.65
          cardDeflectX = (cdx / distToCard) * repelForce
          // Deflect upper birds upwards, lower birds downwards towards waves
          const verticalBias = b.band === "waves" ? 0.45 : -0.45
          cardDeflectY = ((cdy / distToCard) * 0.3 + verticalBias) * repelForce
        }

        // Interactive Hawk Evasion (pointer)
        let hawkX = 0
        let hawkY = 0
        if (ptr.active) {
          const pdx = b.x - ptr.x
          const pdy = b.y - ptr.y
          const pDistSq = pdx * pdx + pdy * pdy
          const repelRadius = 160
          if (pDistSq < repelRadius * repelRadius && pDistSq > 0) {
            const pDist = Math.sqrt(pDistSq)
            const pForce = (repelRadius - pDist) / repelRadius
            hawkX = (pdx / pDist) * pForce * 0.40
            hawkY = (pdy / pDist) * pForce * 0.40
          }
        }

        // Apply forces
        b.vx += sepX + alignX + cohX + wanderX + cardDeflectX + hawkX
        b.vy += sepY + alignY + cohY + wanderY + altitudeForceY + cardDeflectY + hawkY

        // Constrain velocity
        const speed = Math.hypot(b.vx, b.vy)
        if (speed > 0.01) {
          const maxSpeed = ptr.active ? 3.4 : 2.6
          const minSpeed = 1.3
          const targetSpeed = Math.min(maxSpeed, Math.max(minSpeed, speed))
          b.vx = (b.vx / speed) * targetSpeed
          b.vy = (b.vy / speed) * targetSpeed
        }

        // Update position
        b.x += b.vx * (dt / 16)
        b.y += b.vy * (dt / 16)

        // Screen boundary wrapping
        const margin = 80
        if (b.x > width + margin) b.x = -margin
        if (b.x < -margin) b.x = width + margin
        if (b.y > height + margin) b.y = b.band === "waves" ? height * 0.68 : -margin * 0.3
        if (b.y < -margin) b.y = b.band === "sky" ? height * 0.15 : height + margin * 0.3

        // Flapping vs Gliding flight cycle (2.4s flap, 2.2s glide)
        b.flapTimer = (b.flapTimer || 0) + dt * 0.001
        const cycle = (b.flapTimer + i * 0.7) % 4.6
        const isGliding = cycle > 2.4
        if (!isGliding) {
          b.wingPhase += b.flapSpeed * (dt / 16) * (speed > 1.8 ? 1.25 : 1.0)
        } else {
          const targetPhase = Math.PI * 0.2
          b.wingPhase += (targetPhase - (b.wingPhase % (Math.PI * 2))) * 0.08
        }

        drawBird(ctx, b)
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onPointerMove)
      window.removeEventListener("touchmove", onPointerMove)
      window.removeEventListener("mouseleave", onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="hero-sky-birds-canvas"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
      aria-hidden="true"
    />
  )
}

// Draw authentic aerodynamic starling/swallow silhouette in flight with 3D depth & wing flex
function drawBird(ctx: CanvasRenderingContext2D, b: Bird) {
  ctx.save()
  ctx.translate(b.x, b.y)

  // Heading angle
  const heading = Math.atan2(b.vy, b.vx)
  ctx.rotate(heading)

  // 3D Depth scale: smaller in distance, crisp in foreground
  const scale = (0.52 + b.z * 0.50) * 0.95
  ctx.scale(scale, scale)

  // Wing flap displacement with aerodynamic wingtip flex
  const flap = Math.sin(b.wingPhase)
  const span = 15
  const tipX = -span * 0.4 + flap * 1.2
  const tipY = span + flap * 6.5
  const midY = span * 0.55 + flap * 3.0

  // Color: warm charcoal silhouette
  const alpha = (0.45 + b.z * 0.48).toFixed(2)
  ctx.fillStyle = `rgba(18, 26, 42, ${alpha})`

  ctx.beginPath()
  // Beak / Head tip
  ctx.moveTo(8, 0)
  // Right wing leading edge
  ctx.quadraticCurveTo(3, midY * 0.6, tipX, tipY)
  // Right wing trailing edge
  ctx.quadraticCurveTo(tipX * 0.5, midY * 0.5, -3, 1.8)
  // Body down to tail
  ctx.lineTo(-10, 2.2)
  // Forked swallow tail notch
  ctx.lineTo(-7.5, 0)
  ctx.lineTo(-10, -2.2)
  // Left wing trailing edge
  ctx.lineTo(-3, -1.8)
  ctx.quadraticCurveTo(tipX * 0.5, -midY * 0.5, tipX, -tipY)
  // Left wing leading edge
  ctx.quadraticCurveTo(3, -midY * 0.6, 8, 0)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

// ============================================================================
// 3. COMBINED HERO SKY ATMOSPHERE
// ============================================================================

export default function HeroSkyAtmosphere() {
  return (
    <div
      className="hero-sky-atmosphere-layer"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <CloudShaderCanvas />
      <MurmurationBirdsCanvas />
    </div>
  )
}
