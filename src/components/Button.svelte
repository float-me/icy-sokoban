<script lang="ts">
	import type { vector } from "$lib/map2d.svelte";
	import { T } from "@threlte/core";

	let { pos }: { pos: vector } = $props();
</script>

<T.Mesh position={[pos[0], 0.51, pos[1]]} rotation={[-Math.PI / 2, 0, 0]}>
	<T.CircleGeometry args={[0.35, 32]} />
	<T.MeshStandardMaterial color={"#4B4376"} />
</T.Mesh>

<T.Mesh position={[pos[0], 0.52, pos[1]]} rotation={[-Math.PI / 2, 0, 0]}>
	<T.CircleGeometry args={[0.2, 32]} />
	<T.MeshStandardMaterial color={"#AE445A"} />
</T.Mesh>
