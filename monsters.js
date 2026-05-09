// Monster Database
window.Monsters = {
  poring: {
    id: "poring",
    name: "Poring",
    sprite: "https://dummyimage.com/64/ffb6c1/ffffff?text=Poring",
    image: "https://dummyimage.com/128x128/ffb6c1/ffffff?text=Poring+Monster",
    hp: 10,
    maxHp: 10,
    attack: 20,
    defense: 0,
    exp: 20,
    gold: 10,
    drops: [
      { item: "gold", amount: 10 }
    ]
  }
};

// Active monster instances
window.ActiveMonsters = [];

// Monster spawner
window.MonsterSpawner = {
  spawn(monsterId, x, y) {
    const monsterTemplate = window.Monsters[monsterId];
    if (!monsterTemplate) {
      console.error(`Monster "${monsterId}" not found`);
      return null;
    }

    const monster = {
      ...monsterTemplate,
      instanceId: Date.now() + Math.random(),
      x: x,
      y: y,
      currentHp: monsterTemplate.hp
    };

    window.ActiveMonsters.push(monster);
    return monster;
  },

  despawn(instanceId) {
    window.ActiveMonsters = window.ActiveMonsters.filter(m => m.instanceId !== instanceId);
  }
};
