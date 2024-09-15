<script>
    import {Button, Modal, Spinner} from "flowbite-svelte";
import {sendCommand} from "$lib";
import {setError, setAlert} from "$lib/store.js";
import {getData} from "$lib/devices.js";
export let open = false
export let selected = [];
export let devices = [];
let apn, sending=false

async function sendConfiguration() {
    try {
        sending = true
        for (const deviceId of selected) {
            const device = devices.find(device => device.id === deviceId)
            if (!device.model) {
                setAlert('Please select model for ' + device.name)
            } else {
                for (const data of getData(device, apn)) {
                    await sendCommand({
                        type: 'custom',
                        attributes: {data},
                        textChannel: true,
                        deviceId
                    })
                }
            }
        }
    } catch (e) {
        setError(e)
    }
    open = false
    sending = false
}
</script>

<Modal bind:open title="Send configuration" class="w-96">
    <div>Send to {selected.length} device{selected.length>1?'s':''}?</div>
    <div class="flex items-center justify-center">
        <Button color="red" class="m-2" on:click={sendConfiguration} disabled="{sending}">
            <Spinner class="{sending || 'hidden'}" size="{4}"></Spinner>
            <span class="pl-1">{sending?'Sending...':'Yes'}</span></Button>
        <Button color="alternative" on:click={() => open = false}>No, cancel</Button>
    </div>
</Modal>
