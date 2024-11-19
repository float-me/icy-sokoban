import { PriorityDeque } from 'priority-deque'

let animTime = new Map<string, number>([
  ['slow-start', 10],
  ['normal-start', 10]
])

export function get_anim_time (name: string) {
  let maybeTime = animTime.get(name)
  if (maybeTime) {
    return maybeTime
  }
  return 10
}

export class Anim {
  name: string
  count: number
  maxCount: number
  data: any
  constructor (name: string, data: any) {
    this.name = name

    this.maxCount = get_anim_time(name)

    this.count = this.maxCount
    this.data = data
  }

  get ratio (): number {
    return 1 - this.count / this.maxCount
  }
}

function compareAnim (a: Anim, b: Anim) {
  if (a.count < b.count) {
    return -1
  } else if (a.count > b.count) {
    return 1
  } else {
    return 0
  }
}

export class AnimGroup {
  anims: PriorityDeque<Anim>
  constructor () {
    this.anims = new PriorityDeque<Anim>({ compare: compareAnim })
  }
  add_anim (anim: Anim) {
    this.anims.push(anim)
  }
  update () {
    this.anims.forEach(anim => {
      anim.count -= 1
    })
    while (true) {
      let first = this.anims.findMin()
      if (first) {
        if (first.count >= 0) {
          break
        }
      } else {
        break
      }
      this.anims.pop()
    }
  }
}
