/**
 * Slum Art Foundation • Interactive Application Engine
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currency: localStorage.getItem('slum_art_currency') || 'NGN',
    selectedCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    cart: JSON.parse(localStorage.getItem('slum_art_cart') || '[]'),
    calculatorAmount: 50, // default USD
    quickviewItem: null,
    artworksExpanded: false
  };

  const DATA = window.SLUM_DATA || {
    artworks: [],
    programs: [],
    welfare: [],
    causes: [],
    testimonials: [],
    team: [],
    contact: {}
  };

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
  function showToast(message, icon = 'fa-check-circle') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon} text-amber"></i> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Currency Switcher
  function setCurrency(newCurr) {
    state.currency = newCurr;
    localStorage.setItem('slum_art_currency', newCurr);
    elements.currencyBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.currency === newCurr);
    });
    renderArtworks();
    updateCartDrawer();
    updateImpactCalculator();
    if (typeof updateBentoDonationEngine === 'function') {
      updateBentoDonationEngine(null, newCurr);
    }
    showToast(`Currency switched to ${newCurr === 'NGN' ? 'Nigerian Naira (₦)' : 'US Dollar ($)'}`);
  }

  // Render Artworks Grid
  function renderArtworks() {
    if (!elements.artworksGrid) return;

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

    if (list.length === 0) {
      elements.artworksGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-light);"></i>
          <h3>No artworks matched your search</h3>
          <p>Try selecting a different category or clearing your search keywords.</p>
          <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="window.clearShopFilters()">Reset All Filters</button>
        </div>
      `;
      const toggleWrap = document.getElementById('artworksToggleContainer');
      if (toggleWrap) toggleWrap.innerHTML = '';
      return;
    }

    const INITIAL_LIMIT = 3;
    const totalCount = list.length;
    const isExpanded = state.artworksExpanded;
    const displayedList = isExpanded ? list : list.slice(0, INITIAL_LIMIT);

    elements.artworksGrid.innerHTML = displayedList.map(item => `
      <div class="artwork-card" data-id="${item.id}">
        <div class="artwork-card-img-wrap" onclick="window.openQuickview('${item.id}')">
          <div class="artwork-passepartout">
            <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='assets/images/resources/Art.png'">
          </div>
          <div class="artwork-card-top-badges">
            <span class="card-cat-badge">${item.category}</span>
            <span class="artwork-provenance-seal"><i class="fas fa-certificate text-amber"></i> Certified Original</span>
          </div>
          <button class="card-quickview-btn" title="Private Viewing Lens">
            <i class="fas fa-expand"></i> <span>Private View</span>
          </button>
        </div>
        <div class="artwork-card-body">
          <div class="artwork-provenance-meta">
            <span class="artwork-atelier"><i class="fas fa-location-dot text-amber"></i> Nigeria Atelier</span>
            <span class="artwork-curator-code">REF: ${item.id.toUpperCase()}</span>
          </div>
          <h4 class="artwork-title">${item.title}</h4>
          <div class="artwork-artist-info">
            <span class="artist-name">By <strong>${item.artist}</strong></span>
            <span class="artist-age-badge">${item.age}</span>
          </div>
          <div class="artwork-medium">
            <i class="fas fa-paintbrush text-amber"></i> ${item.medium}
          </div>
          <div class="artwork-impact-note">
            <i class="fas fa-graduation-cap text-emerald"></i> ${item.impact || '100% Funds direct school tuition & meals'}
          </div>
          <div class="artwork-card-foot">
            <div class="artwork-price-wrap">
              <span class="price-main">${formatPrice(item)}</span>
              <span class="price-secondary">${formatSecondaryPrice(item)}</span>
            </div>
            <div class="artwork-actions-wrap">
              <button class="btn btn-bag-round" onclick="window.addToArtBag('${item.id}')" title="Add to Collector's Cart">
                <i class="fas fa-bag-shopping"></i>
              </button>
              <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-luxury-acquire" title="Buy this certified original piece instantly via Paystack">
                Buy Now <i class="fas fa-bolt text-amber"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Render Expand / Collapse Button Container
    const toggleWrap = document.getElementById('artworksToggleContainer');
    if (toggleWrap) {
      if (totalCount > INITIAL_LIMIT) {
        const remaining = totalCount - INITIAL_LIMIT;
        toggleWrap.innerHTML = `
          <div class="artworks-collapse-wrap">
            <button type="button" class="btn-artworks-expand-toggle" onclick="window.toggleArtworksExpand()">
              <span>${isExpanded ? 'Collapse to 3 Artworks' : `View All ${totalCount} Masterpieces (${remaining} More)`}</span>
              <i class="fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}"></i>
            </button>
            <p class="artworks-collapse-subtext">
              ${isExpanded 
                ? `Showing all ${totalCount} certified works • 100% of proceeds fund youth education` 
                : `Currently displaying 3 curator highlights • ${remaining} more certified works in vault`}
            </p>
          </div>
        `;
      } else {
        toggleWrap.innerHTML = '';
      }
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
            <i class="fas fa-certificate text-amber"></i> Official Slum Art Provenance Dossier
          </div>
        </div>
        <div class="quickview-details">
          <div class="gallery-salon-tag" style="margin-bottom: 0.5rem;"><i class="fas fa-crown text-amber"></i> Permanent Archive • REF: ${item.id.toUpperCase()}</div>
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
            <i class="fas fa-heart text-amber" style="font-size: 1.2rem;"></i>
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
              Acquire Original via Paystack <i class="fas fa-lock" style="font-size: 0.85rem;"></i>
            </a>
            <button class="btn btn-bag-round btn-lg" onclick="window.addToArtBag('${item.id}')" style="border-radius: 12px; padding: 0 1.5rem;" title="Add to Art Bag">
              <i class="fas fa-bag-shopping"></i> Add to Bag
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
      showToast(`"${item.title}" added to your Art Bag!`, 'fa-bag-shopping');
    } else {
      showToast(`"${item.title}" is already in your Art Bag.`, 'fa-info-circle');
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
          <i class="fas fa-bag-shopping" style="font-size: 3rem; margin-bottom: 1rem; color: var(--border-light);"></i>
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
          <i class="fas fa-trash"></i>
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
        <button class="modal-close-btn" onclick="window.closeAllModals()"><i class="fas fa-times"></i></button>
        <div style="padding: 3rem 2rem; text-align: center;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: #fef3c7; color: #d97706; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
            <i class="fas fa-trophy"></i>
          </div>
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
            <button class="btn btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print Confirmation</button>
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
        <button class="modal-close-btn" onclick="window.closeAllModals()"><i class="fas fa-times"></i></button>
        <div style="padding: 3rem 2rem; text-align: center;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: #ecfdf5; color: #059669; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
            <i class="fas fa-heart"></i>
          </div>
          <h2 style="font-size: 1.9rem; margin-bottom: 0.75rem;">Welcome to the Slum Art Family!</h2>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.6;">
            Thank you, <strong>${name}</strong>! Your passion to uplift young creative minds in underserved slum communities is deeply appreciated.
          </p>
          <p style="font-size: 0.9rem; color: #475569; margin-bottom: 2rem;">
            Our volunteer coordination team will review your application and reach out via WhatsApp/email within 48 hours.
          </p>
          <a href="${DATA.contact.whatsapp}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg">
            <i class="fab fa-whatsapp"></i> Join Volunteer WhatsApp Group
          </a>
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
      btn.innerHTML = `<i class="fas fa-heart"></i> <span>Pledge $${amount} &amp; Educate Children</span> <i class="fas fa-arrow-right gwr-arrow-icon"></i>`;
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
          <button class="modal-close-btn" onclick="window.closeAllModals()"><i class="fas fa-times"></i></button>
          <div style="padding: 3rem 2rem; text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; background: #fff2ea; color: var(--color-primary); margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2.2rem;">
              <i class="fas fa-bullhorn"></i>
            </div>
            <div class="section-tag" style="margin-bottom: 0.5rem;">Ambassador Onboarded</div>
            <h2 style="font-size: 2rem; margin-bottom: 0.75rem;">Welcome to the Movement, ${name}!</h2>
            <p style="color: var(--text-muted); max-width: 540px; margin: 0 auto 1.5rem; line-height: 1.6;">
              You are officially Ambassador <strong>#${ambassadorId}</strong> for the 5,000 Comic Movement. Handle: <strong>${handle}</strong>.
            </p>

            <div style="background: var(--bg-subtle); border: 2px dashed var(--color-primary); border-radius: var(--radius-lg); padding: 1.5rem; max-width: 460px; margin: 0 auto 2rem; text-align: left;">
              <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--text-main);"><i class="fas fa-list-check text-amber"></i> Next Steps for Your CapCut Drop:</div>
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
                <i class="fas fa-lock"></i> Activate $1/mo Comic Access
              </a>
              <button class="btn btn-secondary" onclick="window.closeAllModals()">Done</button>
            </div>
          </div>
        `;
      }
    }
  };

  // Custom Portrait Commission Modal & Handlers
  window.openCustomPortraitModal = function () {
    const modal = document.getElementById('customPortraitModal');
    if (modal) {
      document.body.classList.add('modal-open');
      modal.classList.add('active');
    }
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
    const name = form.fullName ? form.fullName.value : 'Patron';
    const email = form.email ? form.email.value : '';
    const phone = form.phone ? form.phone.value : '';
    const location = form.location ? form.location.value : '';
    const subject = form.subjectType ? form.subjectType.value : 'Custom Portrait';
    const medium = form.medium ? form.medium.value : 'Vibrant Acrylic';
    const sizeTier = form.sizeTier ? form.sizeTier.value : 'Standard Studio';
    const photoLink = form.photoLink ? form.photoLink.value : '';
    const notes = form.notes ? form.notes.value : '';

    const refId = 'PORTRAIT-NG-' + Math.floor(1000 + Math.random() * 9000);

    // Save commission draft to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('slum_custom_portraits') || '[]');
      existing.push({
        refId,
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
          `Hello Slum Art Foundation! I just submitted a Custom Portrait Commission request (Ref: ${refId}).\n\nName: ${name}\nSubject: ${subject}\nMedium: ${medium}\nSize: ${sizeTier}\nDelivery: ${location}\n\nI am sending my reference photo directly here on WhatsApp!`
        );
        const waLink = `https://wa.me/2348059994834?text=${waText}`;

        card.innerHTML = `
          <button class="modal-close-btn" onclick="window.closeAllModals()"><i class="fas fa-times"></i></button>
          <div style="padding: 2.75rem 2rem; text-align: center;">
            <div style="width: 76px; height: 76px; border-radius: 50%; background: #ecfdf5; color: #059669; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; box-shadow: 0 8px 24px rgba(5, 150, 105, 0.2);">
              <i class="fas fa-check"></i>
            </div>
            <div class="section-tag" style="margin-bottom: 0.5rem;"><i class="fas fa-sparkles text-amber"></i> Commission Received &bull; 100% Impact</div>
            <h2 style="font-size: 1.85rem; margin-bottom: 0.6rem; color: var(--text-main);">Your Custom Portrait Is in the Works!</h2>
            <p style="color: var(--text-muted); max-width: 520px; margin: 0 auto 1.5rem; line-height: 1.6; font-size: 0.95rem;">
              Thank you, <strong>${name}</strong>! Our master artist mentors and talented youth scholars in Nigeria are honored to create your 1-of-1 original masterpiece.
            </p>

            <div style="background: var(--bg-subtle, #f8fafc); border: 2px dashed #f59e0b; border-radius: var(--radius-lg, 16px); padding: 1.4rem 1.5rem; max-width: 480px; margin: 0 auto 1.75rem; text-align: left;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 0.5rem;">
                <span style="font-size: 0.76rem; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.05em;">Commission Order Ref</span>
                <span style="font-size: 1.15rem; font-weight: 900; color: #b45309; font-family: monospace;">${refId}</span>
              </div>
              <div style="font-size: 0.88rem; color: #334155; line-height: 1.55;">
                <div><strong>Subject:</strong> ${subject}</div>
                <div><strong>Medium:</strong> ${medium}</div>
                <div><strong>Tier:</strong> ${sizeTier}</div>
                <div><strong>Delivery to:</strong> ${location} (Free Worldwide DHL Express)</div>
              </div>
            </div>

            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 1rem 1.25rem; max-width: 480px; margin: 0 auto 1.75rem; text-align: left; font-size: 0.85rem; color: #92400e; line-height: 1.5;">
              <i class="fas fa-camera text-amber" style="margin-right: 6px;"></i> <strong>Next Step (Important):</strong> If you haven't attached high-res photos, please send them directly to our master artist atelier on WhatsApp quoting ref <strong>${refId}</strong>.
            </div>

            <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
              <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" style="background: #25D366; border-color: #25D366; color: #ffffff;">
                <i class="fab fa-whatsapp"></i> Send Photos via WhatsApp
              </a>
              <button class="btn btn-secondary" onclick="window.print()"><i class="fas fa-print"></i> Print Receipt</button>
              <button class="btn btn-secondary" onclick="window.closeAllModals()">Done</button>
            </div>
          </div>
        `;
      }
    }
  };

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

    // Mobile Navigation Drawer
    if (elements.mobileNavToggle) {
      elements.mobileNavToggle.addEventListener('click', () => {
        if (elements.mobileDrawer) elements.mobileDrawer.classList.add('open');
        if (elements.drawerBackdrop) elements.drawerBackdrop.classList.add('active');
      });
    }
    if (elements.mobileDrawerClose) {
      elements.mobileDrawerClose.addEventListener('click', () => {
        if (elements.mobileDrawer) elements.mobileDrawer.classList.remove('open');
        if (elements.drawerBackdrop) elements.drawerBackdrop.classList.remove('active');
      });
    }
    if (elements.drawerBackdrop) {
      elements.drawerBackdrop.addEventListener('click', () => {
        if (elements.mobileDrawer) elements.mobileDrawer.classList.remove('open');
        if (elements.drawerBackdrop) elements.drawerBackdrop.classList.remove('active');
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
    });
  }

  // ===================================================================
  // 13 CREATIVE PROGRAMS: KINETIC RIBBONS & SPOTLIGHT SHOWCASE ENGINE
  // ===================================================================
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
                <i class="fas ${prog.icon}"></i> ${prog.category}
              </span>
            </div>
            <h3 class="insp-title">${prog.title}</h3>
          </div>
          <div class="insp-icon-wrap" style="color: ${prog.color}; background: ${prog.color}18;">
            <i class="fas ${prog.icon}"></i>
          </div>
        </div>

        <p class="insp-desc">${prog.desc}</p>

        <div class="insp-curriculum-wrap">
          <div class="insp-sec-label">
            <i class="fas fa-graduation-cap text-amber"></i> Core Skills & Curriculum Modules
          </div>
          <div class="insp-curriculum-grid">
            ${(prog.curriculum || []).map(m => `
              <div class="insp-curr-item">
                <i class="fas fa-check-circle" style="color: ${prog.color};"></i>
                <span>${m}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insp-outcome-box">
          <strong style="display: block; margin-bottom: 0.35rem;"><i class="fas fa-seedling text-emerald"></i> Real-World Social Impact:</strong>
          ${prog.outcome || 'Directly preparing youth with practical vocational and artistic capabilities.'}
        </div>

        <div class="insp-stats-line">
          <i class="fas fa-chart-line text-amber"></i>
          <span>${prog.stats || 'Active across community studios in Nigeria'}</span>
        </div>

        <div class="insp-actions">
          <a href="https://paystack.shop/pay/lk0hlrdlun" target="_blank" class="btn btn-primary">
            <i class="fas fa-heart"></i> Sponsor ${prog.title}
          </a>
          <button class="btn btn-secondary" onclick="window.volunteerForProgram('${prog.title}')">
            <i class="fas fa-user-plus"></i> Volunteer to Coach
          </button>
          <a href="#art-shop" class="btn btn-secondary" onclick="window.filterShopByProgram('${prog.category}')">
            <i class="fas fa-palette"></i> View Works
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
        <span class="prog-ribbon-icon"><i class="fas ${p.icon}"></i></span>
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
          <i class="fas ${p.icon}" style="color: ${p.color};"></i>
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
      ctaUsd: 'Sponsor Daily Meals ($10)',
      ctaNgn: 'Sponsor Daily Meals (₦12,500)'
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
      ctaUsd: "Sponsor 1 Child's Tuition ($35)",
      ctaNgn: "Sponsor 1 Child's Tuition (₦43,750)"
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
      ctaUsd: 'Sponsor 1 Full Year ($100)',
      ctaNgn: 'Sponsor 1 Full Year (₦125,000)'
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
      ctaUsd: 'Sponsor Full Fellowship ($250)',
      ctaNgn: 'Sponsor Full Fellowship (₦312,500)'
    }
  };

  let bentoState = {
    selectedAmount: '35',
    currency: 'USD'
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

  
  // Section 2: Minimalist Hero Donation Thingy
  function initMHeroDonationThingy() {
    let mCurr = 'USD';
    let mAmount = '35';

    const btnUsd = document.getElementById('mHeroCurrUsd');
    const btnNgn = document.getElementById('mHeroCurrNgn');
    const tierBtns = document.querySelectorAll('.m-hero-tier-btn');
    const donateText = document.getElementById('mHeroDonateText');

    const TIER_TITLES = {
      '10': { USD: 'Sponsor Meals & Art ()', NGN: 'Sponsor Meals & Art (₦12,500)' },
      '35': { USD: "Sponsor 1 Child's Tuition ()", NGN: "Sponsor 1 Child's Tuition (₦43,750)" },
      '100': { USD: 'Sponsor Full Year ()', NGN: 'Sponsor Full Year (₦125,000)' },
      '250': { USD: 'Sponsor Fellowship ()', NGN: 'Sponsor Fellowship (₦312,500)' },
    };

    function updateView() {
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
    }

    if (btnUsd) {
      btnUsd.addEventListener('click', (e) => {
        e.preventDefault();
        mCurr = 'USD';
        updateView();
      });
    }
    if (btnNgn) {
      btnNgn.addEventListener('click', (e) => {
        e.preventDefault();
        mCurr = 'NGN';
        updateView();
      });
    }

    tierBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        mAmount = btn.dataset.amount;
        updateView();
      });
    });
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
      desc: "Before Slum Art, my days were spent fishing plastic from the water. Today my paintings pay my school tuition and I have a seat in a real classroom.",
      outcomes: "<span>100% Tuition Escrow</span><span class=\"dot-sep\">&bull;</span><span>Crested Kit</span><span class=\"dot-sep\">&bull;</span><span>Daily Meals</span>"
    },
    {
      name: "Blessing, Age 13",
      role: "Scholar #078 &bull; Waterfront Academy, Nigeria",
      avatar: "assets/images/resources/prof_2.png",
      bgImage: "assets/images/gallery/gallery_07.jpg",
      tagText: "Secondary Scholar &bull; Floating Atelier",
      title: "Finding My Creative Voice on the Floating Easel",
      desc: "Painting on the lagoon gave me confidence and hope. My artwork helped fund our solar-powered library, and now I am excelling in secondary school.",
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
      tagText: "Charcoal & Pastels &bull; Under-Bridge Studio",
      title: "From Informal Dumpsites to Gallery Showcases",
      desc: "Drawing portraits with charcoal taught me that my hands can build something beautiful. Our art is breaking generations of poverty right here under the bridge.",
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

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
