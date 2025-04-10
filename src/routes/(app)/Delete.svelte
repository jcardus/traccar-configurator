<script>
    import {Button, Modal, Spinner} from 'flowbite-svelte';
    import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
    import {createEventDispatcher} from "svelte";
    export let open = false; // modal control
    export let data
    let loading = false
    const dispatch = createEventDispatcher();
    async function deleteDevice() {
        loading = true
        try {
        let id = data.id
        const url = `/api/devices/${id}`;
        const response = await fetch(url, {method: 'DELETE'});
        if (response.ok) {
            dispatch('deleteDevice', data); // Dispatch event to parent
            open=false
        } else {
            alert(await response.text())
        }
        } catch(e) {
            console.error(e)
        }
        loading = false
    }
</script>

<Modal bind:open size="sm">
    <ExclamationCircleOutline class="mx-auto mb-4 mt-8 h-10 w-10 text-red-600" />

    <h3 class="mb-6 text-center text-lg text-gray-500 dark:text-gray-400">
        Are you sure you want to delete device {data.name}?
    </h3>

    <div class="flex items-center justify-center">
        <Button color="red" class="mr-2" on:click={deleteDevice} disabled="{loading}">
            {#if loading}
                <Spinner size={5} class="mr-2"></Spinner>
                Deleting...
            {:else}
                Yes, delete {data.name}
            {/if}
        </Button>
        <Button color="alternative" on:click={() => (open = false)}>No, cancel</Button>
    </div>
</Modal>
