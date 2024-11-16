<script lang="ts">
	import { PriorityDeque } from 'priority-deque';
	import { add_vector, Map2D } from '$lib/map2d.svelte';
	import type { vector } from '$lib/map2d.svelte';

	let lastFrameTime = 0;
	let frame = 0;

	let land = new Map2D([
		[1, 0, 0, 0],
		[0, 0, 0, 5],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 1, 0],
		[1, 0, 0, 0]
	]);

	let obj = new Map2D([
		[0, 0, 0, 0],
		[0, 3, 0, 0],
		[0, 0, 0, 2],
		[1, 2, 0, 0],
		[0, 3, 0, 0],
		[0, 0, 0, 0]
	]);

	let player_pos: vector = [0, 3];
	let player_moving = false;

	let button = [
		[0, 0, 0, 0],
		[0, 0, 1, 0],
		[0, 1, 1, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];

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
		if (player_moving) {
			return;
		}
		switch (event.key) {
			case 'ArrowUp':
				player_move([0, -1]);
				break;
			case 'ArrowDown':
				player_move([0, 1]);
				break;
			case 'ArrowLeft':
				player_move([-1, 0]);
				break;
			case 'ArrowRight':
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

	function add_move(before: vector, direction: vector) {
		let after = add_vector(before, direction);
		if (!is_valid(after)) {
			return false;
		}
		if (obj.get_at(after) !== 0) {
			return false;
		}
		rewrite(before, after, direction);
		return true;
	}

	function rewrite(before: vector, after: vector, direction: vector) {
		let objType = obj.get_at(before);
		obj.set_at(after, objType);
		obj.set_at(before, 0);
		queue.push(new Action(frame + 100, after, direction));
	}

	function player_move(direction: vector) {
		let before = player_pos;
		let after = add_vector(before, direction);
		if (!is_valid(after)) {
			return false;
		}
		if (obj.get_at(after) === 0) {
			rewrite(before, after, direction);
			player_moving = true;
			player_pos = after;
			return true;
		}
		let box_move = add_move(after, direction);
		if (box_move) {
			player_moving = add_move(before, direction);
			if (player_moving) {
				player_pos = after;
			}
			return player_moving;
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
				console.log(player_moving);
			}

			lastFrameTime = time;
		}
		requestAnimationFrame(gameLoop);
	}

	function calc(action: Action) {
		let isPlayer = false;
		if (obj.get_at(action.position) === 1) {
			isPlayer = true;
			player_pos = action.position;
		}
		let attempt = false;
		switch (land.get_at(action.position)) {
			case 2:
				attempt = add_move(action.position, action.direction);
				break;
			case 3:
				attempt = add_move(action.position, [1, 0]);
				break;
			case 4:
				attempt = add_move(action.position, [0, -1]);
				break;
			case 5:
				attempt = add_move(action.position, [-1, 0]);
				break;
			case 6:
				attempt = add_move(action.position, [0, 1]);
				break;
			default:
				if (obj.get_at(action.position) === 3) {
					attempt = add_move(action.position, action.direction);
				}
				break;
		}
		if (isPlayer && !attempt) {
			player_moving = false;
		}
	}

	// Start the game loop only on the client
	if (typeof window !== 'undefined') {
		requestAnimationFrame(gameLoop);
	}
</script>

<div class="grid auto-rows-[50px] grid-cols-4 gap-2 rounded-md bg-gray-200 p-4">
	{#each land.info as row, rowIndex}
		{#each row as land_type, colIndex}
			<div
				class="relative flex items-center justify-center rounded-md text-center font-bold text-black"
				class:bg-green-300={land_type === 0}
				class:bg-blue-300={land_type === 1}
				class:bg-yellow-300={land_type === 2}
				class:bg-gray-400={land_type === 3}
				class:bg-red-300={land_type === 4}
				class:bg-purple-300={land_type === 5}
				class:bg-pink-300={land_type === 6}
				class:bg-teal-300={land_type === 7}
			>
				<!-- Display object type if it's not 0 -->
				{#if obj.info[rowIndex][colIndex] !== 0}
					<span class="absolute inset-0 flex items-center justify-center font-bold text-white">
						{#if obj.info[rowIndex][colIndex] === 1}
							🧍 <!-- Player -->
						{:else if obj.info[rowIndex][colIndex] === 2}
							📦 <!-- Box -->
						{:else if obj.info[rowIndex][colIndex] === 3}
							❄️ <!-- Icy Box -->
						{/if}
					</span>
				{/if}
			</div>
		{/each}
	{/each}
</div>

<svelte:window onkeydown={handleKeyDown} />
