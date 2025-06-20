<script>
    import maplibre from 'maplibre-gl'
    import 'maplibre-gl/dist/maplibre-gl.css';
    import {onMount} from "svelte";
    let map
    onMount(() => {
        map = new maplibre.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9 // starting zoom
        });
    })
</script>

<div id='map' style='width: 100%; height: 100%;'></div>
