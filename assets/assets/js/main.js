// Utilidades
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// Intro Overlay
const introOverlay = $('#introOverlay');
const introEnter = $('#introEnter');

// Dias juntos
const tgDaysTotal = $('#tg-days-total');
const tgMonths = $('#tg-months');
const tgDaysCal = $('#tg-days-cal');
const startDateInput = $('#startDate');
const saveStartDateBtn = $('#saveStartDate');
const togetherStartLabel = $('#togetherStartLabel');
const stateKey = 'celebration-3meses-state';
let state = { startDate: '2025-08-15', messages: [], markers: [] };

function loadState() {
  try {
    const raw = localStorage.getItem(stateKey);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch (_) {}
}
function saveState() { localStorage.setItem(stateKey, JSON.stringify(state)); }

let togetherTimer;
function startTogetherCounter() {
  if (togetherTimer) clearInterval(togetherTimer);
  const startStr = state.startDate || '2025-08-15';
  togetherStartLabel.textContent = formatPTBR(startStr);
  const start = new Date(startStr).getTime();
  togetherTimer = setInterval(() => {
    const nowMs = Date.now();
    let diff = nowMs - start;
    if (diff < 0) diff = 0;
    const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));
    tgDaysTotal.textContent = String(daysTotal);

    // Breakdown calendário (anos, meses, dias)
    const from = new Date(startStr);
    const to = new Date(nowMs);
    const { y, m, d } = calendarDiff(from, to);
    if (tgMonths) tgMonths.textContent = String(m);
    if (tgDaysCal) tgDaysCal.textContent = String(d);
  }, 1000);
}

function formatPTBR(dStr) {
  if (!dStr) return '';
  const d = new Date(dStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function calendarDiff(from, to) {
  if (to < from) return { y: 0, m: 0, d: 0 };
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m -= 1;
    const prevMonthDays = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    d += prevMonthDays;
  }
  if (m < 0) { y -= 1; m += 12; }
  return { y, m, d };
}

// (removido) contador de tempo juntos

// Compartilhamento
const shareBtn = $('#shareBtn');
function shareSite() {
  const shareData = {
    title: 'Feliz 3 Meses de Namoro — Pablo & Catharine',
    text: 'Celebre conosco! Nossa história, galeria, música e mensagens.',
    url: window.location.href,
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    const text = encodeURIComponent(`${shareData.title} — ${shareData.text} ${shareData.url}`);
    const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`;
    const tw = `https://twitter.com/intent/tweet?text=${text}`;
    const wa = `https://wa.me/?text=${text}`;
    alert('Compartilhe nas redes sociais:\nFacebook, Twitter (X) ou WhatsApp.');
    window.open(fb, '_blank');
    window.open(tw, '_blank');
    window.open(wa, '_blank');
  }
}

// Música
const audio = $('#audio');
const musicInput = $('#musicInput');
const playPause = $('#playPause');
const stopMusic = $('#stopMusic');
const musicFilename = $('#musicFilename');
const volume = $('#volume');

function setupMusic() {
  // Música fixa via atributo data-src no elemento <audio>
  const fixed = audio?.dataset?.src;
  if (fixed) {
    audio.src = fixed;
    try { audio.load(); } catch (_) {}
    audio.volume = parseFloat(volume.value || '0.8');
    if (stopMusic) stopMusic.disabled = false;
  }
  // Tratamento de erro de carregamento do áudio
  if (audio) {
    audio.addEventListener('error', () => {
      // Mensagem discreta no botão e desabilitar controles dependentes
      const prev = playPause?.textContent || '';
      if (playPause) {
        playPause.textContent = 'Arquivo de música não encontrado';
        setTimeout(() => { playPause.textContent = prev || 'Retomar Música'; }, 2000);
      }
      if (stopMusic) stopMusic.disabled = true;
      // Mantém o src para permitir novas tentativas
      try { audio.pause(); } catch (_) {}
    });
    audio.addEventListener('canplay', async () => { await tryAutoplay(); });
    audio.addEventListener('loadeddata', () => {
      if (stopMusic) stopMusic.disabled = false;
    });
  }
  // Compatibilidade: se existir seletor de arquivo, mantém comportamento antigo
  if (musicInput) {
    musicInput.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      audio.src = url;
      audio.volume = parseFloat(volume.value || '0.8');
      playPause.textContent = 'Tocar Música';
      if (stopMusic) stopMusic.disabled = false;
    });
  }
  playPause.addEventListener('click', async () => {
    if (!audio.src) { playPause.textContent = 'Música indisponível'; setTimeout(() => playPause.textContent = 'Retomar Música', 1600); return; }
    try {
      if (audio.paused) { await audio.play(); playPause.textContent = 'Pausar Música'; }
      else { audio.pause(); playPause.textContent = 'Retomar Música'; }
    } catch (_) {}
  });
  if (stopMusic) {
    // Desabilita o botão Parar enquanto não houver música carregada
    stopMusic.disabled = !audio.src;
    stopMusic.addEventListener('click', () => {
      if (!audio.src) return;
      try { audio.pause(); } catch (_) {}
      audio.currentTime = 0;
      playPause.textContent = 'Retomar Música';
    });
  }
  volume.addEventListener('input', (e) => audio.volume = parseFloat(e.target.value || '0.8'));
}

async function tryAutoplay() {
  try {
    if (audio && audio.autoplay) {
      await audio.play();
      if (playPause) playPause.textContent = 'Pausar Música';
    }
  } catch (_) {
    if (playPause) playPause.textContent = 'Retomar Música';
    // Tentar novamente após breve intervalo
    setTimeout(async () => {
      try {
        await audio.play();
        if (playPause) playPause.textContent = 'Pausar Música';
      } catch (_) {}
    }, 600);
  }
}

function setupIntro() {
  if (!introOverlay || !introEnter) return;
  introEnter.addEventListener('click', async () => {
    introOverlay.classList.add('hidden');
    // Após revelar, tentar iniciar a música se autoplay estiver habilitado
    await tryAutoplay();
  });
}
// Timeline
const timeline = $('#timeline');
const evTitle = $('#evTitle');
const evDate = $('#evDate');
const evText = $('#evText');
function setupTimeline() {
  if (!timeline) return;
  timeline.addEventListener('click', (e) => {
    const t = e.target.closest('.event');
    if (!t) return;
    $$('.timeline .event').forEach(el => el.classList.remove('active'));
    t.classList.add('active');
    if (evTitle) evTitle.textContent = t.dataset.title || '';
    if (evDate) evDate.textContent = t.dataset.date || '';
    if (evText) evText.textContent = t.dataset.text || '';
  });
}

// Galeria / Lightbox
const gridItems = () => $$('#gallery .grid-item');
const lb = $('#lightbox');
const lbImg = $('#lbImg');
const lbClose = $('#lbClose');
const lbPrev = $('#lbPrev');
const lbNext = $('#lbNext');
let currentIdx = 0;
function openLightbox(idx) {
  currentIdx = idx;
  lbImg.src = gridItems()[idx].src;
  lb.classList.remove('hidden');
}
function closeLightbox() { lb.classList.add('hidden'); }
function changeLightbox(delta) {
  const items = gridItems();
  currentIdx = (currentIdx + delta + items.length) % items.length;
  lbImg.src = items[currentIdx].src;
}
function setupGallery() {
  gridItems().forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => changeLightbox(-1));
  lbNext.addEventListener('click', () => changeLightbox(1));
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightbox(-1);
    if (e.key === 'ArrowRight') changeLightbox(1);
  });
}

// Depoimentos simples
const quotes = () => $$('#quotes .quote');
const prevQuote = $('#prevQuote');
const nextQuote = $('#nextQuote');
let qIdx = 0;
function showQuote(i) { quotes().forEach((q, idx) => q.classList.toggle('active', idx === i)); }
function setupQuotes() {
  prevQuote.addEventListener('click', () => { qIdx = (qIdx - 1 + quotes().length) % quotes().length; showQuote(qIdx); });
  nextQuote.addEventListener('click', () => { qIdx = (qIdx + 1) % quotes().length; showQuote(qIdx); });
  // autoplay com pausa ao passar o mouse
  let quoteTimer;
  const startAuto = () => { quoteTimer = setInterval(() => { qIdx = (qIdx + 1) % quotes().length; showQuote(qIdx); }, 4000); };
  const stopAuto = () => { if (quoteTimer) clearInterval(quoteTimer); };
  startAuto();
  const quotesWrap = $('#quotes');
  quotesWrap.addEventListener('mouseenter', stopAuto);
  quotesWrap.addEventListener('mouseleave', startAuto);
}

// Mapa Leaflet
let map;
function setupMap() {
  const mapEl = document.getElementById('map');
  if (!mapEl) {
    // Seção de mapa removida; sair sem erros
    return;
  }
  if (typeof L === 'undefined') {
    // Leaflet não carregado; evitar erro e seguir com o restante do site
    return;
  }
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Restaurar marcadores
  (state.markers || []).forEach(m => L.marker([m.lat, m.lng]).addTo(map).bindPopup(m.name));

  map.on('click', (e) => {
    const name = prompt('Nome do lugar especial:');
    if (!name) return;
    const { lat, lng } = e.latlng;
    L.marker([lat, lng]).addTo(map).bindPopup(name);
    state.markers.push({ lat, lng, name });
    saveState();
  });
}

// Mensagens
const msgForm = $('#msgForm');
const msgName = $('#msgName');
const msgText = $('#msgText');
const msgList = $('#msgList');
function renderMessages() {
  if (!msgList) return;
  msgList.innerHTML = '';
  (state.messages || []).forEach(m => {
    const card = document.createElement('div');
    card.className = 'msg-card fade-in visible';
    card.innerHTML = `<div class="author">${m.name}</div><div class="text">${m.text}</div>`;
    msgList.appendChild(card);
  });
}
function setupMessages() {
  if (!msgForm || !msgName || !msgText || !msgList) return;
  msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = msgName.value.trim();
    const text = msgText.value.trim();
    if (!name || !text) return;
    state.messages = [{ name, text }, ...(state.messages || [])];
    saveState();
    msgName.value = ''; msgText.value = '';
    renderMessages();
  });
}

// Animações suaves ao rolar
function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => { if (ent.isIntersecting) ent.target.classList.add('visible'); });
  }, { threshold: 0.15 });
  $$('.section').forEach(sec => { sec.classList.add('fade-in'); io.observe(sec); });
}

function init() {
  loadState();
  // Estado inicial
  if (startDateInput) startDateInput.value = state.startDate || '2025-08-15';
  startTogetherCounter();

  // Eventos gerais
  if (saveStartDateBtn) saveStartDateBtn.addEventListener('click', () => {
    state.startDate = startDateInput.value || '2025-08-15';
    saveState();
    startTogetherCounter();
  });
  if (shareBtn) shareBtn.addEventListener('click', shareSite);

  setupMusic();
  setupIntro();
  // Tentar autoplay apenas se não houver overlay
  if (!introOverlay) { tryAutoplay(); }
  // Reforçar tentativa em eventos de visibilidade e interação
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !introOverlay) tryAutoplay(); });
  window.addEventListener('pageshow', () => { if (!introOverlay) tryAutoplay(); });
  ['pointerdown','keydown','touchstart'].forEach(evt => document.addEventListener(evt, () => { if (audio?.paused) tryAutoplay(); }, { once: true }));
  setupTimeline();
  setupGallery();
  setupQuotes();
  setupMap();
  setupMessages();
  setupReveal();
}

document.addEventListener('DOMContentLoaded', init);