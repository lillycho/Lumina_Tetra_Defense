import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DIRECTIONS, GameState, shapeCells } from "./core.js";
import { ART_ASSETS, blockAssetForState } from "./art-assets.js";

test("현재 사용하기로 한 아트 에셋 매니페스트가 실제 파일과 연결된다", () => {
  const required = [
    ART_ASSETS.background.stage,
    ART_ASSETS.castle.idle,
    ART_ASSETS.castle.hit,
    ART_ASSETS.enemies.fragment.idle,
    ART_ASSETS.enemies.fragment.move,
    ART_ASSETS.enemies.fragment.attack,
    ART_ASSETS.enemies.fragment.vanish,
    ART_ASSETS.tiles.field,
    ART_ASSETS.tiles.entrance,
    ART_ASSETS.tiles.spawn,
    ART_ASSETS.tiles.hoverValid,
    ART_ASSETS.tiles.hoverInvalid,
    ART_ASSETS.cards.blueprint,
    ART_ASSETS.cards.event,
    ...Object.values(ART_ASSETS.icons),
    ...Object.values(ART_ASSETS.blocks).flatMap((states) => Object.values(states))
  ];

  assert.equal(required.includes("assets/art/backgrounds/bg_stage_01_sunset.png"), false);
  assert.equal(required.includes("assets/art/backgrounds/bg_stage_02_workshop.png"), false);
  assert.equal(blockAssetForState({ material: "wood", hp: 1, maxHp: 3 }), ART_ASSETS.blocks.wood.critical);

  for (const assetPath of required) {
    assert.equal(existsSync(fileURLToPath(new URL(assetPath, import.meta.url))), true, assetPath);
  }
});

test("UI는 둥근모 폰트와 화면 맞춤 확대 레이아웃을 사용한다", () => {
  const css = readFileSync(fileURLToPath(new URL("./styles.css", import.meta.url)), "utf8");
  const html = readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");

  assert.equal(existsSync(fileURLToPath(new URL("./assets/fonts/DungGeunMo.ttf", import.meta.url))), true);
  assert.match(css, /@font-face[\s\S]*font-family:\s*"DungGeunMo"/);
  assert.match(css, /font-size:\s*150%/);
  assert.match(css, /\.topbar\s*\{[\s\S]*display:\s*none/);
  assert.match(css, /\.game-shell\s*\{[\s\S]*--ui-scale:/);
  assert.match(css, /\.forecast-panel\s*\{[\s\S]*width:\s*240px/);
  assert.match(css, /\.battlefield\s*\{[\s\S]*grid-column:\s*1\s*\/\s*-1/);
  assert.match(css, /line-height:\s*1\.65/);
  assert.match(css, /\.game-shell\s*\{[\s\S]*align-content:\s*center/);
  assert.match(css, /\.battlefield\s*\{[\s\S]*transform:\s*translateY\(-24px\)/);
  assert.match(css, /\.merge-panel\s*\{[\s\S]*justify-self:\s*center/);
  assert.match(css, /\.hand-panel\s*\{[\s\S]*justify-self:\s*center/);
  assert.match(css, /\.direction-icon\s*\{[\s\S]*width:\s*24px/);
  assert.match(html, /<h1>루미나 테트라 디펜스<\/h1>/);
});

test("설계도 카드 상단은 블럭 모양 아이콘과 전선 방향 텍스트 없이 방향 아이콘만 쓴다", () => {
  const gameJs = readFileSync(fileURLToPath(new URL("./game.js", import.meta.url)), "utf8");

  assert.equal(gameJs.includes("shapeIcon(card.shape)"), false);
  assert.equal(gameJs.includes("${DIRECTION_LABELS[card.direction]} 전선"), false);
  assert.match(gameJs, /class="direction-icon"/);
});

test("전선은 왼쪽과 오른쪽 두 방향만 사용한다", () => {
  assert.deepEqual(DIRECTIONS, ["left", "right"]);
  assert.deepEqual(Object.keys(new GameState(7).lanes), ["left", "right"]);
});

test("재질 확률 경계는 나무 90%, 돌 9%, 철 1%다", () => {
  const game = new GameState(8);
  game.rng = () => 0.8999;
  assert.equal(game.weightedMaterial(), "wood");
  game.rng = () => 0.9;
  assert.equal(game.weightedMaterial(), "stone");
  game.rng = () => 0.9899;
  assert.equal(game.weightedMaterial(), "stone");
  game.rng = () => 0.99;
  assert.equal(game.weightedMaterial(), "iron");
});

test("테트로미노 회전은 항상 4칸과 정규화된 좌표를 유지한다", () => {
  for (const shape of ["I", "T", "S", "Z", "J", "L"]) {
    for (let rotation = 0; rotation < 4; rotation += 1) {
      const cells = shapeCells(shape, rotation);
      assert.equal(cells.length, 4);
      assert.equal(Math.min(...cells.map(([x]) => x)), 0);
      assert.equal(Math.min(...cells.map(([, y]) => y)), 0);
      assert.equal(new Set(cells.map(([x, y]) => `${x}:${y}`)).size, 4);
    }
  }
});

test("빈 전선의 블럭은 적 방향 끝까지 배치된다", () => {
  const game = new GameState(1);
  const card = { shape: "I", material: "wood", direction: "left", rotation: 0 };
  const placement = game.getPlacement(card, 0);
  assert.deepEqual(placement.map(({ depth }) => depth), [9, 9, 9, 9]);
});

test("2x2 나무 합성은 바깥쪽 줄의 돌 2칸을 만든다", () => {
  const game = new GameState(2);
  const lane = game.lanes.left;
  for (const depth of [3, 4]) for (const col of [1, 2]) lane.blocks[depth][col] = { material: "wood", hp: 2, maxHp: 2 };
  const count = game.mergeLane("left");
  assert.equal(count, 1);
  assert.equal(game.mergeProgress, 1);
  const stones = lane.blocks.flat().filter((block) => block?.material === "stone");
  assert.equal(stones.length, 2);
});

test("적은 앞 블럭을 공격하고 파괴한 턴에는 전진하지 않는다", () => {
  const game = new GameState(3);
  game.preview[0] = [];
  const lane = game.lanes.left;
  lane.enemies.push({ col: 2, depth: 2 });
  lane.blocks[1][2] = { material: "wood", hp: 1, maxHp: 2 };
  game.moveEnemies();
  assert.equal(lane.blocks[1][2], null);
  assert.equal(lane.enemies[0].depth, 2);
});

test("20턴 행동을 마치고 성이 남아 있으면 승리한다", () => {
  const game = new GameState(4);
  game.turn = 20;
  game.castleHp = 99;
  game.preview[0] = [];
  Object.values(game.lanes).forEach((lane) => { lane.enemies = []; lane.queue.fill(0); });
  game.pass();
  assert.equal(game.status, "won");
});

test("같은 턴에 여러 적이 도달해도 성 HP는 음수가 되지 않는다", () => {
  const game = new GameState(6);
  game.castleHp = 1;
  game.lanes.left.enemies.push({ col: 0, depth: 0 }, { col: 1, depth: 0 });
  game.moveEnemies();
  assert.equal(game.castleHp, 0);
});

test("방향 대상 이벤트 카드는 사용 후 인벤토리에서 제거된다", () => {
  const game = new GameState(5);
  game.inventory.push({ id: "freezeLane", name: "전선 빙결", description: "", target: "direction" });
  const result = game.useEvent(0, "right");
  assert.equal(result.ok, true);
  assert.equal(game.lanes.right.frozen, 1);
  assert.equal(game.inventory.length, 0);
});
