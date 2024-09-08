<script>
    import {Button, Checkbox, Input, Label, Modal, Select} from 'flowbite-svelte';
    import { createEventDispatcher } from 'svelte';
    import {deviceTypes} from "$lib/devices.js";

    export let open = false; // modal control

    export let data = {};

    function init(form) {
        for (const key in data) {
            const el = form.elements.namedItem(key);
            if (el) el.value = data[key];
        }
    }
    const dispatch = createEventDispatcher();
    const handleSave = async () => {
        let url = `/api/devices`;
        let id = data.id
        if (id) {
            url += `/${id}`;
        }

        const response = await fetch(url, {
            method: !id ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            dispatch('updateDevice', data); // Dispatch event to parent
            open=false
        } else {
            throw Error(await response.text());
        }
    };

</script>

<Modal
        bind:open
        title={Object.keys(data).length ? 'Edit device' : 'Add new device'}
        size="md"
        class="m-4"
>
    <div class="space-y-6 p-0">
        <form action="#" use:init>
            <div class="grid grid-cols-6 gap-6">
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Name</span>
                    <Input name="name" bind:value={data.name} class="border outline-none" placeholder="e.g. My device" required />
                </Label>
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Imei</span>
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
                    <span>Disabled</span>
                    <Checkbox id="checkbox2" bind:checked={data.disabled} />
                </Label>
            </div>
        </form>
    </div>

    <!-- Modal footer -->
    <div slot="footer">
        <Button type="submit" on:click={handleSave}>{data.length ? 'Save all' : 'Save'}</Button>
    </div>
</Modal>
