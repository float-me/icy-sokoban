import type { vector } from '$lib/map2d.svelte'
import { PriorityDeque } from 'priority-deque'

let action_id = 0

export class Action {
  id: number
  time: number
  position: vector
  direction: vector
  constructor (time: number, position: vector, direction: vector) {
    this.id = action_id
    action_id += 1
    this.time = time
    this.position = position
    this.direction = direction
  }
}

function compareAction (a: Action, b: Action) {
  if (a.time < b.time) {
    return -1
  } else if (a.time > b.time) {
    return 1
  } else {
    if (a.id < b.id) {
      return -1
    } else if (a.id > b.id) {
      return 1
    } else {
      return 0
    }
  }
}

export let actionQueue = new PriorityDeque<Action>({ compare: compareAction })
