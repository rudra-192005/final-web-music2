// ===== SONIX PLAYER CONTROLS (shared across all pages) =====

let _progress = appState.progress || 0;
let _progressTimer = null;
let _audio = null;

function getOrCreateAudio(src) {
  if (!_audio) {
    _audio = new Audio();
    _audio.crossOrigin = "anonymous";
    _audio.addEventListener('timeupdate', () => {
      if (_audio.duration) {
        _progress = (_audio.currentTime / _audio.duration) * 100;
        appState.progress = _progress;
        updateProgressUI();
      }
    });
    _audio.addEventListener('ended', () => { _progress = 0; nextTrack(); });
  }
  if (_audio.src !== src) {
    _audio.src = src;
    _audio.load();
  }
  return _audio;
}

function togglePlay() {
  appState.isPlaying = !appState.isPlaying;
  const btn = document.getElementById('pbPlay');
  if (btn) btn.textContent = appState.isPlaying ? '⏸' : '▶';
  const mobBtn = document.getElementById('mobPlay');
  if (mobBtn) mobBtn.textContent = appState.isPlaying ? '⏸' : '▶';
  if (appState.isPlaying) startProgress(); else stopProgress();
  saveState();
}

function startProgress() {
  stopProgress();
  const track = appState.queue[appState.currentTrackIndex];
  if (!track) return;
  if (track.src) {
    const audio = getOrCreateAudio(track.src);
    audio.volume = appState.volume;
    audio.play().catch(() => {});
  } else {
    _progressTimer = setInterval(() => {
      _progress += (100 / track.durationSec) * 0.1;
      if (_progress >= 100) { _progress = 0; nextTrack(); return; }
      appState.progress = _progress;
      updateProgressUI();
    }, 100);
  }
}

function stopProgress() {
  if (_progressTimer) { clearInterval(_progressTimer); _progressTimer = null; }
  if (_audio && !_audio.paused) { _audio.pause(); }
}

function updateProgressUI() {
  const fill = document.getElementById('pbFill');
  if (fill) fill.style.width = _progress + '%';
  const mobFill = document.getElementById('mobFill');
  if (mobFill) mobFill.style.width = _progress + '%';
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
  if (_audio && _audio.duration) {
    _audio.currentTime = (_progress / 100) * _audio.duration;
  }
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
  if (_audio) _audio.volume = appState.volume;
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
  refreshMobilePlayer();
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

// ===== MOBILE PLAYER SYNC =====
function refreshMobilePlayer() {
  const track = appState.queue[appState.currentTrackIndex];
  if (!track) return;
  const el = (id) => document.getElementById(id);
  if (el('mobTitle')) el('mobTitle').textContent = track.title;
  if (el('mobArtist')) el('mobArtist').textContent = track.artist;
  if (el('mobThumb')) {
    el('mobThumb').textContent = track.emoji;
    el('mobThumb').style.background = `linear-gradient(135deg,${track.color}44,${track.color}22)`;
  }
  if (el('mobPlay')) el('mobPlay').textContent = appState.isPlaying ? '⏸' : '▶';
  if (el('mobLike')) {
    el('mobLike').textContent = track.liked ? '♥' : '♡';
    el('mobLike').style.color = track.liked ? 'var(--accent)' : '';
  }
}

// Mobile sync is now handled inside the original functions above (no duplicate declarations needed)

document.addEventListener('DOMContentLoaded', () => {
  refreshMobilePlayer();
});
