<script lang="ts">
	import { T, useTask } from "@threlte/core";
	let { row, col, type } = $props();

	const getcolor = (tp: number) => {
		switch (tp) {
			case 0:
				return "rgb(112, 219, 112)";
			case 1:
				return "rgb(204, 153, 102)";
			default:
				return "hotpink";
		}
	};

	let color = $derived(getcolor(type));
</script>

<T.Mesh position={[col, 0, row]} receiveShadow>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial {color} />
</T.Mesh>

{#if type === 1}
	<T.Mesh position={[col + 0.1, 0.8, row]} castShadow>
		<T.BoxGeometry args={[0.8, 0.3, 0.8]} />
		<T.MeshStandardMaterial color="#b3b3b3" />
	</T.Mesh>
{/if}

{#if type >= 3 && type <= 6}
	<T.Mesh position={[col, 0.5, row]}>
		<T.CylinderGeometry
			args={[0.5, 0.5, 0.2, 3, 1, false, (3.142 * (type - 2)) / 2]}
		/>
		<T.MeshStandardMaterial color="#ffaa00" />
	</T.Mesh>
{/if}
