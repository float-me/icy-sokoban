<script lang="ts">
	import { add_vector, type Box, type vector } from "$lib/map2d.svelte";
	import { T, useTask } from "@threlte/core";
	let { box }: { box: Box } = $props();
	import { Anim, AnimGroup } from "$lib/animation";
	import { vertexShader, fragmentShader } from "../materials/shinyshader";
	import WoodenBox from "./wooden-box.svelte";

	let animGroup = new AnimGroup();

	let moveRatio = $state(1);

	let shinePos = $state(-2);

	let failMoveDisp = $state([0, 0]);

	// x, z only updates when moveRatio changes; Therefore, they do not change when the position of the box changed but the animation didn't start.
	let x = $derived(
		box.position[0] - box.direction[0] * (1 - moveRatio) + failMoveDisp[0]
	);
	let z = $derived(
		box.position[1] - box.direction[1] * (1 - moveRatio) + failMoveDisp[1]
	);

	useTask((delta) => {
		animGroup.update();
		failMoveDisp = [0, 0];
		for (const anim of animGroup.anims) {
			switch (anim.name) {
				case "slow-start":
					const slow_start = (p: number) => p * p * (2 - p);
					moveRatio = slow_start(anim.ratio);
					break;
				case "normal-start":
					moveRatio = anim.ratio;
					break;
				case "fail-move":
					const length =
						anim.ratio * anim.ratio * (1 - anim.ratio) * 0.8;
					failMoveDisp = [
						anim.data[0] * length,
						anim.data[1] * length,
					];
					break;
				case "shine":
					shinePos = anim.ratio * 4 - 2;
					break;
				default:
					break;
			}
		}
	});

	export function add_anim(name: string, data: any) {
		animGroup.add_anim(new Anim(name, data));
	}

	export function get_anim() {
		return animGroup;
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
{:else if box.objType === 2}
	<T.Mesh position={[x, 0.9, z]} castShadow>
		<T.BoxGeometry args={[0.8, 0.8, 0.8]} />
		<T.ShaderMaterial
			{vertexShader}
			{fragmentShader}
			uniforms={{
				color: { value: [0.3, 0.7, 0.7] },
				time: { value: -3 },
			}}
			uniforms.time.value={shinePos}
		/>
	</T.Mesh>
{:else if box.objType === 1}
	<WoodenBox {x} {z} {color} />
{/if}
