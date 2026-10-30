import React from "react"
import { createRoot } from "react-dom/client"
import AnimatorTitlePreloader from "./animator-title-preloader"

const SLUM_PALETTE = {
  stage: "#faf8f5",
  sleeve0: "#1e293b",
  sleeve1: "#0f172a",
  sleeve2: "#020617",
  pattern: "#334155",
  skin0: "#9e5c33",
  skin1: "#743e1d",
  skin2: "#4a240e",
  cuff: "#1e293b",
  nail: "#dfad99",
  word0: "#000000",
  word1: "#000000",
  word2: "#000000",
  rough: "transparent",
  ghost: "transparent",
  ink: "#000000",
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
          title="slum art"
          kicker=""
          kickerStyle="editorial"
          connector=""
          name=""
          showLogoSwipe={true}
          subtitle="Transforming Underserved Communities Through sustainable Creative Art & Education"
          preset="ember"
          palette={SLUM_PALETTE}
          hands={true}
          rough={false}
          mascot={false}
          hud={false}
          height="100%"
          displayFamily="'Outfit', 'Plus Jakarta Sans', sans-serif"
        />

        {/* Floating Luxury Interactive Scroll Cue */}
        <button
          type="button"
          className="hero-scroll-cue"
          aria-label="Register for Guinness World Record"
          onClick={(e) => {
            e.preventDefault();
            if (typeof (window as any).scrollToGuinnessRecord === "function") {
              (window as any).scrollToGuinnessRecord(e);
            } else {
              const comic = document.getElementById("guinness-record") || document.querySelector(".gwr-backing-section");
              if (comic) comic.scrollIntoView({ behavior: "smooth", block: "start" });
              else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }
          }}
        >
          <span className="hsc-pulse-dot" aria-hidden="true">
            <span className="hsc-pulse-ring"></span>
            <span className="hsc-pulse-core"></span>
          </span>
          <span className="hsc-label">Register for Guinness World Record</span>
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
