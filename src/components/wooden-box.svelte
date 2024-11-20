<script lang="ts">
	import { useGltf } from "@threlte/extras";
	import { T } from "@threlte/core";

	let { x, z, color } = $props();
</script>

{#await useGltf("/models/box.glb") then gltf}
	<T.Mesh
		position={[x, 0.9, z]}
		castShadow
		geometry={gltf.nodes["Cube"].geometry}
		scale={[0.4, 0.4, 0.4]}
		rotation={[-Math.PI / 2, 0, 0]}
	>
		<!-- <T.BoxGeometry args={[0.8, 0.8, 0.8]} /> -->
		<T.MeshStandardMaterial {color} />
	</T.Mesh>
{/await}
