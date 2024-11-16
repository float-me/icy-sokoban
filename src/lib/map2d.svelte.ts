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
