/**
 * ===================================================================
 * ANIMATOR TITLE PRELOADER & PRODUCTION PIPELINE (21st.dev @kedhareswer)
 * Customized for: "The Pet Bottle School in Onigbongbo" Comic Project
 * Features:
 * - 4 Cinematic Phases: ROUGH (Blue Pencil) -> INK -> PAINT -> FINAL (Held by Cartoon Hands)
 * - Animation Lightbox Frame with Pegbar Holes & Clapperboard Slate
 * - Procedural Web Audio FX (Pencil scratching, Ink pen, Paint swish, Cartoon Chime)
 * - Interactive Phase Scrubbing & Auto-Play Loop
 * - Seamless Hero View Switcher (Animation Pipeline <-> Documentary Video)
 * ===================================================================
 */

(function () {
  'use strict';

  // Procedural Web Audio Synthesizer for Animator Pipeline Sounds
  let audioCtx = null;
  let audioEnabled = true;

  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playPhaseSound(phase) {
    if (!audioEnabled) return;
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      if (phase === 'rough') {
        // Quick pencil scratching noise
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (phase === 'ink') {
        // Sharp inking pen nib scratch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (phase === 'paint') {
        // Soft smooth brush swish
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
      } else if (phase === 'final') {
        // Celebratory cartoon chord chime (C - E - G - C)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.05, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.45);
        });
      }
    } catch (e) {}
  }

  const PHASES = ['rough', 'ink', 'paint', 'final'];
  const PHASE_NAMES = {
    rough: 'Phase 01: Rough Blue Pencil',
    ink: 'Phase 02: Inked Outlines & Ben-Day Dots',
    paint: 'Phase 03: Cel Paint & Color Fills',
    final: 'Phase 04: Finished Card (Cartoon Hands)'
  };

  let activePhase = 'rough';
  let pipelineTimer = null;
  let isAutoPlaying = true;

  function setPipelinePhase(phase, manual = false) {
    if (!PHASES.includes(phase)) return;
    activePhase = phase;

    const container = document.querySelector('.animator-title-card');
    if (!container) return;

    // Update active class on container
    PHASES.forEach(p => container.classList.remove(`phase-${p}`));
    container.classList.add(`phase-${phase}`);

    // Update progress bar
    const progressMap = { rough: 25, ink: 50, paint: 75, final: 100 };
    const pct = progressMap[phase];
    const fillEl = container.querySelector('.atp-progress-fill');
    const labelEl = container.querySelector('.atp-phase-label');
    const pctEl = container.querySelector('.atp-pct-readout');

    if (fillEl) fillEl.style.width = `${pct}%`;
    if (labelEl) labelEl.textContent = PHASE_NAMES[phase];
    if (pctEl) pctEl.textContent = `${pct}%`;

    // Update frame number on clapperboard slate
    const frameEl = document.querySelector('.atp-frame-num');
    if (frameEl) {
      const frameMap = { rough: '24', ink: '48', paint: '72', final: '96' };
      frameEl.textContent = frameMap[phase] || '24';
    }

    // Update phase tab buttons
    const tabs = container.querySelectorAll('.atp-phase-tab');
    tabs.forEach(tab => {
      if (tab.dataset.phase === phase) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Play procedural sound
    playPhaseSound(phase);

    // If manual click, pause auto-timer
    if (manual) {
      if (pipelineTimer) clearTimeout(pipelineTimer);
      isAutoPlaying = false;
      const playPauseBtn = container.querySelector('.atp-ctrl-playpause');
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
      }
    }
  }

  function advancePipeline() {
    const currentIndex = PHASES.indexOf(activePhase);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= PHASES.length) {
      // Pause at final for 4 seconds then loop back to rough
      pipelineTimer = setTimeout(() => {
        setPipelinePhase('rough');
        scheduleNextStep();
      }, 4200);
      return;
    }
    setPipelinePhase(PHASES[nextIndex]);
    scheduleNextStep();
  }

  function scheduleNextStep() {
    if (!isAutoPlaying) return;
    if (pipelineTimer) clearTimeout(pipelineTimer);
    pipelineTimer = setTimeout(advancePipeline, 1800);
  }

  function startPipeline() {
    isAutoPlaying = true;
    setPipelinePhase('rough');
    scheduleNextStep();
    const container = document.querySelector('.animator-title-card');
    if (container) {
      const playPauseBtn = container.querySelector('.atp-ctrl-playpause');
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      }
    }
  }

  function togglePipelinePlay() {
    const container = document.querySelector('.animator-title-card');
    if (isAutoPlaying) {
      isAutoPlaying = false;
      if (pipelineTimer) clearTimeout(pipelineTimer);
      if (container) {
        const btn = container.querySelector('.atp-ctrl-playpause');
        if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Resume';
      }
    } else {
      isAutoPlaying = true;
      scheduleNextStep();
      if (container) {
        const btn = container.querySelector('.atp-ctrl-playpause');
        if (btn) btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      }
    }
  }

  function replayPipeline() {
    if (pipelineTimer) clearTimeout(pipelineTimer);
    startPipeline();
  }

  function initAnimatorPreloader() {
    const container = document.querySelector('.animator-title-card');
    if (!container) return;

    // Attach phase tab listeners
    const tabs = container.querySelectorAll('.atp-phase-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const p = tab.dataset.phase;
        setPipelinePhase(p, true);
      });
    });

    // Replay button
    const replayBtn = container.querySelector('.atp-ctrl-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', (e) => {
        e.preventDefault();
        replayPipeline();
      });
    }

    // Play/Pause button
    const playPauseBtn = container.querySelector('.atp-ctrl-playpause');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        togglePipelinePlay();
      });
    }

    // Sound toggle button
    const soundBtn = container.querySelector('.atp-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.preventDefault();
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
          soundBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
          soundBtn.setAttribute('title', 'Mute audio FX');
          getAudioCtx();
        } else {
          soundBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
          soundBtn.setAttribute('title', 'Enable audio FX');
        }
      });
    }

    // Kickoff auto-pipeline
    startPipeline();
  }

  // Hero View Switcher: Animator Pipeline <--> Documentary Video
  function setHeroMediaView(mode) {
    const animatorView = document.getElementById('heroAnimatorView');
    const videoView = document.getElementById('heroVideoView');
    const switchAnimatorBtn = document.getElementById('heroSwitchAnimator');
    const switchVideoBtn = document.getElementById('heroSwitchVideo');

    if (mode === 'animator') {
      if (animatorView) animatorView.style.display = 'block';
      if (videoView) videoView.style.display = 'none';
      if (switchAnimatorBtn) switchAnimatorBtn.classList.add('active');
      if (switchVideoBtn) switchVideoBtn.classList.remove('active');
      // Resume animation
      if (!isAutoPlaying) {
        startPipeline();
      }
    } else if (mode === 'video') {
      if (animatorView) animatorView.style.display = 'none';
      if (videoView) videoView.style.display = 'block';
      if (switchAnimatorBtn) switchAnimatorBtn.classList.remove('active');
      if (switchVideoBtn) switchVideoBtn.classList.add('active');
      // Pause pipeline animation to save CPU
      if (pipelineTimer) clearTimeout(pipelineTimer);
      isAutoPlaying = false;
    }
  }

  // Expose Globally
  window.setPipelinePhase = setPipelinePhase;
  window.replayPipeline = replayPipeline;
  window.setHeroMediaView = setHeroMediaView;
  window.initAnimatorPreloader = initAnimatorPreloader;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimatorPreloader);
  } else {
    initAnimatorPreloader();
  }
})();
