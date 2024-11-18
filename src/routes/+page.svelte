<script lang="ts">
	import { add_vector, Box, boxes, Map2D } from "$lib/map2d.svelte";
	import type { vector } from "$lib/map2d.svelte";

  import { Canvas, T} from "@threlte/core";
  import Floor from "../components/Floor.svelte";
  import Object from "../components/Object.svelte";
  import map from "../map.json";
	import { Action, actionQueue } from "$lib/action";

  let lastFrameTime = 0;
  let frame = 0;
  
  let land = new Map2D(map.land);

  function create2DArray(rows : number, cols : number, fillValue : number) {
    return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
  }

  let obj = new Map2D(create2DArray(land.height, land.width, -1));
  let player = new Box(map.player as vector, 0);
  map.boxes.forEach(([pos, type]) => new Box(pos as vector, type as number));
  for (const boxId in boxes) {
    const box = boxes[boxId];
    obj.set_at(box.position, box.id);
  }

  let action_id = 0;

	function handleKeyDown(event: KeyboardEvent) {
		if (player.moving) {
			return;
		}
		switch (event.key) {
			case "ArrowUp":
				add_move(player, [0, -1], true);
				break;
			case "ArrowDown":
				add_move(player, [0, 1], true);
				break;
			case "ArrowLeft":
				add_move(player, [-1, 0], true);
				break;
			case "ArrowRight":
				add_move(player, [1, 0], true);
				break;
			default:
				break;
		}
	}

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

	function add_move(box: Box, direction: vector, push: boolean = false) {
		let after = add_vector(box.position, direction);
		if (!is_valid(after)) {
			return false;
		}
		const boxId = obj.get_at(after);
		if (boxId !== -1) {
			if (!box.pushable || !push) {
				return false;
			}
			const afterBox = boxes[boxId];
			let box_move = add_move(afterBox, direction);
			if (box_move) {
				rewrite(box, after, direction);
				return true;
			}
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
		box.direction = direction;
		actionQueue.push(new Action(frame + 10, after, direction));
	}

	function gameLoop(time: number) {
		if (time - lastFrameTime > 16) {
			// roughly 60fps
			// Update game state
			frame++;
			while (frame === actionQueue.findMin()?.time) {
				let action = actionQueue.pop();
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
				add_move(box, [1, 0], true);
				break;
			case 4:
				add_move(box, [0, -1], true);
				break;
			case 5:
				add_move(box, [-1, 0], true);
				break;
			case 6:
				add_move(box, [0, 1], true);
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
  const hw = (land.width-1) / 2;
  const hh = (land.height-1) / 2;
</script>

<Canvas>
	<T.PerspectiveCamera
    makeDefault
    position={[hw, 10, land.height]}
    oncreate={(ref) => {
      ref.lookAt(hw, 0, hh);
    }}
  />
  <T.DirectionalLight position={[hw, 40, hh]} castShadow/>
	{#each land.info as row, rowIndex}
		{#each row as land_type, colIndex}
			<Floor row={rowIndex} col={colIndex} type={land_type} />
		{/each}
	{/each}
	{#each boxes as box}
		<Object
			row={box.position[1]}
			col={box.position[0]}
			type={box.objType}
			dir={box.direction}
			moving={box.moving}
		/>
	{/each}
</Canvas>

<svelte:window onkeydown={handleKeyDown} />
