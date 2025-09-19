<script>
    import {Button, Checkbox, Input, Label, Modal, Select} from 'flowbite-svelte';
    import {createEventDispatcher, onMount} from 'svelte';
    import { deviceTypes } from "$lib/devices.js";
    import SendConfig from "./SendConfig.svelte";
    import {
        ArrowUpRightFromSquareOutline,
        FloppyDiskAltOutline,
        TrashBinSolid
    } from "flowbite-svelte-icons";
    import Delete from "./Delete.svelte";
    import ShareLocation from "./ShareLocation.svelte";
    import SendCommand from "./SendCommand.svelte";
    let url
    export let open = false; // Modal control
    export let data = {}; // Default empty object
    export let devices
    let sendConfig = false
    let openDelete = false
    let sendCommand = false
    const dispatch = createEventDispatcher();
    function handleDeleteDevice(event) {
        open=false
        dispatch('deleteDevice', event.detail)
    }

    function init(form) {
        if (data) {
            for (const key in data) {
                const el = form.elements.namedItem(key);
                if (el) el.value = data[key];
            }
        }
    }

    const handleSave = async (event) => {
        event.preventDefault(); // Prevent default form submission

        let url = `/api/devices`;
        let id = data.id;

        if (id) {
            url += `/${id}`;
        }

        delete data.position

        const response = await fetch(url, {
            method: !id ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            dispatch('updateDevice', await response.json()); // Dispatch event to parent
            open = false; // Close modal
        } else { alert(await response.text()) }
    };
    let openShareLocation = false;

    onMount(() => data.attributes ||= {apn: ''})
</script>

<form action="#" use:init on:submit={handleSave}>
    <Modal
            bind:open
            title={data.id ? 'Edit device' : 'Add new device'}
            size="sm"
            class="m-4 h-[calc(100vh-6rem)] sm:h-max"
    >
        <div class="space-y-6 p-0">
            <div class="grid grid-cols-6 gap-6">
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Name</span>
                    <Input name="name" bind:value={data.name} class="border outline-none" placeholder="e.g. My device" required />
                </Label>
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Identifier</span>
                    <Input name="uniqueId" bind:value={data.uniqueId} class="border outline-none" placeholder="e.g. 123456789" required />
                </Label>
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Phone</span>
                    <Input bind:value={data.phone}
                           name="phone"
                           type="tel"
                           class="border outline-none"
                           placeholder="example: 351912381488"
                    />
                </Label>
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Model</span>
                    <Select items="{deviceTypes}" bind:value={data.model} name="model" class="border outline-none" required />
                </Label>
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>APN</span>
                    <Input bind:value="{data.attributes.apn}" name="apn" class="border outline-none" />
                </Label>

                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Disabled</span>
                    <Checkbox id="checkbox2" bind:checked={data.disabled} />
                </Label>
            </div>
        </div>

        <!-- Modal footer -->
        <div slot="footer" class="w-full">
            <div class="flex justify-between ">
                <Button  type="submit" color="alternative" size="sm" onclick="{()=>{sendConfig = true}}" class="{data.id?'':'hidden'}">
                    <ArrowUpRightFromSquareOutline/>
                    Send config
                </Button>
                <Button  type="submit" color="alternative" size="sm" onclick="{()=>{sendCommand = true}}" class="{data.id?'':'hidden'}">
                    <ArrowUpRightFromSquareOutline/>
                    Send command
                </Button>
                <ShareLocation bind:open={openShareLocation} {url} {data} />
            </div>
            <div class="flex justify-between py-4">
                <Button color="red" onclick={() => openDelete=true}>
                    <TrashBinSolid size="sm" />
                    Delete
                </Button>
                <Button type="submit">
                    <FloppyDiskAltOutline size="sm"/>
                    Save
                </Button>
            </div>
        </div>
    </Modal>
</form>

<SendCommand bind:open={sendCommand} selected="{[data.id]}" devices="{devices}"/>
<SendConfig bind:open={sendConfig} selected="{[data.id]}" devices="{devices}"/>
<!--Delete bind:open={openDelete} data={data} on:deleteDevice={handleDeleteDevice}/-->
