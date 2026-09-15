/**
 * AURUM / V. KESTREL — Master Application Controller
 * Interaction Architecture, Magnetic Physics, Case Study Modals, Form Validation, & Studio Telemetry
 */

(function () {
  'use strict';

  // Master Portfolio Data (Case Studies & Articles)
  const PROJECTS_DATA = {
    'noir-et-or': {
      title: 'NOIR & OR — Spatial Exhibition & Digital Archive',
      category: 'Spatial Systems',
      client: 'Fondation de Haute Horlogerie, Geneva',
      year: '2026',
      heroImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
      ],
      role: 'Lead Spatial Designer & Creative Technologist',
      disciplines: ['Spatial UI', 'Volumetric Raymarching', 'WebGPU Shaders', 'Binaural Audio'],
      overview: 'A monolithic digital sanctuary commissioned by Geneva’s premier horological foundation. NOIR & OR translates the micro-mechanical soul of ultra-rare tourbillons into an interactive spatial memory palace, letting visitors inspect gear escapements down to the nanometer in zero-latency 3D.',
      philosophy: 'Horology is the physical quantization of entropy. Our spatial experience embraces shadow and quietude, allowing precious metals to catch light only when provoked by intentional human curiosity.',
      outcomes: [
        'Awwwards Site of the Month & Developer Award (Score 9.42)',
        'Over 420,000 unique global visitors during the Geneva Watch Week',
        'Sub-14ms frame latency on Apple Vision Pro and desktop Safari'
      ],
      deliverables: ['Custom WebGPU Raymarching Engine', 'Anisotropic Shaders', 'Spatial Audio Landscape']
    },
    'aether-fluidity': {
      title: 'AETHER FLUIDITY — Parametric Runway 2026',
      category: 'Digital Haute Couture',
      client: 'Maison Vespera, Paris',
      year: '2026',
      heroImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'
      ],
      role: 'Creative Director & Generative Artist',
      disciplines: ['Cloth Simulation', 'Custom Transmission Shaders', 'Generative Silk Curves'],
      overview: 'An avant-garde digital runway experience exploring the intersection of champagne silk, mathematical turbulence, and bespoke digital silhouettes for Paris Fashion Week.',
      philosophy: 'Fabric is not merely texture; it is liquid poetry governed by Newtonian gravity and emotional momentum.',
      outcomes: [
        'Featured in Vogue Digital & Wallpaper* Magazine',
        'Over 85,000 interactive garment customizations saved',
        'Real-time cloth physics running smoothly at 120 FPS on OLED displays'
      ],
      deliverables: ['Real-time Silk Vertex Shader', 'Interactive Colorway Synthesizer', '4K Procedural Runway Visualizer']
    },
    'chronos-monolith': {
      title: 'CHRONOS MONOLITH — Autonomous Kinetic Timepiece',
      category: 'Physical Artifacts',
      client: 'Kestrel Labs x Urwerk',
      year: '2025',
      heroImage: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=1600&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80'
      ],
      role: 'Industrial Designer & Systems Architect',
      disciplines: ['CNC Titanium Architecture', 'Gold Inlay', 'Embedded RISC-V Firmware'],
      overview: 'A physical desk monolith machined from solid Grade 5 titanium, housing an autonomous mechanical sundial and embedded RISC-V core that maps the celestial transit of the sun using gold laser micro-refractions.',
      philosophy: 'True luxury resists obsolescence. By blending ancient solar observation with aerospace alloys, the Monolith exists beyond software deprecation cycles.',
      outcomes: [
        'Limited edition run of 24 numbered units sold out within 8 minutes',
        'Red Dot: Best of the Best in Industrial Design 2025'
      ],
      deliverables: ['Titanium Monolith Enclosure', 'Custom Firmware', 'Collector Web Companion']
    },
    'kyoto-sanctuary': {
      title: 'KYOTO SANCTUARY — Acoustic Architecture & Tea Pavilion',
      category: 'Brand Architecture',
      client: 'Sōkei Cultural Foundation, Kyoto',
      year: '2025',
      heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80'
      ],
      role: 'Spatial Architect & Sound Designer',
      disciplines: ['Parametric Woodworking', 'Charred Cedar (Yakisugi)', 'Binaural Acoustics'],
      overview: 'A contemplative tea pavilion nestled in the hills of Arashiyama. Constructed using traditional joinery without metal fasteners, paired with a web-based acoustic twin that lets global guests listen to the live rain acoustics of the garden.',
      philosophy: 'Architecture should not shout over nature; it should provide the acoustic frame through which the wind and rain compose their symphony.',
      outcomes: [
        'Architectural Digest Spatial Experience of the Year',
        'Permanent installation in Kyoto, Japan'
      ],
      deliverables: ['Physical Pavilion Blueprint', 'Web Audio Live Twin Stream', 'Editorial Book']
    },
    'synthesis-os': {
      title: 'SYNTHESIS OS — Spatial Computing Operating Surface',
      category: 'Spatial Systems',
      client: 'Archetype Intelligence, San Francisco',
      year: '2025',
      heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
      ],
      role: 'Principal Interface Designer',
      disciplines: ['Spatial UX', 'Micro-Typography', 'Eye-Tracking Gestures', 'Haptic Guidance'],
      overview: 'A radical spatial operating system interface crafted for next-generation holographic headsets. Replaces floating 2D rectangles with volumetric fluid lenses, spatial typography anchored in physical architecture, and micro-gaze focus triggers.',
      philosophy: 'Spatial interfaces must feel like polished quartz and obsidian—tactile, stable, and deeply respectful of the user’s cognitive peripheral vision.',
      outcomes: [
        'Adopted as primary design reference by three tier-one spatial computing hardware teams',
        'FWA of the Month & UX Design Award'
      ],
      deliverables: ['Spatial Design System', 'SwiftUI / Metal Reference Engine', 'Interactive Prototype']
    },
    'lobsidienne': {
      title: 'L’OBSIDIENNE — High-Jewelry Digital Experience',
      category: 'Digital Haute Couture',
      client: 'Place Vendôme Atelier, Paris',
      year: '2024',
      heroImage: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1600&q=85',
      gallery: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80'
      ],
      role: 'Creative Director & WebGL Shader Specialist',
      disciplines: ['Micro-Displacement Maps', 'Spectral Diamond Dispersion', 'Interactive Macrophotography'],
      overview: 'An ultra-high-definition interactive showcase for a one-of-a-kind black diamond necklace. Employs 8K custom procedural spectral dispersion shaders that capture every ray of refraction in real-time as users manipulate light with cursor kinematics.',
      philosophy: 'Darkness is not the absence of beauty; it is the ultimate canvas for light to declare its brilliance.',
      outcomes: [
        'Sold to a private collector within 48 hours of digital unveiling',
        'CSS Design Awards Site of the Day'
      ],
      deliverables: ['Custom Diamond Refraction Shader', '8K Interactive Viewer', 'Private Client Portal']
    }
  };

  const ARTICLES_DATA = {
    'dignity-of-friction': {
      title: 'The Dignity of Friction in Post-AI Interfaces',
      date: 'September 2026',
      readTime: '6 min read',
      category: 'Design Philosophy & AI Ethics',
      lead: 'Why frictionless instant generation creates disposable culture, and why deliberate tactile resistance, pacing, and human intentionality represent the true new luxury.',
      content: `
        <p class="mb-6 leading-relaxed text-gray-300">Over the past three years, the dominant technological narrative has worshipped zero-friction: generate an image in 200 milliseconds, write a 40-page brief with a single prompt, produce infinite variants with zero physical or cognitive strain.</p>
        
        <p class="mb-6 leading-relaxed text-gray-300">Yet, when output becomes instantaneous and effortless, its perceived value asymptotically approaches zero. If an artifact demands no time, no struggle, and no physical commitment from its creator, why should any viewer grant it their most precious and finite asset: their unhurried human attention?</p>
        
        <blockquote class="my-8 border-l-2 border-amber-400/80 pl-6 italic text-xl font-serif text-amber-200/90">
          "Friction is not a bug to be engineered away; it is the very membrane where human intentionality crystallizes into meaning."
        </blockquote>

        <h3 class="text-2xl font-serif text-white mt-8 mb-4">The Fallacy of Frictionless Speed</h3>
        <p class="mb-6 leading-relaxed text-gray-300">In physical craftsmanship—from Japanese wood joinery (Kanawa Tsugi) to bespoke Swiss watchmaking—friction is the teacher. The grain of the wood pushes back against the chisel. The tension of the hairspring resists the balance wheel. It is precisely through this tactile conversation that mastery emerges.</p>

        <p class="mb-6 leading-relaxed text-gray-300">When we build digital spaces that move at the speed of human thought rather than the speed of algorithmic dumping, we create sanctuary. We invite the viewer to breathe, to touch, to linger. That is the essence of Quiet Luxury in code.</p>

        <h3 class="text-2xl font-serif text-white mt-8 mb-4">Tactile Computing & The Next Decade</h3>
        <p class="mb-6 leading-relaxed text-gray-300">As we move toward spatial and ambient intelligence, the websites and tools that will endure are not those that flood the senses with hyperactive noise, but those that embody weight, inertia, acoustic warmth, and quiet confidence.</p>
      `
    },
    'anisotropic-light': {
      title: 'Anisotropic Light & The Mathematics of Liquid Gold',
      date: 'July 2026',
      readTime: '8 min read',
      category: 'Creative Engineering & GLSL',
      lead: 'A technical exploration into real-time microfacet distribution approximations, Simplex turbulence, and rendering physical metallurgy in WebGL shaders.',
      content: `
        <p class="mb-6 leading-relaxed text-gray-300">Simulating precious metals on the web has historically suffered from plastic specular falloffs. Standard Blinn-Phong and simplistic PBR models often fail to capture the subtle microscopic grain alignment inherent to hand-brushed champagne gold.</p>
        
        <p class="mb-6 leading-relaxed text-gray-300">In our custom GLSL pipeline, we introduce a modified Ashikhmin-Shirley anisotropic reflectance model parameterized by tangent vectors and high-frequency multi-octave Simplex noise. By calculating the microfacet normal distribution function alongside a cyan subsurface dispersion term, we achieve the warm, liquid sheen characteristic of raw melted bullion.</p>

        <blockquote class="my-8 border-l-2 border-cyan-400/80 pl-6 italic text-xl font-serif text-cyan-200/90">
          "Light does not merely bounce off matter; it is sculpted by the microscopic memory of its forging."
        </blockquote>

        <h3 class="text-2xl font-serif text-white mt-8 mb-4">Shader Optimization & Mobile Thermal Budgets</h3>
        <p class="mb-6 leading-relaxed text-gray-300">Rendering real-time noise on mobile GPU architectures requires strict mathematical discipline. By pre-calculating permutation tables in memory and avoiding heavy trigonometric loops in the fragment stage, our shaders maintain a flat 60 FPS profile on mobile Safari while drawing less than 3% battery per session.</p>
      `
    }
  };

  class AurumApp {
    constructor() {
      this.initCursor();
      this.initScrollReveals();
      this.initStudioClocks();
      this.initGalleryFilters();
      this.initCaseStudyModal();
      this.initJournalModal();
      this.initContactForm();
      this.initNavigation();
    }

    /* 1. Custom Magnetic Cursor Physics */
    initCursor() {
      const dot = document.querySelector('.custom-cursor-dot');
      const follower = document.querySelector('.custom-cursor-follower');
      if (!dot || !follower || window.innerWidth < 1024) return;

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let followerX = mouseX;
      let followerY = mouseY;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }, { passive: true });

      const animateFollower = () => {
        followerX += (mouseX - followerX) * 0.14;
        followerY += (mouseY - followerY) * 0.14;
        follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateFollower);
      };
      requestAnimationFrame(animateFollower);

      // Interactive Elements Hover Expansion
      const interactiveEls = document.querySelectorAll('a, button, input, textarea, select, .vault-card, .tab-btn, .interactive-hover');
      interactiveEls.forEach((el) => {
        el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
      });

      // Magnetic Button Physics
      const magneticBtns = document.querySelectorAll('.magnetic-btn');
      magneticBtns.forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const relX = e.clientX - rect.left - rect.width / 2;
          const relY = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${relX * 0.28}px, ${relY * 0.28}px)`;
          btn.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          btn.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate(0px, 0px)';
        });
      });
    }

    /* 2. Scroll Reveals & Active Nav Spy */
    initScrollReveals() {
      const revealItems = document.querySelectorAll('.reveal-item');
      if (!revealItems.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealItems.forEach((item) => observer.observe(item));

      // ScrollSpy for Nav
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');

      window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 200;

        sections.forEach((section) => {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = section.getAttribute('id');
          }
        });

        navLinks.forEach((link) => {
          link.classList.remove('text-amber-300', 'active-nav');
          if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-amber-300', 'active-nav');
          }
        });
      }, { passive: true });
    }

    /* 3. Studio Telemetry & Live World Clocks */
    initStudioClocks() {
      const updateClocks = () => {
        const now = new Date();

        // New York (EST)
        const nyTime = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);

        // Tokyo (JST)
        const tokyoTime = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Tokyo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);

        const elNY = document.getElementById('clock-ny');
        const elTokyo = document.getElementById('clock-tokyo');

        if (elNY) elNY.textContent = `${nyTime} EST`;
        if (elTokyo) elTokyo.textContent = `${tokyoTime} JST`;
      };

      updateClocks();
      setInterval(updateClocks, 1000);
    }

    /* 4. The Vault Gallery Filtering */
    initGalleryFilters() {
      const filterBtns = document.querySelectorAll('.filter-btn');
      const cards = document.querySelectorAll('.vault-card');

      filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter');

          filterBtns.forEach(b => {
            b.classList.remove('active', 'border-amber-400', 'text-amber-300', 'bg-amber-400/10');
            b.classList.add('text-gray-400', 'border-white/10');
          });
          btn.classList.add('active', 'border-amber-400', 'text-amber-300', 'bg-amber-400/10');
          btn.classList.remove('text-gray-400', 'border-white/10');

          cards.forEach((card) => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
              card.style.display = 'block';
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
              }, 40);
            } else {
              card.style.opacity = '0';
              card.style.transform = 'translateY(16px) scale(0.96)';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          });
        });
      });
    }

    /* 5. Full-Screen Case Study Modal System */
    initCaseStudyModal() {
      const modal = document.getElementById('case-study-modal');
      const closeBtn = document.getElementById('close-case-study');
      const triggers = document.querySelectorAll('.open-case-study');

      if (!modal) return;

      const openModal = (projectId) => {
        const data = PROJECTS_DATA[projectId];
        if (!data) return;

        // Populate Modal Fields
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-client').textContent = data.client;
        document.getElementById('modal-year').textContent = data.year;
        document.getElementById('modal-role').textContent = data.role;
        document.getElementById('modal-overview').textContent = data.overview;
        document.getElementById('modal-philosophy').textContent = data.philosophy;
        
        const heroImg = document.getElementById('modal-hero-img');
        if (heroImg) {
          heroImg.src = data.heroImage;
          heroImg.alt = data.title;
        }

        // Disciplines Pills
        const discContainer = document.getElementById('modal-disciplines');
        if (discContainer) {
          discContainer.innerHTML = data.disciplines
            .map(d => `<span class="px-3 py-1 text-xs rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200 font-mono">${d}</span>`)
            .join('');
        }

        // Outcomes List
        const outcomesContainer = document.getElementById('modal-outcomes');
        if (outcomesContainer) {
          outcomesContainer.innerHTML = data.outcomes
            .map(o => `<li class="flex items-start gap-3 text-sm text-gray-300"><span class="text-amber-400 mt-1">✦</span><span>${o}</span></li>`)
            .join('');
        }

        // Deliverables
        const delivContainer = document.getElementById('modal-deliverables');
        if (delivContainer) {
          delivContainer.innerHTML = data.deliverables
            .map(d => `<span class="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-300 font-mono">${d}</span>`)
            .join('');
        }

        // Gallery Stills
        const galleryContainer = document.getElementById('modal-gallery-stills');
        if (galleryContainer && data.gallery) {
          galleryContainer.innerHTML = data.gallery
            .map(img => `<div class="rounded-xl overflow-hidden border border-white/10 aspect-video"><img src="${img}" alt="Detail Still" class="w-full h-full object-cover hover:scale-105 transition duration-700"></div>`)
            .join('');
        }

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      };

      const closeModal = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      };

      triggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const card = trigger.closest('.vault-card');
          const projectId = card ? card.getAttribute('data-project-id') : null;
          if (projectId) openModal(projectId);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop-area')) {
          closeModal();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
          closeModal();
        }
      });
    }

    /* 6. Journal Reader Modal */
    initJournalModal() {
      const modal = document.getElementById('journal-modal');
      const closeBtn = document.getElementById('close-journal-modal');
      const triggers = document.querySelectorAll('.open-article');

      if (!modal) return;

      const openArticle = (articleId) => {
        const data = ARTICLES_DATA[articleId];
        if (!data) return;

        document.getElementById('journal-modal-title').textContent = data.title;
        document.getElementById('journal-modal-meta').textContent = `${data.date} • ${data.readTime} • ${data.category}`;
        document.getElementById('journal-modal-lead').textContent = data.lead;
        document.getElementById('journal-modal-body').innerHTML = data.content;

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      };

      const closeArticle = () => {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
      };

      triggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          const articleId = trigger.getAttribute('data-article-id');
          if (articleId) openArticle(articleId);
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', closeArticle);

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('journal-backdrop-area')) {
          closeArticle();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
          closeArticle();
        }
      });
    }

    /* 7. Working Contact Form Validation & Confirmation */
    initContactForm() {
      const form = document.getElementById('portfolio-contact-form');
      const feedback = document.getElementById('form-feedback');
      const submitBtn = document.getElementById('contact-submit-btn');

      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.elements['name'] ? form.elements['name'].value.trim() : '';
        const email = form.elements['email'] ? form.elements['email'].value.trim() : '';
        const scope = form.elements['scope'] ? form.elements['scope'].value : '';
        const message = form.elements['message'] ? form.elements['message'].value.trim() : '';

        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name) {
          this.showFeedback('Please provide your name or principal entity.', 'error');
          return;
        }
        if (!email || !emailRegex.test(email)) {
          this.showFeedback('Please provide a valid direct email address.', 'error');
          return;
        }
        if (!message || message.length < 10) {
          this.showFeedback('Please provide a brief summary of your project vision (at least 10 characters).', 'error');
          return;
        }

        // Button submission animation
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span class="inline-block animate-spin mr-2">✦</span>
            <span class="font-mono text-xs tracking-wider uppercase">Encrypting & Transmitting...</span>
          `;
        }

        // Simulate secure cryptographic dispatch
        setTimeout(() => {
          const inquiryToken = `AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
              <span class="relative z-10 font-mono text-xs uppercase tracking-widest text-black font-semibold">Transmission Confirmed</span>
            `;
          }

          this.showFeedback(`
            <div class="p-6 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-100">
              <div class="flex items-center gap-2 text-amber-300 font-serif text-lg mb-1">
                <span>✦</span> <span>Inquiry Logged into Secure Vault</span>
              </div>
              <p class="text-sm text-gray-300 mb-3">Thank you, <strong class="text-white">${name}</strong>. Your communication regarding <em class="text-amber-200">${scope || 'Strategic Commission'}</em> has been received.</p>
              <div class="text-xs font-mono text-amber-300/80 bg-black/40 px-3 py-2 rounded border border-amber-400/20 inline-block">
                Reference Token: <strong>${inquiryToken}</strong> • Direct PGP Handshake Ready
              </div>
            </div>
          `, 'success', true);
        }, 900);
      });
    }

    showFeedback(msg, type = 'info', isHtml = false) {
      const feedback = document.getElementById('form-feedback');
      if (!feedback) return;

      if (isHtml) {
        feedback.innerHTML = msg;
      } else {
        feedback.innerHTML = `
          <div class="px-4 py-3 rounded-lg text-sm ${type === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-200' : 'bg-amber-400/10 border border-amber-400/30 text-amber-200'}">
            ${msg}
          </div>
        `;
      }
      feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /* 8. Mobile Menu & Navigation */
    initNavigation() {
      const mobileToggle = document.getElementById('mobile-menu-toggle');
      const mobileMenu = document.getElementById('mobile-nav-drawer');

      if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
          const isOpen = mobileMenu.classList.toggle('hidden');
          mobileToggle.setAttribute('aria-expanded', !isOpen);
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
          });
        });
      }

      // Smooth scroll support for aliases (#home -> #hero, #gallery -> #vault, #about -> #monolith)
      const aliasMap = {
        '#home': '#hero',
        '#gallery': '#vault',
        '#about': '#monolith',
        '#contact': '#contact'
      };

      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          const targetId = aliasMap[href] || href;
          if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              targetEl.scrollIntoView({ behavior: 'smooth' });
              history.pushState(null, null, href);
            }
          }
        });
      });
    }
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AurumApp());
  } else {
    new AurumApp();
  }
})();
