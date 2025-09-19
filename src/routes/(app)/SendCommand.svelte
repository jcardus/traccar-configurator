<script>
    import {Button, Input, Modal, Spinner} from "flowbite-svelte";
import {sendCommand} from "$lib";
import {setError, setAlert} from "$lib/store.js";

export let open = false
export let selected = [];

let data = '', sending=false

async function sendConfiguration() {
    try {
        sending = true
        for (const deviceId of selected) {
            await sendCommand({
                type: 'custom',
                attributes: {data},
                textChannel: false,
                deviceId
            })
            setAlert('Commands sent successfully')
        }
    } catch (e) {
        console.error(e)
        setError(e)
    }
    open = false
    sending = false

}
</script>

<Modal bind:open title="Send command" class="w-96">
    <div>Send to {selected.length} device{selected.length>1?'s':''}?</div>
    <Input placeholder="command" class="me-4 border xl:w-96" bind:value={data}  />
    <div class="flex items-center justify-center">
        <Button color="red" class="m-2" onclick={sendConfiguration} disabled="{sending}">
            <Spinner class="{sending || 'hidden'}" size="{4}"></Spinner>
            <span class="pl-1">{sending?'Sending...':'Yes'}</span></Button>
        <Button color="alternative" onclick={() => open = false}>No, cancel</Button>
    </div>
</Modal>
