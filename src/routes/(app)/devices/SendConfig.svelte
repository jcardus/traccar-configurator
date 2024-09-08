<script>
    import {Button, Input, Label, Modal, Select} from "flowbite-svelte";
import {sendCommand} from "$lib";
import {setError} from "$lib/store.js";
import {getData} from "$lib/commands.js";
export let open = false
export let selected = [];
export let devices = [];
const deviceTypes = ['Suntech', 'Aovx'].sort().map(d => ({name: d, value: d}))
let deviceType = 'Aovx'
let apn=''

async function sendConfiguration() {
    try {
        for (const deviceId of selected) {
            for (const data of getData(devices.find(device => device.id === deviceId), deviceType, apn)) {
                for (const textChannel of [true, false]) {
                    await sendCommand({
                        type: 'custom',
                        attributes: {data},
                        textChannel,
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
        <Label class="col-span-6 space-y-2 sm:col-span-3">Manufacturer
        <Select items={deviceTypes} bind:value={deviceType} class="mt-2"/>
        </Label>

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
