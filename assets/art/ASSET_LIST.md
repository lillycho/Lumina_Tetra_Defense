# 루미나 테트라 디펜스 아트 에셋 제작 목록

## 공통 제작 규칙

- 파일 형식: 투명 배경이 필요한 에셋은 `PNG`, 배경은 `PNG` 권장
- 색상: `sRGB`, 인덱스 컬러 또는 제한 팔레트 권장
- 확대 방식: 원본 도트 이미지를 게임에서 `2x`, `3x`, `4x` 정수 배율로 확대
- 리사이즈 필터: `nearest-neighbor`, 안티앨리어싱 사용 금지
- 기준 타일: `24x24px`
- 외곽선: 캐릭터와 적은 1px 진한 남색 외곽선 권장
- 파일명: 영문 소문자 `snake_case`
- 스프라이트 시트: 프레임을 왼쪽에서 오른쪽 순서로 배치하고 프레임 사이 여백을 두지 않음

## 1. 전장 타일 `tiles/`

| 파일명 | 원본 크기 | 내용 |
| --- | ---: | --- |
| `tile_field.png` | 24x24 | 일반 배치 칸 |
| `tile_entrance.png` | 24x24 | 성과 가까운 민트색 입구 칸 |
| `tile_spawn.png` | 24x24 | 적 시작칸 |
| `tile_hover_valid.png` | 24x24 | 배치 가능 칸 오버레이, 반투명 |
| `tile_hover_invalid.png` | 24x24 | 배치 불가 칸 오버레이, 반투명 |
| `tile_grid_corner.png` | 24x24 | 전선 모서리 장식, 선택 사항 |

타일은 서로 붙였을 때 이음새가 자연스럽게 반복되어야 한다.

## 2. 방어 블럭 `blocks/`

각 블럭은 `24x24px` 단일 타일이다. 손상 상태는 HP 비율 표현에 사용한다.

| 파일명 | 크기 |
| --- | ---: |
| `block_wood_full.png` | 24x24 |
| `block_wood_damaged.png` | 24x24 |
| `block_wood_critical.png` | 24x24 |
| `block_stone_full.png` | 24x24 |
| `block_stone_damaged.png` | 24x24 |
| `block_stone_critical.png` | 24x24 |
| `block_iron_full.png` | 24x24 |
| `block_iron_damaged.png` | 24x24 |
| `block_iron_critical.png` | 24x24 |

재질 기준:

- 나무: 황갈색, 크림색 결, 작은 못
- 돌: 청회색, 연보라 그림자, 금이 간 표현
- 철: 짙은 남청색, 은색 모서리 하이라이트, 작은 별 반짝임

## 3. 중앙 성 `castle/`

| 파일명 | 원본 크기 | 내용 |
| --- | ---: | --- |
| `castle_lumina_idle.png` | 96x96 | 기본 공방성 |
| `castle_lumina_hit.png` | 96x96 | 피격 순간 |
| `castle_lumina_damaged.png` | 96x96 | HP 1 상태 |
| `castle_lumina_destroyed.png` | 96x96 | 패배 상태 |
| `castle_lumina_glow_sheet.png` | 384x96 | 96x96, 4프레임 마력로 빛 애니메이션 |

성은 작은 탑, 따뜻한 창문, 공방 굴뚝 또는 리본 깃발로 실루엣을 단순하게 유지한다.

## 4. 적 `enemies/`

### 기본 적: 틈새 조각

| 파일명 | 원본 크기 | 프레임 |
| --- | ---: | ---: |
| `enemy_fragment_idle_sheet.png` | 96x24 | 24x24, 4프레임 |
| `enemy_fragment_move_sheet.png` | 96x24 | 24x24, 4프레임 |
| `enemy_fragment_attack_sheet.png` | 72x24 | 24x24, 3프레임 |
| `enemy_fragment_vanish_sheet.png` | 96x24 | 24x24, 4프레임 |

### 빠른 적: 폴짝 조각

| 파일명 | 원본 크기 | 프레임 |
| --- | ---: | ---: |
| `enemy_hopper_idle_sheet.png` | 96x24 | 24x24, 4프레임 |
| `enemy_hopper_move_sheet.png` | 144x24 | 24x24, 6프레임 |
| `enemy_hopper_attack_sheet.png` | 72x24 | 24x24, 3프레임 |
| `enemy_hopper_vanish_sheet.png` | 96x24 | 24x24, 4프레임 |

적은 둥근 네모 실루엣, 1~2개의 큰 눈, 짧은 팔다리로 무섭기보다 말랑하고 귀엽게 표현한다.

## 5. 캐릭터 초상 `characters/portraits/`

초상은 `128x128px` 정사각형 투명 PNG로 제작한다. 캐릭터는 2~3등신 느낌의 큰 머리와 단순한 표정을 사용한다.

### 리나

- `portrait_rina_default.png`
- `portrait_rina_smile.png`
- `portrait_rina_focus.png`
- `portrait_rina_surprised.png`
- `portrait_rina_victory.png`
- `portrait_rina_sad.png`

### 모모

- `portrait_momo_default.png`
- `portrait_momo_explain.png`
- `portrait_momo_surprised.png`
- `portrait_momo_proud.png`
- `portrait_momo_sad.png`

### 세라

- `portrait_sera_default.png`
- `portrait_sera_focus.png`
- `portrait_sera_warning.png`
- `portrait_sera_smile.png`

## 6. 캐릭터 미니 스프라이트 `characters/sprites/`

초기 웹 게임에는 선택 사항이다. 필요하면 각 프레임 `32x48px`로 제작한다.

- `sprite_rina_idle_sheet.png`: 128x48, 4프레임
- `sprite_rina_cheer_sheet.png`: 192x48, 6프레임
- `sprite_momo_float_sheet.png`: 128x48, 4프레임
- `sprite_sera_idle_sheet.png`: 128x48, 4프레임

## 7. 카드 `ui/cards/`

카드 원본 기준은 `96x128px`이다. 게임에서는 약 1.5~2배로 확대한다. 텍스트는 이미지에 넣지 않고 웹 UI에서 표시한다.

| 파일명 | 크기 | 내용 |
| --- | ---: | --- |
| `card_blueprint_wood.png` | 96x128 | 나무 설계도 카드 프레임 |
| `card_blueprint_stone.png` | 96x128 | 돌 설계도 카드 프레임 |
| `card_blueprint_iron.png` | 96x128 | 철 설계도 카드 프레임 |
| `card_event_parchment.png` | 96x128 | 이벤트 카드 프레임 |
| `card_selected_glow.png` | 104x136 | 선택 카드 외곽 광택, 투명 PNG |
| `card_back.png` | 96x128 | 카드 뒷면 |

## 8. UI 아이콘 `ui/icons/`

기본 아이콘은 `24x24px`, 작은 상태 아이콘은 `16x16px`로 제작한다.

### 블럭 모양

- `icon_shape_i.png` 24x24
- `icon_shape_t.png` 24x24
- `icon_shape_s.png` 24x24
- `icon_shape_z.png` 24x24
- `icon_shape_j.png` 24x24
- `icon_shape_l.png` 24x24

### HUD

- `icon_direction_left.png` 16x16
- `icon_direction_right.png` 16x16
- `icon_heart_full.png` 16x16
- `icon_heart_empty.png` 16x16
- `icon_rotation.png` 16x16
- `icon_enemy_spawn.png` 16x16
- `icon_merge_charge_on.png` 16x16
- `icon_merge_charge_off.png` 16x16
- `icon_hp.png` 16x16

### 이벤트 카드 계열

- `icon_event_rotation.png` 24x24
- `icon_event_castle_repair.png` 24x24
- `icon_event_redraw.png` 24x24
- `icon_event_card_upgrade.png` 24x24
- `icon_event_time_stop.png` 24x24
- `icon_event_lane_freeze.png` 24x24
- `icon_event_push.png` 24x24
- `icon_event_block_repair.png` 24x24
- `icon_event_block_drop.png` 24x24
- `icon_event_merge.png` 24x24
- `icon_event_enemy_remove.png` 24x24
- `icon_event_queue_burn.png` 24x24

20개 카드가 위 계열 아이콘을 공유해도 된다. 1차 제작에서는 이벤트마다 고유 아이콘을 만들 필요가 없다.

## 9. 전투 이펙트 `effects/`

| 파일명 | 원본 크기 | 프레임 |
| --- | ---: | ---: |
| `fx_place_dust_sheet.png` | 96x24 | 24x24, 4프레임 |
| `fx_hit_wood_sheet.png` | 96x24 | 24x24, 4프레임 |
| `fx_hit_stone_sheet.png` | 96x24 | 24x24, 4프레임 |
| `fx_hit_iron_sheet.png` | 96x24 | 24x24, 4프레임 |
| `fx_block_break_sheet.png` | 144x24 | 24x24, 6프레임 |
| `fx_merge_circle_sheet.png` | 192x48 | 48x48, 4프레임 |
| `fx_merge_burst_sheet.png` | 288x48 | 48x48, 6프레임 |
| `fx_castle_hit_sheet.png` | 192x48 | 48x48, 4프레임 |
| `fx_heal_sheet.png` | 192x48 | 48x48, 4프레임 |
| `fx_time_stop_sheet.png` | 256x64 | 64x64, 4프레임 |
| `fx_lane_freeze_tile.png` | 24x24 | 얼음 오버레이 |
| `fx_victory_sparkle_sheet.png` | 192x32 | 32x32, 6프레임 |

## 10. 배경 `backgrounds/`

배경 원본은 `480x320px`로 제작하고 게임에서 3배 확대해 1440x960 영역에 사용한다. UI 안전 영역에는 강한 명암이나 복잡한 소품을 피한다.

- `bg_stage_01_sunset.png`: 해질녘 공방성 외곽, 상자와 연습 표지판
- `bg_stage_02_workshop.png`: 불이 켜진 공방성과 좌우 균열
- `bg_stage_03_stardust.png`: 밤하늘 성운 조각과 별가루
- `bg_intro_narration.png`: 나레이션 직전 상황 설명 컷, 루미나 공방성·좌우 균열·별가루·멀리 기사단 등불
- `bg_title.png`: 타이틀용 공방성 실루엣
- `overlay_crack_left.png`: 96x320, 왼쪽 균열 투명 오버레이
- `overlay_crack_right.png`: 96x320, 오른쪽 균열 투명 오버레이
- `overlay_stardust.png`: 480x320, 별가루 투명 오버레이

## 11. 성공·실패 이미지 `endings/`

- `ending_success.png`: 480x320
- `ending_failure.png`: 480x320
- `result_frame_success.png`: 320x180, 투명 PNG
- `result_frame_failure.png`: 320x180, 투명 PNG

성공 이미지는 리나·모모·세라와 좌우 방벽, 네모난 별가루를 포함한다. 실패 이미지는 무너진 방벽과 수리 도면을 준비하는 세라를 보여주되 전체 분위기를 지나치게 어둡게 만들지 않는다.

## 우선 제작 순서

1. `tiles/` 전장 타일 5종
2. `blocks/` 재질별 기본·손상 타일 9종
3. `castle/` 기본·피격·파손 상태
4. `enemies/` 기본 적 이동·공격·소멸
5. `ui/cards/` 설계도 카드와 이벤트 카드 프레임
6. `ui/icons/` 블럭 모양, 방향, 하트, 합성 게이지
7. `effects/` 배치·피격·파괴·합성 이펙트
8. `characters/portraits/` 캐릭터별 기본 초상과 표정
9. `backgrounds/` 스테이지 배경
10. `endings/` 성공·실패 이미지
