// ─── SAHNEM — Shared UI Components ───────────────────────────────────────────

const SAHNEM = {
  musician: { name: 'Emre Aydın', email: 'emre@sahnem.com', initial: 'E', role: 'Gitarist & Solist' },
  employer: { name: 'Hilton İstanbul', email: 'events@hilton.com', initial: 'H', role: 'Otel & Etkinlik' },
};

function logoMark(size = 26) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="86" y="240" width="38" height="76" rx="9" fill="currentColor"/>
    <rect x="148" y="178" width="38" height="200" rx="9" fill="currentColor"/>
    <rect x="210" y="123" width="38" height="310" rx="9" fill="currentColor"/>
    <rect x="272" y="178" width="38" height="200" rx="9" fill="currentColor"/>
    <rect x="334" y="221" width="38" height="114" rx="9" fill="currentColor"/>
  </svg>`;
}

function icon(name, size = 18) {
  const icons = {
    bell: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    message: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    search: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    heart: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    user: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    settings: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    menu: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>`,
    check: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`,
    location: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    music: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    briefcase: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`,
    grid: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    list: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>`,
    star: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    play: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
    logout: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  };
  return `<span class="icon">${icons[name] || ''}</span>`;
}

function renderStars(rating, size = 14) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '<div class="stars">';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += `<span class="star" style="font-size:${size}px">★</span>`;
    else if (i === full && half) html += `<span class="star" style="font-size:${size}px;opacity:0.6">★</span>`;
    else html += `<span class="star empty" style="font-size:${size}px">★</span>`;
  }
  return html + '</div>';
}

function renderNavbar(active = '', loggedIn = false, userType = 'musician') {
  const user = SAHNEM[userType] || SAHNEM.musician;
  const dash = userType === 'musician' ? 'dashboard-musician.html' : 'dashboard-employer.html';
  const profile = userType === 'musician' ? 'profile-musician.html' : 'profile-employer.html';
  const edit = userType === 'musician' ? 'profile-edit-musician.html' : 'profile-edit-employer.html';

  const publicLinks = `
    <a href="explore.html" class="${active === 'explore' ? 'active' : ''}">Keşfet</a>
    <a href="jobs.html" class="${active === 'jobs' ? 'active' : ''}">İlanlar</a>
    <a href="index.html#nasil-calisir">Nasıl Çalışır?</a>
  `;

  const authLinks = `
    <a href="explore.html" class="${active === 'explore' ? 'active' : ''}">Keşfet</a>
    <a href="jobs.html" class="${active === 'jobs' ? 'active' : ''}">İlanlar</a>
    <a href="offers.html" class="${active === 'offers' ? 'active' : ''}">Teklifler</a>
    <a href="messages.html" class="${active === 'messages' ? 'active' : ''}">Mesajlar</a>
    ${userType === 'employer' ? `<a href="post-offer.html" class="${active === 'post-offer' ? 'active' : ''}">İlan Yayınla</a>` : ''}
  `;

  const guestActions = `
    <a href="login.html" class="btn btn-ghost btn-sm">Giriş Yap</a>
    <a href="register.html" class="btn btn-primary btn-sm">Üye Ol</a>
  `;

  const userActions = `
    <a href="favorites.html" class="nav-icon-btn" title="Favoriler">${icon('heart', 16)}</a>
    <a href="notifications.html" class="nav-icon-btn" title="Bildirimler">
      ${icon('bell', 16)}<span class="nav-badge">3</span>
    </a>
    <div class="nav-user-wrap">
      <button type="button" class="navbar-avatar" id="nav-avatar-btn" aria-label="Hesap menüsü">${user.initial}</button>
      <div class="nav-dropdown" id="nav-dropdown">
        <div class="nav-dropdown-header">
          <strong>${user.name}</strong>
          <span>${user.role}</span>
        </div>
        <a href="${dash}">${icon('grid', 16)} Panel</a>
        <a href="${profile}">${icon('user', 16)} Profilim</a>
        <a href="${edit}">${icon('settings', 16)} Profili Düzenle</a>
        <a href="offers.html">${icon('briefcase', 16)} Teklifler</a>
        <a href="favorites.html">${icon('heart', 16)} Favoriler</a>
        <a href="settings.html">${icon('settings', 16)} Ayarlar</a>
        <button type="button" class="danger" onclick="location.href='login.html'">${icon('logout', 16)} Çıkış Yap</button>
      </div>
    </div>
  `;

  return `
  <nav class="navbar">
    <div class="navbar-inner">
      <a href="${loggedIn ? dash : 'index.html'}" class="navbar-logo">${logoMark(26)}SAHNEM<span style="color:var(--text-dim);font-weight:400;">.</span></a>
      <div class="navbar-nav">${loggedIn ? authLinks : publicLinks}</div>
      <div class="navbar-actions">
        ${loggedIn ? userActions : guestActions}
        <button type="button" class="nav-toggle" id="nav-toggle" aria-label="Menü">${icon('menu', 18)}</button>
      </div>
    </div>
  </nav>
  <div class="mobile-nav" id="mobile-nav">
    ${loggedIn ? authLinks : publicLinks}
    ${loggedIn ? `<a href="${dash}">Panel</a><a href="settings.html">Ayarlar</a>` : `<a href="login.html">Giriş Yap</a><a href="register.html">Üye Ol</a>`}
  </div>`;
}

function renderFooter() {
  return `
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <div class="footer-logo">${logoMark(28)}<span style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;color:var(--gold);">SAHNEM.</span></div>
        <p class="footer-desc">Müzik ve organizasyon sektörünün profesyonellerini buluşturan dijital platform.</p>
        <div class="social-links mt-16">
          <a href="#" class="social-link">in</a>
          <a href="#" class="social-link">X</a>
          <a href="#" class="social-link">ig</a>
          <a href="#" class="social-link">yt</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Platform</h4>
        <a href="explore.html">Müzisyenler</a>
        <a href="explore.html?cat=dj">DJ'ler</a>
        <a href="jobs.html">İş İlanları</a>
        <a href="explore.html?cat=grup">Gruplar</a>
      </div>
      <div class="footer-col">
        <h4>Şirket</h4>
        <a href="about.html">Hakkımızda</a>
        <a href="about.html#iletisim">İletişim</a>
        <a href="about.html#kvkk">KVKK</a>
      </div>
      <div class="footer-col">
        <h4>Destek</h4>
        <a href="help.html">Yardım Merkezi</a>
        <a href="help.html#kosullar">Kullanım Koşulları</a>
        <a href="help.html#gizlilik">Gizlilik Politikası</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 Sahnem. Tüm hakları saklıdır.</span>
      <span>Müzik Profesyonelleri Ağı</span>
    </div>
  </footer>`;
}

function renderAppSidebar(active, userType = 'musician') {
  const dash = userType === 'musician' ? 'dashboard-musician.html' : 'dashboard-employer.html';
  const edit = userType === 'musician' ? 'profile-edit-musician.html' : 'profile-edit-employer.html';
  const profile = userType === 'musician' ? 'profile-musician.html' : 'profile-employer.html';

  const musicianLinks = `
    <div class="sidebar-section">Genel</div>
    <a href="${dash}" class="${active === 'dashboard' ? 'active' : ''}">${icon('grid', 16)} Panel</a>
    <a href="${profile}" class="${active === 'profile' ? 'active' : ''}">${icon('user', 16)} Profilim</a>
    <a href="${edit}" class="${active === 'edit' ? 'active' : ''}">${icon('settings', 16)} Profili Düzenle</a>
    <div class="sidebar-section">İş & İletişim</div>
    <a href="offers.html" class="${active === 'offers' ? 'active' : ''}">${icon('briefcase', 16)} Teklifler</a>
    <a href="jobs.html" class="${active === 'jobs' ? 'active' : ''}">${icon('search', 16)} İlanlar</a>
    <a href="messages.html" class="${active === 'messages' ? 'active' : ''}">${icon('message', 16)} Mesajlar</a>
    <a href="favorites.html" class="${active === 'favorites' ? 'active' : ''}">${icon('heart', 16)} Favoriler</a>
    <div class="sidebar-section">Hesap</div>
    <a href="notifications.html" class="${active === 'notif' ? 'active' : ''}">${icon('bell', 16)} Bildirimler</a>
    <a href="settings.html" class="${active === 'settings' ? 'active' : ''}">${icon('settings', 16)} Ayarlar</a>
  `;

  const employerLinks = `
    <div class="sidebar-section">Genel</div>
    <a href="${dash}" class="${active === 'dashboard' ? 'active' : ''}">${icon('grid', 16)} Panel</a>
    <a href="${profile}" class="${active === 'profile' ? 'active' : ''}">${icon('user', 16)} Kurum Profili</a>
    <a href="${edit}" class="${active === 'edit' ? 'active' : ''}">${icon('settings', 16)} Profili Düzenle</a>
    <div class="sidebar-section">İş & İletişim</div>
    <a href="post-offer.html" class="${active === 'post-offer' ? 'active' : ''}">${icon('briefcase', 16)} İlan Yayınla</a>
    <a href="offers.html" class="${active === 'offers' ? 'active' : ''}">${icon('briefcase', 16)} Tekliflerim</a>
    <a href="explore.html" class="${active === 'explore' ? 'active' : ''}">${icon('search', 16)} Müzisyen Ara</a>
    <a href="messages.html" class="${active === 'messages' ? 'active' : ''}">${icon('message', 16)} Mesajlar</a>
    <a href="favorites.html" class="${active === 'favorites' ? 'active' : ''}">${icon('heart', 16)} Favoriler</a>
    <div class="sidebar-section">Hesap</div>
    <a href="notifications.html" class="${active === 'notif' ? 'active' : ''}">${icon('bell', 16)} Bildirimler</a>
    <a href="settings.html" class="${active === 'settings' ? 'active' : ''}">${icon('settings', 16)} Ayarlar</a>
  `;

  return `<aside class="app-sidebar">${userType === 'employer' ? employerLinks : musicianLinks}</aside>`;
}

function renderMusicianCard(m) {
  const href = m.slug ? `profile-musician.html?id=${m.slug}` : 'profile-musician.html';
  return `
  <a href="${href}" class="musician-card">
    <div class="musician-card-header">
      <div class="avatar avatar-lg avatar-gold" style="background:linear-gradient(135deg,${m.color || '#B14EFF66'},${m.color2 || '#8B1FE066'})">${m.initials}</div>
      <div style="flex:1;min-width:0;">
        <div class="flex items-center gap-8 mb-2">
          <span style="font-family:var(--font-display);font-weight:700;font-size:1rem;">${m.name}</span>
          ${m.verified ? `<span class="badge badge-gold" style="padding:2px 6px;">${icon('check', 12)}</span>` : ''}
        </div>
        <div class="body-sm">${m.title}</div>
        <div class="flex items-center gap-8 mt-4">${renderStars(m.rating, 12)}<span class="body-sm">${m.rating} (${m.reviews})</span></div>
      </div>
      <span class="badge ${m.available ? 'badge-green' : 'badge-muted'}">${m.available ? 'Müsait' : 'Meşgul'}</span>
    </div>
    <div class="musician-card-body"><div class="tags">${m.genres.map(g => `<span class="tag">${g}</span>`).join('')}</div></div>
    <div class="musician-card-footer">
      <span class="body-sm flex items-center gap-4">${icon('location', 14)} ${m.city} · ${m.experience}</span>
      <span class="gold" style="font-weight:700;font-family:var(--font-display);">${m.price}</span>
    </div>
  </a>`;
}

const MUSICIANS = [
  { name: 'Emre Aydın', initials: 'EA', title: 'Gitarist & Solist', rating: 4.9, reviews: 127, verified: true, available: true, genres: ['Pop', 'Rock', 'Akustik'], city: 'İstanbul', experience: '10+ yıl', price: '₺2.500', color: '#B14EFF66', color2: '#8B1FE066', slug: 'emre-aydin' },
  { name: 'Zeynep Kaya', initials: 'ZK', title: 'DJ', rating: 5.0, reviews: 89, verified: true, available: true, genres: ['Electronic', 'House'], city: 'İzmir', experience: '7 yıl', price: '₺3.800', color: '#7B5CFA66', color2: '#4A36C866', slug: 'zeynep-kaya' },
  { name: 'Musa Çelik', initials: 'MC', title: 'Perküsyoncu', rating: 4.7, reviews: 54, verified: false, available: true, genres: ['Latin', 'Perküsyon'], city: 'Ankara', experience: '6 yıl', price: '₺1.800', color: '#4CAF7D66', color2: '#2E7D5266', slug: 'musa-celik' },
  { name: 'Selin Demir', initials: 'SD', title: 'Kemancı', rating: 4.8, reviews: 71, verified: false, available: false, genres: ['Klasik', 'Jazz'], city: 'İstanbul', experience: '12 yıl', price: '₺4.200', color: '#E8555566', color2: '#B83A3A66', slug: 'selin-demir' },
  { name: 'Ali Yıldız', initials: 'AY', title: 'Klavyeci', rating: 4.6, reviews: 43, verified: false, available: true, genres: ['Türk Halk', 'Fasıl'], city: 'Bursa', experience: '8 yıl', price: '₺1.500', color: '#FF8C0066', color2: '#CC660066', slug: 'ali-yildiz' },
  { name: 'Nalan Doğan', initials: 'ND', title: 'Solist', rating: 5.0, reviews: 108, verified: true, available: true, genres: ['Pop', 'R&B', 'Jazz'], city: 'İstanbul', experience: '9 yıl', price: '₺5.500', color: '#00BCD466', color2: '#006E8066', slug: 'nalan-dogan' },
];

function showToast(msg, type = 'default') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = '0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function initNavbar() {
  const btn = document.getElementById('nav-avatar-btn');
  const dropdown = document.getElementById('nav-dropdown');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('mobile-nav');

  if (btn && dropdown) {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
  }
  if (toggle && mobile) {
    toggle.addEventListener('click', () => mobile.classList.toggle('open'));
  }
}

function initTabs(selector) {
  document.querySelectorAll(selector + ' .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.dataset.tab;
      const container = btn.closest('[data-tabs]') || document;
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      container.querySelectorAll('[data-panel]').forEach(p => {
        p.hidden = p.dataset.panel !== panel;
      });
    });
  });
}

function mountLayout(opts = {}) {
  const { active = '', loggedIn = false, userType = 'musician', showFooter = true } = opts;
  const nav = document.getElementById('navbar-slot');
  const foot = document.getElementById('footer-slot');
  if (nav) nav.innerHTML = renderNavbar(active, loggedIn, userType);
  if (foot && showFooter) foot.innerHTML = renderFooter();
  initNavbar();
}

function mountAppPage(opts = {}) {
  const { sidebarActive = '', userType = 'musician', ...layoutOpts } = opts;
  mountLayout({ loggedIn: true, userType, ...layoutOpts });
  const slot = document.getElementById('sidebar-slot');
  if (slot) slot.innerHTML = renderAppSidebar(sidebarActive, userType);
}

function switchProfileTab(name, btn) {
  document.querySelectorAll('.profile-nav .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('[data-profile-panel]').forEach(p => {
    p.hidden = p.dataset.profilePanel !== name;
  });
}

function formatPrice(n) {
  return '₺' + Number(n).toLocaleString('tr-TR');
}
