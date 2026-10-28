# Slum Art Foundation • Modern Web Platform

> **"Buy An Artwork and Send a Kid to School"**  
> A high-performance, modern, accessible web platform built with authentic content from [slumart.org](https://slumart.org/) and elevated with modern design engineering components from [21st.dev](https://21st.dev/).

---

## 🌟 What was Upgraded & Modernized

### 1. 21st.dev Components & Modern Design Engineering
* **`tideline-cta` ([21st.dev/@ham7a311/components/tideline-cta](https://21st.dev/@ham7a311/components/tideline-cta))**:
  - Implemented for **The Comic Project • 5,000 Social Media Ambassadors Campaign**.
  - Features a warm ivory/obsidian dual-layer typography engine with an animated SVG wave mask that inverts and submerges the copy as the tide rises to 74% (3,720 / 5,000 ambassadors).
  - Floating buoy action button bobbing on the waterline with an interactive modal trigger.
  - **Seamless Color Flow**: Deep rising water color is tuned to `#060911`, which seamlessly continues downward directly into the Skiper39 Canvas Crowd footer with zero border artifacts.
* **`cta-with-text-marquee` ([21st.dev/@lyanchouss/components/cta-with-text-marquee](https://21st.dev/@lyanchouss/components/cta-with-text-marquee))**:
  - Implemented directly on the **13 Creative & Skills Programs** section.
  - Features an **Interactive Program Inspector** coupled with an infinite **Vertical Scrolling Text Marquee** with top and bottom gradient masks.
  - **Click-to-Inspect**: Clicking any item in the scrolling vertical marquee pauses and instantly loads rich in-depth content:
    - Program number and category pill
    - Comprehensive discipline overview
    - 4 Core Skills & Curriculum Modules
    - Real-world community social outcome
    - Active youth enrollment statistics
    - Action triggers: "Sponsor This Pillar" (direct Paystack checkout), "Volunteer to Coach" (pre-fills volunteer application), and "View Works" (filters the art shop).
  - **Dynamic Center Proximity Opacity**: Calculates real-time bounding box distance to the container midpoint, highlighting the center item at 100% opacity while softly fading items towards 35% near top and bottom edges.
  - **View Switcher**: Seamlessly toggle between the interactive 21st.dev Marquee Inspector and the full 13 cards grid.
* **`skiper39` Canvas Crowd Footer ([21st.dev/@reuno-ui/components/skiper39](https://21st.dev/@reuno-ui/components/skiper39))**:
  - Implemented as the official site footer across all pages.
  - Powered by **HTML5 Canvas** & **GSAP timeline walk cycles**.
  - Renders a lively, continuous walking crowd of illustrated characters from the OpenPeeps sprite sheet moving across the ground plane at the footer baseline.
  - Features layered giant brand watermark typography (`SLUM ART FOUNDATION`), a live status beacon (`● Slum Art Community Center • Ijora Badia, Lagos`), a sleek newsletter subscription pill, organized navigation columns, and direct Paystack donation access.
* **Infinite Partner & Recognition Marquee (21st.dev Infinite Ribbon)**:
  - GPU-accelerated, continuous-flow infinite ticker with edge gradient masking, spotlighting the 4-Time Guinness World Records, Pet Bottle School, Cal Ripken, Sr. Foundation, UnTours Foundation, and international media features.
* **Spotlight Mouse-Tracking Radial Glow (21st.dev Spotlight)**:
  - Cards dynamically track the cursor's coordinates to render a soft, interactive radial spotlight that brings depth to program, cause, and artwork cards.
* **Animated Number Counter Tickers (21st.dev Counters)**:
  - Smooth easing counter animations triggered via `IntersectionObserver` when metrics scroll into view (`4x` World Records, `36+` Artworks, `1,000+` Kids Reached, `10,000+` Upcycled Bottles).

### 2. The Comic Project & Ambassador Movement Details
* **5,000 Social Media Ambassadors**: Onboarding 5,000 passionate ambassadors to rally viral attention for slum youth empowerment.
* **CapCut Video Templates & Training**: We provide pre-edited CapCut template video files and teach ambassadors video editing. Ambassadors simply insert a 5-second selfie video into the template.
* **Synchronized Posting**: Coordinated publishing times tagging `@adetunwaseadenle` and official foundation handles.
* **3×3 Viral Multiplication**: Each onboarded ambassador influences and onboards 3 new people, each of whom onboards another 3.
* **$1/Month & Daily Web Comic Access**: Each ambassador commits to a $1 monthly donation (≈₦1,250) supporting school fees, books, and lunches while gaining access to the daily web comic.

### 3. Programs Document Integration (`10 Slum Art programs.docx`)
* All 13 Creative Programs and 6 Community Welfare Pillars match the official document text verbatim:
  - **13 Programs**: *Slum Art, Slum Music, Slum Film, Slum Dance, Slum Photography, Slum Skate, Slum Poetry, Slum Fashion, Slum Animation, Slum Theatre, Slum Designs, Slum Tech, Slum Evangelism*.
  - **6 Welfare Initiatives**: *Food Clinic, Hair-Port, Jollof Rice Party, Art-surance, Mentorship, Garri Fiesta*.

### 2. Fixes for Critical Issues on the Original Website
* **Fixed 500 Internal Server Errors**: The live site throws 500 server errors on `/about.html` and `/register`. In this upgraded codebase, both pages have been completely restored, polished, and made fully functional.
* **Eliminated Template Placeholder Text**: Removed generic template filler text (dummy reviews, Latin strings, placeholder team names like *"Yana Good Nigen"*) and replaced them with verified Slum Art Foundation copy, real partner voices (*Cal Ripken, Sr. Foundation*, *Reset Tourism Fund*), and authentic leadership (*Adetunwase Adenle*, *Natalie Gilbert*, *Oyindamola Sulaimon*).
* **Repaired Broken Links**: Fixed broken navigation anchors, telephone links, mailto links, social handles, and direct Paystack payment URLs.

### 3. High-Impact Interactive Features
* **Dynamic Currency Toggle (₦ NGN / $ USD)**:
  - Instant toggle between Nigerian Naira (`₦`) and US Dollars (`$`) across the entire website and art shop, with `localStorage` persistence.
* **Interactive Impact Calculator**:
  - Live slider allowing donors and collectors to visualize real tangible outcomes (nutritious meals provided, terms of school tuition covered, art kits supplied, and mentorship hours unlocked).
* **Advanced E-Commerce Art Gallery & Shop**:
  - Full catalog of **36 authentic original artworks** by children and youth (ages 8–15) from Makoko and Ijora Badia.
  - Live instant search by title, artist, or medium.
  - Category filter pills (*Vibrant Acrylics*, *Charcoal & Pencil*, *Recycled Media*, *Story Canvases*, *Little Masters*).
  - Price sorting (Low to High, High to Low, Title A–Z).
  - **Quick View Modal** featuring high-res imagery, artist bio, medium, origin, and social impact statement.
  - **Interactive Art Bag (Cart Drawer)** with item counter badge and direct Paystack checkout integration.
* **Guinness World Records™ Comic Book Project Flow**:
  - Dedicated interactive registration modal and standalone page (`register.html`).
  - Generates verified, unique participant codes (e.g. `SLUM-GWR-7842`) with printable/downloadable accreditation cards.
* **Rich Storytelling for 19 Pillars**:
  - Interactive showcases for all **13 Creative & Skills Programs** and **6 Community Welfare Initiatives**.
  - Dedicated progress bars for **4 Core Causes** (*Craft Minds Empowerment*, *Girls Hygiene*, *Doodle Dreams*, *Recycling Trash*).

---

## 📁 Project Structure

```
Slum Art website/
├── index.html            # Flagship modern homepage with all highlights & calculator
├── about.html            # In-depth About page: founder biography, Pet Bottle School, team
├── shop.html             # Dedicated Full Art Shop & Gallery with live filter suite
├── programs.html         # Interactive directory of 13 Creative Programs & 6 Welfare Pillars
├── register.html         # Guinness World Record Comic Book Project Registration
├── contact.html          # Contact info, WhatsApp link, and volunteer application
├── css/
│   └── style.css         # Modern design system + 21st.dev styling (marquee, spotlight, skiper39 footer)
├── js/
│   ├── data.js           # Structured data: 36 artworks, programs, welfare, team, causes
│   ├── app.js            # App engine: currency switcher, filter/search, cart drawer, modals, toasts
│   └── canvas-crowd.js   # 21st.dev Skiper39 Canvas Crowd animation engine (HTML5 Canvas + GSAP)
├── assets/
│   └── images/
│       ├── peeps/        # 21st.dev Skiper39 sprite sheet (all-peeps.png)
│       └── artworks/     # All authentic youth artwork images
└── data_artworks.json    # JSON catalog of all 36 artworks with metadata and pricing
```

---

## 🚀 How to Run Locally

You can open [**`index.html`**](file:///Users/sanjeevn/Downloads/Slum%20Art%20website/index.html) directly in any web browser, or serve it using Python's built-in web server:

```bash
# In the project directory:
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.
