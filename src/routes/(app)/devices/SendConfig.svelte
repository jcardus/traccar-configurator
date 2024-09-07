<script>
import {setAlert} from "$lib/store.js";
import {Button, Modal} from "flowbite-svelte";
import {QuestionCircleOutline} from "flowbite-svelte-icons";
export let open = false
export let selected = [];
</script>

<Modal bind:open size="sm">
    <QuestionCircleOutline class="mx-auto mb-4 mt-8 h-10 w-10 text-red-600" />
    <h3 class="mb-6 text-center text-lg text-gray-500 dark:text-gray-400">
        Send configuration to {selected.length} devices?
    </h3>
    <div class="flex items-center justify-center">
        <Button color="red" class="mr-2" on:click={() => {
            setAlert('Configuration sent.')
            open = false
        }}>Yes</Button>
        <Button color="alternative" on:click={() => (open = false)}>No, cancel</Button>
    </div>
</Modal>
