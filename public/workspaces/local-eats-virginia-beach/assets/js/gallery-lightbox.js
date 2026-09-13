/**
 * Accessible Photo Gallery & Lightbox Viewer
 * Keyboard navigable, focus trapped, mobile touch enabled
 */

(function () {
  const galleryGrid = document.getElementById('gallery-grid');
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTag = document.getElementById('lightbox-tag');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  if (!galleryGrid || !lightboxModal) return;

  let currentItems = [];
  let currentIndex = 0;
  let lastFocusedElement = null;

  function updateItemsList() {
    currentItems = Array.from(galleryGrid.querySelectorAll('.gallery-item:not(.hidden)'));
  }

  // Gallery filtering
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => {
        b.classList.remove('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
        b.classList.add('text-zinc-400', 'border-white/10');
        b.setAttribute('aria-pressed', 'false');
      });

      btn.classList.add('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
      btn.classList.remove('text-zinc-400', 'border-white/10');
      btn.setAttribute('aria-pressed', 'true');

      const allItems = galleryGrid.querySelectorAll('.gallery-item');
      allItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      updateItemsList();
    });
  });

  // Open Lightbox
  function openLightbox(index) {
    updateItemsList();
    if (index < 0 || index >= currentItems.length) return;

    lastFocusedElement = document.activeElement;
    currentIndex = index;
    renderLightboxItem();

    lightboxModal.classList.remove('hidden');
    lightboxModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function renderLightboxItem() {
    const item = currentItems[currentIndex];
    if (!item) return;

    const fullSrc = item.getAttribute('data-full-src') || item.querySelector('img')?.src;
    const title = item.getAttribute('data-title') || '';
    const desc = item.getAttribute('data-desc') || '';
    const tag = item.getAttribute('data-tag') || '';
    const alt = item.querySelector('img')?.alt || title;

    lightboxImg.src = fullSrc;
    lightboxImg.alt = alt;
    lightboxCaption.innerHTML = `<h4 class="text-lg font-serif font-bold text-zinc-100">${title}</h4><p class="text-sm text-zinc-300 mt-1">${desc}</p>`;
    if (lightboxTag) lightboxTag.textContent = tag;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} of ${currentItems.length}`;
  }

  function closeLightbox() {
    lightboxModal.classList.add('hidden');
    lightboxModal.classList.remove('flex');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function nextItem() {
    if (currentItems.length === 0) return;
    currentIndex = (currentIndex + 1) % currentItems.length;
    renderLightboxItem();
  }

  function prevItem() {
    if (currentItems.length === 0) return;
    currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
    renderLightboxItem();
  }

  // Attach item click
  galleryGrid.addEventListener('click', (e) => {
    const trigger = e.target.closest('.gallery-trigger');
    if (!trigger) return;
    const item = trigger.closest('.gallery-item');
    updateItemsList();
    const idx = currentItems.indexOf(item);
    if (idx !== -1) {
      openLightbox(idx);
    }
  });

  // Lightbox navigation triggers
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextItem);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevItem);

  // Click backdrop to close
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Keyboard navigation & trap
  document.addEventListener('keydown', (e) => {
    if (lightboxModal.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextItem();
    } else if (e.key === 'ArrowLeft') {
      prevItem();
    } else if (e.key === 'Tab') {
      // Focus trap within modal
      const focusables = lightboxModal.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });

  // Initial update
  updateItemsList();
})();
