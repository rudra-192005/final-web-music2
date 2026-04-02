// ===== SONIX PLAYER CONTROLS (shared across all pages) =====

let _progress = appState.progress || 0;
let _progressTimer = null;

function togglePlay() {
  appState.isPlaying = !appState.isPlaying;
  const btn = document.getElementById('pbPlay');
  if (btn) btn.textContent = appState.isPlaying ? '⏸' : '▶';
  if (appState.isPlaying) startProgress(); else stopProgress();
  saveState();
}

function startProgress() {
  stopProgress();
  const track = appState.queue[appState.currentTrackIndex];
  if (!track) return;
  _progressTimer = setInterval(() => {
    _progress += (100 / track.durationSec) * 0.1;
    if (_progress >= 100) { _progress = 0; nextTrack(); return; }
    appState.progress = _progress;
    updateProgressUI();
  }, 100);
}

function stopProgress() {
  if (_progressTimer) { clearInterval(_progressTimer); _progressTimer = null; }
}

function updateProgressUI() {
  const fill = document.getElementById('pbFill');
  if (fill) fill.style.width = _progress + '%';
  const track = appState.queue[appState.currentTrackIndex];
  if (!track) return;
  const elapsed = Math.floor((_progress / 100) * track.durationSec);
  const m = Math.floor(elapsed / 60), s = elapsed % 60;
  const cur = document.getElementById('pbCurrent');
  if (cur) cur.textContent = `${m}:${s.toString().padStart(2,'0')}`;
}

function seekBar(event) {
  const bar = document.getElementById('pbBar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  _progress = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
  appState.progress = _progress;
  updateProgressUI();
}

function prevTrack() {
  if (_progress > 10) { _progress = 0; updateProgressUI(); return; }
  appState.currentTrackIndex = (appState.currentTrackIndex - 1 + appState.queue.length) % appState.queue.length;
  _progress = 0;
  refreshPlayerBar();
  if (appState.isPlaying) startProgress();
  saveState();
}

function nextTrack() {
  if (appState.repeatMode === 2) { _progress = 0; updateProgressUI(); if (appState.isPlaying) startProgress(); return; }
  if (appState.isShuffle) appState.currentTrackIndex = Math.floor(Math.random() * appState.queue.length);
  else appState.currentTrackIndex = (appState.currentTrackIndex + 1) % appState.queue.length;
  _progress = 0;
  refreshPlayerBar();
  if (appState.isPlaying) startProgress();
  saveState();
}

function toggleShuffle() {
  appState.isShuffle = !appState.isShuffle;
  const btn = document.getElementById('pbShuffle');
  if (btn) btn.classList.toggle('active', appState.isShuffle);
  saveState();
}

function toggleRepeat() {
  appState.repeatMode = (appState.repeatMode + 1) % 3;
  const btn = document.getElementById('pbRepeat');
  if (btn) { btn.classList.toggle('active', appState.repeatMode > 0); }
  saveState();
}

function setVol(event) {
  const bar = document.getElementById('volBar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  appState.volume = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const fill = document.getElementById('volFill');
  if (fill) fill.style.width = (appState.volume * 100) + '%';
  saveState();
}

function toggleLikeBar() {
  const track = appState.queue[appState.currentTrackIndex];
  if (!track) return;
  track.liked = !track.liked;
  const origTrack = TRACKS.find(t => t.id === track.id);
  if (origTrack) origTrack.liked = track.liked;
  const btn = document.getElementById('pbLike');
  if (btn) { btn.textContent = track.liked ? '♥' : '♡'; btn.classList.toggle('liked', track.liked); }
  saveState();
}

function refreshPlayerBar() {
  const track = appState.queue[appState.currentTrackIndex];
  if (!track) return;
  const title = document.getElementById('pbTitle');
  const artist = document.getElementById('pbArtist');
  const total = document.getElementById('pbTotal');
  const thumb = document.querySelector('.player-thumb');
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist;
  if (total) total.textContent = track.duration;
  if (thumb) {
    thumb.textContent = track.emoji;
    thumb.style.background = `linear-gradient(135deg,${track.color}44,${track.color}22)`;
  }
  updateProgressUI();
}

// Topbar scroll effect
function initTopbarScroll() {
  const ps = document.querySelector('.page-scroll');
  const tb = document.querySelector('.topbar');
  if (!ps || !tb) return;
  ps.addEventListener('scroll', () => {
    tb.classList.toggle('scrolled', ps.scrollTop > 60);
  });
}

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
  _progress = appState.progress || 0;
  updateProgressUI();
  if (appState.isPlaying) startProgress();
  initTopbarScroll();
});
