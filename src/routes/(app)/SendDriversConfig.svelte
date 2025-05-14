<script>
    import {Button, Modal, Spinner} from "flowbite-svelte";
import {sendCommand} from "$lib";
// noinspection JSFileReferences
import {setError, setAlert} from "$lib/store.js";
    // noinspection JSFileReferences
import {sendDriverConfigOpened} from "$lib/dialogsOpened.js";
let {selected, drivers, devices} = $props()

let sending=$state(false)
let commandsSent = $state(1)
let open = $state(false)
sendDriverConfigOpened.subscribe(value => (open = value))

    function convertUniqueId(uniqueId) {
        return uniqueId
    }

    async function sendConfiguration() {
    sendDriverConfigOpened.set(false)
    if (!drivers || !drivers.length) {
        setAlert('Please register at least one driver.')
        return
    }
    /*for (const deviceId of selected) {
        const device = devices.find(device => device.id === deviceId)
        if (!device.model) {
            setAlert('Please select model for ' + device.name)
            return
        }
    }*/
    try {
        sendDriverConfigOpened.set(true)
        commandsSent = 1
        sending = true
        for (const deviceId of selected) {
            await sendCommand({
                type: 'custom',
                attributes: {data: 'setcfg 255 2, 271 1'},
                textChannel: false,
                deviceId
            })
            for (const driver of drivers) {
                const device = devices.find(device => device.id === deviceId)
                await sendCommand({
                    type: 'custom',
                    // todo: authid del
                    attributes: {data: `authid add ${convertUniqueId(driver.uniqueId)}`},
                    textChannel: false,
                    deviceId
                })
                setAlert(`${commandsSent++} - ${driver.name} -> ${device.name}`)
            }
        }
    } catch (e) {
        setError(e)
    }
    sending = false
    sendDriverConfigOpened.set(false)
    setAlert(`${--commandsSent} commands sent successfully`)
}
</script>

<Modal bind:open title="Send drivers configuration" class="w-max">
    <div>Send to {selected.length} device{selected.length>1?'s':''} with {drivers.length} drivers ({drivers.length*selected.length} commands)?</div>
    <div class="flex items-center justify-center">
        <Button color="red" class="m-2" onclick={sendConfiguration} disabled={sending}>
            <Spinner class={sending || 'hidden'} size={4}></Spinner>
            <span class="pl-1">{sending ?
                `Sending ${commandsSent} / ${drivers.length*selected.length}`
                :'Yes'}
            </span></Button>
        <Button color="alternative" onclick={() => open = false}>No, cancel</Button>
    </div>
</Modal>
