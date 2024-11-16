<script lang="ts">
    import {T} from "@threlte/core";
  import { RGBA_ASTC_10x10_Format } from "three";
    let {row, col, type} = $props();

    const getcolor = (tp : number) => {
        switch(tp){
            case 0:
                return "rgb(112, 219, 112)";
            case 1:
                return "#f5d184";
            case 2:
                return "#80ffff"
            default:
                return "hotpink";
        }
    }

    let color = $derived(getcolor(type));

</script>

{#if type === 0}
<T.Mesh position={[col,0.9, row]} castShadow>
    <T.SphereGeometry args={[ 0.4, 32, 16 ]}/>
    <T.MeshStandardMaterial color="rgb(0,0,0)" roughness={0.5}/>
</T.Mesh>

{:else}
<T.Mesh position={[col,0.9, row]} castShadow>
    <T.BoxGeometry args={[0.8, 0.8, 0.8]}/>
    <T.MeshStandardMaterial color={color}/>
</T.Mesh>
{/if}