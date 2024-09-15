<script>
    import { error, clearError, alert, clearAlert } from '$lib/store';
    import { onMount } from 'svelte';
    import {Alert} from "flowbite-svelte";
    import { pwaInfo } from 'virtual:pwa-info';
    import { pwaAssetsHead } from 'virtual:pwa-assets/head';

    $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : ''

    let errorMessage = '';
    let alertMessage = '';

    const unsubscribe = error.subscribe(value => {
        errorMessage = value;
        if (value) {
            setTimeout(() => {
                clearError();
            }, 5000);
        }
    });

    const unsubscribeAlert = alert.subscribe(value => {
        alertMessage = value;
        if (value) {
            setTimeout(() => {
                clearAlert();
            }, 5000);
        }
    });

    onMount(() => {
        return () => {
            unsubscribe();
            unsubscribeAlert();
        };
    });
    const appVersion = import.meta.env.VITE_APP_VERSION;

</script>
<slot/>

<svelte:head>
    <title>Configurator {appVersion}</title>
    {#if pwaAssetsHead.themeColor}
        <meta name="theme-color" content={pwaAssetsHead.themeColor.content} />
    {/if}
    {#each pwaAssetsHead.links as link}
        <link {...link} />
    {/each}
    {@html webManifestLink}
</svelte:head>

{#if errorMessage}
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
    <Alert>
        {errorMessage}
    </Alert>
    </div>
{/if}
{#if alertMessage}
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Alert border>
            <span class="font-medium">{alertMessage}</span>
        </Alert>
    </div>
{/if}
