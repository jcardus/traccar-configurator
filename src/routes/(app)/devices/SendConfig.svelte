<script>
import {setAlert} from "$lib/store.js";
import {Button, Modal, Select} from "flowbite-svelte";
export let open = false
export let selected = [];
const deviceTypes = ['Suntech', 'Aovx'].sort().map(d => ({name: d, value: d}))
let deviceType = 'Aovx'
</script>

<Modal bind:open>
    <div class="flex items-center justify-center">
        Send
    <Select items={deviceTypes} bind:value={deviceType} class="w-30 m-4" />
    configuration to {selected.length} devices?
    </div>
    <div class="flex items-center justify-center">

        <Button color="red" class="mr-2" on:click={() => {
            setAlert('Configuration sent.')
            open = false
        }}>Yes</Button>
        <Button  color="alternative" on:click={() => (open = false)}>No, cancel</Button>
    </div>
</Modal>
