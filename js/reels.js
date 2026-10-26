/* ============================================
   REELS.JS — reel playback (Home + Videos pages)
   Reels play silently while on screen; tap one
   to turn its sound on (and the others off).
   ============================================ */

(function () {
  const reels = document.querySelectorAll('.reel-card video');
  if (!reels.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  reels.forEach(video => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.closest('.reel-card').classList.add('has-video');
  });

  // Autoplay only while at least half the reel is visible (saves battery & data)
  if (!reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) target.play().catch(() => {});
        else target.pause();
      });
    }, { threshold: 0.5 });
    reels.forEach(video => io.observe(video));
  }

  // Tap a reel: sound on for that one (and off for the rest); tap again to mute
  reels.forEach(video => {
    video.addEventListener('click', () => {
      const turnOn = video.muted;
      reels.forEach(other => {
        other.muted = true;
        other.closest('.reel-card').classList.remove('is-unmuted');
      });
      if (turnOn) {
        video.muted = false;
        video.closest('.reel-card').classList.add('is-unmuted');
        video.play().catch(() => {});
      }
    });
  });
})();
