export const GAME_BALANCE = {
  stage: {
    id: "single_stardust_defense",
    clearTurn: 30,
    initialCastleHp: 3,
    initialRotations: 10,
    previewTurns: 3,
    handSize: 4,
    logLimit: 8
  },
  lanes: {
    directions: ["left", "right"],
    width: 6,
    defenseDepth: 10
  },
  materials: {
    wood: { label: "나무", hp: 2, weight: 90 },
    stone: { label: "돌", hp: 3, weight: 9 },
    iron: { label: "철", hp: 4, weight: 1 }
  },
  spawnCurve: [
    { fromTurn: 1, toTurn: 5, count: 1 },
    { fromTurn: 6, toTurn: 13, count: 2 },
    { fromTurn: 14, toTurn: 30, count: 2, bonusEvery: 3, bonusCount: 1 }
  ],
  merge: {
    squareSize: 2,
    rewardThreshold: 3,
    catalystHpBonus: 1
  },
  rewards: {
    choiceCount: 3
  },
  events: {
    rotationGain: 3,
    repairCastleAmount: 1,
    repairCastleMaxHp: 5,
    freezeTurns: 1,
    blockHpBoost: 1,
    dropIronCount: 2,
    woodRainCount: 4,
    enemyPushDistance: 1
  }
};
