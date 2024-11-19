<script lang="ts">
	import type { Box } from "$lib/map2d.svelte";
	import { T, useTask } from "@threlte/core";
	let { box }: { box: Box } = $props();
	import { Anim, AnimGroup } from "$lib/animation";

	let animGroup = new AnimGroup();

	let moveRatio = $state(1);
	// x, z only updates when moveRatio changes; Therefore, they do not change when the position of the box changed but the animation didn't start.
	let x = $derived(box.position[0] - box.direction[0] * (1 - moveRatio));
	let z = $derived(box.position[1] - box.direction[1] * (1 - moveRatio));

	useTask((delta) => {
		animGroup.update();
		for (const anim of animGroup.anims) {
			switch (anim.name) {
				case "slow-start":
					const slow_start = (p: number) => p * p * (2 - p);
					moveRatio = slow_start(anim.ratio);
					break;
				case "normal-start":
					moveRatio = anim.ratio;
					break;
				default:
					break;
			}
		}
	});

	export function add_anim(name: string, data: any) {
		animGroup.add_anim(new Anim(name, data));
	}

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

	let color = $derived(getcolor(box.objType));
</script>

{#if box.objType === 0}
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
