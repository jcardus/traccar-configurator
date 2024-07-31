<script>
    import { error, clearError } from '$lib/store';
    import { onMount } from 'svelte';
    import {Alert} from "flowbite-svelte";

    let errorMessage = '';

    const unsubscribe = error.subscribe(value => {
        errorMessage = value;
        if (value) {
            setTimeout(() => {
                clearError();
            }, 5000); // Clear error after 5 seconds
        }
    });

    onMount(() => {
        return () => {
            unsubscribe();
        };
    });
    const appVersion = import.meta.env.VITE_APP_VERSION;

</script>
<slot/>
<svelte:head>
    <title>Configurator {appVersion}</title>
</svelte:head>
{#if errorMessage}
    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
    <Alert>
        {errorMessage}
    </Alert>
    </div>
{/if}
