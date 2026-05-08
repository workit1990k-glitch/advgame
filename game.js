const Game = {
  mainEl: null,
  popupEl: null,
  currentLocation: null,
  npcs: [],

  init() {
    this.mainEl = document.getElementById('main');
    this.createPopup();
    this.setupGlobalEvents();
    
    // Load starting location automatically
    this.loadLocationScript('locations/town.js').then(() => {
      if (window.TownLocation) {
        this.loadLocation(window.TownLocation);
      } else {
        console.error('TownLocation not found. Make sure locations/town.js is correct.');
      }
    }).catch(err => console.error('Failed to load location script:', err));
  },

  loadLocationScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(); return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },

  createPopup() {
    this.popupEl = document.createElement('div');
    this.popupEl.id = 'npc-popup';
    this.mainEl.appendChild(this.popupEl);
  },

  setupGlobalEvents() {
    this.mainEl.addEventListener('click', (e) => {
      if (!e.target.closest('.npc') && !e.target.closest('#npc-popup')) {
        this.hidePopup();
      }
    });
  },

  loadLocation(locationData) {
    this.unloadCurrent();
    this.currentLocation = locationData;
    this.mainEl.style.backgroundImage = `url('${locationData.background}')`;
    locationData.npcs.forEach(npc => this.spawnNPC(npc));
  },

  spawnNPC(npcData) {
    const el = document.createElement('div');
    el.className = 'npc';
    el.style.left = `${npcData.x}px`;
    el.style.top = `${npcData.y}px`;
    el.style.backgroundImage = `url('${npcData.sprite}')`;
    el.dataset.id = npcData.id;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showPopup(npcData);
    });

    this.mainEl.appendChild(el);
    this.npcs.push(el);
  },

  showPopup(npcData) {
    // Build popup content
    const imgHTML = npcData.popupImage ? `<img src="${npcData.popupImage}" alt="">` : '';
    this.popupEl.innerHTML = `${imgHTML}<p>${npcData.text}</p>`;
    
    // Make visible to measure dimensions
    this.popupEl.style.display = 'block';
    void this.popupEl.offsetWidth; // Force reflow
    
    // Center popup on screen
    const mainRect = this.mainEl.getBoundingClientRect();
    const popupRect = this.popupEl.getBoundingClientRect();
    
    const centerX = (mainRect.width - popupRect.width) / 2;
    const centerY = (mainRect.height - popupRect.height) / 2;
    
    this.popupEl.style.left = `${centerX}px`;
    this.popupEl.style.top = `${centerY}px`;
  },

  hidePopup() {
    this.popupEl.style.display = 'none';
  },

  unloadCurrent() {
    this.npcs.forEach(el => el.remove());
    this.npcs = [];
    this.hidePopup();
  }
};

document.addEventListener('DOMContentLoaded', () => Game.init());
