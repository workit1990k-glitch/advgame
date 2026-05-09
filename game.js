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

  // Add to Game object in game.js

spawnMonster(monsterId, x, y) {
  const monster = window.MonsterSpawner.spawn(monsterId, x, y);
  if (monster) {
    const el = document.createElement('div');
    el.className = 'monster';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.backgroundImage = `url('${monster.sprite}')`;
    el.dataset.instanceId = monster.instanceId;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.attackMonster(monster);
    });
    this.mainEl.appendChild(el);
    monster.element = el;
  }
},

attackMonster(monster) {
  const hero = window.Hero;
  const damage = Math.max(1, hero.attack - monster.defense);
  monster.currentHp -= damage;
  
  this.showPopup({
    text: `You attack ${monster.name} for ${damage} damage!`,
    popupImage: monster.image
  });

  if (monster.currentHp <= 0) {
    this.defeatMonster(monster);
  }
},

defeatMonster(monster) {
  const hero = window.Hero;
  
  // Award EXP
  hero.exp += monster.exp;
  
  // Award Gold
  hero.inventory.gold += monster.gold;
  
  this.showPopup({
    text: `${monster.name} defeated! +${monster.exp} EXP, +${monster.gold} Gold`,
    popupImage: monster.image
  });

  // Remove monster element
  if (monster.element) {
    monster.element.remove();
  }
  
  window.MonsterSpawner.despawn(monster.instanceId);
  
  // Check for level up
  this.checkLevelUp();
},

checkLevelUp() {
  const hero = window.Hero;
  if (hero.exp >= hero.expToLevel) {
    hero.level++;
    hero.exp -= hero.expToLevel;
    hero.expToLevel = Math.floor(hero.expToLevel * 1.5);
    hero.maxHp += 20;
    hero.hp = hero.maxHp;
    hero.attack += 5;
    
    this.showPopup({
      text: `LEVEL UP! You are now level ${hero.level}!`,
      popupImage: ""
    });
  }
}

};

document.addEventListener('DOMContentLoaded', () => Game.init());
