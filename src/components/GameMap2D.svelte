<script lang="ts">
    import { Map2D, boxes, type vector } from "$lib/map2d.svelte";
    import {check, x} from "../svgdata.json";
    let {land, buttons}:{land : Map2D, buttons : vector[]}= $props()

    function compvec(v1:vector, v2:vector) {
        return v1[0]===v2[0] && v1[1]===v2[1]
    }

    //find buttons that are not on any land
    let buttons_checked = $derived(
        buttons.map((vec) => ({vec : vec, chk : boxes.findIndex((bx) => bx.objType !== 0 && compvec(bx.position, vec)) >= 0}))
    )

    const contains = (li: vector[], vec : vector) => {
        return li.findIndex((v) => v[0]===vec[0]&&v[1]===vec[1]) >= 0
    }

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
				return "rgb(150, 150, 150)";
			case 1:
				return "#f5d184";
			case 2:
				return "#80ffff";
			default:
				return "hotpink";
		}
	};

    const getsvgcolor = (chk:boolean) => chk?"#99ff66":"#ff0000";
</script>

<div
style:display = "grid"
style:grid-template-columns = {`repeat(${land?.width}, 1fr)`}
style:grid-template-rows = {`repeat(${land?.height}, 1fr)`}
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
class={`box ${box.objType === 0 ?"player":""}`}
style:grid-column={`${box.position[0]+1}/${box.position[0]+2}`}
style:grid-row={box.position[1]+1}
style:background-color={getboxcolor(box.objType)}
>
</div>
{/each}
{#each buttons_checked as {vec, chk}}
<svg
style:grid-column={`${vec[0]+1}/${vec[0]+2}`}
style:grid-row={vec[1]+1}
viewBox={chk ? check.viewBox : x.viewBox}
class="button"
fill={getsvgcolor(chk)}
>
<path d={chk ? check.path : x.path}
stroke={getsvgcolor(chk)}
stroke-width=8%/>
</svg>
{/each}
</div>

<style>
    .maingrid{
		position:fixed;
        width: 10%;
        max-width: 10%;
        left: 0;
        top: 0;
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
        border-width: 3px;
        border-color: rgba(0, 0, 0, 0.4);
        box-sizing: border-box;
        border-radius: 3px;
    }
    .player {
        border-radius: 50%;
    }
    .button {
        justify-self: center;
        align-self: center;
        object-fit: contain;
        width: 70%;
        height: 70%;
    }
</style>