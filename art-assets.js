export const ART_ASSETS = {
  background: {
    stage: "assets/art/backgrounds/bg_stage_stardust.png"
  },
  tiles: {
    field: "assets/art/tiles/tile_field.png",
    entrance: "assets/art/tiles/tile_entrance.png",
    spawn: "assets/art/tiles/tile_spawn.png",
    hoverValid: "assets/art/tiles/tile_hover_valid.png",
    hoverInvalid: "assets/art/tiles/tile_hover_invalid.png"
  },
  blocks: {
    wood: {
      full: "assets/art/blocks/block_wood_full.png",
      damaged: "assets/art/blocks/block_wood_damaged.png",
      critical: "assets/art/blocks/block_wood_critical.png"
    },
    stone: {
      full: "assets/art/blocks/block_stone_full.png",
      damaged: "assets/art/blocks/block_stone_damaged.png",
      critical: "assets/art/blocks/block_stone_critical.png"
    },
    iron: {
      full: "assets/art/blocks/block_iron_full.png",
      damaged: "assets/art/blocks/block_iron_damaged.png",
      critical: "assets/art/blocks/block_iron_critical.png"
    }
  },
  castle: {
    idle: "assets/art/castle/castle_lumina_idle.png",
    hit: "assets/art/castle/castle_lumina_hit.png"
  },
  enemies: {
    fragment: {
      idle: "assets/art/enemies/enemy_fragment_idle_sheet.png",
      move: "assets/art/enemies/enemy_fragment_move_sheet.png",
      attack: "assets/art/enemies/enemy_fragment_attack_sheet.png",
      vanish: "assets/art/enemies/enemy_fragment_vanish_sheet.png"
    }
  },
  cards: {
    blueprint: "assets/art/ui/cards/card_blueprint.png",
    event: "assets/art/ui/cards/card_event_parchment.png"
  },
  icons: {
    directionLeft: "assets/art/ui/icons/icon_direction_left.png",
    directionRight: "assets/art/ui/icons/icon_direction_right.png",
    heartFull: "assets/art/ui/icons/icon_heart_full.png",
    heartEmpty: "assets/art/ui/icons/icon_heart_empty.png",
    hp: "assets/art/ui/icons/icon_hp.png",
    mergeChargeOn: "assets/art/ui/icons/icon_merge_charge_on.png",
    mergeChargeOff: "assets/art/ui/icons/icon_merge_charge_off.png",
    rotation: "assets/art/ui/icons/icon_rotation.png",
    shapeI: "assets/art/ui/icons/icon_shape_i.png",
    shapeJ: "assets/art/ui/icons/icon_shape_j.png",
    shapeL: "assets/art/ui/icons/icon_shape_l.png",
    shapeS: "assets/art/ui/icons/icon_shape_s.png",
    shapeT: "assets/art/ui/icons/icon_shape_t.png",
    shapeZ: "assets/art/ui/icons/icon_shape_z.png"
  }
};

export function blockAssetForState(block) {
  const states = ART_ASSETS.blocks[block.material];
  if (!states) return "";
  const ratio = block.hp / block.maxHp;
  if (ratio <= 0.34) return states.critical;
  if (ratio < 1) return states.damaged;
  return states.full;
}

export function directionIcon(direction) {
  return direction === "left" ? ART_ASSETS.icons.directionLeft : ART_ASSETS.icons.directionRight;
}

export function shapeIcon(shape) {
  return ART_ASSETS.icons[`shape${shape}`] ?? "";
}
