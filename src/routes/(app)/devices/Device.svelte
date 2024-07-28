<script lang="ts">
    import { Button, Input, Label, Modal } from 'flowbite-svelte';
    export let open: boolean = false; // modal control

    export let data = {};

    function init(form: HTMLFormElement) {
        for (const key in data) {
            const el = form.elements.namedItem(key);
            if (el) el.value = data[key];
        }
    }
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
            open=false
        } else {
            throw Error(await response.text());
        }
    };

</script>

<Modal
        bind:open
        title={Object.keys(data).length ? 'Edit user' : 'Add new user'}
        size="md"
        class="m-4"
>
    <!-- Modal body -->
    <div class="space-y-6 p-0">
        <form action="#" use:init>
            <div class="grid grid-cols-6 gap-6">
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Name</span>
                    <Input name="name" class="border outline-none" placeholder="e.g. Bonnie" required />
                </Label>
                <Label class="col-span-6 space-y-2 sm:col-span-3">
                    <span>Imei</span>
                    <Input name="uniqueId" class="border outline-none" placeholder="e.g. Green" required />
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
                    <span>Position</span>
                    <Input
                            name="position"
                            class="border outline-none"
                            placeholder="e.g. React Developer"
                            required
                    />
                </Label>


                <Label class="col-span-6 space-y-2">
                    <span>Image</span>

                </Label>
            </div>
        </form>
    </div>

    <!-- Modal footer -->
    <div slot="footer">
        <Button type="submit" on:click={handleSave}>{data.length ? 'Save all' : 'Save'}</Button>
    </div>
</Modal>
