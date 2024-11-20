<script lang="ts">
    import { Box, Map2D, boxes } from "$lib/map2d.svelte";
    let {land}:{land? : Map2D}= $props()

    const getlandcolor = (tp: number) => {
		switch (tp) {
			case 0:
				return "rgb(112, 219, 112)";
			case 1:
				return "rgb(204, 153, 102)";
			default:
				return "hotpink";
		}
	};
	const getboxcolor = (tp: number) => {
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
</script>

<div
style:display = "grid"
style:grid-template-column = {`repeat(${land?.width}, 1fr)`}
style:grid-template-row = {`repeat(${land?.height}, 1fr)`}
class="maingrid"
>
{#if land !== undefined}
    {#each land.info as row, rowIndex}
        {#each row as land_type, colIndex}
            <div 
            class="land"
            style:grid-column={`${colIndex+1}/${colIndex+2}`}
            style:grid-row={rowIndex+1}
            style:background-color={getlandcolor(land_type)}
            ></div>
        {/each}
    {/each}
{/if}
{#each boxes as box}
<div 
class="box"
style:grid-column={`${box.position[0]+1}/${box.position[0]+2}`}
style:grid-row={box.position[1]+1}
style:background-color={getboxcolor(box.objType)}
></div>
{/each}

</div>

<style>
    .maingrid{
		position:fixed;
        width: var(--width, 10%);
        height: var(--height, 30%);
        left: var(--left, 0);
        top: var(--top, 0);
    }
    .land {
        aspect-ratio: 1/1;
        width:100%;
        height:100%;
    }
    .box {
        aspect-ratio: 1/1;
        width: 80%;
        height: 80%;
  justify-self: center;
  align-self: center;
    }
</style>