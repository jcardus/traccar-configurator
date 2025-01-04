<script>

import {Button, Label, Modal, Select, Spinner} from "flowbite-svelte";
import {addPermission} from "$lib";
import {setError} from "$lib/store.js";
export let open = false
export let selected = [];
export let users = [];
let linking=false

async function link() {
    try {
        linking = true
        for (const deviceId of selected) {
            await addPermission({userId, deviceId})
        }
    } catch (e) {
        setError(e)
    }
    open = false
    linking = false
}

    let userId;
</script>

<Modal bind:open title="Link user" class="w-96">

    <div>Link user to {selected.length} device{selected.length>1?'s':''}?</div>
    <Label class="col-span-6 space-y-2 sm:col-span-3">
        <span>Model</span>
        <Select items="{users.map(u => ({name: u.name.trim(), value: u.id})).sort((a,b)=>a.name.localeCompare(b.name))}"
                class="border outline-none" required
                bind:value={userId}
        />
    </Label>
    <div class="flex items-center justify-center">
        <Button color="red" class="m-2" on:click={link} disabled="{linking}">
            <Spinner class="{linking || 'hidden'}" size="{4}"></Spinner>
            <span class="pl-1">{linking?'Linking...':'Yes'}</span></Button>
        <Button color="alternative" on:click={() => open = false}>No, cancel</Button>
    </div>
</Modal>
