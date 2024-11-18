<script lang="ts">
	import { T, useTask } from "@threlte/core";
	let { row, col, type, dir, moving } = $props();

	const maxCount = 10;

	let count = $state(0);
	useTask((delta) => {
		if (count < maxCount) {
			count += 1;
		}
	});

	const slow_start = (p: number) => p * p * (2 - p);
	let ratio = $derived(
		moving === 2 ? count / maxCount : slow_start(count / maxCount)
	);

	let x = $derived(col - dir[0] * (1 - ratio));
	let z = $derived(row - dir[1] * (1 - ratio));

	$effect(() => {
		count = (row + col) * 0;
		if (moving === 0) {
			count = maxCount;
		}
	}); //evaluates whenever moving changes; activates only when the object is moving

	const getcolor = (tp: number) => {
		switch (tp) {
			case 0:
				return "rgb(112, 219, 112)";
			case 1:
				return "#f5d184";
			case 2:
				return "#80ffff";
			default:
				return "hotpink";
		}
	};

	let color = $derived(getcolor(type));
</script>

{#if type === 0}
	<T.Mesh position={[x, 0.9, z]} castShadow>
		<T.SphereGeometry args={[0.4, 32, 16]} />
		<T.MeshStandardMaterial color="rgb(0,0,0)" roughness={0.5} />
	</T.Mesh>
{:else}
	<T.Mesh position={[x, 0.9, z]} castShadow>
		<T.BoxGeometry args={[0.8, 0.8, 0.8]} />
		<T.MeshStandardMaterial {color} />
	</T.Mesh>
{/if}
