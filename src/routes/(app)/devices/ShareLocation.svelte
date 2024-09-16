<script>
    import {Button, Input, Modal, Spinner} from "flowbite-svelte";
    import {MapPinAltOutline} from "flowbite-svelte-icons";
    export let open = false
    export let data
    let sharingLocation;
    async function share() {
        await navigator.share({
            title: 'Location',
            url
        }).catch(() => {})
    }
    const getUrl = async () => {
        sharingLocation = true
        const expirationTime = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const response = await fetch('/api/devices/share', {
            method: 'POST',
            body: new URLSearchParams(`deviceId=${data.id}&expiration=${expirationTime}`),
        });
        if (response.ok) {
            const token = await response.text();
            url = `https://${import.meta.env.VITE_TRACCAR_WEB_SERVER}?token=${token}`
        } else {
            alert(await response.text());
        }
        sharingLocation=false
    }
    export let url
</script>

<div class="flex">
    <Button color="alternative" sixe="xs" on:click={getUrl} class="{url && 'hidden'}">
        <Spinner size="{4}" class="{sharingLocation || 'hidden'}"></Spinner>
        <MapPinAltOutline/>
        Location
    </Button>
    <span class="p-2 {url || 'hidden'}">
    <a target="_blank" href="{url}">
        {url ? 'Open' : ''}
    </a></span>
    <Button size='xs' class="{url || 'hidden'}" on:click={share}>Share</Button>
</div>
