 function loadPage(page) {
  // Save the current page to localStorage
  sessionStorage.setItem('lastPage', page);

  fetch(page)
    .then(res => res.text())
    .then(html => {
      document.getElementById('main-content').innerHTML = html;

      // Re-run fullscreen check after new content is added
      checkFullscreen();
    });
}


    // Music toggle
    const music = document.getElementById('bg-music');
    const button = document.getElementById('audio-controls');
    function toggleMusic() {
      if (music.paused) {
        music.play();
        button.textContent = '⏸ Pause Music';
      } else {
        music.pause();
        button.textContent = '▶ Play Music';
      }
    }

    // Initial content
    window.addEventListener('load', () => {
       const lastPage = sessionStorage.getItem('lastPage') || 'overview.html';
  loadPage(lastPage);
    });

    // Optional: expose globally to use in HTML buttons
    window.loadPage = loadPage;

  let wasFullscreen = window.innerHeight === screen.height;

  function checkFullscreen() {
    const isFullscreen = window.innerHeight === screen.height;
    const warning = document.getElementById('fullscreen-warning');

    // Show or hide fullscreen warning
    warning.style.display = isFullscreen ? 'none' : 'block';

    // Enable or disable scroll
    document.body.style.overflow = isFullscreen ? 'hidden' : 'auto';

    // If user just entered fullscreen, scroll to top
    if (isFullscreen && !wasFullscreen) {
      window.scrollTo(0, 0);
    }

    wasFullscreen = isFullscreen;
  }

  window.addEventListener('load', checkFullscreen);
  window.addEventListener('resize', checkFullscreen);