import {
  GameState,
  DIRECTIONS,
  DIRECTION_LABELS,
  MATERIALS,
  shapeCells
} from "./core.js";
import {
  ART_ASSETS,
  blockAssetForState,
  directionIcon
} from "./art-assets.js";
import { GAME_BALANCE } from "./game-balance.js";

const $ = (selector) => document.querySelector(selector);
const elements = {
  turn: $("#turn-value"),
  hearts: $("#castle-hearts"),
  forecast: $("#forecast-list"),
  gauge: $("#merge-gauge"),
  inventory: $("#event-inventory"),
  rotations: $("#rotation-value"),
  rotate: $("#rotate-button"),
  hand: $("#hand"),
  pass: $("#pass-button"),
  instruction: $("#instruction"),
  log: $("#battle-log"),
  seed: $("#seed-label"),
  modal: $("#modal"),
  modalKicker: $("#modal-kicker"),
  modalTitle: $("#modal-title"),
  modalContent: $("#modal-content"),
  modalClose: $("#modal-close"),
  introOverlay: $("#intro-overlay"),
  introCaption: $("#intro-caption"),
  introKicker: $("#intro-kicker"),
  introSpeaker: $("#intro-speaker"),
  introText: $("#intro-text"),
  introPrompt: $("#intro-prompt"),
  introCharacters: $("#intro-characters"),
  introPortraits: {
    lina: $("#intro-character-lina"),
    momo: $("#intro-character-momo"),
    sera: $("#intro-character-sera")
  },
  tutorialOverlay: $("#tutorial-overlay"),
  tutorialImage: $("#tutorial-image"),
  tutorialPage: $("#tutorial-page"),
  tutorialTitle: $("#tutorial-title"),
  tutorialBody: $("#tutorial-body"),
  tutorialTip: $("#tutorial-tip"),
  tutorialPrompt: $("#tutorial-prompt")
};

let game;
let selectedCard = null;
let previewAnchor = null;
let pendingEvent = null;
let modalLocked = false;
let visualEffects = [];
let introStep = "hidden";
let introDialogueIndex = 0;
let introTimer = null;
let tutorialIndex = 0;
let clickSound = null;

const INTRO_NARRATION = [
  "별가루가 내려앉은 밤, 루미나 공방성의 좌우에 푸른 균열이 열렸다.",
  "오래전 하늘을 떠돌던 테트라 성운 조각이 공방성의 마력로에 닿으며, 잠들어 있던 별가루가 깨어났다.",
  "균열 너머에서는 완성되지 못한 조각들이 성문을 향해 기어 나오고 있었다.",
  "왕국 기사단의 등불은 아직 산등성이 너머에 있고, 공방성에 남은 것은 견습생들과 오래된 설계도 카드뿐이었다.",
  "리나와 친구들은 흔들리는 마력로 앞에서 마지막 방어선을 펼쳤다."
];

const INTRO_DIALOGUE = [
  { speaker: "리나", character: "lina", text: "방금 성이... 양쪽으로 흔들렸어. 저 빛, 그냥 별가루가 아니지?" },
  { speaker: "모모", character: "momo", text: "흠흠. 기록상으로는 테트라 성운 조각이야. 아주 오래전에 하늘에서 길을 잃은 설계의 잔해지." },
  { speaker: "세라", character: "sera", text: "마력로 출력이 불안정해. 좌우 균열이 성벽을 잡아당기고 있어." },
  { speaker: "리나", character: "lina", text: "그럼 저 조각들이 성문까지 오기 전에 막아야겠네. 창고의 설계도 카드, 아직 살아 있지?" },
  { speaker: "모모", character: "momo", text: "당연하지. 먼지는 좀 먹었지만, 고대 방어 기하학의 품위는 멀쩡해." },
  { speaker: "세라", character: "sera", text: "내가 마력로를 붙잡고 있을게. 리나, 방어선은 네가 세워." },
  { speaker: "리나", character: "lina", text: "좋아. 기사단이 오기 전까지, 루미나 공방성은 우리가 지킨다!" }
];

const TUTORIAL_PAGES = [
  {
    image: ART_ASSETS.tutorial.battlefield,
    alt: "좌우 전선, 중앙 성, 적 출현 예고가 보이는 전체 전장 화면",
    title: "방어 작전",
    body: "좌우 균열에서 틈새 조각들이 몰려옵니다.\n성 중앙까지 도달하기 전에 양쪽 전선에 방어 블럭을 세워주세요.",
    tip: "목표: 30턴 동안 루미나 공방성 지키기"
  },
  {
    image: ART_ASSETS.tutorial.blueprint,
    alt: "설계도 카드를 선택해 오른쪽 전선의 배치 가능 칸이 파랗게 표시된 화면",
    title: "설계도 투입",
    body: "설계도 카드를 선택하면 배치할 수 있는 전선과 위치가 표시됩니다.\n파랗게 빛나는 칸을 클릭해 블럭을 내려놓으세요.",
    tip: "카드의 방향 아이콘을 보면 어느 전선에 놓을지 알 수 있습니다."
  },
  {
    image: ART_ASSETS.tutorial.mergeEvent,
    alt: "블럭 배치 후 합성폭발 게이지와 이벤트 카드 영역이 함께 보이는 화면",
    title: "마력로 반응",
    body: "같은 재질 블럭이 2×2로 모이면 더 강한 블럭으로 합성됩니다.\n합성이 쌓이면 마력로가 반응해 비상 이벤트 카드를 만들어냅니다.",
    tip: "이벤트 카드는 위급한 전선을 되돌릴 수 있는 마지막 한 수입니다."
  }
];

const assetUrl = (path) => `url("${path}")`;

function applyArtTheme() {
  document.documentElement.style.setProperty("--stage-art", assetUrl(ART_ASSETS.background.stage));
  document.documentElement.style.setProperty("--intro-art", assetUrl(ART_ASSETS.background.intro));
  document.documentElement.style.setProperty("--castle-art", assetUrl(ART_ASSETS.castle.idle));
  document.documentElement.style.setProperty("--castle-hit-art", assetUrl(ART_ASSETS.castle.hit));
  document.documentElement.style.setProperty("--card-blueprint-art", assetUrl(ART_ASSETS.cards.blueprint));
  document.documentElement.style.setProperty("--card-event-art", assetUrl(ART_ASSETS.cards.event));
  elements.introPortraits.lina.src = ART_ASSETS.characters.lina;
  elements.introPortraits.momo.src = ART_ASSETS.characters.momo;
  elements.introPortraits.sera.src = ART_ASSETS.characters.sera;
}

function setupAudio() {
  clickSound = new Audio(ART_ASSETS.audio.click);
  clickSound.volume = 0.45;
  clickSound.preload = "auto";
}

function playClickSound() {
  if (!clickSound) return;
  const sound = clickSound.cloneNode();
  sound.volume = clickSound.volume;
  sound.play().catch(() => {});
}

function handleGlobalClick(event) {
  if (!event.isTrusted) return;
  playClickSound();
}

function tileAsset(depth) {
  if (depth === 0) return ART_ASSETS.tiles.entrance;
  if (depth === GAME_BALANCE.lanes.defenseDepth) return ART_ASSETS.tiles.spawn;
  return ART_ASSETS.tiles.field;
}

function enemyVisualState(lane, enemy) {
  if (lane.frozen > 0) return "idle";
  if (enemy.depth === 0 || lane.blocks[enemy.depth - 1]?.[enemy.col]) return "attack";
  return "move";
}

function snapshotEnemies() {
  const snapshot = new Map();
  for (const direction of DIRECTIONS) {
    for (const enemy of game.lanes[direction].enemies) {
      snapshot.set(enemy, { direction, col: enemy.col, depth: enemy.depth });
    }
  }
  return snapshot;
}

function trackVisualRemovals(action) {
  const before = snapshotEnemies();
  const result = action();
  const live = new Set(DIRECTIONS.flatMap((direction) => game.lanes[direction].enemies));
  const vanished = [...before].filter(([enemy]) => !live.has(enemy)).map(([, effect]) => ({
    ...effect,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }));
  if (vanished.length) {
    visualEffects.push(...vanished);
    setTimeout(() => {
      const vanishedIds = new Set(vanished.map((effect) => effect.id));
      visualEffects = visualEffects.filter((effect) => !vanishedIds.has(effect.id));
      render();
    }, 480);
  }
  return result;
}

function freshGame() {
  const querySeed = new URLSearchParams(location.search).get("seed");
  const seed = querySeed ? Number(querySeed) : Math.floor(Date.now() % 1_000_000_000);
  game = new GameState(seed);
  selectedCard = null;
  previewAnchor = null;
  pendingEvent = null;
  visualEffects = [];
  closeModal(true);
  render();
  startIntro();
}

function startIntro() {
  clearTimeout(introTimer);
  introStep = "waiting";
  introDialogueIndex = 0;
  elements.introOverlay.classList.remove("hidden");
  elements.introOverlay.classList.add("waiting");
  elements.introOverlay.classList.remove("dialogue-mode");
  elements.introCaption.classList.add("hidden");
  elements.introCharacters.classList.add("hidden");
  elements.tutorialOverlay.classList.add("hidden");
  Object.values(elements.introPortraits).forEach((portrait) => portrait.classList.remove("speaking", "dimmed"));
  introTimer = setTimeout(() => showNarration(), 2000);
}

function showNarration() {
  introStep = "narration";
  elements.introOverlay.classList.remove("waiting");
  elements.introOverlay.classList.remove("dialogue-mode");
  elements.introCharacters.classList.add("hidden");
  elements.introCaption.classList.remove("hidden");
  elements.introKicker.textContent = "NARRATION";
  elements.introSpeaker.textContent = "";
  elements.introText.replaceChildren();
  INTRO_NARRATION.forEach((sentence) => {
    const line = document.createElement("span");
    line.textContent = sentence;
    elements.introText.append(line);
  });
  elements.introPrompt.textContent = "클릭해서 계속";
}

function showDialogue(index) {
  const line = INTRO_DIALOGUE[index];
  introStep = "dialogue";
  elements.introOverlay.classList.add("dialogue-mode");
  elements.introCharacters.classList.remove("hidden");
  elements.introCaption.classList.remove("hidden");
  elements.introKicker.textContent = "DIALOGUE";
  elements.introSpeaker.textContent = line.speaker;
  elements.introText.textContent = line.text;
  elements.introPrompt.textContent = index === INTRO_DIALOGUE.length - 1 ? "클릭해서 방어 시작" : "클릭해서 계속";
  Object.entries(elements.introPortraits).forEach(([key, portrait]) => {
    portrait.classList.toggle("speaking", key === line.character);
    portrait.classList.toggle("dimmed", key !== line.character);
  });
}

function advanceIntro() {
  if (introStep === "waiting" || introStep === "hidden") return;
  if (introStep === "narration") {
    introDialogueIndex = 0;
    showDialogue(introDialogueIndex);
    return;
  }
  introDialogueIndex += 1;
  if (introDialogueIndex < INTRO_DIALOGUE.length) {
    showDialogue(introDialogueIndex);
    return;
  }
  introStep = "hidden";
  elements.introOverlay.classList.remove("dialogue-mode");
  elements.introOverlay.classList.add("hidden");
  startTutorial();
}

function startTutorial() {
  tutorialIndex = 0;
  elements.tutorialOverlay.classList.remove("hidden");
  showTutorialPage();
}

function showTutorialPage() {
  const page = TUTORIAL_PAGES[tutorialIndex];
  elements.tutorialImage.src = page.image;
  elements.tutorialImage.alt = page.alt;
  elements.tutorialPage.textContent = `${tutorialIndex + 1} / ${TUTORIAL_PAGES.length}`;
  elements.tutorialTitle.textContent = page.title;
  elements.tutorialBody.textContent = page.body;
  elements.tutorialTip.textContent = page.tip;
  elements.tutorialPrompt.textContent = tutorialIndex === TUTORIAL_PAGES.length - 1 ? "클릭해서 방어 시작" : "클릭해서 계속";
}

function advanceTutorial() {
  if (elements.tutorialOverlay.classList.contains("hidden")) return;
  tutorialIndex += 1;
  if (tutorialIndex < TUTORIAL_PAGES.length) {
    showTutorialPage();
    return;
  }
  elements.tutorialOverlay.classList.add("hidden");
}

function makeCell(direction, col, depth, previewSet, previewMaterial) {
  const lane = game.lanes[direction];
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.cellDirection = direction;
  cell.dataset.cellColumn = String(col);
  cell.dataset.cellDepth = String(depth);
  cell.style.setProperty("--tile-art", assetUrl(tileAsset(depth)));
  if (depth === 0) cell.classList.add("entrance");
  if (depth === GAME_BALANCE.lanes.defenseDepth) cell.classList.add("spawn");
  if (previewSet.has(`${col}:${depth}`)) {
    cell.classList.add("preview", `ghost-${previewMaterial}`);
    cell.style.setProperty("--hover-art", assetUrl(ART_ASSETS.tiles.hoverValid));
    cell.title = "클릭하여 이 위치에 배치";
  }
  const block = depth < GAME_BALANCE.lanes.defenseDepth ? lane.blocks[depth][col] : null;
  if (block) {
    cell.classList.add("block", block.material);
    cell.style.setProperty("--block-art", assetUrl(blockAssetForState(block)));
    cell.textContent = block.hp;
    cell.title = `${MATERIALS[block.material].label} HP ${block.hp}/${block.maxHp}`;
  }
  const enemy = lane.enemies.find((item) => item.col === col && item.depth === depth);
  if (enemy) {
    const state = enemyVisualState(lane, enemy);
    const marker = document.createElement("span");
    marker.className = `enemy enemy-fragment enemy-${state}`;
    marker.style.setProperty("--enemy-sheet", assetUrl(ART_ASSETS.enemies.fragment[state]));
    marker.title = "조각 마물";
    cell.append(marker);
  }
  visualEffects
    .filter((effect) => effect.direction === direction && effect.col === col && effect.depth === depth)
    .forEach(() => {
      const effectMarker = document.createElement("span");
      effectMarker.className = "enemy enemy-fragment enemy-vanish enemy-effect";
      effectMarker.style.setProperty("--enemy-sheet", assetUrl(ART_ASSETS.enemies.fragment.vanish));
      cell.append(effectMarker);
    });
  if (depth === GAME_BALANCE.lanes.defenseDepth && lane.queue[col] > 0) {
    const queue = document.createElement("span");
    queue.className = "queue-count";
    queue.textContent = `+${lane.queue[col]}`;
    queue.title = "시작칸 대기열";
    cell.append(queue);
  }
  return cell;
}

function renderLane(direction) {
  const root = $(`#lane-${direction}`);
  root.replaceChildren();
  const card = selectedCard === null ? null : game.hand[selectedCard];
  const active = card?.direction === direction && !pendingEvent;
  root.classList.toggle("active", active);
  const grid = document.createElement("div");
  grid.className = "lane-grid horizontal";

  const valid = active ? game.validAnchors(card) : [];
  if (active && !valid.includes(previewAnchor)) previewAnchor = valid[0] ?? null;
  const preview = active && previewAnchor !== null ? game.getPlacement(card, previewAnchor) : null;
  const previewSet = new Set((preview || []).map(({ col, depth }) => `${col}:${depth}`));

  const laneDepth = GAME_BALANCE.lanes.defenseDepth;
  const laneWidth = GAME_BALANCE.lanes.width;
  const depths = direction === "left"
    ? Array.from({ length: laneDepth + 1 }, (_, index) => laneDepth - index)
    : Array.from({ length: laneDepth + 1 }, (_, index) => index);
  for (let col = 0; col < laneWidth; col += 1) depths.forEach((depth) => grid.append(makeCell(direction, col, depth, previewSet, card?.material)));

  grid.setAttribute("role", active ? "button" : "grid");
  grid.setAttribute("aria-label", active
    ? `${DIRECTION_LABELS[direction]} 전선 배치 영역. 칸을 가리켜 미리 보고 클릭해 배치합니다.`
    : `${DIRECTION_LABELS[direction]} 전선`);
  grid.addEventListener("pointermove", (event) => {
    if (!active) return;
    const cell = event.target.closest("[data-cell-column]");
    if (!cell) return;
    const hoveredColumn = Number(cell.dataset.cellColumn);
    const closestAnchor = [...valid].sort((a, b) => Math.abs(a - hoveredColumn) - Math.abs(b - hoveredColumn))[0];
    if (closestAnchor !== undefined && previewAnchor !== closestAnchor) {
      previewAnchor = closestAnchor;
      renderLanes();
    }
  });
  grid.addEventListener("click", (event) => {
    if (!active) return;
    const cell = event.target.closest("[data-cell-column]");
    if (!cell) return;
    const hoveredColumn = Number(cell.dataset.cellColumn);
    const closestAnchor = [...valid].sort((a, b) => Math.abs(a - hoveredColumn) - Math.abs(b - hoveredColumn))[0];
    if (closestAnchor !== undefined) placeSelected(closestAnchor);
  });

  const controls = document.createElement("div");
  controls.className = "column-controls";
  for (let col = 0; col < laneWidth; col += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "column-button";
    button.dataset.direction = direction;
    button.dataset.column = String(col);
    button.textContent = col + 1;
    button.disabled = !valid.includes(col);
    if (valid.includes(col)) button.classList.add("valid");
    button.addEventListener("mouseenter", () => { previewAnchor = col; renderLanes(); });
    button.addEventListener("focus", () => { previewAnchor = col; renderLanes(); });
    button.addEventListener("click", () => placeSelected(col));
    controls.append(button);
  }
  root.append(grid, controls);
}

function renderLanes() {
  DIRECTIONS.forEach(renderLane);
}

function renderHearts() {
  elements.hearts.replaceChildren();
  for (let index = 0; index < game.castleHp; index += 1) {
    const heart = document.createElement("span");
    heart.className = `heart ${index >= 3 ? "bonus" : ""}`;
    const icon = document.createElement("img");
    icon.src = ART_ASSETS.icons.heartFull;
    icon.alt = "";
    heart.append(icon);
    elements.hearts.append(heart);
  }
}

function renderForecast() {
  elements.forecast.replaceChildren();
  game.preview.forEach((spawns, offset) => {
    const panel = document.createElement("article");
    panel.className = `forecast-turn ${offset === 0 ? "current" : ""}`;
    const header = document.createElement("header");
    header.innerHTML = `<strong>${game.turn + offset}턴</strong><span>${spawns.length}마리</span>`;
    const chips = document.createElement("div");
    chips.className = "spawn-chips";
    spawns.forEach((spawn) => {
      const chip = document.createElement("span");
      chip.className = "spawn-chip";
      chip.textContent = `${DIRECTION_LABELS[spawn.direction]} ${spawn.col + 1}열`;
      chips.append(chip);
    });
    panel.append(header, chips);
    elements.forecast.append(panel);
  });
}

function miniShape(card) {
  const root = document.createElement("div");
  root.className = "mini-shape";
  const cells = shapeCells(card.shape, card.rotation);
  const width = Math.max(...cells.map(([x]) => x)) + 1;
  const height = Math.max(...cells.map(([, y]) => y)) + 1;
  const offsetX = (70 - width * 16) / 2;
  const offsetY = (55 - height * 16) / 2;
  cells.forEach(([x, y]) => {
    const cell = document.createElement("span");
    cell.className = `mini-cell ${card.material}`;
    cell.style.left = `${offsetX + x * 16}px`;
    cell.style.top = `${offsetY + y * 16}px`;
    root.append(cell);
  });
  return root;
}

function renderHand() {
  elements.hand.replaceChildren();
  game.hand.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `blueprint-card ${selectedCard === index ? "selected" : ""}`;
    button.dataset.cardIndex = String(index);
    const top = document.createElement("div");
    top.className = "card-top";
    top.innerHTML = `<span class="material-label">${MATERIALS[card.material].label} ${card.shape}</span><span class="card-direction"><img class="direction-icon" src="${directionIcon(card.direction)}" alt="${DIRECTION_LABELS[card.direction]}"></span>`;
    const bottom = document.createElement("div");
    bottom.className = "card-bottom";
    bottom.innerHTML = `<span>HP ${MATERIALS[card.material].hp}</span><span>${card.rotation * 90}°</span>`;
    button.append(top, miniShape(card), bottom);
    button.addEventListener("click", () => selectHandCard(index));
    elements.hand.append(button);
  });
}

function renderInventory() {
  elements.inventory.replaceChildren();
  if (!game.inventory.length) {
    const empty = document.createElement("span");
    empty.className = "event-empty";
    empty.textContent = `합성 ${GAME_BALANCE.merge.rewardThreshold}회마다 이벤트 카드가 이곳에 보관됩니다.`;
    elements.inventory.append(empty);
    return;
  }
  game.inventory.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-card";
    button.innerHTML = `<strong>${card.name}</strong><span>${card.description}</span>`;
    button.addEventListener("click", () => beginEvent(index));
    elements.inventory.append(button);
  });
}

function renderGauge() {
  elements.gauge.replaceChildren();
  for (let index = 0; index < GAME_BALANCE.merge.rewardThreshold; index += 1) {
    const dot = document.createElement("span");
    dot.className = `merge-dot ${index < game.mergeProgress ? "on" : ""}`;
    dot.style.setProperty("--merge-icon", assetUrl(index < game.mergeProgress ? ART_ASSETS.icons.mergeChargeOn : ART_ASSETS.icons.mergeChargeOff));
    elements.gauge.append(dot);
  }
}

function renderLog() {
  elements.log.replaceChildren();
  game.logs.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    elements.log.append(item);
  });
}

function render() {
  elements.turn.textContent = `${game.turn} / ${game.maxTurns}`;
  elements.rotations.textContent = `${game.rotations} / ${GAME_BALANCE.stage.initialRotations}`;
  elements.seed.textContent = `SEED ${game.seed}`;
  document.body.classList.toggle("castle-hit", game.castleHp <= 1);
  elements.rotate.disabled = selectedCard === null || game.rotations <= 0 || game.status !== "playing" || pendingEvent;
  elements.pass.disabled = game.status !== "playing" || Boolean(pendingEvent);
  renderHearts();
  renderForecast();
  renderGauge();
  renderInventory();
  renderHand();
  renderLanes();
  renderLog();
  if (game.rewardChoices) showRewardModal();
  else if (game.status !== "playing") showResult();
}

function selectHandCard(index) {
  if (game.status !== "playing") return;
  if (pendingEvent) {
    const result = trackVisualRemovals(() => game.useEvent(pendingEvent.index, index));
    pendingEvent = null;
    elements.instruction.textContent = result.ok ? "이벤트 카드가 적용되었습니다." : result.message;
    render();
    return;
  }
  selectedCard = selectedCard === index ? null : index;
  previewAnchor = null;
  elements.instruction.textContent = selectedCard === null
    ? "카드를 선택한 뒤 강조된 전선의 열 번호를 선택하세요."
    : `${DIRECTION_LABELS[game.hand[selectedCard].direction]} 전선에서 파란 열 번호를 선택하세요.`;
  render();
}

function placeSelected(col) {
  if (selectedCard === null) return;
  const result = trackVisualRemovals(() => game.placeCard(selectedCard, col));
  elements.instruction.textContent = result.ok ? "턴 처리가 완료되었습니다. 다음 설계도를 선택하세요." : result.message;
  selectedCard = null;
  previewAnchor = null;
  render();
}

function rotateSelected() {
  if (selectedCard === null) return;
  if (game.rotateCard(selectedCard)) {
    previewAnchor = null;
    elements.instruction.textContent = "블럭을 시계 방향으로 90° 회전했습니다.";
    render();
  }
}

function beginEvent(index) {
  const card = game.inventory[index];
  if (!card || game.status !== "playing") return;
  if (card.target === "none") {
    const result = trackVisualRemovals(() => game.useEvent(index));
    elements.instruction.textContent = result.ok ? `「${card.name}」 효과가 적용되었습니다.` : result.message;
    render();
    return;
  }
  if (card.target === "card") {
    pendingEvent = { index };
    selectedCard = null;
    elements.instruction.textContent = `「${card.name}」을 적용할 일반 카드를 선택하세요.`;
    render();
    return;
  }
  openModal("EVENT TARGET", `${card.name} · 전선 선택`, "", false);
  const wrapper = document.createElement("div");
  wrapper.className = "target-buttons";
  DIRECTIONS.forEach((direction) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "target-button";
    button.textContent = `${DIRECTION_LABELS[direction]} 전선 · 위협 ${game.threat(direction)}`;
    button.addEventListener("click", () => {
      const result = trackVisualRemovals(() => game.useEvent(index, direction));
      closeModal(true);
      elements.instruction.textContent = result.ok ? `「${card.name}」 효과가 적용되었습니다.` : result.message;
      render();
    });
    wrapper.append(button);
  });
  elements.modalContent.append(wrapper);
}

function showRewardModal() {
  openModal("MERGE BURST", "합성폭발 보상", "세 장 중 보관할 이벤트 카드 한 장을 선택하세요.", true);
  const options = document.createElement("div");
  options.className = "reward-options";
  game.rewardChoices.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "event-card";
    button.innerHTML = `<strong>${card.name}</strong><span>${card.description}</span>`;
    button.addEventListener("click", () => {
      game.chooseReward(index);
      if (game.pendingRewards > 0) game.createRewardChoices();
      else closeModal(true);
      render();
    });
    options.append(button);
  });
  elements.modalContent.append(options);
}

function showResult() {
  const won = game.status === "won";
  const resultImage = won ? ART_ASSETS.endings.success : ART_ASSETS.endings.failure;
  const resultAlt = won ? "맑은 날 성 앞에서 기뻐하는 리나, 모모, 세라" : "귀여운 틈새 조각들에게 둘러싸여 당황한 리나, 모모, 세라";
  openModal(won ? "DEFENSE COMPLETE" : "WORKSHOP FALLEN", won ? "방어 성공!" : "방어 실패", "", true);
  elements.modal.classList.add("result-modal");
  elements.modalContent.innerHTML = `
    <img class="result-frame" src="${resultImage}" alt="${resultAlt}">
    <p class="result-message">${won ? "루미나 공방성은 마지막 파도까지 버텨냈습니다." : "마력로가 꺼졌지만, 다음 설계는 더 단단해질 겁니다."}</p>
    <button id="result-restart" class="primary-button" type="button">새 방어 시작</button>`;
  $("#result-restart").addEventListener("click", freshGame);
}

function openModal(kicker, title, paragraph = "", locked = false) {
  modalLocked = locked;
  elements.modalKicker.textContent = kicker;
  elements.modalTitle.textContent = title;
  elements.modalContent.innerHTML = paragraph ? `<p>${paragraph}</p>` : "";
  elements.modalClose.hidden = locked;
  elements.modal.classList.remove("result-modal");
  elements.modal.classList.remove("hidden");
}

function closeModal(force = false) {
  if (modalLocked && !force) return;
  modalLocked = false;
  elements.modal.classList.add("hidden");
}

function showHelp() {
  openModal("HOW TO PLAY", "공방성 방어 지침", "", false);
  elements.modalContent.innerHTML = `
    <ol>
      <li>손패에서 설계도 카드 한 장을 선택합니다.</li>
      <li>카드가 가리키는 전선에 나타난 파란 열 번호를 선택해 블럭을 배치합니다.</li>
      <li>R 키로 선택 블럭을 회전할 수 있으며, 한 판에 기본 ${GAME_BALANCE.stage.initialRotations}회만 사용할 수 있습니다.</li>
      <li>같은 재질 2×2는 다음 재질의 2×1 블럭으로 합성됩니다.</li>
      <li>적은 턴마다 성으로 전진하고, 블럭을 만나면 HP를 1 깎습니다.</li>
      <li>${GAME_BALANCE.stage.clearTurn}턴 종료까지 성 HP를 1 이상 유지하면 승리합니다.</li>
    </ol>
    <p>칸의 숫자는 블럭 HP, 붉은 원은 적, 시작칸의 +숫자는 대기 중인 적입니다.</p>`;
}

elements.rotate.addEventListener("click", rotateSelected);
elements.pass.addEventListener("click", () => {
  if (trackVisualRemovals(() => game.pass())) {
    selectedCard = null;
    previewAnchor = null;
    elements.instruction.textContent = "턴을 넘겼습니다.";
    render();
  }
});
$("#restart-button").addEventListener("click", freshGame);
$("#help-button").addEventListener("click", showHelp);
elements.introOverlay.addEventListener("click", advanceIntro);
elements.tutorialOverlay.addEventListener("click", advanceTutorial);
elements.modalClose.addEventListener("click", () => closeModal());
elements.modal.addEventListener("click", (event) => { if (event.target === elements.modal) closeModal(); });
document.addEventListener("click", handleGlobalClick, true);
document.addEventListener("keydown", (event) => {
  if (!elements.introOverlay.classList.contains("hidden") && (event.key === " " || event.key === "Enter")) {
    event.preventDefault();
    advanceIntro();
    return;
  }
  if (!elements.tutorialOverlay.classList.contains("hidden") && (event.key === " " || event.key === "Enter")) {
    event.preventDefault();
    advanceTutorial();
    return;
  }
  if (event.key.toLowerCase() === "r" && elements.modal.classList.contains("hidden")) rotateSelected();
  if (event.key === "Escape") closeModal();
});

applyArtTheme();
setupAudio();
freshGame();
