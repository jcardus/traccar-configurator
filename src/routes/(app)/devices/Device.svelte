<script>
    import { Button, Checkbox, Input, Label, Modal, Select } from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import { deviceTypes } from "$lib/devices.js";
    import SendConfig from "./SendConfig.svelte";
    import {
        ArrowUpRightFromSquareOutline,
        FloppyDiskAltOutline,
        TrashBinSolid
    } from "flowbite-svelte-icons";
    import Delete from "./Delete.svelte";

    export let open = false; // Modal control
    export let data = {}; // Default empty object
    export let devices
    let sendConfig = false
    let openDelete = false
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
</script>

<form action="#" use:init on:submit={handleSave}>
    <Modal
            bind:open
            title={data.id ? 'Edit device' : 'Add new device'}
            size="sm"
            class="m-4 h-[calc(100vh-5rem)] sm:h-max"
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
            {#if data.id}
                <Button color="alternative" on:click="{()=>{sendConfig = true}}" class="{data.id?'':'hidden'}">
                    <ArrowUpRightFromSquareOutline/>
                    Send config
                </Button>
            {/if}
            <Button type="submit">
                <FloppyDiskAltOutline size="sm"/>
                Save
            </Button>
            </div>
            <div class="flex justify-between py-4">
                <Button color="red" on:click={() => openDelete=true}>
                    <TrashBinSolid size="sm" />
                    Delete
                </Button>
            </div>
        </div>
    </Modal>
</form>

<SendConfig bind:open={sendConfig} selected="{[data.id]}" devices="{devices}"/>
<Delete bind:open={openDelete} data={data} on:deleteDevice={handleDeleteDevice}/>
