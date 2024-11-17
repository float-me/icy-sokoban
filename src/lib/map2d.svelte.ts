export type vector = [number, number]
export function add_vector (a: vector, b: vector): vector {
  return [a[0] + b[0], a[1] + b[1]]
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
const v : Array<Box> = [];
export const boxes = $state(v)

export class Box {
  id: number
  position: vector
  direction: vector
  moving: boolean
  objType: number
  constructor (position: vector, objType: number) {
    this.id = boxId
    boxId += 1
    this.position = position
    this.direction = [0, 0]
    this.objType = objType // 0: Player, 1: Wooden box, 2: Icy box
    this.moving = false
    boxes.push(this)
  }
}
