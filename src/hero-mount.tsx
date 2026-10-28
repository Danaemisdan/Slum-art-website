import React from "react"
import { createRoot } from "react-dom/client"
import AnimatorTitlePreloader from "./animator-title-preloader"

const SLUM_PALETTE = {
  stage: "#faf8f5",
  sleeve0: "#e06927",
  sleeve1: "#d97706",
  sleeve2: "#9a3412",
  pattern: "#fbbf24",
  skin0: "#c68642",
  skin1: "#a0522d",
  skin2: "#5c3317",
  cuff: "#ea580c",
  nail: "#ffd3bd",
  word0: "#ea580c",
  word1: "#f59e0b",
  word2: "#c2410c",
  rough: "#0284c7",
  ghost: "#e11d48",
  ink: "#0f172a",
  muted: "#64748b",
}

function HeroAnimatorApp() {
  return (
    <div className="hero-atp-official-wrapper">
      {/* 21st.dev Kedhareswer Animator Title Preloader (Full Stage) */}
      <div className="hero-atp-full-stage">
        <AnimatorTitlePreloader
          loop={false}
          stayOnHold={true}
          durationMs={3600}
          title="SLUM ART"
          kicker="Slum Art Foundation • Registered Nonprofit"
          kickerStyle="editorial"
          showLogoSwipe={true}
          subtitle="Transforming Underserved Communities Through Art, Education & Creativity"
          preset="ember"
          palette={SLUM_PALETTE}
          hands={true}
          rough={true}
          mascot={false}
          hud={false}
          height="100%"
          displayFamily="'Syne', 'Outfit', 'Plus Jakarta Sans', sans-serif"
        />

        {/* Floating Luxury Interactive Scroll Cue */}
        <button
          type="button"
          className="hero-scroll-cue"
          aria-label="Scroll to discover who we are"
          onClick={() => {
            const next = document.getElementById("who-we-are") || document.getElementById("art-shop") || document.querySelector("section:nth-of-type(2)")
            if (next) next.scrollIntoView({ behavior: "smooth" })
            else window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }}
        >
          <span className="hsc-pulse-dot" aria-hidden="true">
            <span className="hsc-pulse-ring"></span>
            <span className="hsc-pulse-core"></span>
          </span>
          <span className="hsc-label">Discover Who We Are</span>
          <span className="hsc-icon-bubble" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

function init() {
  const mountEl = document.getElementById("heroAnimatorPreloaderMount")
  if (mountEl) {
    const root = createRoot(mountEl)
    root.render(<HeroAnimatorApp />)
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
}
