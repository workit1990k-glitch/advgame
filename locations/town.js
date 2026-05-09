window.TownLocation = {
  name: "Town",
  background: "https://dummyimage.com/1200x800/2c3e50/ffffff?text=Town+Background",
  npcs: [
    {
      id: "merchant",
      x: 250,
      y: 300,
      sprite: "https://github.com/workit1990k-glitch/advgame/blob/main/4_F_FAIRY2.gif?raw=true",
      popupImage: "https://raw.githubusercontent.com/workit1990k-glitch/advgame/refs/heads/main/4_M_FAIRYSCHOLAR.gif",
      text: "Welcome, traveler! Check out my finest wares."
    },
    {
      id: "elder",
      x: 600,
      y: 400,
      sprite: "https://dummyimage.com/64/3498db/ffffff?text=Elder",
      popupImage: "",
      text: "The old forest to the east is dangerous. Tread carefully."
    },
    {
      id: "guard",
      x: 800,
      y: 250,
      sprite: "https://dummyimage.com/64/27ae60/ffffff?text=Guard",
      popupImage: "https://dummyimage.com/200x150/9b59b6/ffffff?text=Shield",
      text: "Halt! State your business in this town."
    }
  ]
};
// town.js - Add at the very end
window.TownSpawner = {
  interval: null,
  maxMonsters: 3,
  spawnRate: 4000, // milliseconds between spawns

  start() {
    // Clear any existing interval to prevent duplicates
    if (this.interval) clearInterval(this.interval);

    this.interval = setInterval(() => {
      // Only spawn if under max limit
      const activeCount = window.ActiveMonsters ? window.ActiveMonsters.length : 0;
      if (activeCount < this.maxMonsters && typeof Game !== 'undefined') {
        // Random position within safe town bounds
        const x = 150 + Math.floor(Math.random() * 900);
        const y = 150 + Math.floor(Math.random() * 500);
        Game.spawnMonster('poring', x, y);
      }
    }, this.spawnRate);
  },

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};

// Auto-start when this file loads
if (typeof Game !== 'undefined' && typeof Game.spawnMonster === 'function') {
  window.TownSpawner.start();
}
