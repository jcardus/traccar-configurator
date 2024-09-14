<script>
    import {
        Button,
        Checkbox,
        Heading,
        Indicator, Tooltip
    } from 'flowbite-svelte';
    import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
    import { TableHeadCell, Toolbar, ToolbarButton } from 'flowbite-svelte';
    import {
        CogSolid,
        DotsVerticalOutline,
        DownloadSolid
    } from 'flowbite-svelte-icons';
    import {
        EditOutline,
        ExclamationCircleSolid,
        PlusOutline,
        TrashBinSolid
    } from 'flowbite-svelte-icons';
    import Delete from "./Delete.svelte";
    import Device from "./Device.svelte";
    import SendConfig from "./SendConfig.svelte";

    let openDevice = false; // modal control
    let openDelete = false; // modal control
    let sendConfig = false; // modal control
    let filter = ''
    let selected = []

    let current_device = {};
    export let data;
    function handleUpdateDevice(event) {
        const updatedDevice = event.detail;
        const index = data.devices.findIndex(device => device.id === updatedDevice.id);
        if (index !== -1) {
            data.devices[index] = updatedDevice; // Update the existing device
        } else {
            data.devices.push(updatedDevice); // Add new device if it doesn't exist
        }
    }

    function handleDeleteDevice(event) {
        const updatedDevice = event.detail;
        const index = data.devices.findIndex(device => device.id === updatedDevice.id);
        if (index !== -1) { data.devices.splice(index, 1) }
    }

    function deviceSelected(device) {
        selected = selected.includes(device.id) ? selected.filter(d => d !== device.id) : selected.concat([device.id])
    }
</script>

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
    <div class="p-4">
        <Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Devices
        </Heading>
        <Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
            <Input placeholder="Search for devices" class="me-4 w-80 border xl:w-96" bind:value={filter}  />
            <div class="border-l border-gray-100 pl-2 dark:border-gray-700">
                <ToolbarButton on:click={() => {
                    selected.length ?
                    sendConfig = true : alert('Please select a device')
                }}
                        color="dark"
                        class="m-0 rounded p-1 hover:bg-gray-100 focus:ring-0 dark:hover:bg-gray-700"
                >
                    <CogSolid size="lg" />
                </ToolbarButton>
                <ToolbarButton
                        color="dark"
                        class="m-0 rounded p-1 hover:bg-gray-100 focus:ring-0 dark:hover:bg-gray-700"
                >
                    <TrashBinSolid size="lg" />
                </ToolbarButton>
                <ToolbarButton
                        color="dark"
                        class="m-0 rounded p-1 hover:bg-gray-100 focus:ring-0 dark:hover:bg-gray-700"
                >
                    <ExclamationCircleSolid size="lg" />
                </ToolbarButton>
                <ToolbarButton
                        color="dark"
                        class="m-0 rounded p-1 hover:bg-gray-100 focus:ring-0 dark:hover:bg-gray-700"
                >
                    <DotsVerticalOutline size="lg" />
                </ToolbarButton>
            </div>
            <div slot="end" class="flex items-center space-x-2">
                <Button
                        size="sm"
                        class="gap-2 whitespace-nowrap px-3"
                        on:click={() => {
                            current_device = {}
                            openDevice = true
                        }}
                >
                    <PlusOutline size="sm" />Add device
                </Button>
                <Button size="sm" color="alternative" class="gap-2 px-3">
                    <DownloadSolid size="md" class="-ml-1" />Export
                </Button>
            </div>
        </Toolbar>
    </div>
    <Table hoverable="true" class="table-fixed">
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            <TableHeadCell class="w-4 p-4"><Checkbox checked="{selected.length === data.devices.length}" on:change={() => {
                selected = selected.length === data.devices.length ? [] : data.devices.map(d => d.id)
            }} /></TableHeadCell>
            <TableHeadCell class="font-medium">Name</TableHeadCell>
            {#each ['Phone', 'Model', 'Last Update', 'Status'] as title}
                <TableHeadCell class="text-center font-medium">{title}</TableHeadCell>
            {/each}
            <TableHeadCell class="text-center font-medium w-40">Actions</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each data.devices.filter(d => !filter || d.name.includes(filter)) as device}
                <TableBodyRow class="text-base" on:click={() => deviceSelected(device)}>
                    <TableBodyCell class="w-4 p-4"><Checkbox checked="{selected.includes(device.id)}"/></TableBodyCell>
                    <TableBodyCell class="max-w-64 flex items-center space-x-6 whitespace-nowrap p-4  overflow-hidden truncate">
                        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div class="text-base font-semibold text-gray-900 dark:text-white">{device.name}</div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">{device.uniqueId}</div>
                        </div>
                        <Tooltip class="lg:hidden"><div class="text-base font-semibold text-gray-900 dark:text-white">{device.name}</div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">{device.uniqueId}</div></Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                        <span>{device.phone}</span>
                        <Tooltip class="lg:hidden">{device.phone}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                        <span>{device.model}</span>
                        <Tooltip class="lg:hidden">{device.model}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="p-1 overflow-ellipsis overflow-hidden">
                        <span>{new Date(device.lastUpdate).toLocaleString()}</span>
                        <Tooltip class="lg:hidden">{new Date(device.lastUpdate).toLocaleString()}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="p-1 font-normal overflow-ellipsis overflow-hidden">
                        <div class="flex items-center gap-2">
                            <Indicator color={device.status === 'Active' ? 'green' : 'red'} />
                            {device.status}
                        </div>
                    </TableBodyCell>
                    <TableBodyCell>
                        <div class="flex justify-center gap-2">
                        <Button
                                size="xs"
                                on:click={() => {
                                    current_device = device
                                    openDevice = true
                                }}
                        >
                            <EditOutline size="xs" /> Edit
                        </Button>
                        <Button
                                color="red"
                                size="xs"
                                on:click={() => {
                                    current_device = device
                                    openDelete = true
                                }}
                        >
                            <TrashBinSolid size="xs" /> Delete
                        </Button>
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</main>


<Device bind:open={openDevice} data={current_device} on:updateDevice={handleUpdateDevice} />
<Delete bind:open={openDelete} data={current_device} on:updateDevice={handleDeleteDevice}/>
<SendConfig bind:open={sendConfig} selected="{selected}" devices="{data.devices}"/>
