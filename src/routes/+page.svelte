<script lang="ts">
  import { PriorityDeque } from "priority-deque";
  import { add_vector, Box, boxes, Map2D } from "$lib/map2d.svelte";
  import type { vector } from "$lib/map2d.svelte";

  import { Canvas, T} from "@threlte/core";
  import Floor from "../components/Floor.svelte";
  import Object from "../components/Object.svelte";

  let lastFrameTime = 0;
  let frame = 0;

  let land = new Map2D([
    [1, 0, 0, 0],
    [0, 0, 0, 5],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [1, 0, 0, 0],
  ]);

  let obj = new Map2D([
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
  ]);
  let player = new Box([0, 3], 0);
  new Box([1, 3], 1);
  new Box([3, 2], 1);
  new Box([1, 1], 2);
  new Box([1, 4], 2);
  for (const boxId in boxes) {
    const box = boxes[boxId];
    obj.set_at(box.position, box.id);
  }

  let action_id = 0;

  class Action {
    id: number;
    time: number;
    position: vector;
    direction: vector;
    constructor(time: number, position: vector, direction: vector) {
      this.id = action_id;
      action_id += 1;
      this.time = time;
      this.position = position;
      this.direction = direction;
    }
  }

  function compareAction(a: Action, b: Action) {
    if (a.time < b.time) {
      return -1;
    } else if (a.time > b.time) {
      return 1;
    } else {
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (player.moving) {
      return;
    }
    switch (event.key) {
      case "ArrowUp":
        player_move([0, -1]);
        break;
      case "ArrowDown":
        player_move([0, 1]);
        break;
      case "ArrowLeft":
        player_move([-1, 0]);
        break;
      case "ArrowRight":
        player_move([1, 0]);
        break;
      default:
        break;
    }
  }

  let queue = new PriorityDeque<Action>({ compare: compareAction });

  function is_valid(pos: vector) {
    if (pos[0] < 0 || pos[0] >= land.width) {
      return false;
    }
    if (pos[1] < 0 || pos[1] >= land.height) {
      return false;
    }
    if (land.get_at(pos) === 1) {
      return false;
    }
    return true;
  }

  function add_move(box: Box, direction: vector) {
    let after = add_vector(box.position, direction);
    if (!is_valid(after)) {
      return false;
    }
    if (obj.get_at(after) !== -1) {
      return false;
    }
    rewrite(box, after, direction);
    return true;
  }

  function rewrite(box: Box, after: vector, direction: vector) {
    box.moving = true;
    obj.set_at(after, box.id);
    obj.set_at(box.position, -1);
    box.position = after;
    queue.push(new Action(frame + 10, after, direction));
  }

  function player_move(direction: vector) {
    let before = player.position;
    let after = add_vector(before, direction);
    if (!is_valid(after)) {
      return false;
    }
    const boxId = obj.get_at(after);
    if (boxId === -1) {
      rewrite(player, after, direction);
      return true;
    }
    const box = boxes[boxId];
    let box_move = add_move(box, direction);
    if (box_move) {
      return add_move(player, direction);
    }
    return false;
  }

  function gameLoop(time: number) {
    if (time - lastFrameTime > 16) {
      // roughly 60fps
      // Update game state
      frame++;
      while (frame === queue.findMin()?.time) {
        let action = queue.pop();
        if (action) {
          calc(action);
        }
      }

      lastFrameTime = time;
    }
    requestAnimationFrame(gameLoop);
  }

  function calc(action: Action) {
    const boxId = obj.get_at(action.position);
    const box = boxes[boxId];
    box.position = action.position;
    box.moving = false;
    switch (land.get_at(action.position)) {
      case 2:
        add_move(box, action.direction);
        break;
      case 3:
        add_move(box, [1, 0]);
        break;
      case 4:
        add_move(box, [0, -1]);
        break;
      case 5:
        add_move(box, [-1, 0]);
        break;
      case 6:
        add_move(box, [0, 1]);
        break;
      default:
        if (box.objType === 2) {
          // Icy Box
          add_move(box, action.direction);
        }
        break;
    }
  }

  // Start the game loop only on the client
  if (typeof window !== "undefined") {
    requestAnimationFrame(gameLoop);
  }

  $inspect(obj.info);
</script>

<Canvas>
	<T.PerspectiveCamera
    makeDefault
    position={[(land.width-1) / 2, 10, land.height+3]}
    oncreate={(ref) => {
      ref.lookAt((land.width-1) / 2, 0, (land.height-1)/2);
    }}
  />
  <T.DirectionalLight position={[0, 40, 20]} castShadow/>
  {#each land.info as row, rowIndex}
	  {#each row as land_type, colIndex}
		<Floor row={rowIndex} col={colIndex} type={land_type}/>
	  {/each}
  {/each}
  {#each obj.info as row, rowIndex}
	  {#each row as boxId, colIndex}
	  	{#if boxId !== -1}
			<Object row={rowIndex} col={colIndex} type={boxes[boxId].objType}/>
		{/if}
	  {/each}
  {/each}
</Canvas>

<svelte:window onkeydown={handleKeyDown} />
