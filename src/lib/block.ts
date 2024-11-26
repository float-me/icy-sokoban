import type { vector } from './map2d.svelte'

export class BlockMaterial {
  friction: boolean
  durability: number
  resistance: number
  bounce: boolean
  constructor (
    friction: boolean,
    durability: number,
    resistance: number,
    bounce: boolean
  ) {
    this.friction = friction
    this.durability = durability
    this.resistance = resistance
    this.bounce = bounce
  }
}

const wood = new BlockMaterial(true, 2, 2, false)
const ice = new BlockMaterial(false, 1, 2, false)
const jelly = new BlockMaterial(true, 2, 0, true)
const fire = new BlockMaterial(false, 2, 2, false)
const steel = new BlockMaterial(false, 2, 2, false)

const interaction = new Map<
  [BlockMaterial, BlockMaterial],
  [BlockMaterial | null, BlockMaterial | null]
>([
  [
    [wood, fire],
    [null, null]
  ],
  [
    [ice, fire],
    [null, null]
  ],
  [
    [jelly, fire],
    [steel, null]
  ],
  [
    [steel, fire],
    [steel, null]
  ]
])

export function find_interaction (
  mat1: BlockMaterial,
  mat2: BlockMaterial
): [BlockMaterial | null, BlockMaterial | null] {
  let result = interaction.get([mat1, mat2])
  if (result) {
    return result
  }
  result = interaction.get([mat2, mat1])
  if (result) {
    return [result[1], result[0]]
  }
  return [mat1, mat2]
}

enum blockScope {
  Inner,
  Outer,
  Both
}

export class BlockType {
  pushability: boolean
  material: BlockMaterial
  scope: blockScope
  weight: number
  constructor (
    pushability: boolean,
    material: BlockMaterial,
    scope: blockScope,
    weight: number
  ) {
    this.pushability = pushability
    this.material = material
    this.scope = scope
    this.weight = weight
  }
}

// push trial...
// 1. pushability: false -> reject
// 2. power > durability: break the block
// 3. power > weight: move call : to the end
// 4. power == weight: friction: true -> move call : to the end
//                     friction: false -> move call : one block
// 5. power < weight: reject

// move call...
// each box: has 'left power'
// for pushed one, left power = max(pushing power - resistance, 0)
// if not bounce...
// for pushing one, left power = max(left power - weight of pushed one, 0)
// if bounce...
// for pushing one,

export const woodenBox = new BlockType(true, wood, blockScope.Both, 1)
export const icyBox = new BlockType(true, ice, blockScope.Both, 1)

export class Block {
  blockType: BlockType
  power: number
  position: vector
  constructor (blockType: BlockType, position: vector) {
    this.blockType = blockType
    this.power = 0
    this.position = position
  }
}
