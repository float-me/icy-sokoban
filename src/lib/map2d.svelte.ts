export type vector = [number, number]
export function add_vector (a: vector, b: vector): vector {
  return [a[0] + b[0], a[1] + b[1]]
}

enum rot {
  RIGHT = 0,
  UP,
  LEFT,
  DOWN
}

export class Map2D {
  info: number[][] = $state([[]])
  width: number
  height: number
  constructor (info: number[][]) {
    this.info = info
    this.width = info[0].length
    this.height = info.length
  }

  get_at (pos: vector) {
    return this.info[pos[1]][pos[0]]
  }

  set_at (pos: vector, value: number) {
    this.info[pos[1]][pos[0]] = value
  }
}

let boxId = 0
export const boxes = $state([] as Array<Box>)

export class Box {
  id: number
  position: vector
  direction: vector
  moving: boolean
  node: any
  pushable: boolean
  objType: number
  constructor (position: vector, objType: number) {
    this.id = boxId
    boxId += 1
    this.position = position
    this.direction = [0, 0]
    this.objType = objType // 0: Player, 1: Wooden box, 2: Icy box
    if (this.objType === 0) {
      this.pushable = true
    } else {
      this.pushable = false
    }
    this.moving = false
    boxes.push(this)
  }
}

class Block {
  position: vector
  rotation: rot
  moveableDir: rot[]
  weight: number
  durability: number
  constructor (
    position: vector,
    rotation: rot,
    moveableDir: rot[],
    weight: number, // power < weight면 밀리지 않음. power == weight면 한칸 밀림. power > weight면 끝까지 밀림. 얼음 상자: 1, 나무 상자: 2. 일반 power: 2.
    durability: number // power > durability면 블록이 파괴됨. 얼음 상자: 2.
  ) {
    this.position = position
    this.rotation = rotation
    this.moveableDir = moveableDir
    this.weight = weight
    this.durability = durability
  }
  can_move (direction: rot) {
    for (const dir of this.moveableDir) {
      if (direction === (this.rotation + dir) % 4) {
        return true
      }
    }
    return false
  }
}
