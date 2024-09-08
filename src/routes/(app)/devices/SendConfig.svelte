<script>
    import {Button, Input, Label, Modal} from "flowbite-svelte";
import {sendCommand} from "$lib";
import {setError, setAlert} from "$lib/store.js";
import {getData} from "$lib/devices.js";
export let open = false
export let selected = [];
export let devices = [];
let apn

async function sendConfiguration() {
    try {
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
}
</script>

<Modal bind:open title="Send configuration to {selected.length} devices">
    <div class="space-y-6 p-0">
    <div class="grid grid-cols-6 gap-6">
        <Label class="col-span-6 space-y-2 sm:col-span-3">APN
        <Input bind:value={apn}  class="mt-2" placeholder="allcom.vivo.com.br" required />
        </Label>
    </div>
    <div class="flex items-center justify-center">
        <Button color="red" class="mr-2" on:click={sendConfiguration}>Yes</Button>
        <Button color="alternative" on:click={() => (open = false)}>No, cancel</Button>
    </div>
    </div>
</Modal>
