/**
 * Slum Art Foundation • Interactive Application Engine
 */

(function () {
  'use strict';

  // Smart Location-Aware Currency Initialization
  function getInitialCurrency() {
    // 1. If user previously selected a preference, respect it
    const stored = localStorage.getItem('slum_art_currency');
    if (stored === 'USD' || stored === 'NGN') {
      return stored;
    }

    // 2. Synchronous heuristic based on client timezone & locale (0ms, zero flicker)
    try {
      const tz = (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
      if (tz && (tz.includes('Lagos') || tz.includes('Nigeria'))) {
        return 'NGN';
      }
      const navLangs = navigator.languages || [navigator.language || ''];
      if (navLangs.some(l => /-(NG|ng)$|^(yo|ha|ig|pcm)/i.test(l))) {
        return 'NGN';
      }
    } catch (e) {
      console.debug('Geo heuristic note:', e);
    }

    // 3. For all international visitors outside Nigeria (US, Europe, UK, Asia, etc.), default to USD
    return 'USD';
  }

  // State Management
  const state = {
    currency: getInitialCurrency(),
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    cart: JSON.parse(localStorage.getItem('slum_art_cart') || '[]'),
    calculatorAmount: 50, // default USD
    quickviewItem: null,
    artworksExpanded: false,
    blogCategory: 'all',
    blogSearchQuery: ''
  };

  window.currentCurrency = state.currency;

  const DATA = window.SLUM_DATA || {
    artworks: [],
    blogs: [],
    programs: [],
    welfare: [],
    causes: [],
    testimonials: [],
    team: [],
    contact: {}
  };

  // Dynamic synchronization with Admin Dashboard (localStorage & BroadcastChannel)
  function syncDynamicData() {
    try {
      const storedArtworks = localStorage.getItem('slum_art_artworks_db');
      if (storedArtworks) {
        const parsed = JSON.parse(storedArtworks);
        // If cached localStorage data contains legacy medium descriptions like "Acrylic" or "Charcoal",
        // or lacks the updated collage portrait metadata, invalidate cache and resync with authoritative DATA.artworks
        if (Array.isArray(parsed) && parsed.some(a => a.medium && (a.medium.includes('Acrylic') || a.medium.includes('Charcoal')))) {
          DATA.artworks = (window.SLUM_DATA && window.SLUM_DATA.artworks) ? window.SLUM_DATA.artworks : [];
          localStorage.setItem('slum_art_artworks_db', JSON.stringify(DATA.artworks));
        } else {
          DATA.artworks = parsed;
        }
      } else if (DATA.artworks && DATA.artworks.length > 0) {
        localStorage.setItem('slum_art_artworks_db', JSON.stringify(DATA.artworks));
      }

      const storedBlogs = localStorage.getItem('slum_art_blogs_db');
      if (storedBlogs) {
        DATA.blogs = JSON.parse(storedBlogs);
      } else if (DATA.blogs && DATA.blogs.length > 0) {
        localStorage.setItem('slum_art_blogs_db', JSON.stringify(DATA.blogs));
      }
    } catch (err) {
      console.warn("Storage sync notice:", err);
    }
  }
  syncDynamicData();

  // Instant reactive synchronization listeners
  if (typeof BroadcastChannel !== 'undefined') {
    const adminChannel = new BroadcastChannel('slum_art_admin_channel');
    adminChannel.onmessage = function (ev) {
      if (ev.data && ev.data.type === 'DATA_UPDATED') {
        syncDynamicData();
        if (typeof renderArtworks === 'function') renderArtworks();
        if (typeof renderBlogArticles === 'function') renderBlogArticles();
        if (typeof renderHomeBlogHighlights === 'function') renderHomeBlogHighlights();
      }
    };
  }

  window.addEventListener('storage', function (e) {
    if (e.key === 'slum_art_artworks_db' || e.key === 'slum_art_blogs_db') {
      syncDynamicData();
      if (typeof renderArtworks === 'function') renderArtworks();
      if (typeof renderBlogArticles === 'function') renderBlogArticles();
      if (typeof renderHomeBlogHighlights === 'function') renderHomeBlogHighlights();
    }
  });

  window.addEventListener('slum_data_updated', function () {
    syncDynamicData();
    if (typeof renderArtworks === 'function') renderArtworks();
    if (typeof renderBlogArticles === 'function') renderBlogArticles();
    if (typeof renderHomeBlogHighlights === 'function') renderHomeBlogHighlights();
  });

  // DOM Elements cache
  const elements = {
    artworksGrid: document.getElementById('artworksGrid'),
    shopSearchInput: document.getElementById('shopSearchInput'),
    categoryPills: document.querySelectorAll('.cat-pill'),
    sortSelect: document.getElementById('sortSelect'),
    currencyBtns: document.querySelectorAll('.currency-btn'),
    cartTriggers: document.querySelectorAll('.cart-trigger'),
    cartBadge: document.getElementById('cartBadge'),
    cartDrawer: document.getElementById('cartDrawer'),
    cartDrawerClose: document.getElementById('cartDrawerClose'),
    cartDrawerBackdrop: document.getElementById('cartDrawerBackdrop'),
    cartDrawerItems: document.getElementById('cartDrawerItems'),
    cartTotalDisplay: document.getElementById('cartTotalDisplay'),
    cartCheckoutBtn: document.getElementById('cartCheckoutBtn'),
    mobileNavToggle: document.getElementById('mobileNavToggle'),
    mobileDrawer: document.getElementById('mobileDrawer'),
    mobileDrawerClose: document.getElementById('mobileDrawerClose'),
    drawerBackdrop: document.getElementById('drawerBackdrop'),
    quickviewModal: document.getElementById('quickviewModal'),
    videoModal: document.getElementById('videoModal'),
    videoFrame: document.getElementById('videoFrame'),
    gwrModal: document.getElementById('gwrModal'),
    volunteerModal: document.getElementById('volunteerModal'),
    donationModal: document.getElementById('donationModal'),
    calcSlider: document.getElementById('calcSlider'),
    calcAmountDisplay: document.getElementById('calcAmountDisplay'),
    calcMeals: document.getElementById('calcMeals'),
    calcTuition: document.getElementById('calcTuition'),
    calcKits: document.getElementById('calcKits'),
    calcHours: document.getElementById('calcHours'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Helper: Format Price based on current state.currency
  function formatPrice(item, overrideCurrency = null) {
    const curr = overrideCurrency || state.currency;
    if (curr === 'USD') {
      return `$${item.price_usd} USD`;
    }
    return `₦${item.price_ngn.toLocaleString()} NGN`;
  }

  function formatSecondaryPrice(item) {
    if (state.currency === 'USD') {
      return `≈ ₦${item.price_ngn.toLocaleString()}`;
    }
    return `≈ $${item.price_usd} USD`;
  }

  // Toast System
  function showToast(message) {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Currency Switcher (Synchronizes Global State, Bento Engine & Minimalist Hero)
  function setCurrency(newCurr, isManual = true) {
    if (newCurr !== 'USD' && newCurr !== 'NGN') newCurr = 'USD';
    state.currency = newCurr;
    window.currentCurrency = newCurr;
    localStorage.setItem('slum_art_currency', newCurr);
    if (isManual) {
      localStorage.setItem('slum_art_currency_manual', 'true');
    }

    elements.currencyBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.currency === newCurr);
    });

    // Update Hero Donation View
    if (typeof updateMHeroDonationView === 'function') {
      updateMHeroDonationView(newCurr);
    }

    // Update Hero copy lead amount
    const heroLeadAmount = document.getElementById('mHeroLeadAmount');
    if (heroLeadAmount) {
      heroLeadAmount.textContent = newCurr === 'USD' ? '$35' : '₦43,750';
    }

    renderArtworks();
    updateCartDrawer();
    updateImpactCalculator();
    if (typeof updateBentoDonationEngine === 'function') {
      updateBentoDonationEngine(null, newCurr);
    }
    window.dispatchEvent(new CustomEvent('currencyChanged', { detail: newCurr }));
    window.dispatchEvent(new CustomEvent('slum_currency_updated', { detail: newCurr }));

    if (isManual) {
      showToast(`Currency switched to ${newCurr === 'NGN' ? 'Nigerian Naira (₦)' : 'US Dollar ($)'}`);
    }
  }
  window.setCurrency = setCurrency;

  // Asynchronous Geo-IP Precision Currency Detection (verifies country on initial visit)
  async function initGeoCurrencyDetection() {
    // If user has already made an explicit manual choice, do not override
    if (localStorage.getItem('slum_art_currency_manual')) {
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch('https://api.country.is/', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const detected = (data && data.country === 'NG') ? 'NGN' : 'USD';
        if (detected !== state.currency && !localStorage.getItem('slum_art_currency_manual')) {
          setCurrency(detected, false); // silent background update, no toast
        }
      }
    } catch (err) {
      // Secondary fallback
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 2000);
        const res2 = await fetch('https://ipwho.is/', { signal: controller2.signal });
        clearTimeout(timeoutId2);
        if (res2.ok) {
          const data2 = await res2.json();
          const detected = (data2 && data2.country_code === 'NG') ? 'NGN' : 'USD';
          if (detected !== state.currency && !localStorage.getItem('slum_art_currency_manual')) {
            setCurrency(detected, false);
          }
        }
      } catch (e2) {
        // Silently preserve synchronous heuristic
      }
    }
  }

  // Render Artworks (Picture Rail Salon Wall Gallery)
  function renderArtworks() {
    let list = [...DATA.artworks];

    // Filter by Category
    if (state.selectedCategory !== 'all') {
      list = list.filter(item => item.category.toLowerCase().trim() === state.selectedCategory.toLowerCase().trim());
    }

    // Filter by Search Query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.artist.toLowerCase().includes(q) ||
        item.medium.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (state.sortBy === 'price-asc') {
      list.sort((a, b) => (state.currency === 'USD' ? a.price_usd - b.price_usd : a.price_ngn - b.price_ngn));
    } else if (state.sortBy === 'price-desc') {
      list.sort((a, b) => (state.currency === 'USD' ? b.price_usd - a.price_usd : b.price_ngn - a.price_ngn));
    } else if (state.sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Synchronize Picture Rail Gallery Wall with filtered collection
    if (typeof window.mountPictureRailGallery === 'function') {
      ['pictureRailMount', 'homePictureRailMount'].forEach(id => {
        const mount = document.getElementById(id);
        if (mount) {
          window.mountPictureRailGallery(mount, list);
        }
      });
    }

    // Clean up any legacy grid references if present
    if (elements.artworksGrid) {
      elements.artworksGrid.innerHTML = '';
    }
  }

  // Toggle Artworks Expansion (6 vs All)
  window.toggleArtworksExpand = function () {
    state.artworksExpanded = !state.artworksExpanded;
    renderArtworks();
    if (!state.artworksExpanded) {
      const shopEl = document.getElementById('art-shop');
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Clear filters helper
  window.clearShopFilters = function () {
    state.selectedCategory = 'all';
    state.searchQuery = '';
    state.sortBy = 'default';
    if (elements.shopSearchInput) elements.shopSearchInput.value = '';
    elements.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
    if (elements.sortSelect) elements.sortSelect.value = 'default';
    renderArtworks();
  };

  // Quick View Modal
  window.openQuickview = function (id) {
    const item = DATA.artworks.find(a => a.id === id);
    if (!item || !elements.quickviewModal) return;

    state.quickviewItem = item;
    const body = elements.quickviewModal.querySelector('.quickview-grid');
    if (body) {
      body.innerHTML = `
        <div class="quickview-img-wrap museum-view-wrap">
          <div class="museum-spotlight-beam"></div>
          <div class="museum-framed-img">
            <img src="${item.image}" alt="${item.title}" onerror="this.src='assets/images/resources/Art.png'">
          </div>
          <div class="museum-provenance-tag">
            Official Slum Art Provenance Dossier
          </div>
        </div>
        <div class="quickview-details">
          <div class="gallery-salon-tag" style="margin-bottom: 0.5rem;">Permanent Archive • REF: ${item.id.toUpperCase()}</div>
          <h2 class="luxury-modal-title">${item.title}</h2>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
            <span style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">Created by <strong>${item.artist}</strong></span>
            <span class="artist-age-badge">${item.age}</span>
            <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">• Nigeria Atelier</span>
          </div>

          <div class="luxury-dossier-grid">
            <div class="dossier-item">
              <span class="dossier-lbl">Medium & Technique:</span>
              <span class="dossier-val">${item.medium}</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-lbl">Authenticity Guarantee:</span>
              <span class="dossier-val">Signed Certificate of Provenance included</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-lbl">Origin & Community:</span>
              <span class="dossier-val">Pet Bottle School, Lagos, Nigeria</span>
            </div>
            <div class="dossier-item">
              <span class="dossier-lbl">Curatorial Category:</span>
              <span class="dossier-val">${item.category}</span>
            </div>
          </div>

          <div class="artwork-impact-note" style="margin-bottom: 1.5rem; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 1rem; border-radius: 12px;">
            <div>
              <strong style="color: #065f46;">Direct Philanthropic Endowment:</strong><br>
              <span style="color: #047857; font-size: 0.88rem; line-height: 1.5;">${item.impact || '100% of your acquisition proceeds directly covers school fees, books, daily nutritious lunch, and professional fine art mentor materials.'}</span>
            </div>
          </div>

          <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 1.75rem;">
            <span style="font-size: 2.1rem; font-weight: 900; color: #b8860b; font-family: var(--font-heading);">${formatPrice(item)}</span>
            <span style="font-size: 1rem; color: #64748b; font-weight: 600;">(${formatSecondaryPrice(item)})</span>
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-luxury-acquire btn-lg" style="flex: 1; justify-content: center;">
              Acquire Original via Paystack </a>
            <button class="btn btn-bag-round btn-lg" onclick="window.addToArtBag('${item.id}')" style="border-radius: 12px; padding: 0 1.5rem;" title="Add to Art Bag">
              Add to Bag
            </button>
          </div>
        </div>
      `;
    }

    elements.quickviewModal.classList.add('active');
  };

  // Cart / Art Bag Operations
  window.addToArtBag = function (id) {
    const item = DATA.artworks.find(a => a.id === id);
    if (!item) return;

    if (!state.cart.find(c => c.id === id)) {
      state.cart.push(item);
      localStorage.setItem('slum_art_cart', JSON.stringify(state.cart));
      updateCartBadge();
      updateCartDrawer();
      showToast(`"${item.title}" added to your Art Bag!`);
    } else {
      showToast(`"${item.title}" is already in your Art Bag.`);
    }
  };

  window.removeFromArtBag = function (id) {
    state.cart = state.cart.filter(c => c.id !== id);
    localStorage.setItem('slum_art_cart', JSON.stringify(state.cart));
    updateCartBadge();
    updateCartDrawer();
    showToast('Item removed from Art Bag.');
  };

  function updateCartBadge() {
    if (elements.cartBadge) {
      elements.cartBadge.textContent = state.cart.length;
      elements.cartBadge.style.display = state.cart.length > 0 ? 'flex' : 'none';
    }
  }

  function updateCartDrawer() {
    if (!elements.cartDrawerItems) return;

    if (state.cart.length === 0) {
      elements.cartDrawerItems.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h4>Your Art Bag is empty</h4>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Explore original pieces and sponsor a child's education today.</p>
        </div>
      `;
      if (elements.cartTotalDisplay) elements.cartTotalDisplay.textContent = state.currency === 'USD' ? '$0 USD' : '₦0 NGN';
      if (elements.cartCheckoutBtn) {
        elements.cartCheckoutBtn.disabled = true;
        elements.cartCheckoutBtn.style.opacity = '0.5';
      }
      return;
    }

    elements.cartDrawerItems.innerHTML = state.cart.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.title}" class="cart-item-thumb" onerror="this.src='assets/images/resources/Art.png'">
        <div class="cart-item-info">
          <h5>${item.title}</h5>
          <p>${item.artist} (${item.age})</p>
          <strong style="color: var(--color-primary);">${formatPrice(item)}</strong>
        </div>
        <button class="cart-item-remove" onclick="window.removeFromArtBag('${item.id}')" title="Remove">
          </button>
      </div>
    `).join('');

    const total = state.cart.reduce((sum, item) => sum + (state.currency === 'USD' ? item.price_usd : item.price_ngn), 0);
    if (elements.cartTotalDisplay) {
      elements.cartTotalDisplay.textContent = state.currency === 'USD' ? `$${total} USD` : `₦${total.toLocaleString()} NGN`;
    }
    if (elements.cartCheckoutBtn) {
      elements.cartCheckoutBtn.disabled = false;
      elements.cartCheckoutBtn.style.opacity = '1';
      elements.cartCheckoutBtn.href = DATA.contact.donatePaystack;
    }
  }

  function toggleCartDrawer(open) {
    if (!elements.cartDrawer) return;
    if (open) {
      elements.cartDrawer.classList.add('open');
      if (elements.cartDrawerBackdrop) elements.cartDrawerBackdrop.classList.add('active');
    } else {
      elements.cartDrawer.classList.remove('open');
      if (elements.cartDrawerBackdrop) elements.cartDrawerBackdrop.classList.remove('active');
    }
  }

  // Interactive Impact Calculator (Tideline Rising Tide)
  function updateImpactCalculator(newVal = null) {
    const slider = document.getElementById('calcSlider') || document.querySelector('.calcSlider');
    if (!slider) return;

    if (newVal !== null) {
      slider.value = newVal;
    }

    const val = parseInt(slider.value, 10);
    state.calculatorAmount = val;

    const ngnAmount = val * 1250;
    const usdAmount = val;
    const formattedNgn = `₦${ngnAmount.toLocaleString()}`;
    const formattedUsd = `$${usdAmount} USD`;

    // Update all display elements in both dry and water layers
    document.querySelectorAll('.calcAmountDisplay').forEach(el => {
      el.innerHTML = `${formattedUsd} <span class="tlc-calc-naira">(≈${formattedNgn} NGN)</span>`;
    });

    // Formulas:
    const meals = Math.floor(usdAmount * 2);
    const tuition = (usdAmount / 25).toFixed(1);
    const kits = Math.floor(usdAmount / 20);
    const mentorshipHours = Math.floor(usdAmount * 1.5);

    document.querySelectorAll('.calcMeals').forEach(el => el.textContent = `${meals}+`);
    document.querySelectorAll('.calcTuition').forEach(el => el.textContent = `${tuition}`);
    document.querySelectorAll('.calcKits').forEach(el => el.textContent = `${kits}`);
    document.querySelectorAll('.calcHours').forEach(el => el.textContent = `${mentorshipHours}h`);

    // Calculate Dynamic Tide Height (maps $10..$300 to percentage 0.28..0.85)
    const minVal = 10;
    const maxVal = 300;
    const minPct = 0.28;
    const maxPct = 0.85;
    const targetPct = minPct + ((val - minVal) / (maxVal - minVal)) * (maxPct - minPct);
    const tideDisplayPct = Math.round(targetPct * 100);

    const impactSection = document.getElementById('impact-calculator');
    if (impactSection) {
      impactSection.style.setProperty('--tlc-p', targetPct.toFixed(3));
      impactSection.style.setProperty('--tlc-target', targetPct.toFixed(3));
      const h = impactSection.offsetHeight || 750;
      impactSection.style.setProperty('--tlc-top', `${((1 - targetPct) * h).toFixed(1)}px`);
    }

    // Update Buoy floating action button
    const buoyText = document.getElementById('calcBuoyText');
    if (buoyText) {
      buoyText.textContent = `Fund This Direct Impact ($${val} • ${formattedNgn})`;
    }

    // Update level indicator text
    document.querySelectorAll('.calcLevelPct').forEach(el => el.textContent = `${tideDisplayPct}%`);

    // Update active preset button
    document.querySelectorAll('.tlc-preset-btn').forEach(btn => {
      const btnVal = parseInt(btn.dataset.val, 10);
      if (btnVal === val) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Sync any secondary sliders
    document.querySelectorAll('.calcSlider').forEach(s => {
      if (s !== slider && s.value !== String(val)) {
        s.value = val;
      }
    });
  }

  // Video Playback Modal
  window.openVideoModal = function (youtubeId = 'VNrDvOuh_-E') {
    const videoModal = document.getElementById('videoModal');
    const videoFrame = document.getElementById('videoFrame');
    if (videoModal && videoFrame) {
      videoFrame.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      videoModal.classList.add('active');
      return;
    }
    const inlinePlayer = document.getElementById('heroInlinePlayer');
    if (inlinePlayer) {
      inlinePlayer.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      const videoCard = document.getElementById('documentary-video');
      if (videoCard) {
        videoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  window.closeVideoModal = function () {
    if (!elements.videoModal || !elements.videoFrame) return;
    elements.videoFrame.src = '';
    elements.videoModal.classList.remove('active');
  };

  // Guinness World Record Comic Book Project Registration
  window.openGwrModal = function () {
    if (elements.gwrModal) elements.gwrModal.classList.add('active');
  };

  window.handleGwrSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.fullName.value;
    const email = form.email.value;
    const mode = form.comicMode ? form.comicMode.value : 'Digital Edition';

    const refId = 'SLUM-GWR-' + Math.floor(1000 + Math.random() * 9000);

    const body = elements.gwrModal.querySelector('.modal-card');
    if (body) {
      body.innerHTML = `
        <button class="modal-close-btn" onclick="window.closeAllModals()">&times;</button>
        <div style="padding: 3rem 2rem; text-align: center;">
          
          <div class="section-tag" style="margin-bottom: 0.75rem;">Guinness World Records™ Official Entry</div>
          <h2 style="font-size: 2rem; margin-bottom: 0.75rem;">You're in the Record Books!</h2>
          <p style="color: var(--text-muted); max-width: 520px; margin: 0 auto 1.5rem; line-height: 1.6;">
            Congratulations <strong>${name}</strong>! Your registration for the <strong>Largest Collaborative Comic Book Project</strong> has been confirmed.
          </p>
          <div style="background: var(--bg-subtle); border: 2px dashed var(--color-amber); border-radius: var(--radius-lg); padding: 1.5rem; max-width: 420px; margin: 0 auto 2rem;">
            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em;">Your Official Participant Code</div>
            <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); font-family: monospace; margin: 0.5rem 0;">${refId}</div>
            <div style="font-size: 0.82rem; color: var(--color-primary-dark); font-weight: 600;">Edition: ${mode} • Certificate Credited</div>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 2rem;">
            A confirmation receipt has been scheduled to <strong>${email}</strong>. Keep your code handy for exhibition accreditation!
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="window.print()">Print Confirmation</button>
            <button class="btn btn-primary" onclick="window.closeAllModals()">Continue Exploring</button>
          </div>
        </div>
      `;
    }
  };

  // Smooth Scroll to Guinness World Record Comic Book Section
  window.scrollToGuinnessRecord = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    const target = document.getElementById('guinness-record') || document.querySelector('.gwr-backing-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Volunteer Modal
  window.openVolunteerModal = function () {
    if (elements.volunteerModal) elements.volunteerModal.classList.add('active');
  };

  window.handleVolunteerSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.fullName.value;
    const body = elements.volunteerModal.querySelector('.modal-card');
    if (body) {
      body.innerHTML = `
        <button class="modal-close-btn" onclick="window.closeAllModals()">&times;</button>
        <div style="padding: 2.25rem 1.5rem; text-align: center;">
          
          <div class="section-tag" style="margin-bottom: 0.5rem;">Guinness World Records™ Official Entry</div>
          <h2 style="font-size: 1.85rem; margin-bottom: 0.75rem;">Welcome to the Record-Breaking Team!</h2>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6;">
            Thank you, <strong>${name}</strong>! You are officially registered to volunteer with Slum Art Foundation on our historic Guinness World Record comic book project empowering 5,000 children.
          </p>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 2rem;">
            Our volunteer coordination team will review your application and reach out via WhatsApp/email within 48 hours with exhibition dates and atelier workshop schedules.
          </p>
          <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
            <a href="${DATA.contact.whatsapp}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="background: #25D366; border-color: #25D366; color: #ffffff;">
              Join Volunteer WhatsApp Group
            </a>
            <button class="btn btn-secondary btn-lg" onclick="window.closeAllModals()">Continue Exploring</button>
          </div>
        </div>
      `;
    }
  };

  // Donation Modal
  window.openDonationModal = function (presetUsd = 50) {
    if (elements.donationModal) elements.donationModal.classList.add('active');
  };

  // Guinness World Record Comic Book Project Tier Selection ($1 Movement)
  window.selectComicTier = function (amount, cardEl, label = null, ctaText = null) {
    const cards = document.querySelectorAll('.gwr-pledge-tier-pill, .gwr-tier-card');
    cards.forEach((c) => c.classList.remove('active'));
    if (cardEl) {
      cardEl.classList.add('active');
    }
    const btn = document.getElementById('gwrBackNowBtn');
    const btnText = document.getElementById('gwrBackNowBtnText');
    if (btnText && ctaText) {
      btnText.innerHTML = ctaText;
    } else if (btn) {
      btn.innerHTML = `<span>Pledge $${amount} &amp; Educate Children</span> `;
    }
  };


  // Comic Ambassador Modal (5,000 Volunteers Campaign)
  window.openComicAmbassadorModal = function () {
    const modal = document.getElementById('comicAmbassadorModal');
    if (modal) modal.classList.add('active');
  };

  window.handleComicAmbassadorSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.fullName.value;
    const handle = form.socialHandle.value;
    const modal = document.getElementById('comicAmbassadorModal');

    const ambassadorId = 'AMB-5K-' + Math.floor(1000 + Math.random() * 9000);

    if (modal) {
      const card = modal.querySelector('.modal-card');
      if (card) {
        card.innerHTML = `
          <button class="modal-close-btn" onclick="window.closeAllModals()">&times;</button>
          <div style="padding: 3rem 2rem; text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; background: #fff2ea; color: var(--color-primary); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2.2rem;">
              </div>
            <div class="section-tag" style="margin-bottom: 0.5rem;">Ambassador Onboarded</div>
            <h2 style="font-size: 2rem; margin-bottom: 0.75rem;">Welcome to the Movement, ${name}!</h2>
            <p style="color: var(--text-muted); max-width: 540px; margin: 0 auto 1.5rem; line-height: 1.6;">
              You are officially Ambassador <strong>#${ambassadorId}</strong> for the 5,000 Comic Movement. Handle: <strong>${handle}</strong>.
            </p>

            <div style="background: var(--bg-subtle); border: 2px dashed var(--color-primary); border-radius: var(--radius-lg); padding: 1.5rem; max-width: 460px; margin: 0 auto 2rem; text-align: left;">
              <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-main);">Next Steps for Your CapCut Drop:</div>
              <ul style="font-size: 0.85rem; color: #475569; padding-left: 1.25rem; line-height: 1.6;">
                <li>Download your pre-edited CapCut template file sent to your email.</li>
                <li>Record a quick 5-second selfie intro ("I am supporting Slum Art kids!") and splice into the file.</li>
                <li>Post at the synchronized drop time tagging <strong>@adetunwaseadenle</strong> & <strong>#SlumArtComic</strong>.</li>
                <li>Influence and onboard your <strong>3 peers</strong> to keep the viral wave multiplying!</li>
              </ul>
            </div>

            <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 2rem;">
              Click below to activate your <strong>$1/month</strong> pledge via Paystack to unlock your daily web comic pass:
            </p>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <a href="https://paystack.shop/pay/lk0hlrdlun" target="_blank" class="btn btn-primary btn-lg">
                Activate $1/mo Comic Access
              </a>
              <button class="btn btn-secondary" onclick="window.closeAllModals()">Done</button>
            </div>
          </div>
        `;
      }
    }
  };

  // Atelier Showcase Minimal Carousel - 100% INDIVIDUAL PAPER COLLAGE PORTRAITS + CNN BROADCAST PROOF
  const ATELIER_CAROUSEL_DATA = [
    {
      img: 'assets/images/custom_portrait_example.jpg',
      alt: 'Original Handcrafted Paper Collage Portrait from Recycled Newsprint',
      caption: 'Original Handcrafted Paper Collage Portrait \u2022 Recycled Newsprint on Board'
    },
    {
      img: 'assets/images/custom_portrait_example_2.jpg',
      alt: 'Youth Scholar Paper Collage Portrait on Archival Museum Board',
      caption: 'Youth Scholar Collage Portrait \u2022 Archival Museum Board'
    },
    {
      img: 'assets/images/custom_portrait_example_3.jpg',
      alt: 'Bespoke 1-of-1 Paper Mosaic Portrait with Hand-Torn Color Shading',
      caption: 'Bespoke 1-of-1 Paper Mosaic Portrait \u2022 Precision Hand-Torn Color Shading'
    },
    {
      img: 'assets/images/custom_portrait_example_4.jpg',
      alt: 'Commissioned Atelier Portrait with Layered Reclaimed Typography',
      caption: 'Commissioned Atelier Portrait \u2022 Layered Reclaimed Typography'
    },
    {
      img: 'assets/images/custom_portrait_example_5.jpg',
      alt: 'Hope in the Slum - Fine-Art Scholar Paper Collage Portrait',
      caption: 'Fine-Art Scholar Collage Portrait \u2022 Custom Archival UV Framing'
    },
    {
      img: 'assets/images/cnn_collage_wall_wide.jpg',
      alt: 'CNN International Feature - Hand-Torn Paper Mosaic Exhibition Wall',
      caption: 'CNN International Feature \u2022 Hand-Torn Paper Mosaic Exhibition Wall'
    },
    {
      img: 'assets/images/cnn_collage_portrait_detail.jpg',
      alt: 'Master Fine-Art Craftsmanship - Hand-Torn Reclaimed Magazine Mosaic',
      caption: 'Master Fine-Art Craftsmanship \u2022 Hand-Torn Reclaimed Magazine Mosaic'
    },
    {
      img: 'assets/images/cnn_portraits_anchors_closeup.jpg',
      alt: 'CNN Anchors Paper Mosaic Portraits for #MyFreedomDay Broadcast',
      caption: 'CNN Anchors Paper Mosaic Portraits \u2022 #MyFreedomDay Broadcast'
    },
    {
      img: 'assets/images/cnn_doc_frame_30s.jpg',
      alt: 'CNN International Feature & Interview \u2022 Anchor Zain Asher Presents Slum Art & Honors Founder Adetunwase Adenle',
      caption: 'CNN International Feature \u2022 Anchor Zain Asher Presents Slum Art & Honors Founder Ade'
    }
  ];

  let currentAtelierSlide = 0;
  let atelierSlideTimer = null;
  let activeCustomProductType = 'portrait';
  let activeAtelierMedia = 'portraits';

  function updateAtelierPrice(productType) {
    if (productType) activeCustomProductType = productType;
    const priceEls = document.querySelectorAll('#cpcPriceTag, .cpc-price-tag');
    if (!priceEls || priceEls.length === 0) return;
    const curr = (typeof state !== 'undefined' && state.currency) || window.currentCurrency || 'USD';
    const priceText = activeCustomProductType === 'portrait'
      ? (curr === 'USD' ? 'From $150 USD' : 'From ₦220,000 NGN')
      : (curr === 'USD' ? 'From $120 USD' : 'From ₦180,000 NGN');
    priceEls.forEach(el => { el.textContent = priceText; });
  }

  // Switch between Individual Portraits and CNN Feature Video
  window.switchAtelierMedia = function (mediaType, autoPlay = false) {
    activeAtelierMedia = mediaType || 'portraits';
    const isVideo = activeAtelierMedia === 'video';

    // Update switcher buttons
    const portraitBtns = document.querySelectorAll('#cpcMediaBtnPortraits, .cpc-media-btn-portraits');
    const videoBtns = document.querySelectorAll('#cpcMediaBtnVideo, .cpc-media-btn-video');

    portraitBtns.forEach(b => {
      b.classList.toggle('active', !isVideo);
      b.setAttribute('aria-selected', !isVideo ? 'true' : 'false');
    });
    videoBtns.forEach(b => {
      b.classList.toggle('active', isVideo);
      b.setAttribute('aria-selected', isVideo ? 'true' : 'false');
    });

    if (isVideo) {
      window.setAtelierSlide(8);
      if (autoPlay) {
        window.playCpcSlideVideo();
      }
    } else {
      if (currentAtelierSlide === 8) {
        window.setAtelierSlide(0);
      }
    }
  };

  window.playCpcSlideVideo = function (e) {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    stopAtelierAutoplay();
    if (currentAtelierSlide !== 8) {
      window.setAtelierSlide(8);
    }
    const slideVideos = document.querySelectorAll('#cpcSlideVideo, .cpc-slide-video-wrap video');
    const overlays = document.querySelectorAll('#cpcSlideVideoOverlay, .cpc-slide-video-overlay');
    overlays.forEach(ov => ov.classList.add('is-hidden'));

    slideVideos.forEach(v => {
      v.play().catch(err => {
        console.warn('Video playback prevented:', err);
      });
    });
  };

  window.pauseCpcSlideVideo = function () {
    const slideVideos = document.querySelectorAll('#cpcSlideVideo, .cpc-slide-video-wrap video');
    const overlays = document.querySelectorAll('#cpcSlideVideoOverlay, .cpc-slide-video-overlay');
    slideVideos.forEach(v => {
      try { v.pause(); } catch (e) {}
    });
    overlays.forEach(ov => ov.classList.remove('is-hidden'));
  };

  window.playCnnDocVideo = function () {
    window.playCpcSlideVideo();
  };

  function initCpcSlideVideoEvents() {
    const slideVideos = document.querySelectorAll('#cpcSlideVideo, .cpc-slide-video-wrap video');
    slideVideos.forEach(video => {
      video.addEventListener('play', () => {
        const wrap = video.closest('.cpc-slide-video-wrap');
        if (wrap) {
          const ov = wrap.querySelector('.cpc-slide-video-overlay');
          if (ov) ov.classList.add('is-hidden');
        }
        stopAtelierAutoplay();
      });
      video.addEventListener('ended', () => {
        const wrap = video.closest('.cpc-slide-video-wrap');
        if (wrap) {
          const ov = wrap.querySelector('.cpc-slide-video-overlay');
          if (ov) ov.classList.remove('is-hidden');
        }
      });
    });
  }

  window.setAtelierSlide = function (idx) {
    const total = ATELIER_CAROUSEL_DATA.length;
    currentAtelierSlide = (idx + total) % total;

    // Pause slide video if leaving slide 8
    if (currentAtelierSlide !== 8) {
      const slideVideos = document.querySelectorAll('#cpcSlideVideo, .cpc-slide-video-wrap video');
      slideVideos.forEach(v => {
        try { v.pause(); } catch (e) {}
      });
      const overlays = document.querySelectorAll('#cpcSlideVideoOverlay, .cpc-slide-video-overlay');
      overlays.forEach(ov => ov.classList.remove('is-hidden'));
    }

    // Sync media switcher buttons state
    const portraitBtns = document.querySelectorAll('#cpcMediaBtnPortraits, .cpc-media-btn-portraits');
    const videoBtns = document.querySelectorAll('#cpcMediaBtnVideo, .cpc-media-btn-video');
    const isVideoSlide = (currentAtelierSlide === 8);
    portraitBtns.forEach(b => {
      b.classList.toggle('active', !isVideoSlide);
      b.setAttribute('aria-selected', !isVideoSlide ? 'true' : 'false');
    });
    videoBtns.forEach(b => {
      b.classList.toggle('active', isVideoSlide);
      b.setAttribute('aria-selected', isVideoSlide ? 'true' : 'false');
    });

    // Update slides in any active carousel viewport
    const viewports = document.querySelectorAll('.cpc-carousel-viewport');
    viewports.forEach(vp => {
      const slides = vp.querySelectorAll('.cpc-carousel-slide');
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === currentAtelierSlide);
      });
    });

    // Update indicators
    const indicatorBars = document.querySelectorAll('.cpc-indicator-bar');
    indicatorBars.forEach((bar, i) => {
      const barIdx = i % total;
      bar.classList.toggle('active', barIdx === currentAtelierSlide);
    });

    // Update captions
    const captions = document.querySelectorAll('#cpcSlideCaption, .cpc-slide-caption');
    captions.forEach(c => {
      if (ATELIER_CAROUSEL_DATA[currentAtelierSlide]) {
        c.textContent = ATELIER_CAROUSEL_DATA[currentAtelierSlide].caption;
      }
    });

    // Update slide counters dynamically
    const counters = document.querySelectorAll('#cpcSlideCounter, .cpc-slide-counter');
    const totalStr = String(total).padStart(2, '0');
    counters.forEach(cnt => {
      const numStr = String(currentAtelierSlide + 1).padStart(2, '0');
      cnt.innerHTML = `<strong>${numStr}</strong> / ${totalStr}`;
    });

    // Update CNN thumbnail strip active state if present
    const thumbs = document.querySelectorAll('.cpc-cnn-photo-thumb');
    thumbs.forEach(thumb => {
      const thumbIdx = parseInt(thumb.getAttribute('data-slide-index'), 10);
      thumb.classList.toggle('active', thumbIdx === currentAtelierSlide);
    });
  };

  window.nextAtelierSlide = function () {
    window.setAtelierSlide(currentAtelierSlide + 1);
  };

  window.prevAtelierSlide = function () {
    window.setAtelierSlide(currentAtelierSlide - 1);
  };

  function startAtelierAutoplay() {
    if (atelierSlideTimer) clearInterval(atelierSlideTimer);
    atelierSlideTimer = setInterval(() => {
      const slideVideo = document.getElementById('cpcSlideVideo');
      if (slideVideo && !slideVideo.paused) {
        return; // Don't interrupt playing video
      }
      if (currentAtelierSlide === 8) {
        return; // Stay on video slide so user can inspect / play
      }
      window.nextAtelierSlide();
    }, 5000);
  }

  function stopAtelierAutoplay() {
    if (atelierSlideTimer) {
      clearInterval(atelierSlideTimer);
      atelierSlideTimer = null;
    }
  }

  // Switch between Collage Portrait and Thematic Artwork
  window.switchCustomProduct = function (productType) {
    activeCustomProductType = productType || 'portrait';
    const isPortrait = activeCustomProductType === 'portrait';

    // Tabs
    const portraitTabs = document.querySelectorAll('#cpcTabPortrait');
    const artworkTabs = document.querySelectorAll('#cpcTabArtwork');
    portraitTabs.forEach(t => {
      t.classList.toggle('active', isPortrait);
      t.setAttribute('aria-selected', isPortrait ? 'true' : 'false');
    });
    artworkTabs.forEach(t => {
      t.classList.toggle('active', !isPortrait);
      t.setAttribute('aria-selected', !isPortrait ? 'true' : 'false');
    });

    // Eyebrow
    const eyebrows = document.querySelectorAll('#cpcEyebrow');
    eyebrows.forEach(eb => {
      eb.innerHTML = isPortrait
        ? '<span class="cpc-eyebrow-cnn">CNN</span> As Seen on CNN &bull; Private Atelier'
        : 'Bespoke Commission Atelier &bull; Fine-Art Masterpiece';
    });

    // Headings
    const titles = document.querySelectorAll('#cpcTitle');
    titles.forEach(t => {
      t.textContent = isPortrait
        ? 'Turn Any Photo into a Handcrafted Paper Collage Portrait'
        : 'Commission an Original Recycled Fine-Art Collage Artwork';
    });

    // Descriptions
    const descs = document.querySelectorAll('#cpcDesc');
    descs.forEach(d => {
      d.textContent = isPortrait
        ? '4-time Guinness World Record holder Adetunwase Adenle and our young scholars transform your photo into an original fine-art portrait assembled entirely from hand-torn recycled magazines on archival museum board.'
        : 'Collaborate directly with our master scholars to craft an original thematic artwork—African cultural heritage, wildlife, lagoon seascapes, or abstract mosaics hand-torn from reclaimed paper on museum board.';
    });

    // Impact text
    const impacts = document.querySelectorAll('#cpcImpactText');
    impacts.forEach(imp => {
      imp.textContent = isPortrait
        ? "100% of your commission funds a child's accredited schooling, uniform, and daily meals in Lagos."
        : "Directly funds accredited schooling and hot meals for vulnerable youth in Ijora Badia, Lagos.";
    });

    // Primary commission buttons
    const btns = document.querySelectorAll('#cpcBtnOrder');
    btns.forEach(b => {
      b.innerHTML = isPortrait
        ? 'Commission a Portrait &rarr;'
        : 'Commission Artwork &rarr;';
      b.setAttribute('onclick', isPortrait ? "window.openCustomProductModal('portrait')" : "window.openCustomProductModal('artwork')");
    });

    // WhatsApp links
    const waLinks = document.querySelectorAll('#cpcWaLink');
    waLinks.forEach(wa => {
      wa.href = isPortrait
        ? 'https://wa.me/2348059994834?text=Hello%20Slum%20Art!%20I%20would%20like%20to%20commission%20a%20custom%20Collage%20Portrait%20from%20my%20photo.'
        : 'https://wa.me/2348059994834?text=Hello%20Slum%20Art!%20I%20would%20like%20to%20commission%20a%20custom%20Collage%20Artwork.';
    });

    // Price
    updateAtelierPrice(productType);

    // Contextual carousel jump
    if (isPortrait) {
      window.setAtelierSlide(0);
    } else {
      window.setAtelierSlide(1);
    }
  };

  function initAtelierCarousel() {
    const viewports = document.querySelectorAll('.cpc-carousel-viewport');
    if (!viewports.length) return;

    viewports.forEach(vp => {
      // Pause on hover
      vp.addEventListener('mouseenter', stopAtelierAutoplay);
      vp.addEventListener('mouseleave', startAtelierAutoplay);

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      vp.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      vp.addEventListener('touchend', (e) => {
        // If touching active playing video controls, do not advance slide
        const activeVid = vp.querySelector('.cpc-slide-video-wrap video');
        if (activeVid && !activeVid.paused && e.target && e.target.closest('.cpc-slide-video-wrap')) {
          return;
        }
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 40) {
          window.nextAtelierSlide();
        } else if (touchEndX > touchStartX + 40) {
          window.prevAtelierSlide();
        }
      }, { passive: true });
    });

    // Update price on currency changes
    window.addEventListener('currencyChanged', () => updateAtelierPrice());
    window.addEventListener('slum_currency_updated', () => updateAtelierPrice());

    // Start autoplay & video listeners
    startAtelierAutoplay();
    updateAtelierPrice('portrait');
    initCpcSlideVideoEvents();
  }

  // Quick Mission Navigator (Direct 1-Click Access to Key Tasks)
  window.triggerQuickMission = function (task) {
    // Close the dropdown menu
    const dropdown = document.getElementById('quickMissionDropdown');
    const trigger = document.getElementById('quickMissionBtn');
    if (dropdown) dropdown.classList.remove('open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');

    // Close mobile drawer if open
    const mobileDrawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');

    switch (task) {
      case 'donation':
        const donateSection = document.getElementById('donate-section') || document.getElementById('bento-donation-engine') || document.getElementById('crowdfunding');
        if (donateSection) {
          donateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          donateSection.classList.add('section-highlight-pulse');
          setTimeout(() => donateSection.classList.remove('section-highlight-pulse'), 2500);
        } else {
          window.open('https://paystack.shop/pay/lk0hlrdlun', '_blank');
        }
        break;

      case 'shop':
        const shopSection = document.getElementById('art-shop') || document.getElementById('homePictureRailSection') || document.getElementById('shopCatalogMount');
        if (shopSection) {
          shopSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = 'shop.html';
        }
        break;

      case 'portrait':
        window.openCustomProductModal('portrait');
        break;

      case 'volunteer':
        window.openVolunteerModal();
        break;

      case 'partnership':
        window.openPartnershipModal();
        break;

      default:
        break;
    }
  };

  window.openPartnershipModal = function () {
    const modal = document.getElementById('partnershipModal');
    if (modal) {
      document.body.classList.add('modal-open');
      modal.classList.add('active');
    }
  };

  window.handlePartnershipSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.partnerName ? form.partnerName.value : 'Partner';
    const org = form.organization ? form.organization.value : 'Organization';
    const modal = document.getElementById('partnershipModal');
    if (modal) {
      const card = modal.querySelector('.modal-card');
      if (card) {
        card.innerHTML = `
          <button class="modal-close-btn" onclick="window.closeAllModals()">&times;</button>
          <div style="padding: 2.5rem 1.75rem; text-align: center;">
            
            <h3 style="font-size: 1.45rem; font-weight: 800; margin-bottom: 0.5rem; color: var(--text-main);">Partnership Proposal Received</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; max-width: 440px; margin: 0 auto 1.5rem;">
              Thank you, <strong>${name}</strong> from <strong>${org}</strong>. Our executive leadership and founder Adetunwase Adenle will review your inquiry and follow up within 24 hours.
            </p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
              <a href="https://wa.me/2348059994834?text=Hello%20Slum%20Art!%20I%20just%20submitted%20a%20partnership%20proposal%20for%20${encodeURIComponent(org)}." target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                Chat on WhatsApp Concierge
              </a>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.closeAllModals()">Close</button>
            </div>
          </div>
        `;
      }
    }
  };

  function initQuickMission() {
    const dropdown = document.getElementById('quickMissionDropdown');
    const trigger = document.getElementById('quickMissionBtn');
    if (!dropdown || !trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  }

  window.selectModalCustomProduct = function (productType) {
    const cardArtwork = document.getElementById('modalCardArtwork');
    const cardPortrait = document.getElementById('modalCardPortrait');
    const radioArtwork = document.getElementById('radioProductArtwork');
    const radioPortrait = document.getElementById('radioProductPortrait');
    const modalTitle = document.getElementById('customProductModalTitle');
    const modalDesc = document.getElementById('customProductModalDesc');
    const groupArtwork = document.getElementById('groupArtworkConcept');
    const groupPortrait = document.getElementById('groupPortraitSubject');
    const uploadLabel = document.getElementById('cpcUploadLabel');
    const submitBtnText = document.getElementById('cpcSubmitBtnText');

    if (productType === 'artwork') {
      if (cardArtwork) cardArtwork.classList.add('active');
      if (cardPortrait) cardPortrait.classList.remove('active');
      if (radioArtwork) radioArtwork.checked = true;
      if (modalTitle) modalTitle.textContent = 'Commission Custom Collage Artwork';
      if (modalDesc) modalDesc.textContent = 'Commission an original bespoke fine-art collage crafted by our young master scholars using upcycled paper, magazines, and sustainable materials on museum archival board. Funds accredited tuition & meals for a child in need.';
      if (groupArtwork) groupArtwork.style.display = 'block';
      if (groupPortrait) groupPortrait.style.display = 'none';
      if (uploadLabel) uploadLabel.textContent = 'Reference Image, Sketch, or Moodboard (Optional)';
      if (submitBtnText) submitBtnText.textContent = 'Request Custom Collage Artwork →';
    } else {
      if (cardPortrait) cardPortrait.classList.add('active');
      if (cardArtwork) cardArtwork.classList.remove('active');
      if (radioPortrait) radioPortrait.checked = true;
      if (modalTitle) modalTitle.textContent = 'Order a Custom Collage Portrait';
      if (modalDesc) modalDesc.textContent = 'Send us a photo of yourself, a family member, child, pet, or memorial tribute. Guided by 4-time Guinness World Record holder Adetunwase Adenle, our scholars transform your photo into an astonishing hand-torn paper collage portrait on museum board.';
      if (groupArtwork) groupArtwork.style.display = 'none';
      if (groupPortrait) groupPortrait.style.display = 'block';
      if (uploadLabel) uploadLabel.textContent = 'Photo Reference *';
      if (submitBtnText) submitBtnText.textContent = 'Request Custom Collage Portrait →';
    }
  };

  window.openCustomProductModal = function (productType) {
    const modal = document.getElementById('customPortraitModal');
    if (modal) {
      document.body.classList.add('modal-open');
      modal.classList.add('active');
      window.selectModalCustomProduct(productType || 'portrait');
    }
  };

  window.openCustomPortraitModal = function () {
    window.openCustomProductModal('portrait');
  };

  window.handlePortraitPhotoSelect = function (input) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    const promptEl = document.getElementById('cpcUploadPrompt');
    const successEl = document.getElementById('cpcUploadSuccess');
    const nameEl = document.getElementById('cpcFileName');
    const thumbEl = document.getElementById('cpcThumbPreview');

    if (nameEl) nameEl.textContent = file.name;
    if (thumbEl) {
      const reader = new FileReader();
      reader.onload = function (e) {
        thumbEl.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    if (promptEl) promptEl.style.display = 'none';
    if (successEl) successEl.style.display = 'flex';
  };

  window.handleCustomPortraitSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const productType = form.customProductType ? form.customProductType.value : 'Collage Portrait';
    const isArtwork = productType === 'Collage Artwork';
    const name = form.fullName ? form.fullName.value : 'Patron';
    const email = form.email ? form.email.value : '';
    const phone = form.phone ? form.phone.value : '';
    const location = form.location ? form.location.value : '';
    const subject = isArtwork 
      ? (form.artworkConcept ? form.artworkConcept.value : 'Original Collage Artwork')
      : (form.subjectType ? form.subjectType.value : 'Custom Collage Portrait');
    const palette = isArtwork && form.colorPalette ? form.colorPalette.value : 'Recycled Media Paper Collage';
    const medium = isArtwork ? `Recycled Media Collage (${palette})` : (form.medium ? form.medium.value : 'Signature Recycled Paper Mosaic');
    const sizeTier = form.sizeTier ? form.sizeTier.value : 'Standard Studio';
    const photoLink = form.photoLink ? form.photoLink.value : '';
    const notes = form.notes ? form.notes.value : '';

    const refId = (isArtwork ? 'COLLAGE-ART-' : 'COLLAGE-PORTRAIT-') + Math.floor(1000 + Math.random() * 9000);

    // Save commission draft to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('slum_custom_portraits') || '[]');
      existing.push({
        refId,
        productType,
        name,
        email,
        phone,
        location,
        subject,
        medium,
        sizeTier,
        photoLink,
        notes,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('slum_custom_portraits', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    const modal = document.getElementById('customPortraitModal');
    if (modal) {
      const card = modal.querySelector('.modal-card');
      if (card) {
        const waText = encodeURIComponent(
          `Hello Slum Art Foundation! I just submitted a Custom Commission request for ${productType} (Ref: ${refId}).\n\nProduct: ${productType}\nName: ${name}\nTheme/Subject: ${subject}\nMedium: ${medium}\nSize: ${sizeTier}\nDelivery: ${location}\n\nI am sharing my details and photos/vision here on WhatsApp!`
        );
        const waLink = `https://wa.me/2348059994834?text=${waText}`;

        card.innerHTML = `
          <button class="modal-close-btn" onclick="window.closeAllModals()">&times;</button>
          <div style="padding: 2.75rem 2rem; text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; background: #ecfdf5; color: #059669; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; box-shadow: 0 8px 24px rgba(5, 150, 105, 0.2);">
              </div>
            <div class="section-tag" style="margin-bottom: 0.5rem;">Commission Received &bull; 100% Impact</div>
            <h2 style="font-size: 1.85rem; margin-bottom: 0.6rem; color: var(--text-main);">Your ${productType} Is in the Works!</h2>
            <p style="color: var(--text-muted); max-width: 520px; margin: 0 auto 1.5rem; line-height: 1.6; font-size: 0.95rem;">
              Thank you, <strong>${name}</strong>! Our master artist mentors and talented youth scholars in Nigeria are honored to create your 1-of-1 original ${productType.toLowerCase()} masterpiece.
            </p>

            <div style="background: var(--bg-subtle, #f8fafc); border: 2px dashed #f59e0b; border-radius: var(--radius-lg, 16px); padding: 1.4rem 1.5rem; max-width: 480px; margin: 0 auto 1.75rem; text-align: left;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 0.5rem;">
                <span style="font-size: 0.76rem; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.05em;">Commission Order Ref</span>
                <span style="font-size: 1.15rem; font-weight: 900; color: #b45309; font-family: monospace;">${refId}</span>
              </div>
              <div style="font-size: 0.88rem; color: #334155; line-height: 1.55;">
                <div><strong>Product:</strong> ${productType}</div>
                <div><strong>${isArtwork ? 'Concept/Theme' : 'Subject'}:</strong> ${subject}</div>
                <div><strong>Medium:</strong> ${medium}</div>
                <div><strong>Tier:</strong> ${sizeTier}</div>
                <div><strong>Delivery to:</strong> ${location} (Free Worldwide DHL Express)</div>
              </div>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 1rem 1.25rem; max-width: 480px; margin: 0 auto 1.75rem; text-align: left; font-size: 0.85rem; color: #92400e; line-height: 1.5;">
              <strong>Next Step (Important):</strong> Please connect with our master artist atelier on WhatsApp quoting ref <strong>${refId}</strong> to finalize sketches, references, and delivery details.
            </div>

            <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="background: #25D366; border-color: #25D366; color: #ffffff;">
                Chat on WhatsApp (Ref ${refId})
              </a>
              <button class="btn btn-secondary" onclick="window.print()">Print Receipt</button>
              <button class="btn btn-secondary" onclick="window.closeAllModals()">Done</button>
            </div>
          </div>
        `;
      }
    }
  };

  // ===================================================================
  // BLOGS ENGINE & REAL-TIME READER
  // ===================================================================

  // Render Latest Blogs on Homepage (#homeLatestBlogsGrid)
  function renderHomeBlogHighlights() {
    const container = document.getElementById('homeLatestBlogsGrid');
    if (!container) return;

    const blogs = (DATA.blogs && DATA.blogs.length > 0) ? DATA.blogs : [];
    if (blogs.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <p>No published field stories at the moment.</p>
        </div>
      `;
      return;
    }

    // Top 3 stories (featured first, then recent)
    const sorted = [...blogs].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    const highlights = sorted.slice(0, 3);

    container.innerHTML = highlights.map(blog => `
      <article class="home-blog-card" onclick="window.openBlogModal('${blog.id}')">
        <div class="home-blog-thumb">
          <img src="${blog.image}" alt="${blog.title}" loading="lazy" onerror="this.src='assets/images/resources/Art.png'">
          <span class="home-blog-tag">${blog.category || 'Field Note'}</span>
          <span class="home-blog-readtime">${blog.readTime || '4 min'}</span>
        </div>
        <div class="home-blog-body">
          <div class="home-blog-meta">
            <span class="home-blog-date">${blog.date}</span>
            <span class="home-blog-author">${blog.author}</span>
          </div>
          <h3 class="home-blog-title">${blog.title}</h3>
          <p class="home-blog-excerpt">${blog.excerpt || ''}</p>
          <div class="home-blog-footer">
            <span class="home-blog-read-link">
              Read Story </span>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Render Blog Catalog on Dedicated Blog Page (blog.html)
  function renderBlogArticles() {
    const gridEl = document.getElementById('blogArticlesGrid');
    const heroEl = document.getElementById('blogFeaturedHero');
    if (!gridEl && !heroEl) return;

    let list = [...(DATA.blogs || [])];

    // Filter by Category
    if (state.blogCategory && state.blogCategory !== 'all') {
      list = list.filter(b => (b.category || '').toLowerCase().trim() === state.blogCategory.toLowerCase().trim());
    }

    // Filter by Search Query
    if (state.blogSearchQuery) {
      const q = state.blogSearchQuery.toLowerCase().trim();
      list = list.filter(b => 
        (b.title || '').toLowerCase().includes(q) ||
        (b.excerpt || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.category || '').toLowerCase().includes(q)
      );
    }

    // Render Featured Hero if present and on 'all' without search
    if (heroEl) {
      if ((!state.blogCategory || state.blogCategory === 'all') && !state.blogSearchQuery && list.length > 0) {
        const featured = list.find(b => b.featured) || list[0];
        heroEl.style.display = 'block';
        heroEl.innerHTML = `
          <div class="blog-featured-card" onclick="window.openBlogModal('${featured.id}')">
            <div class="blog-featured-media">
              <img src="${featured.image}" alt="${featured.title}" onerror="this.src='assets/images/resources/Art.png'">
              <span class="featured-badge">Featured Milestone</span>
            </div>
            <div class="blog-featured-content">
              <div class="blog-meta-pills">
                <span class="pill-category">${featured.category}</span>
                <span class="pill-readtime">${featured.readTime}</span>
                <span class="pill-date">${featured.date}</span>
              </div>
              <h2 class="blog-featured-title">${featured.title}</h2>
              <p class="blog-featured-desc">${featured.excerpt}</p>
              <div class="blog-author-strip">
                <img src="${featured.authorAvatar || 'assets/images/team/founder_1.png'}" alt="${featured.author}" class="author-avatar-sm" onerror="this.src='assets/images/team/founder_1.png'">
                <div>
                  <strong>${featured.author}</strong>
                  <span class="author-role-sub">${featured.authorRole || 'Slum Art Foundation'}</span>
                </div>
              </div>
              <div class="blog-featured-btn-wrap">
                <button class="btn btn-primary btn-md">Read Full Story</button>
              </div>
            </div>
          </div>
        `;
      } else {
        heroEl.style.display = 'none';
        heroEl.innerHTML = '';
      }
    }

    if (!gridEl) return;

    if (list.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h3>No articles match your search</h3>
          <p>Try selecting a different category or clearing your search keywords.</p>
          <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="window.resetBlogFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = list.map(blog => `
      <article class="blog-catalog-card" onclick="window.openBlogModal('${blog.id}')">
        <div class="blog-card-media">
          <img src="${blog.image}" alt="${blog.title}" loading="lazy" onerror="this.src='assets/images/resources/Art.png'">
          <span class="blog-card-cat">${blog.category || 'Story'}</span>
          <span class="blog-card-time">${blog.readTime || '4 min'}</span>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span>${blog.date}</span>
            <span>${blog.author}</span>
          </div>
          <h3 class="blog-card-title">${blog.title}</h3>
          <p class="blog-card-excerpt">${blog.excerpt || ''}</p>
          <div class="blog-card-foot">
            <span class="read-more-accent">Read Full Article </span>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Filter Blog by Category
  window.filterBlogCategory = function (cat) {
    state.blogCategory = cat;
    document.querySelectorAll('.blog-cat-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === cat);
    });
    renderBlogArticles();
  };

  // Reset Blog Filters
  window.resetBlogFilters = function () {
    state.blogCategory = 'all';
    state.blogSearchQuery = '';
    const searchInput = document.getElementById('blogSearchInput');
    if (searchInput) searchInput.value = '';
    document.querySelectorAll('.blog-cat-pill').forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
    renderBlogArticles();
  };

  // Open Full Story Reader Modal
  window.openBlogModal = function (blogId) {
    const blog = (DATA.blogs || []).find(b => b.id === blogId);
    if (!blog) return;

    let modal = document.getElementById('blogReaderModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.id = 'blogReaderModal';
      modal.innerHTML = `
        <div class="modal-card blog-reader-card">
          <button class="modal-close-btn" onclick="window.closeAllModals()">&times;</button>
          <div id="blogReaderContainer" class="blog-reader-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.closeAllModals();
      });
    }

    const container = document.getElementById('blogReaderContainer');
    if (container) {
      container.innerHTML = `
        <div class="blog-reader-hero-img-wrap">
          <img src="${blog.image}" alt="${blog.title}" class="blog-reader-hero-img" onerror="this.src='assets/images/resources/Art.png'">
          <div class="blog-reader-cat-tag">${blog.category || 'Story'}</div>
        </div>
        <div class="blog-reader-inner">
          <div class="blog-reader-meta-bar">
            <div class="blog-reader-author-wrap">
              <img src="${blog.authorAvatar || 'assets/images/team/founder_1.png'}" alt="${blog.author}" class="blog-reader-avatar" onerror="this.src='assets/images/team/founder_1.png'">
              <div>
                <strong>${blog.author}</strong>
                <span class="blog-reader-role">${blog.authorRole || 'Slum Art Foundation'}</span>
              </div>
            </div>
            <div class="blog-reader-date-wrap">
              <span>${blog.date}</span>
              <span>${blog.readTime || '4 min read'}</span>
            </div>
          </div>
          <h1 class="blog-reader-title">${blog.title}</h1>
          <div class="blog-reader-lead-excerpt">${blog.excerpt || ''}</div>
          <div class="blog-reader-divider"></div>
          <div class="blog-reader-prose">
            ${blog.content || ''}
          </div>
          <div class="blog-reader-impact-banner">
            <div>
              <strong>Support the transformation of Makoko's creative youth</strong>
              <p>Every artwork acquired from our gallery directly finances tuition, meals, and medical care for the children authoring these stories.</p>
              <div style="margin-top: 0.75rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <a href="shop.html" class="btn btn-primary btn-sm">Browse Original Artworks</a>
                <a href="https://paystack.shop/pay/lk0hlrdlun" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">Donate Paystack</a>
              </div>
            </div>
          </div>
          <div class="blog-reader-share-bar">
            <span>Share this story:</span>
            <div class="share-btns-row">
              <a href="https://wa.me/?text=${encodeURIComponent(blog.title + ' - ' + window.location.origin + '/blog.html')}" target="_blank" class="share-pill share-whatsapp" title="Share to WhatsApp">WhatsApp</a>
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.origin + '/blog.html')}" target="_blank" class="share-pill share-x" title="Share to X">X</a>
              <button class="share-pill share-copy" onclick="navigator.clipboard.writeText(window.location.origin + '/blog.html'); alert('Article link copied to clipboard!');">Copy Link</button>
            </div>
          </div>
        </div>
      `;
    }

    document.body.classList.add('modal-open');
    modal.classList.add('active');
  };

  // Expose global renderers
  window.renderArtworks = renderArtworks;
  window.renderBlogArticles = renderBlogArticles;
  window.renderHomeBlogHighlights = renderHomeBlogHighlights;
  window.syncDynamicData = syncDynamicData;

  // Close All Modals
  window.closeAllModals = function () {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.classList.remove('modal-open');
    window.closeVideoModal();
    toggleCartDrawer(false);
  };

  // Event Listeners Initialization
  function initListeners() {
    // Currency Toggle
    elements.currencyBtns.forEach(btn => {
      btn.addEventListener('click', () => setCurrency(btn.dataset.currency));
    });

    // Category Filter Pills
    elements.categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (!pill.dataset.category) return;
        elements.categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.selectedCategory = pill.dataset.category;
        renderArtworks();
      });
    });

    // Search Input
    if (elements.shopSearchInput) {
      elements.shopSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderArtworks();
      });
    }

    // Blog Search Input
    const blogSearchInput = document.getElementById('blogSearchInput');
    if (blogSearchInput) {
      blogSearchInput.addEventListener('input', (e) => {
        state.blogSearchQuery = e.target.value;
        renderBlogArticles();
      });
    }

    // Sort Select
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderArtworks();
      });
    }

    // Cart Triggers
    elements.cartTriggers.forEach(btn => {
      btn.addEventListener('click', () => toggleCartDrawer(true));
    });

    if (elements.cartDrawerClose) {
      elements.cartDrawerClose.addEventListener('click', () => toggleCartDrawer(false));
    }
    if (elements.cartDrawerBackdrop) {
      elements.cartDrawerBackdrop.addEventListener('click', () => toggleCartDrawer(false));
    }

    // Mobile Navigation Drawer (Berlix UI Menu Vertical)
    function toggleMobileDrawer(open) {
      if (elements.mobileDrawer) {
        if (open) {
          elements.mobileDrawer.classList.add('open');
          document.body.classList.add('drawer-open');
        } else {
          elements.mobileDrawer.classList.remove('open');
          document.body.classList.remove('drawer-open');
        }
      }
      if (elements.drawerBackdrop) {
        if (open) {
          elements.drawerBackdrop.classList.add('active');
        } else {
          elements.drawerBackdrop.classList.remove('active');
        }
      }
    }

    if (elements.mobileNavToggle) {
      elements.mobileNavToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileDrawer(true);
      });
    }
    if (elements.mobileDrawerClose) {
      elements.mobileDrawerClose.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileDrawer(false);
      });
    }
    if (elements.drawerBackdrop) {
      elements.drawerBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMobileDrawer(false);
      });
    }

    // Enhance Mobile Drawer Links to Berlix UI Menu Vertical
    if (elements.mobileDrawer) {
      const drawerLinks = elements.mobileDrawer.querySelectorAll('.drawer-links a, .berlix-menu-vertical a');
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';

      drawerLinks.forEach((link, idx) => {
        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.style.setProperty('--item-index', idx);
        }

        // Structure Berlix motion components if not yet present
        if (!link.querySelector('.berlix-label')) {
          const rawText = link.textContent.trim();
          link.innerHTML = `<span class="berlix-label">${rawText}</span>`;
          link.classList.add('berlix-menu-link');
        }

        // Mark active link
        const linkHref = link.getAttribute('href') || '';
        if (linkHref === currentPath || (currentPath === 'index.html' && (linkHref === 'index.html' || linkHref === './'))) {
          link.classList.add('active');
        }

        // Smooth closing on click (for anchor navigation)
        link.addEventListener('click', () => {
          setTimeout(() => toggleMobileDrawer(false), 140);
        });
      });

      // Escape key to dismiss drawer
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.mobileDrawer.classList.contains('open')) {
          toggleMobileDrawer(false);
        }
      });
    }

    // Calculator Slider & Presets
    const calcSlider = document.getElementById('calcSlider') || document.querySelector('.calcSlider');
    if (calcSlider) {
      calcSlider.addEventListener('input', () => updateImpactCalculator());
      calcSlider.addEventListener('change', () => updateImpactCalculator());
    }

    document.querySelectorAll('.tlc-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        if (!isNaN(val)) {
          updateImpactCalculator(val);
        }
      });
    });

    // Close Modals on Backdrop Click or Close Button
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) window.closeAllModals();
      });
      const closeBtn = overlay.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', window.closeAllModals);
      }
    });

    // Keyboard ESC to close modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeAllModals();
      // Discreet Curatorial Staff Access: Ctrl+Shift+A / Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        window.location.href = 'admin.html';
      }
    });
  }

  // ===================================================================
  // 13 CREATIVE PROGRAMS: KINETIC RIBBONS & SPOTLIGHT SHOWCASE ENGINE
  // ===================================================================
  window.getIconSvg = function(key, size = 24) {
    const icons = {
      palette: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.37-.61-.37-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9z"/><circle cx="7.5" cy="11.5" r="1" fill="currentColor"/><circle cx="9.5" cy="7.5" r="1" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1" fill="currentColor"/><circle cx="16.5" cy="11.5" r="1" fill="currentColor"/></svg>`,
      music: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
      film: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
      dance: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="m19 17-5.5-2.5L12 9l-3 4-4.5-1.5"/><path d="m14 14.5 2 6.5"/><path d="m9 13-2 8"/></svg>`,
      running: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/><path d="m19 17-5.5-2.5L12 9l-3 4-4.5-1.5"/><path d="m14 14.5 2 6.5"/><path d="m9 13-2 8"/></svg>`,
      camera: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
      skate: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="17.5" r="2.5"/><circle cx="17" cy="17.5" r="2.5"/><path d="M4 12h16c1.1 0 2-.9 2-2s-.9-2-2-2H4c-1.1 0-2 .9-2 2s.9 2 2 2z"/></svg>`,
      poetry: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 11.5V21h9.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
      feather: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 11.5V21h9.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`,
      fashion: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      animation: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
      sparkles: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
      theatre: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 10s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6Z"/><circle cx="12" cy="10" r="2"/></svg>`,
      masks: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 10s3-6 10-6 10 6 10 6-3 6-10 6-10-6-10-6Z"/><circle cx="12" cy="10" r="2"/></svg>`,
      designs: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>`,
      compass: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>`,
      tech: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="m9 10-2-2 2-2"/><path d="m15 10 2-2-2-2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
      laptop: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="m9 10-2-2 2-2"/><path d="m15 10 2-2-2-2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
      food: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 8v1M12 7v2M17 8v1"/></svg>`,
      bowl: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/><path d="M7 8v1M12 7v2M17 8v1"/></svg>`,
      scissors: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      hair: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      utensils: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M12 11v11"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/></svg>`,
      rice: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M12 11v11"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/></svg>`,
      heart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
      mentorship: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      users: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      garri: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      default: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
    };
    const cleanKey = (key || '').toLowerCase().replace('fa-', '').replace('slum-', '');
    for (const k in icons) {
      if (cleanKey.includes(k) || k.includes(cleanKey)) return icons[k];
    }
    return icons.default;
  };

  let activeProgramId = 'slum-art';

  window.selectProgramInspector = function (progId) {
    activeProgramId = progId;
    const prog = DATA.programs.find(p => p.id === progId);
    if (!prog) return;

    const inspectorEl = document.getElementById('programInspectorCard');
    if (inspectorEl) {
      inspectorEl.style.setProperty('--insp-color', prog.color);
      inspectorEl.innerHTML = `
        <div class="insp-header">
          <div>
            <div class="insp-meta">
              <span class="insp-num-badge">PILLAR ${prog.num}</span>
              <span class="insp-pill-badge" style="background: ${prog.color}15; color: ${prog.color};">
                ${prog.category}
              </span>
            </div>
            <h3 class="insp-title">${prog.title}</h3>
          </div>
          <div class="insp-icon-wrap" style="color: ${prog.color}; background: ${prog.color}18; display: flex; align-items: center; justify-content: center;">
            ${window.getIconSvg(prog.icon || prog.id, 32)}
          </div>
        </div>

        <p class="insp-desc">${prog.desc}</p>

        <div class="insp-curriculum-wrap">
          <div class="insp-sec-label">
            Core Skills & Curriculum Modules
          </div>
          <div class="insp-curriculum-grid">
            ${(prog.curriculum || []).map(m => `
              <div class="insp-curr-item">
                <span>${m}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insp-outcome-box">
          <strong style="display: block; margin-bottom: 0.35rem;">Real-World Social Impact:</strong>
          ${prog.outcome || 'Directly preparing youth with practical vocational and artistic capabilities.'}
        </div>

        <div class="insp-stats-line">
          <span>${prog.stats || 'Active across community studios in Nigeria'}</span>
        </div>

        <div class="insp-actions">
          <a href="https://paystack.shop/pay/lk0hlrdlun" target="_blank" class="btn btn-primary">
            Sponsor ${prog.title}
          </a>
          <button class="btn btn-secondary" onclick="window.volunteerForProgram('${prog.title}')">
            Volunteer to Coach
          </button>
          <a href="#art-shop" class="btn btn-secondary" onclick="window.filterShopByProgram('${prog.category}')">
            View Works
          </a>
        </div>
      `;
    }

    // Update active highlight on ribbon tags
    document.querySelectorAll('.prog-ribbon-tag').forEach(el => {
      el.classList.toggle('active', el.dataset.id === progId);
    });

    // Update active highlight on quick rail items
    document.querySelectorAll('.prog-rail-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === progId);
    });
  };

  window.volunteerForProgram = function (progTitle) {
    window.openVolunteerModal();
    const sel = document.querySelector('#volunteerModal select[name="interest"]');
    if (sel) {
      sel.value = "Teaching Art / Painting";
      const matchOpt = Array.from(sel.options).find(o => o.text.toLowerCase().includes(progTitle.toLowerCase().replace('slum ', '')));
      if (matchOpt) matchOpt.selected = true;
    }
  };

  window.filterShopByProgram = function (category) {
    state.selectedCategory = category;
    elements.categoryPills.forEach(p => p.classList.toggle('active', p.dataset.category.toLowerCase() === category.toLowerCase()));
    renderArtworks();
    const shopEl = document.getElementById('art-shop');
    if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
  };

  // Changing Lives Gallery Filter
  window.filterChangingLives = function (cat, btn) {
    document.querySelectorAll('.cl-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const cards = document.querySelectorAll('.changing-lives-card');
    cards.forEach(card => {
      if (cat === 'all' || card.dataset.category === cat) {
        card.style.display = '';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  };

  window.filterProgramsByCat = function (categoryKey, btn) {
    document.querySelectorAll('.prog-filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (!DATA.programs) return;

    if (categoryKey === 'all') {
      window.selectProgramInspector(DATA.programs[0].id);
      return;
    }

    const catMap = {
      visual: ['visual', 'art', 'photography', 'film', 'fashion'],
      performing: ['music', 'dance', 'skate'],
      tech: ['coding', 'robotics', 'digital', 'writers'],
      vocational: ['woodwork', 'culinary', 'agriculture']
    };

    const keywords = catMap[categoryKey] || [];
    const match = DATA.programs.find(p => 
      keywords.some(k => p.category.toLowerCase().includes(k) || p.title.toLowerCase().includes(k))
    );

    if (match) {
      window.selectProgramInspector(match.id);
    }
  };

  window.toggleProgramsView = function (mode) {
    const marqueeView = document.getElementById('programsMarqueeView');
    const gridView = document.getElementById('programsGridView');
    const btnMarquee = document.getElementById('viewSwitchMarquee');
    const btnGrid = document.getElementById('viewSwitchGrid');

    if (mode === 'marquee') {
      if (marqueeView) marqueeView.style.display = 'block';
      if (gridView) gridView.style.display = 'none';
      if (btnMarquee) btnMarquee.classList.add('active');
      if (btnGrid) btnGrid.classList.remove('active');
    } else {
      if (marqueeView) marqueeView.style.display = 'none';
      if (gridView) gridView.style.display = 'grid';
      if (btnMarquee) btnMarquee.classList.remove('active');
      if (btnGrid) btnGrid.classList.add('active');
    }
  };

  function initProgramsSuite() {
    const track1 = document.getElementById('progRibbonTrack1');
    const rail = document.getElementById('programsQuickRail');
    if (!track1 && !rail) return;
    if (!DATA.programs || DATA.programs.length === 0) return;

    // Split into 2 rows for ribbons
    const half = Math.ceil(DATA.programs.length / 2);
    const row1 = DATA.programs.slice(0, half);
    const row2 = DATA.programs.slice(half);

    const renderRibbon = (progs) => progs.map(p => `
      <div class="prog-ribbon-tag ${p.id === activeProgramId ? 'active' : ''}" data-id="${p.id}" style="--tag-color: ${p.color}; --tag-bg: ${p.color}15;" onclick="window.selectProgramInspector('${p.id}')">
        <span class="prog-ribbon-icon" style="display: inline-flex; align-items: center; justify-content: center;">${window.getIconSvg(p.icon || p.id, 14)}</span>
        <span class="prog-ribbon-title">${p.title}</span>
        <span class="prog-ribbon-cat">${p.category}</span>
      </div>
    `).join('');

    if (track1) {
      track1.innerHTML = renderRibbon(row1) + renderRibbon(row1);
    }
    if (track2) {
      track2.innerHTML = renderRibbon(row2) + renderRibbon(row2);
    }

    // Populate Quick Rail
    if (rail) {
      rail.innerHTML = DATA.programs.map(p => `
        <div class="prog-rail-item ${p.id === activeProgramId ? 'active' : ''}" data-id="${p.id}" onclick="window.selectProgramInspector('${p.id}')">
          <span class="prog-rail-num">${p.num}</span>
          <span>${p.title}</span>
        </div>
      `).join('');
    }

    // Render active inspector card
    window.selectProgramInspector(activeProgramId);
  }

  // 21st.dev Interactive Direct Donation Bento Engine
  const BENTO_TIERS = {
    '10': {
      usd: 10,
      ngn: '12,500',
      displayUsd: '$10.00',
      displayNgn: '₦12,500',
      altUsd: '≈ ₦12,500 NGN • Only $0.33/day',
      altNgn: '≈ $10.00 USD • ₦416/day',
      name: 'Daily Hot Meals & Studio Sketchbook',
      badge: 'Sponsors 1 Child For 1 Full Month',
      breakdown: {
        tuition: { usd: '$0.00', ngn: '₦0' },
        uniform: { usd: '$0.00', ngn: '₦0' },
        meals: { usd: '$6.50', ngn: '₦8,125' },
        books: { usd: '$3.50', ngn: '₦4,375' }
      },
      ctaUsd: 'Sponsor Daily Meals • $10',
      ctaNgn: 'Sponsor Daily Meals • ₦12,500'
    },
    '35': {
      usd: 35,
      ngn: '43,750',
      displayUsd: '$35.00',
      displayNgn: '₦43,750',
      altUsd: '≈ ₦43,750 NGN • Only $1.16/day',
      altNgn: '≈ $35.00 USD • ₦1,458/day',
      name: '1 Full Term Primary School Tuition',
      badge: 'Sponsors 1 Child For 3 Full Months (90 Days)',
      breakdown: {
        tuition: { usd: '$22.00', ngn: '₦27,500' },
        uniform: { usd: '$6.00', ngn: '₦7,500' },
        meals: { usd: '$4.50', ngn: '₦5,625' },
        books: { usd: '$2.50', ngn: '₦3,125' }
      },
      ctaUsd: "Sponsor 1 Child's Tuition • $35",
      ctaNgn: "Sponsor 1 Child's Tuition • ₦43,750"
    },
    '100': {
      usd: 100,
      ngn: '125,000',
      displayUsd: '$100.00',
      displayNgn: '₦125,000',
      altUsd: '≈ ₦125,000 NGN • Full Academic Year',
      altNgn: '≈ $100.00 USD • Full Academic Year',
      name: '1 Full Academic Year School Sponsorship',
      badge: 'Sponsors 1 Child For 1 Full Year (3 Terms)',
      breakdown: {
        tuition: { usd: '$66.00', ngn: '₦82,500' },
        uniform: { usd: '$14.00', ngn: '₦17,500' },
        meals: { usd: '$12.00', ngn: '₦15,000' },
        books: { usd: '$8.00', ngn: '₦10,000' }
      },
      ctaUsd: 'Sponsor 1 Full Year • $100',
      ctaNgn: 'Sponsor 1 Full Year • ₦125,000'
    },
    '250': {
      usd: 250,
      ngn: '312,500',
      displayUsd: '$250.00',
      displayNgn: '₦312,500',
      altUsd: '≈ ₦312,500 NGN • Master Artist Fellowship',
      altNgn: '≈ $250.00 USD • Master Artist Fellowship',
      name: 'Full Scholar & Master Artist Fellowship',
      badge: 'Comprehensive 1-Year Fellowship + Studio Mentorship',
      breakdown: {
        tuition: { usd: '$120.00', ngn: '₦150,000' },
        uniform: { usd: '$50.00', ngn: '₦62,500' },
        meals: { usd: '$45.00', ngn: '₦56,250' },
        books: { usd: '$35.00', ngn: '₦43,750' }
      },
      ctaUsd: 'Sponsor Full Fellowship • $250',
      ctaNgn: 'Sponsor Full Fellowship • ₦312,500'
    }
  };

  let bentoState = {
    selectedAmount: '35',
    currency: state.currency || 'USD'
  };

  function updateBentoDonationEngine(newAmount = null, newCurr = null) {
    if (newAmount) bentoState.selectedAmount = String(newAmount);
    if (newCurr) bentoState.currency = newCurr;

    const tierData = BENTO_TIERS[bentoState.selectedAmount] || BENTO_TIERS['35'];
    const isNgn = bentoState.currency === 'NGN';

    // Update Currency buttons
    const btnUsd = document.getElementById('bentoCurrUsd');
    const btnNgn = document.getElementById('bentoCurrNgn');
    if (btnUsd && btnNgn) {
      btnUsd.classList.toggle('active', !isNgn);
      btnNgn.classList.toggle('active', isNgn);
    }

    // Update Tactile Tier Buttons
    document.querySelectorAll('.tactile-tier-btn, .bento-tier-pill').forEach(btn => {
      const amt = btn.dataset.amount;
      const isActive = amt === bentoState.selectedAmount;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');

      const lamp = btn.querySelector('.tactile-mini-lamp');
      if (lamp) {
        lamp.classList.toggle('active', isActive);
      }

      const costEl = btn.querySelector('.tactile-tier-cost, .tier-pill-val');
      if (costEl) {
        costEl.textContent = isNgn ? (costEl.dataset.tierNgn || costEl.textContent) : (costEl.dataset.tierUsd || costEl.textContent);
      }
    });

    // Update Display Amount & Alt
    const displayAmount = document.getElementById('bentoDisplayAmount');
    const altAmount = document.getElementById('bentoAltAmount');
    const impactName = document.getElementById('bentoImpactName');
    const impactBadge = document.getElementById('bentoImpactBadge');
    const ctaText = document.getElementById('bentoCtaText');
    const ctaBtn = document.getElementById('bentoCtaBtn');

    if (displayAmount) {
      displayAmount.textContent = isNgn ? tierData.displayNgn : tierData.displayUsd;
    }
    if (altAmount) {
      altAmount.textContent = isNgn ? tierData.altNgn : tierData.altUsd;
    }
    if (impactName) {
      impactName.textContent = tierData.name;
    }
    if (impactBadge) {
      impactBadge.textContent = tierData.badge;
    }

    // Update itemized cost breakdown
    if (tierData.breakdown) {
      const costTuition = document.getElementById('ledgerCostTuition');
      const costUniform = document.getElementById('ledgerCostUniform');
      const costMeals = document.getElementById('ledgerCostMeals');
      const costBooks = document.getElementById('ledgerCostBooks');

      if (costTuition) costTuition.textContent = isNgn ? tierData.breakdown.tuition.ngn : tierData.breakdown.tuition.usd;
      if (costUniform) costUniform.textContent = isNgn ? tierData.breakdown.uniform.ngn : tierData.breakdown.uniform.usd;
      if (costMeals) costMeals.textContent = isNgn ? tierData.breakdown.meals.ngn : tierData.breakdown.meals.usd;
      if (costBooks) costBooks.textContent = isNgn ? tierData.breakdown.books.ngn : tierData.breakdown.books.usd;
    }

    if (ctaText) {
      ctaText.textContent = isNgn ? tierData.ctaNgn : tierData.ctaUsd;
    }
    if (ctaBtn) {
      ctaBtn.href = 'https://paystack.shop/pay/lk0hlrdlun';
    }
  }

  function initBentoDonationEngine() {
    const consoleCard = document.getElementById('tactileConsoleCard') || document.getElementById('bentoDonationCard');
    if (!consoleCard) return;

    // Currency button clicks
    const btnUsd = document.getElementById('bentoCurrUsd');
    const btnNgn = document.getElementById('bentoCurrNgn');
    if (btnUsd) {
      btnUsd.addEventListener('click', () => {
        setCurrency('USD');
        updateBentoDonationEngine(null, 'USD');
      });
    }
    if (btnNgn) {
      btnNgn.addEventListener('click', () => {
        setCurrency('NGN');
        updateBentoDonationEngine(null, 'NGN');
      });
    }

    // Tier button clicks
    document.querySelectorAll('.tactile-tier-btn, .bento-tier-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = btn.dataset.amount;
        if (amt && BENTO_TIERS[amt]) {
          updateBentoDonationEngine(amt);
        }
      });
    });

    // Reality Switcher (Scholar vs Street Reality)
    const btnScholar = document.getElementById('realityBtnScholar');
    const btnStreet = document.getElementById('realityBtnStreet');
    const viewScholar = document.getElementById('viewScholar');
    const viewStreet = document.getElementById('viewStreet');

    function setRealityView(mode) {
      const isScholar = mode === 'scholar';
      if (btnScholar && btnStreet) {
        btnScholar.classList.toggle('active', isScholar);
        btnStreet.classList.toggle('active', !isScholar);
      }
      if (viewScholar && viewStreet) {
        if (isScholar) {
          viewScholar.style.display = 'block';
          viewScholar.classList.add('active');
          viewStreet.style.display = 'none';
          viewStreet.classList.remove('active');
        } else {
          viewScholar.style.display = 'none';
          viewScholar.classList.remove('active');
          viewStreet.style.display = 'block';
          viewStreet.classList.add('active');
        }
      }
    }

    if (btnScholar) {
      btnScholar.addEventListener('click', () => setRealityView('scholar'));
    }
    if (btnStreet) {
      btnStreet.addEventListener('click', () => setRealityView('street'));
    }

    // Initialize with current state
    bentoState.currency = state.currency || 'USD';
    updateBentoDonationEngine('35', bentoState.currency);
  }

  // 21st.dev Founder Interactive Milestone Switcher
  const FOUNDER_MILESTONES = {
    records: {
      num: '4x',
      title: 'Official Guinness World Records',
      desc: 'Holds 4 verified world records including the Largest Painting by Numbers (63.5m × 49.3m) and Largest Postcard, co-created with thousands of Nigerian students.'
    },
    school: {
      num: '50k+',
      title: 'Plastic Bottles to Classrooms',
      desc: 'Pioneered the famous Pet Bottle School in Nigeria—clearing over 50,000 discarded bottles from lagoon gutters and upcycling them into solar-powered floating studios.'
    },
    mentorship: {
      num: '5,000+',
      title: 'Slum Children Elevated',
      desc: 'Over 5,000 children mentored across 19 creative & welfare initiatives. 100% of art sale proceeds fund formal primary school tuition, daily hot meals, uniforms, and textbooks.'
    }
  };

  function initFounderMilestones() {
    const tabs = document.querySelectorAll('.milestone-tab');
    const heroNum = document.getElementById('milestoneNum');
    const title = document.getElementById('milestoneTitle');
    const desc = document.getElementById('milestoneDesc');
    if (!tabs.length || !heroNum || !title || !desc) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab;
        const data = FOUNDER_MILESTONES[key];
        if (!data) return;

        tabs.forEach(t => {
          const isActive = t === tab;
          t.classList.toggle('active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Smooth morph animation
        heroNum.style.opacity = '0';
        heroNum.style.transform = 'translateY(6px)';
        title.style.opacity = '0';
        desc.style.opacity = '0';

        setTimeout(() => {
          heroNum.textContent = data.num;
          title.textContent = data.title;
          desc.textContent = data.desc;

          heroNum.style.transition = 'all 0.25s ease';
          heroNum.style.opacity = '1';
          heroNum.style.transform = 'translateY(0)';
          title.style.transition = 'all 0.25s ease';
          title.style.opacity = '1';
          desc.style.transition = 'all 0.25s ease';
          desc.style.opacity = '1';
        }, 150);
      });
    });
  }

  // Initialization
  function init() {
    // Set initial active currency button
    elements.currencyBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.currency === state.currency);
    });

    renderArtworks();
    renderHomeBlogHighlights();
    renderBlogArticles();
    updateCartBadge();
    updateCartDrawer();
    updateImpactCalculator();
    initListeners();
    initProgramsSuite();
    initBentoDonationEngine();
    initFounderMilestones();
    initHeroScrollChoreography();
    initMHeroDonationThingy();
    initScholarStoriesAutoCycle();
    initGeoCurrencyDetection();
    initAtelierCarousel();
    initQuickMission();
    initTeamCarousel();
  }

  // Hero Scroll Choreography: Hero elements glide UPWARDS, next section (#who-we-are) comes to life
  function initHeroScrollChoreography() {
    const hero = document.getElementById('hero') || document.querySelector('.hero-atp-stage');
    const navbar = document.querySelector('.navbar');
    const nextSection = document.getElementById('who-we-are') || document.getElementById('art-shop');
    if (!hero) return;

    document.body.classList.add('has-hero-nav');

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollChoreography();
          ticking = false;
        });
        ticking = true;
      }
    }

    function updateScrollChoreography() {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const heroH = hero.offsetHeight || window.innerHeight;

      // 1. Navbar Visibility (Smooth entrance on scroll)
      if (navbar) {
        if (scrollY > 60) {
          navbar.classList.add('navbar-visible');
          document.body.classList.add('scrolled-past-hero');
        } else {
          navbar.classList.remove('navbar-visible');
          document.body.classList.remove('scrolled-past-hero');
        }
      }

      // 2. Hero Elements Glide UPWARDS
      const card = document.querySelector('#heroAnimatorPreloaderMount .atp-card');
      const hands = document.querySelectorAll('#heroAnimatorPreloaderMount .atp-handslot');
      const cue = document.querySelector('.hero-scroll-cue');
      const bgCanvas = document.querySelector('.atp-nsibidi-canvas');

      if (scrollY <= heroH * 1.1) {
        const exitProgress = Math.min(1, Math.max(0, scrollY / (heroH * 0.45)));

        if (card) {
          card.style.transform = `translate(-50%, calc(-50% - ${scrollY * 0.85}px))`;
          card.style.opacity = `${Math.max(0, 1 - exitProgress * 1.45)}`;
        }
        if (hands && hands.length >= 2) {
          hands[0].style.transform = `translate3d(-${scrollY * 0.35}px, -${scrollY * 0.9}px, 0)`;
          hands[0].style.opacity = `${Math.max(0, 1 - exitProgress * 1.35)}`;
          hands[1].style.transform = `translate3d(${scrollY * 0.35}px, -${scrollY * 0.9}px, 0)`;
          hands[1].style.opacity = `${Math.max(0, 1 - exitProgress * 1.35)}`;
        }
        if (cue) {
          cue.style.opacity = `${Math.max(0, 1 - scrollY / 70)}`;
        }
        if (bgCanvas) {
          bgCanvas.style.transform = `translate3d(0, -${scrollY * 0.22}px, 0)`;
        }

        // 3. Elements below (Who We Are Bento Grid) Stay crisp and smoothly enter
        if (nextSection) {
          const enterProgress = Math.min(1, Math.max(0, scrollY / (heroH * 0.25)));
          nextSection.style.transform = `translate3d(0, ${Math.max(0, (1 - enterProgress) * 40)}px, 0)`;
          nextSection.style.opacity = '1';
        }
      } else {
        // Once scrolled past hero, reset incoming section to normal display
        if (nextSection) {
          nextSection.style.transform = 'none';
          nextSection.style.opacity = '1';
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateScrollChoreography();
  }

  
  let updateMHeroDonationView = null;

  // Section 2: Minimalist Hero Donation Thingy
  function initMHeroDonationThingy() {
    let mCurr = state.currency || 'USD';
    let mAmount = '35';

    const btnUsd = document.getElementById('mHeroCurrUsd');
    const btnNgn = document.getElementById('mHeroCurrNgn');
    const tierBtns = document.querySelectorAll('.m-hero-tier-btn');
    const donateText = document.getElementById('mHeroDonateText');

    const TIER_TITLES = {
      '10': { USD: 'Sponsor Meals & Art • $10', NGN: 'Sponsor Meals & Art • ₦12,500' },
      '35': { USD: "Sponsor 1 Child's Tuition • $35", NGN: "Sponsor 1 Child's Tuition • ₦43,750" },
      '100': { USD: 'Sponsor Full Year • $100', NGN: 'Sponsor Full Year • ₦125,000' },
      '250': { USD: 'Sponsor Fellowship • $250', NGN: 'Sponsor Fellowship • ₦312,500' },
    };

    function updateView(overrideCurr) {
      if (overrideCurr) mCurr = overrideCurr;
      else mCurr = state.currency || mCurr;

      if (btnUsd && btnNgn) {
        btnUsd.classList.toggle('active', mCurr === 'USD');
        btnNgn.classList.toggle('active', mCurr === 'NGN');
      }

      tierBtns.forEach(btn => {
        const amt = btn.dataset.amount;
        btn.classList.toggle('active', amt === mAmount);
        const valSpan = btn.querySelector('.m-tier-val');
        if (valSpan) {
          valSpan.textContent = mCurr === 'USD' ? btn.dataset.labelUsd : btn.dataset.labelNgn;
        }
      });

      if (donateText) {
        const titleObj = TIER_TITLES[mAmount] || TIER_TITLES['35'];
        donateText.textContent = mCurr === 'USD' ? titleObj.USD : titleObj.NGN;
      }

      const heroLeadAmount = document.getElementById('mHeroLeadAmount');
      if (heroLeadAmount) {
        heroLeadAmount.textContent = mCurr === 'USD' ? '$35' : '₦43,750';
      }
    }

    updateMHeroDonationView = updateView;

    if (btnUsd) {
      btnUsd.addEventListener('click', (e) => {
        e.preventDefault();
        setCurrency('USD', true);
      });
    }
    if (btnNgn) {
      btnNgn.addEventListener('click', (e) => {
        e.preventDefault();
        setCurrency('NGN', true);
      });
    }

    tierBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        mAmount = btn.dataset.amount;
        updateView();
      });
    });

    window.addEventListener('currencyChanged', (e) => {
      updateView(e.detail);
    });

    // Synchronize initial render with current state.currency
    updateView(state.currency);
  }

  // Interactive Scholar Story Showcase (Bento Hero Card)
  const SCHOLAR_STORIES = [
    {
      name: "Kehinde, Age 11",
      role: "Scholar #042 &bull; Bright Achievers Primary",
      avatar: "assets/images/gallery/kehinde_portrait.jpg",
      bgImage: "assets/images/gallery/gallery_05.jpg",
      tagText: "Live Studio &bull; Floating Lagoon Studio, Nigeria",
      title: "From Shoreline Labor to Fine Art Mastery",
      desc: "Before Slum Art, my days were spent fishing plastic from the water. Today my collage portraits pay my school tuition and I have a seat in a real classroom.",
      outcomes: "<span>100% Tuition Escrow</span><span class=\"dot-sep\">&bull;</span><span>Crested Kit</span><span class=\"dot-sep\">&bull;</span><span>Daily Meals</span>"
    },
    {
      name: "Blessing, Age 13",
      role: "Scholar #078 &bull; Waterfront Academy, Nigeria",
      avatar: "assets/images/resources/prof_2.png",
      bgImage: "assets/images/gallery/gallery_07.jpg",
      tagText: "Secondary Scholar &bull; Floating Atelier",
      title: "Finding My Creative Voice on the Floating Easel",
      desc: "Creating paper collage art on the lagoon gave me confidence and hope. My artwork helped fund our solar-powered library, and now I am excelling in secondary school.",
      outcomes: "<span>Secondary Scholarship</span><span class=\"dot-sep\">&bull;</span><span>Art Supplies</span><span class=\"dot-sep\">&bull;</span><span>Hot Lunch</span>"
    },
    {
      name: "Samuel, Age 10",
      role: "Scholar #105 &bull; Nigeria Learning Center",
      avatar: "assets/images/resources/prof_3.png",
      bgImage: "assets/images/gallery/gallery_03.jpg",
      tagText: "Eco-Art Academy &bull; Nigeria",
      title: "Upcycling Waste into Global Exhibitions",
      desc: "I used to collect scrap bottles. Now under Guinness record mentor Adenle, I sculpt them into art that travels to international exhibitions.",
      outcomes: "<span>Full School Sponsorship</span><span class=\"dot-sep\">&bull;</span><span>Mentorship</span><span class=\"dot-sep\">&bull;</span><span>Medical Care</span>"
    },
    {
      name: "Taiwo, Age 11",
      role: "Scholar #043 &bull; Bright Achievers Primary",
      avatar: "assets/images/gallery/gallery_02.jpg",
      bgImage: "assets/images/gallery/gallery_06.jpg",
      tagText: "Paper Collage Portraits &bull; Under-Bridge Studio",
      title: "From Informal Dumpsites to Gallery Showcases",
      desc: "Assembling portraits from recycled paper taught me that my hands can build something beautiful. Our art is breaking generations of poverty right here under the bridge.",
      outcomes: "<span>Tuition Escrow</span><span class=\"dot-sep\">&bull;</span><span>Studio Easel Kit</span><span class=\"dot-sep\">&bull;</span><span>Academic Tutoring</span>"
    }
  ];

  let currentStoryIndex = 0;
  let storyAutoCycleTimer = null;
  const STORY_CYCLE_DURATION = 4500; // 4.5 seconds per story

  window.selectScholarStory = function (idx, isManual = false) {
    if (idx < 0 || idx >= SCHOLAR_STORIES.length) return;
    currentStoryIndex = idx;
    const story = SCHOLAR_STORIES[idx];

    // If manually clicked, restart the auto-cycle interval so it continues cycling
    if (isManual && storyAutoCycleTimer) {
      clearInterval(storyAutoCycleTimer);
      storyAutoCycleTimer = setInterval(() => {
        currentStoryIndex = (currentStoryIndex + 1) % SCHOLAR_STORIES.length;
        window.selectScholarStory(currentStoryIndex);
      }, STORY_CYCLE_DURATION);
    }

    // 1. Crossfade background slides
    const slides = document.querySelectorAll('.hero-bg-slide');
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });

    // 2. Update active tab buttons and restart their progress line
    document.querySelectorAll('#scholarStoryTabs .story-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === idx);
      const fill = tab.querySelector('.tab-progress-fill');
      if (fill) {
        fill.style.animation = 'none';
        // Trigger reflow to restart animation
        void fill.offsetWidth;
        if (i === idx) {
          fill.style.animation = `tabProgressFill ${STORY_CYCLE_DURATION}ms linear forwards`;
        }
      }
    });

    // 3. Update story content with smooth crossfade
    const tagEl = document.getElementById('scholarStoryTag');
    const bodyEl = document.getElementById('scholarStoryBody');
    const titleEl = document.getElementById('scholarStoryTitle');
    const descEl = document.getElementById('scholarStoryDesc');
    const footerEl = document.getElementById('scholarStoryFooter');
    const avatarEl = document.getElementById('scholarStoryAvatar');
    const nameEl = document.getElementById('scholarStoryName');
    const roleEl = document.getElementById('scholarStoryRole');
    const outcomesEl = document.getElementById('scholarStoryOutcomes');

    if (bodyEl) {
      bodyEl.style.opacity = '0';
      bodyEl.style.transform = 'translateY(6px)';
      if (footerEl) footerEl.style.opacity = '0';

      setTimeout(() => {
        if (tagEl) {
          tagEl.innerHTML = `<span class="ui-pulse-dot pulse--green"></span><span>${story.tagText}</span>`;
        }
        if (titleEl) titleEl.innerHTML = story.title;
        if (descEl) descEl.innerHTML = `&ldquo;${story.desc}&rdquo;`;
        if (avatarEl) avatarEl.src = story.avatar;
        if (nameEl) nameEl.textContent = story.name;
        if (roleEl) roleEl.innerHTML = story.role;
        if (outcomesEl) outcomesEl.innerHTML = story.outcomes;

        bodyEl.style.opacity = '1';
        bodyEl.style.transform = 'translateY(0)';
        if (footerEl) footerEl.style.opacity = '1';
      }, 180);
    }
  };

  function initScholarStoriesAutoCycle() {
    const heroCard = document.querySelector('.card--hero');
    if (!heroCard) return;

    function nextStory() {
      currentStoryIndex = (currentStoryIndex + 1) % SCHOLAR_STORIES.length;
      window.selectScholarStory(currentStoryIndex);
    }

    // Start auto cycle immediately (continuous non-stop loop)
    window.selectScholarStory(0);
    if (storyAutoCycleTimer) clearInterval(storyAutoCycleTimer);
    storyAutoCycleTimer = setInterval(nextStory, STORY_CYCLE_DURATION);
  }

  // =========================================================================
  // GLOBAL LEADERSHIP TEAM CAROUSEL (Infinite Loop & Touch/Swipe)
  // =========================================================================
  function initTeamCarousel() {
    const track = document.getElementById('teamCarouselTrack');
    const viewport = document.getElementById('teamCarouselViewport');
    if (!track || !viewport) return;

    const prevBtn = document.getElementById('teamPrevBtn');
    const nextBtn = document.getElementById('teamNextBtn');
    const dots = Array.from(document.querySelectorAll('#teamCarouselPagination .team-pag-dot'));
    const originalCards = Array.from(track.children);
    const N = originalCards.length;
    if (N === 0) return;

    // Buffer: Prepend and append cloned cards for continuous infinite sliding
    const prefixClones = originalCards.map(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });
    const suffixClones = originalCards.map(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    });

    // Insert prefix clones in reverse to preserve original order
    for (let i = prefixClones.length - 1; i >= 0; i--) {
      track.insertBefore(prefixClones[i], track.firstChild);
    }
    suffixClones.forEach(clone => track.appendChild(clone));

    let currentIndex = N; // Start at first original card
    let isTransitioning = false;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 4500;

    function getCardStep() {
      const firstCard = track.children[0];
      if (!firstCard) return 0;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function updateDots() {
      const activeIdx = ((currentIndex - N) % N + N) % N;
      dots.forEach((dot, idx) => {
        const isActive = idx === activeIdx;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    }

    function updatePosition(animate = true) {
      const step = getCardStep();
      if (animate) {
        track.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)';
      } else {
        track.style.transition = 'none';
      }
      track.style.transform = `translateX(-${currentIndex * step}px)`;
      updateDots();
    }

    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (currentIndex >= N * 2) {
        currentIndex -= N;
        updatePosition(false);
      } else if (currentIndex < N) {
        currentIndex += N;
        updatePosition(false);
      }
    });

    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updatePosition(true);
    }

    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updatePosition(true);
    }

    function jumpToSlide(dotIdx) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = N + dotIdx;
      updatePosition(true);
    }

    // Controls
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoplay();
        nextSlide();
        startAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prevSlide();
        startAutoplay();
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        if (!isNaN(idx)) {
          stopAutoplay();
          jumpToSlide(idx);
          startAutoplay();
        }
      });
    });

    // Autoplay with viewport awareness & tab visibility
    let isSectionInView = false;

    function startAutoplay() {
      stopAutoplay();
      if (!isSectionInView || document.hidden) return;
      autoplayTimer = setInterval(() => {
        nextSlide();
      }, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    if ('IntersectionObserver' in window) {
      const sectionEl = document.getElementById('teamSection');
      if (sectionEl) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isSectionInView = entry.isIntersecting;
            if (isSectionInView) {
              startAutoplay();
            } else {
              stopAutoplay();
            }
          });
        }, { threshold: 0.15 });
        observer.observe(sectionEl);
      } else {
        isSectionInView = true;
      }
    } else {
      isSectionInView = true;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else if (isSectionInView) {
        startAutoplay();
      }
    });

    viewport.addEventListener('mouseenter', stopAutoplay);
    viewport.addEventListener('mouseleave', () => {
      if (isSectionInView) startAutoplay();
    });
    viewport.addEventListener('focusin', stopAutoplay);
    viewport.addEventListener('focusout', () => {
      if (isSectionInView) startAutoplay();
    });

    // Touch & Swipe
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    viewport.addEventListener('touchstart', (e) => {
      stopAutoplay();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      if (!isSwiping) return;
      isSwiping = false;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      if (isSectionInView) startAutoplay();
    }, { passive: true });

    // Keyboard support
    viewport.setAttribute('tabindex', '0');
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        stopAutoplay();
        nextSlide();
        if (isSectionInView) startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        stopAutoplay();
        prevSlide();
        if (isSectionInView) startAutoplay();
      }
    });

    // Resize recalculation
    window.addEventListener('resize', () => {
      updatePosition(false);
    });

    // Expose helpers globally
    window.prevTeamSlide = prevSlide;
    window.nextTeamSlide = nextSlide;
    window.jumpTeamSlide = jumpToSlide;

    // Initial positioning after DOM layout
    requestAnimationFrame(() => {
      updatePosition(false);
    });
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
