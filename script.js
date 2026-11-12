// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

// Date
const dateEl = document.getElementById('current-date');
if (dateEl) {
  dateEl.textContent = new Date().toLocaleDateString('te-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== AUTO YOUTUBE VIDEOS from @advocatei =====
// Channel: hafeez law associates | https://www.youtube.com/@advocatei
// Channel ID: UCxTWPnyKde7PWQaMlx74f0w
const YT_VIDEOS = [
  { id: 'A0w7uH2Zb1g', title: 'INDIA ADVOCATE LEGAL NEWS – Income Tax, GST, Trademark' },
  { id: '8Emlz_9xk3M', title: 'February 23, 2024 – Legal Update' },
  { id: 'Knc2S8KPrGY', title: 'Land Title Act' },
  { id: 'QHKVNT3FzMU', title: 'ALL INDIA LEGAL NEWS TODAY' },
  { id: 'Uj45dvMVLz8', title: 'INDIA ADVOCATE NELLORE NEWS' }
];

function loadYouTubeVideos() {
  const grid = document.getElementById('yt-video-grid');
  if (!grid) return;

  grid.innerHTML = YT_VIDEOS.map(v => `
    <div class="yt-card">
      <iframe
        src="https://www.youtube.com/embed/${v.id}"
        title="${v.title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"></iframe>
      <div class="yt-card-info">
        <h4>${v.title}</h4>
        <p>hafeez law associates · @advocatei</p>
      </div>
    </div>
  `).join('');
}

loadYouTubeVideos();

// To add new videos later: just add { id: 'VIDEO_ID', title: 'Title' } to YT_VIDEOS above.
// Video ID is the part after v= in YouTube URL.
// Example: https://www.youtube.com/watch?v=A0w7uH2Zb1g → id is A0w7uH2Zb1g