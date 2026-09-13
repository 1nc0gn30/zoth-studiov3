/**
 * Cinder & Tide - Primary Interactive Logic
 * Modern, accessible SPA router, dynamic menu filtering, live reservation engine & validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Lucide Icons if available ---
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Live Status & Schedule Checker ---
  function updateBusinessStatus() {
    const statusBadge = document.getElementById('live-status-badge');
    const statusText = document.getElementById('live-status-text');
    const statusDot = document.getElementById('live-status-dot');
    if (!statusBadge || !statusText) return;

    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeMinutes = hours * 60 + minutes;

    let isOpen = false;
    let scheduleToday = '';

    if (day === 1) { // Monday
      scheduleToday = 'Closed on Mondays (Private Events & Sourcing)';
    } else if (day >= 2 && day <= 4) { // Tue - Thu (5:00 PM - 10:00 PM)
      scheduleToday = 'Tonight: 5:00 PM – 10:00 PM';
      if (currentTimeMinutes >= 17 * 60 && currentTimeMinutes < 22 * 60) {
        isOpen = true;
      }
    } else if (day === 5 || day === 6) { // Fri - Sat (4:30 PM - 11:00 PM)
      scheduleToday = 'Tonight: 4:30 PM – 11:00 PM';
      if (currentTimeMinutes >= (16 * 60 + 30) && currentTimeMinutes < 23 * 60) {
        isOpen = true;
      }
    } else if (day === 0) { // Sunday (10:30 AM - 2:30 PM & 5:00 PM - 9:30 PM)
      scheduleToday = 'Sunday: Brunch 10:30 AM – 2:30 PM | Dinner 5:00 PM – 9:30 PM';
      if ((currentTimeMinutes >= (10 * 60 + 30) && currentTimeMinutes < (14 * 60 + 30)) ||
          (currentTimeMinutes >= 17 * 60 && currentTimeMinutes < (21 * 60 + 30))) {
        isOpen = true;
      }
    }

    if (isOpen) {
      if (statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
      statusText.innerHTML = `<span class="text-emerald-400 font-semibold">Open Now</span> • ${scheduleToday}`;
    } else {
      if (statusDot) statusDot.className = 'w-2 h-2 rounded-full bg-amber-400';
      statusText.innerHTML = `<span class="text-amber-400 font-medium">Opening Soon</span> • ${scheduleToday}`;
    }
  }
  updateBusinessStatus();

  // --- SPA Hash Router & Page Switching ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.view-section');
  const mobileMenuDrawer = document.getElementById('mobile-menu');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function setActivePage(targetHash) {
    let hash = targetHash || window.location.hash || '#home';
    if (!hash.startsWith('#')) hash = '#' + hash;

    // Default to home if target doesn't exist
    const targetSection = document.querySelector(hash);
    if (!targetSection) {
      hash = '#home';
    }

    // Toggle sections visibility
    sections.forEach((sec) => {
      if ('#' + sec.id === hash) {
        sec.classList.remove('hidden');
        sec.setAttribute('aria-hidden', 'false');
      } else {
        sec.classList.add('hidden');
        sec.setAttribute('aria-hidden', 'true');
      }
    });

    // Update active nav links
    navLinks.forEach((link) => {
      const linkHref = link.getAttribute('href');
      if (linkHref === hash) {
        link.classList.add('text-white', 'font-semibold');
        link.classList.remove('text-zinc-400');
        link.setAttribute('aria-current', 'page');
        const indicator = link.querySelector('.nav-indicator');
        if (indicator) indicator.classList.remove('opacity-0');
      } else {
        link.classList.remove('text-white', 'font-semibold');
        link.classList.add('text-zinc-400');
        link.removeAttribute('aria-current');
        const indicator = link.querySelector('.nav-indicator');
        if (indicator) indicator.classList.add('opacity-0');
      }
    });

    // Scroll top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile menu if open
    closeMobileMenu();

    // Re-create icons on dynamic elements
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  window.addEventListener('hashchange', () => {
    setActivePage(window.location.hash);
  });

  // Initial routing
  setActivePage(window.location.hash);

  // Mobile menu toggle
  function openMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.remove('translate-x-full');
    mobileMenuDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.add('translate-x-full');
    mobileMenuDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

  // --- Menu Live Search & Category Filtering ---
  const menuCategories = document.querySelectorAll('.menu-category-btn');
  const menuItems = document.querySelectorAll('.menu-item-card');
  const menuSearchInput = document.getElementById('menu-search-input');
  const menuDietaryFilter = document.getElementById('menu-dietary-filter');
  const menuEmptyState = document.getElementById('menu-empty-state');
  const menuResetBtn = document.getElementById('menu-reset-filter');

  let activeCategory = 'all';
  let activeDietary = 'all';
  let searchQuery = '';

  function filterMenu() {
    let visibleCount = 0;

    menuItems.forEach((item) => {
      const category = item.getAttribute('data-category');
      const dietary = (item.getAttribute('data-dietary') || '').toLowerCase();
      const title = (item.querySelector('.item-name')?.textContent || '').toLowerCase();
      const desc = (item.querySelector('.item-desc')?.textContent || '').toLowerCase();
      const itemText = `${title} ${desc} ${dietary} ${category}`.toLowerCase();

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesDietary = activeDietary === 'all' || dietary.includes(activeDietary.toLowerCase());
      const matchesSearch = !searchQuery || itemText.includes(searchQuery);

      if (matchesCategory && matchesDietary && matchesSearch) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    if (menuEmptyState) {
      if (visibleCount === 0) {
        menuEmptyState.classList.remove('hidden');
      } else {
        menuEmptyState.classList.add('hidden');
      }
    }
  }

  menuCategories.forEach((btn) => {
    btn.addEventListener('click', () => {
      menuCategories.forEach((b) => {
        b.classList.remove('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
        b.classList.add('text-zinc-400', 'border-white/10');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
      btn.classList.remove('text-zinc-400', 'border-white/10');
      btn.setAttribute('aria-pressed', 'true');

      activeCategory = btn.getAttribute('data-category');
      filterMenu();
    });
  });

  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterMenu();
    });
  }

  if (menuDietaryFilter) {
    menuDietaryFilter.addEventListener('change', (e) => {
      activeDietary = e.target.value;
      filterMenu();
    });
  }

  if (menuResetBtn) {
    menuResetBtn.addEventListener('click', () => {
      activeCategory = 'all';
      activeDietary = 'all';
      searchQuery = '';
      if (menuSearchInput) menuSearchInput.value = '';
      if (menuDietaryFilter) menuDietaryFilter.value = 'all';

      menuCategories.forEach((b, idx) => {
        if (idx === 0) {
          b.classList.add('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
          b.classList.remove('text-zinc-400', 'border-white/10');
        } else {
          b.classList.remove('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
          b.classList.add('text-zinc-400', 'border-white/10');
        }
      });
      filterMenu();
    });
  }

  // Print Menu action
  const printMenuBtn = document.getElementById('print-menu-btn');
  if (printMenuBtn) {
    printMenuBtn.addEventListener('click', () => {
      // Ensure all menu items are visible before print
      menuItems.forEach(item => item.classList.remove('hidden'));
      window.print();
    });
  }

  // --- Reservation Form Tabs & Validation ---
  const bookingTabBtn = document.getElementById('tab-booking-btn');
  const inquiryTabBtn = document.getElementById('tab-inquiry-btn');
  const bookingForm = document.getElementById('reservation-form');
  const inquiryForm = document.getElementById('inquiry-form');

  if (bookingTabBtn && inquiryTabBtn && bookingForm && inquiryForm) {
    bookingTabBtn.addEventListener('click', () => {
      bookingTabBtn.classList.add('border-amber-500', 'text-amber-400', 'bg-amber-500/10');
      bookingTabBtn.classList.remove('border-transparent', 'text-zinc-400');
      inquiryTabBtn.classList.remove('border-amber-500', 'text-amber-400', 'bg-amber-500/10');
      inquiryTabBtn.classList.add('border-transparent', 'text-zinc-400');

      bookingForm.classList.remove('hidden');
      inquiryForm.classList.add('hidden');
    });

    inquiryTabBtn.addEventListener('click', () => {
      inquiryTabBtn.classList.add('border-amber-500', 'text-amber-400', 'bg-amber-500/10');
      inquiryTabBtn.classList.remove('border-transparent', 'text-zinc-400');
      bookingTabBtn.classList.remove('border-amber-500', 'text-amber-400', 'bg-amber-500/10');
      bookingTabBtn.classList.add('border-transparent', 'text-zinc-400');

      inquiryForm.classList.remove('hidden');
      bookingForm.classList.add('hidden');
    });
  }

  // Set default minimum date for booking input to today
  const resDateInput = document.getElementById('res-date');
  if (resDateInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    resDateInput.min = todayStr;
    // Set default to tomorrow or today if early
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    resDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Toast notification helper
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `glass-panel px-4 py-3 rounded-lg shadow-xl text-sm flex items-center gap-3 border ${
      type === 'success' ? 'border-amber-500/40 text-amber-200' : 'border-red-500/40 text-red-200'
    } transform translate-y-4 opacity-0 transition-all duration-300 pointer-events-auto`;
    toast.innerHTML = `
      <div class="w-2 h-2 rounded-full ${type === 'success' ? 'bg-amber-400' : 'bg-red-400'}"></div>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- Reservation Confirmation Modal & ICS Generator ---
  const confirmationModal = document.getElementById('confirmation-modal');
  const confCodeEl = document.getElementById('conf-code');
  const confDetailsEl = document.getElementById('conf-details');
  const confCloseBtn = document.getElementById('conf-close-btn');
  const confCalendarBtn = document.getElementById('conf-calendar-btn');
  const confCopyBtn = document.getElementById('conf-copy-btn');

  let lastReservationData = null;

  function generateConfCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'CT-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function generateICS(data) {
    const startDate = new Date(`${data.date}T${data.time}:00`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    function formatDate(d) {
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cinder and Tide//Restaurant Reservation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${data.code}@cinderandtide.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:Dinner at Cinder & Tide (${data.guests} Guests)`,
      `DESCRIPTION:Reservation Code: ${data.code}\\nGuest: ${data.name}\\nSeating: ${data.seating}\\nPhone: ${data.phone}\\nSpecial Notes: ${data.notes || 'None'}\\nAddress: 2408 Pacific Ave, Virginia Beach, VA 23451`,
      'LOCATION:Cinder & Tide, 2408 Pacific Ave, Virginia Beach, VA 23451',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Cinder_and_Tide_Reservation_${data.code}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Reservation Form Submit Handler
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('res-name').value.trim();
      const email = document.getElementById('res-email').value.trim();
      const phone = document.getElementById('res-phone').value.trim();
      const guests = document.getElementById('res-guests').value;
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const seating = document.getElementById('res-seating').value;
      const notes = document.getElementById('res-notes').value.trim();

      if (!name || !email || !phone || !date || !time) {
        showToast('Please fill out all required fields marked with *', 'error');
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please provide a valid email address.', 'error');
        return;
      }

      const confCode = generateConfCode();
      lastReservationData = {
        code: confCode,
        name,
        email,
        phone,
        guests,
        date,
        time,
        seating,
        notes
      };

      // Populate confirmation modal
      if (confCodeEl) confCodeEl.textContent = confCode;
      if (confDetailsEl) {
        const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        confDetailsEl.innerHTML = `
          <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-white/5">
              <span class="text-zinc-400">Primary Guest</span>
              <span class="text-white font-medium">${name}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white/5">
              <span class="text-zinc-400">Party Size</span>
              <span class="text-amber-400 font-semibold">${guests} Guests</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white/5">
              <span class="text-zinc-400">Date & Time</span>
              <span class="text-white font-medium">${formattedDate} at ${time}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white/5">
              <span class="text-zinc-400">Seating Area</span>
              <span class="text-zinc-200">${seating}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white/5">
              <span class="text-zinc-400">Contact</span>
              <span class="text-zinc-200">${phone} • ${email}</span>
            </div>
            ${notes ? `
            <div class="py-2 border-b border-white/5">
              <span class="text-zinc-400 block mb-1">Notes & Dietary:</span>
              <span class="text-zinc-300 italic text-xs">${notes}</span>
            </div>` : ''}
          </div>
        `;
      }

      // Show modal
      if (confirmationModal) {
        confirmationModal.classList.remove('hidden');
        confirmationModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }

      bookingForm.reset();
      showToast(`Reservation ${confCode} successfully confirmed!`);
    });
  }

  // Inquiry Form Submit Handler
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('inq-name').value.trim();
      const email = document.getElementById('inq-email').value.trim();
      const msg = document.getElementById('inq-msg').value.trim();

      if (!name || !email || !msg) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }

      showToast('Thank you! Your private dining inquiry has been sent. Our team will contact you within 24 hours.');
      inquiryForm.reset();
    });
  }

  // Confirmation Modal actions
  if (confCloseBtn) {
    confCloseBtn.addEventListener('click', () => {
      if (confirmationModal) {
        confirmationModal.classList.add('hidden');
        confirmationModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  if (confCalendarBtn) {
    confCalendarBtn.addEventListener('click', () => {
      if (lastReservationData) {
        generateICS(lastReservationData);
        showToast('Calendar event (.ics) downloaded!');
      }
    });
  }

  if (confCopyBtn) {
    confCopyBtn.addEventListener('click', () => {
      if (lastReservationData) {
        const summary = `Cinder & Tide Reservation\nCode: ${lastReservationData.code}\nGuest: ${lastReservationData.name}\nParty: ${lastReservationData.guests} Guests\nDate: ${lastReservationData.date} at ${lastReservationData.time}\nAddress: 2408 Pacific Ave, Virginia Beach, VA`;
        navigator.clipboard.writeText(summary).then(() => {
          showToast('Reservation details copied to clipboard!');
        }).catch(() => {
          showToast(`Code: ${lastReservationData.code}`);
        });
      }
    });
  }
});
