<script lang="ts">
	import type { vector } from "$lib/map2d.svelte";
	import { T } from "@threlte/core";

	let { pos }: { pos: vector } = $props();
	let color = 0x0077ff;
</script>

<T.Mesh position={[pos[0], 0.51, pos[1]]} rotation={[-Math.PI / 2, 0, 0]}>
	<T.CircleGeometry args={[0.5, 32]} />
	<T.MeshStandardMaterial {color} />
</T.Mesh>
