/* ===========================================================
   Janata Ki Taqhat News – script.js
   Optimized YouTube integration for @advocatei
   =========================================================== */

// ---------- Config ----------
const YT_CONFIG = {
  channelHandle: '@advocatei',
  channelId: 'UCxTWPnyKde7PWQaMlx74f0w',
  uploadsPlaylistId: 'UUxTWPnyKde7PWQaMlx74f0w',
  channelUrl: 'https://www.youtube.com/@advocatei',
  // Optional: paste a YouTube Data API v3 key to auto-fetch latest videos.
  // Leave empty to use the fallback list below (safe for GitHub Pages).
  apiKey: '',
  maxResults: 6
};

// Fallback videos (used when no API key). Update when you upload new videos.
const YT_FALLBACK = [
  { id: 'A0w7uH2Zb1g', title: 'INDIA ADVOCATE LEGAL NEWS – Income Tax, GST, Trademark' },
  { id: '8Emlz_9xk3M', title: 'February 23, 2024 – Legal Update' },
  { id: 'Knc2S8KPrGY', title: 'Land Title Act' },
  { id: 'QHKVNT3FzMU', title: 'ALL INDIA LEGAL NEWS TODAY' },
  { id: 'Uj45dvMVLz8', title: 'INDIA ADVOCATE NELLORE NEWS' }
];

// ---------- Mobile menu ----------
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

// ---------- Date ----------
const dateEl = document.getElementById('current-date');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('te-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ---------- Smooth scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ---------- YouTube helpers ----------
function ytThumb(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function createVideoCard(video) {
  const card = document.createElement('div');
  card.className = 'yt-card';
  card.dataset.videoId = video.id;

  card.innerHTML = `
    <button type="button" class="yt-thumb-btn" aria-label="Play ${escapeHtml(video.title)}">
      <img src="${ytThumb(video.id)}" alt="" loading="lazy" width="480" height="360">
      <span class="yt-play-icon">▶</span>
    </button>
    <div class="yt-card-info">
      <h4>${escapeHtml(video.title)}</h4>
      <p>hafeez law associates · ${YT_CONFIG.channelHandle}</p>
    </div>
  `;

  // Click-to-play: replace thumbnail with iframe only when user clicks
  const btn = card.querySelector('.yt-thumb-btn');
  btn.addEventListener('click', () => {
    const wrap = document.createElement('div');
    wrap.className = 'yt-embed-wrap';
    wrap.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0"
        title="${escapeHtml(video.title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"></iframe>
    `;
    btn.replaceWith(wrap);
  });

  return card;
}

function renderVideos(videos) {
  const grid = document.getElementById('yt-video-grid');
  if (!grid) return;
  grid.innerHTML = '';
  videos.slice(0, YT_CONFIG.maxResults).forEach(v => {
    grid.appendChild(createVideoCard(v));
  });
}

// Fetch latest via YouTube Data API v3 (only if apiKey is set)
async function fetchFromApi() {
  if (!YT_CONFIG.apiKey) return null;
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet&maxResults=${YT_CONFIG.maxResults}` +
    `&playlistId=${YT_CONFIG.uploadsPlaylistId}` +
    `&key=${YT_CONFIG.apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('API ' + res.status);
    const data = await res.json();
    return (data.items || []).map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title
    }));
  } catch (err) {
    console.warn('YouTube API failed, using fallback list.', err);
    return null;
  }
}

async function loadYouTubeVideos() {
  const grid = document.getElementById('yt-video-grid');
  if (!grid) return;

  grid.innerHTML = '<p class="yt-loading">Loading videos…</p>';

  let videos = await fetchFromApi();
  if (!videos || !videos.length) {
    videos = YT_FALLBACK;
  }
  renderVideos(videos);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadYouTubeVideos);
} else {
  loadYouTubeVideos();
}

/*
  HOW TO USE FULL AUTO-FETCH (optional):
  1. Go to https://console.cloud.google.com/
  2. Create a project → Enable "YouTube Data API v3"
  3. Create an API key (restrict it to your GitHub Pages domain)
  4. Paste the key into YT_CONFIG.apiKey above
  5. New uploads will appear automatically

  WITHOUT API KEY (current default):
  - Playlist embed always shows latest uploads
  - Grid uses YT_FALLBACK list
  - Add new videos: { id: 'VIDEO_ID', title: 'Title' }
*/