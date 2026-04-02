// ===== SONIX SHARED LAYOUT COMPONENTS =====
// Called by each page to inject sidebar + player bar

function renderSidebar(activePage) {
  return `
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-top">
      <a class="logo-mark" href="index.html">
        <div class="logo-icon">♪</div>
        <span class="logo-text">SONIX</span>
      </a>
      <nav class="nav-group">
        <a href="index.html" class="nav-item ${activePage==='home'?'active':''}"><i class="nav-icon">⌂</i> Home</a>
        <a href="recommendations.html" class="nav-item ${activePage==='discover'?'active':''}"><i class="nav-icon">⊕</i> Discover</a>
        <a href="queue.html" class="nav-item ${activePage==='queue'?'active':''}"><i class="nav-icon">≡</i> Queue</a>
        <a href="playlist.html" class="nav-item ${activePage==='playlist'?'active':''}"><i class="nav-icon">◫</i> Playlists</a>
        <a href="userdata.html" class="nav-item ${activePage==='stats'?'active':''}"><i class="nav-icon">◑</i> Stats</a>
      </nav>
    </div>
    <div class="sidebar-library">
      <div class="library-header">
        <button class="library-title">
          <i class="nav-icon" style="font-size:16px;">◫</i> Your Library
        </button>
        <button class="lib-add-btn" onclick="openCreateModal()" title="Create playlist">+</button>
      </div>
      <div class="library-filter-row">
        <button class="lib-pill active">Playlists</button>
        <button class="lib-pill">Artists</button>
      </div>
      <div class="library-list">
        <div class="lib-item ${activePage==='liked'?'playing-lib':''}">
          <div class="lib-cover" style="background:linear-gradient(135deg,#4b0082,#1d4b3e); font-size:24px; color:#1ed9b4;">♥</div>
          <div class="lib-info">
            <div class="lib-name">Liked Songs</div>
            <div class="lib-meta">Playlist · ${TRACKS.filter(t=>t.liked).length || 3} songs</div>
          </div>
        </div>
        ${PLAYLISTS.map(p => {
          const firstTrack = TRACKS.find(t => t.id === p.trackIds[0]);
          return `
          <div class="lib-item ${activePage==='pl-'+p.id?'playing-lib':''}" onclick="window.location.href='playlist.html?id=${p.id}'">
            <div class="lib-cover" style="background: linear-gradient(135deg, ${p.color}44, ${p.color}22);">${firstTrack?.emoji||'🎵'}</div>
            <div class="lib-info">
              <div class="lib-name">${p.name}</div>
              <div class="lib-meta">Playlist · You</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </aside>`;
}

function renderPlayerBar() {
  const track = appState.queue[appState.currentTrackIndex] || TRACKS[0];
  return `
  <!-- DESKTOP PLAYER BAR -->
  <div class="player-bar" id="playerBar">
    <div class="player-track-side">
      <div class="player-thumb" style="background: linear-gradient(135deg,${track.color}44,${track.color}22);" onclick="window.location.href='index.html'" title="Now Playing">
        ${track.emoji}
      </div>
      <div class="player-track-info">
        <div class="player-t-name" id="pbTitle">${track.title}</div>
        <div class="player-t-artist" id="pbArtist">${track.artist}</div>
      </div>
      <button class="player-like ${track.liked?'liked':''}" id="pbLike" onclick="toggleLikeBar()" title="Like">
        ${track.liked ? '♥' : '♡'}
      </button>
    </div>
    <div class="player-center">
      <div class="player-ctrl-row">
        <button class="ctrl ${appState.isShuffle?'active':''}" id="pbShuffle" onclick="toggleShuffle()" title="Shuffle">⇄</button>
        <button class="ctrl" onclick="prevTrack()" title="Previous">⏮</button>
        <button class="ctrl-play" id="pbPlay" onclick="togglePlay()">${appState.isPlaying?'⏸':'▶'}</button>
        <button class="ctrl" onclick="nextTrack()" title="Next">⏭</button>
        <button class="ctrl ${appState.repeatMode?'active':''}" id="pbRepeat" onclick="toggleRepeat()" title="Repeat">↺</button>
      </div>
      <div class="progress-row">
        <span class="p-time" id="pbCurrent">0:00</span>
        <div class="p-bar" id="pbBar" onclick="seekBar(event)">
          <div class="p-fill" id="pbFill" style="width:${appState.progress||0}%"></div>
          <div class="p-dot"></div>
        </div>
        <span class="p-time" id="pbTotal">${track.duration}</span>
      </div>
    </div>
    <div class="player-right-side">
      <button class="ctrl" onclick="window.location.href='queue.html'" title="Queue">≡</button>
      <button class="vol-icon" title="Mute">🔈</button>
      <div class="vol-bar" id="volBar" onclick="setVol(event)">
        <div class="vol-fill" id="volFill" style="width:${(appState.volume||0.7)*100}%"></div>
      </div>
    </div>
  </div>

  <!-- MOBILE PLAYER BAR -->
  <div class="mobile-player" id="mobilePlayer">
    <div class="mobile-progress" id="mobProgressBar" onclick="seekBarMobile(event)">
      <div class="mobile-progress-fill" id="mobFill" style="width:${appState.progress||0}%"></div>
    </div>
    <div class="mobile-player-main">
      <div class="mobile-thumb" id="mobThumb" style="background: linear-gradient(135deg,${track.color}44,${track.color}22);">${track.emoji}</div>
      <div class="mobile-track-info">
        <div class="mobile-track-name" id="mobTitle">${track.title}</div>
        <div class="mobile-track-artist" id="mobArtist">${track.artist}</div>
      </div>
      <div class="mobile-ctrl-row">
        <button class="mobile-ctrl" onclick="prevTrack()" title="Previous">⏮</button>
        <button class="mobile-ctrl-play" id="mobPlay" onclick="togglePlay()">${appState.isPlaying?'⏸':'▶'}</button>
        <button class="mobile-ctrl" onclick="nextTrack()" title="Next">⏭</button>
        <button class="mobile-ctrl ${track.liked?'liked':''}" id="mobLike" onclick="toggleLikeBar()" style="${track.liked?'color:var(--accent)':''}">${track.liked?'♥':'♡'}</button>
      </div>
    </div>
  </div>

  <!-- MOBILE BOTTOM NAV -->
  <nav class="mobile-bottom-nav" id="mobileBottomNav">
    <a class="mob-nav-item ${location.pathname.includes('index')||location.pathname.endsWith('/')?'active':''}" href="index.html">
      <span class="mob-nav-icon">⌂</span>Home
    </a>
    <a class="mob-nav-item ${location.pathname.includes('recommendations')?'active':''}" href="recommendations.html">
      <span class="mob-nav-icon">⊕</span>Discover
    </a>
    <a class="mob-nav-item ${location.pathname.includes('playlist')?'active':''}" href="playlist.html">
      <span class="mob-nav-icon">◫</span>Library
    </a>
    <a class="mob-nav-item ${location.pathname.includes('userdata')?'active':''}" href="userdata.html">
      <span class="mob-nav-icon">◑</span>Stats
    </a>
  </nav>`;
}

// ===== SIDEBAR TOGGLE =====
function openSidebar() {
  document.getElementById('sidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (sb?.classList.contains('open')) closeSidebar(); else openSidebar();
}

// ===== MOBILE SEEK =====
function seekBarMobile(event) {
  const bar = document.getElementById('mobProgressBar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const pct = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
  if (typeof _progress !== 'undefined') {
    window._progress = pct;
  }
  appState.progress = pct;
  const fill = document.getElementById('mobFill');
  if (fill) fill.style.width = pct + '%';
}

// ===== MISSING: renderBottomNav (called by all pages) =====
function renderBottomNav(activePage) {
  return `
  <nav class="mobile-bottom-nav" id="mobileBottomNavExtra">
    <a class="mob-nav-item ${activePage==='home'?'active':''}" href="index.html">
      <span class="mob-nav-icon">⌂</span>Home
    </a>
    <a class="mob-nav-item ${activePage==='discover'?'active':''}" href="recommendations.html">
      <span class="mob-nav-icon">⊕</span>Discover
    </a>
    <a class="mob-nav-item ${activePage==='playlist'?'active':''}" href="playlist.html">
      <span class="mob-nav-icon">◫</span>Library
    </a>
    <a class="mob-nav-item ${activePage==='stats'||activePage==='user'?'active':''}" href="userdata.html">
      <span class="mob-nav-icon">◑</span>Stats
    </a>
  </nav>`;
}

// ===== MISSING: closeMobileSidebar (called by sidebar-overlay onclick in all pages) =====
function closeMobileSidebar() {
  closeSidebar();
}

function playPlaylistFromLib(id) {
  if (!id || id === 'null') return;
  const numId = parseInt(id.replace('pl-',''));
  const pl = PLAYLISTS.find(p => p.id === numId);
  if (!pl) return;
  const tracks = pl.trackIds.map(i => TRACKS.find(t=>t.id===i)).filter(Boolean);
  appState.queue = tracks;
  appState.currentTrackIndex = 0;
  appState.isPlaying = true;
  saveState();
  window.location.href = 'index.html';
}
