// gallery.js — JSON-driven premium gallery engine
// Handles: videos + images, search, sort, filters, lightbox, skeletons

document.addEventListener('DOMContentLoaded', async () => {

  /* ============ VIDEO GALLERY ============ */
  const videoGrid = document.getElementById('video-grid');
  if (videoGrid) {
    try {
      const res = await fetch('videos.json');
      const data = await res.json();
      const videos = data.videos;

      const state = { filter: 'all', search: '', sort: 'date-desc' };

      const searchInput = document.getElementById('video-search');
      const sortSelect  = document.getElementById('video-sort');
      const emptyMsg    = document.getElementById('video-empty');

      function applyState() {
        let list = videos.slice();

        if (state.filter !== 'all') {
          list = list.filter(v => v.category.includes(state.filter));
        }
        if (state.search) {
          const q = state.search.toLowerCase();
          list = list.filter(v =>
            v.title.toLowerCase().includes(q) ||
            v.description.toLowerCase().includes(q) ||
            (v.sanskrit && v.sanskrit.includes(q))
          );
        }

        list.sort((a, b) => {
          switch (state.sort) {
            case 'date-asc':     return new Date(a.date) - new Date(b.date);
            case 'title-asc':    return a.title.localeCompare(b.title);
            case 'duration-asc': return a.duration - b.duration;
            case 'duration-desc':return b.duration - a.duration;
            default:             return new Date(b.date) - new Date(a.date);
          }
        });

        renderVideos(list);
        emptyMsg.hidden = list.length > 0;
      }

      function renderVideos(list) {
        videoGrid.innerHTML = list.map(v => `
          <figure class="video-card" data-id="${v.id}">
            <video preload="metadata" poster="${v.poster}" controls playsinline>
              <source src="${v.video}" type="video/mp4">
              Your browser does not support video.
            </video>
            <figcaption>
              <h3>${v.title} <span class="sanskrit">${v.sanskrit || ''}</span></h3>
              <p>${v.description}</p>
              <p class="meta">${v.duration_label} · ${v.level}${v.teacher ? ' · ' + v.teacher : ''}</p>
            </figcaption>
          </figure>
        `).join('');
      }

      // Filters
      document.querySelectorAll('.gallery-filters[data-target="video-grid"] button')
        .forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.gallery-filters[data-target="video-grid"] button')
              .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filter = btn.dataset.filter;
            applyState();
          });
        });

      // Search (debounced)
      let t;
      searchInput.addEventListener('input', e => {
        clearTimeout(t);
        t = setTimeout(() => {
          state.search = e.target.value.trim();
          applyState();
        }, 200);
      });

      // Sort
      sortSelect.addEventListener('change', e => {
        state.sort = e.target.value;
        applyState();
      });

      applyState();

    } catch (err) {
      console.error('Failed to load videos.json', err);
      videoGrid.innerHTML = '<p class="error">Could not load videos. Please try again later.</p>';
    }
  }

  /* ============ IMAGE GALLERY ============ */
  const imageGrid = document.getElementById('image-grid');
  if (imageGrid) {
    try {
      const res = await fetch('images.json');
      const data = await res.json();
      const images = data.images;

      const state = { filter: 'all', search: '' };

      const searchInput = document.getElementById('image-search');
      const emptyMsg    = document.getElementById('image-empty');

      function applyState() {
        let list = images.slice();

        if (state.filter !== 'all') {
          list = list.filter(i => i.category.includes(state.filter));
        }
        if (state.search) {
          const q = state.search.toLowerCase();
          list = list.filter(i =>
            i.title.toLowerCase().includes(q) ||
            i.alt.toLowerCase().includes(q)
          );
        }

        renderImages(list);
        emptyMsg.hidden = list.length > 0;
      }

      function renderImages(list) {
        imageGrid.innerHTML = list.map(img => `
          <figure class="image-card" data-id="${img.id}">
            <img src="${img.src}" alt="${img.alt}" loading="lazy" width="800" height="1000">
            <figcaption>
              <span class="title">${img.title}</span>
              ${img.sanskrit ? `<span class="sanskrit">${img.sanskrit}</span>` : ''}
            </figcaption>
          </figure>
        `).join('');
      }

      document.querySelectorAll('.gallery-filters[data-target="image-grid"] button')
        .forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.gallery-filters[data-target="image-grid"] button')
              .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filter = btn.dataset.filter;
            applyState();
          });
        });

      let t;
      searchInput.addEventListener('input', e => {
        clearTimeout(t);
        t = setTimeout(() => {
          state.search = e.target.value.trim();
          applyState();
        }, 200);
      });

      applyState();
      setupLightbox();

    } catch (err) {
      console.error('Failed to load images.json', err);
      imageGrid.innerHTML = '<p class="error">Could not load images. Please try again later.</p>';
    }
  }

  /* ============ LIGHTBOX ============ */
  function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-caption');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev  = lightbox.querySelector('.lightbox-prev');
    const btnNext  = lightbox.querySelector('.lightbox-next');
    let current = 0;

    function visible() {
      return Array.from(document.querySelectorAll('.image-card'));
    }

    function open(card) {
      const cards = visible();
      current = cards.indexOf(card);
      show(cards[current]);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function show(card) {
      const img = card.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = card.querySelector('figcaption')?.textContent || '';
    }

    function close() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function nav(dir) {
      const cards = visible();
      if (!cards.length) return;
      current = (current + dir + cards.length) % cards.length;
      show(cards[current]);
    }

    // Delegate clicks so new cards work after re-render
    imageGrid.addEventListener('click', e => {
      const card = e.target.closest('.image-card');
      if (card) open(card);
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => nav(-1));
    btnNext.addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') nav(-1);
      if (e.key === 'ArrowRight') nav(1);
    });
  }

});
