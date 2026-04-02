// ===== SONIX SHARED LAYOUT COMPONENTS =====
// Called by each page to inject sidebar + player bar

function renderSidebar(activePage) {
  const pages = [
    { id: 'home',    href: 'index.html',           icon: '⌂', label: 'Home' },
    { id: 'search',  href: '#',                    icon: '⊕', label: 'Search' },
  ];
  const navHtml = pages.map(p => `
    <a href="${p.href}" class="nav-item ${activePage === p.id ? 'active' : ''}">
      <i class="nav-icon">${p.icon}</i>${p.label}
    </a>
  `).join('');

  const playlists = [
    { id:'pl-liked', name:'Liked Songs', meta:'Playlist', emoji:'💚', color:'#1d4b3e', circle: false },
    ...PLAYLISTS.map(p => ({ id:'pl-'+p.id, name:p.name, meta:'Playlist · You', emoji: TRACKS.find(t=>t.id===p.trackIds[0])?.emoji||'🎵', color:p.color, circle:false })),
  ];

  const libHtml = playlists.map(pl => `
    <div class="lib-item" onclick="playPlaylistFromLib(${pl.id ? `'${pl.id}'` : 'null'})" >
      <div class="lib-cover" style="background: linear-gradient(135deg, ${pl.color}55, ${pl.color}22);">${pl.emoji}</div>
      <div class="lib-info">
        <div class="lib-name">${pl.name}</div>
        <div class="lib-meta">${pl.meta}</div>
      </div>
    </div>
  `).join('');

  return `
  <aside class="sidebar">
    <div class="sidebar-top">
      <a class="logo-mark" href="index.html">
        <div class="logo-icon">♪</div>
        <span class="logo-text">SONIX</span>
      </a>
      <nav class="nav-group">
        <a href="index.html" class="nav-item ${activePage==='home'?'active':''}"><i class="nav-icon">⌂</i> Home</a>
        <a href="recommendations.html" class="nav-item ${activePage==='discover'?'active':''}"><i class="nav-icon">⊕</i> Discover</a>
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
  <div class="player-bar" id="playerBar">
    <!-- Left: track info -->
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

    <!-- Center: controls -->
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

    <!-- Right: volume etc -->
    <div class="player-right-side">
      <button class="ctrl" onclick="window.location.href='queue.html'" title="Queue">≡</button>
      <button class="vol-icon" title="Mute">🔈</button>
      <div class="vol-bar" id="volBar" onclick="setVol(event)">
        <div class="vol-fill" id="volFill" style="width:${(appState.volume||0.7)*100}%"></div>
      </div>
    </div>
  </div>`;
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
