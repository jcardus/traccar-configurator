<script>
    import {
        Button,
        Checkbox,
        Heading,
        Indicator, Tooltip
    } from 'flowbite-svelte';
    import { Input, Table, TableBody, TableBodyCell, TableHead } from 'flowbite-svelte';
    import { TableHeadCell, Toolbar, ToolbarButton } from 'flowbite-svelte';
    import {
        CogSolid,
        DownloadSolid
    } from 'flowbite-svelte-icons';
    import {
        EditOutline,
        PlusOutline,
        TrashBinSolid
    } from 'flowbite-svelte-icons';
    import Delete from "./Delete.svelte";
    import Device from "./Device.svelte";
    import SendConfig from "./SendConfig.svelte";
    import {slide} from 'svelte/transition'
    import config from "tailwindcss/defaultTheme.js";

    let openDevice = false; // modal control
    let openDelete = false; // modal control
    let sendConfig = false; // modal control
    let filter = ''
    let selected = []

    let current_device = {};
    export let data;
    function handleUpdateDevice(event) {
        const updatedDevice = event.detail;
        let {devices} = data
        const index = devices.findIndex(device => device.id === updatedDevice.id);
        if (index !== -1) {
            devices[index] = updatedDevice;
        } else {
            devices.push(updatedDevice)
        }
        data = {devices}
    }

    function handleDeleteDevice(event) {
        const {id} = event.detail;
        let {devices} = data
        const index = devices.findIndex(device => device.id === id);
        if (index !== -1) {
            devices.splice(index, 1)
            data = {devices}
        }
        else {
            console.error('deviceId', id, 'not found:', index)
        }
    }

    function deviceSelected(device) {
        if (!window.matchMedia(`(min-width: ${config.screens.sm})`).matches) {
            current_device = device
            selected = [device.id]
            openDevice = true
        } else {
            selected = selected.includes(device.id) ? selected.filter(d => d !== device.id) : selected.concat([device.id])
        }
    }
    const socket = new WebSocket('/api/socket')
    socket.onmessage = (event) => {
        const _data = JSON.parse(event.data);
        if (_data.devices) {
            _data.devices.forEach(detail => handleUpdateDevice({detail}))
        }
        if (data.positions) {

        }
        if (data.events) {

        }
        if (data.logs) {

        }
    }
</script>

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
    <div class="p-4">
        <Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Devices
        </Heading>
        <Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
            <Input placeholder="Search for devices" class="me-4 w-40 border xl:w-96" bind:value={filter}  />
            <div class="border-l border-gray-100 pl-2 dark:border-gray-700">
                <ToolbarButton on:click={() => {
                    selected.length ?
                    sendConfig = true : alert('Please select a device')
                }}
                        color="dark"
                        class="m-0 rounded p-1 hover:bg-gray-100 focus:ring-0 dark:hover:bg-gray-700"
                >
                    <CogSolid size="lg" />
                    <Tooltip>Send config</Tooltip>
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
                <Button size="sm" color="alternative" class="hidden sm:block gap-2 px-3">
                    <DownloadSolid size="md" class="-ml-1" />Export
                </Button>
            </div>
        </Toolbar>
    </div>
    <Table hoverable="true" class="table-auto sm:table-fixed">
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            <TableHeadCell class="w-4 p-4 hidden sm:table-cell">
                <Checkbox checked="{selected.length === data.devices.length}" on:change={() => {
                    selected = selected.length === data.devices.length ? [] : data.devices.map(d => d.id)
                }} />
            </TableHeadCell>
            <TableHeadCell class="font-medium">Name</TableHeadCell>
            <TableHeadCell class="text-center font-medium hidden sm:table-cell">Phone</TableHeadCell>
            <TableHeadCell class="text-center font-medium hidden sm:table-cell">Model</TableHeadCell>
            <TableHeadCell class="text-center font-medium">Last Update</TableHeadCell>
            <TableHeadCell class="text-center font-medium w-24">Status</TableHeadCell>
            <TableHeadCell class="text-center font-medium w-40 hidden sm:table-cell">Actions</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each data.devices.filter(d => !filter || d.name.toLowerCase().includes(filter.toLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)) as device}
                <tr transition:slide class="text-base" on:click={() => deviceSelected(device)}>
                    <TableBodyCell class="w-4 p-4 hidden sm:table-cell">
                        <Checkbox checked="{selected.includes(device.id)}"/>
                    </TableBodyCell>
                    <TableBodyCell class="space-x-6 p-4">
                        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div class="whitespace-normal text-base font-semibold text-gray-900 dark:text-white">{device.name}</div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">{device.uniqueId}</div>
                        </div>
                        <Tooltip class="lg:hidden" placement="top" arrow="{false}">
                            {device.name} - {device.uniqueId}
                        </Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="hidden sm:table-cell text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                        <span>{device.phone}</span>
                        <Tooltip class="lg:hidden">{device.phone}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        <span>{device.model}</span>
                        <Tooltip class="lg:hidden">{device.model}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="p-1 overflow-ellipsis overflow-hidden text-center">
                        <span>{new Date(device.lastUpdate).toLocaleDateString()}<br>{new Date(device.lastUpdate).toLocaleTimeString()}</span>
                        <Tooltip class="lg:hidden">{new Date(device.lastUpdate).toLocaleString()}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="p-1 font-normal">
                        <div class="flex items-center gap-2">
                            <Indicator color={device.status === 'online' ? 'green' : 'red'} />
                            {device.status}
                        </div>
                    </TableBodyCell>
                    <TableBodyCell class="hidden sm:table-cell">
                        <div class="flex justify-center gap-2 ">
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
                </tr>
            {/each}
        </TableBody>
    </Table>
</main>


<Device bind:open={openDevice} data={current_device} on:updateDevice={handleUpdateDevice} devices={data.devices}/>
<Delete bind:open={openDelete} data={current_device} on:deleteDevice={handleDeleteDevice}/>
<SendConfig bind:open={sendConfig} selected="{selected}" devices="{data.devices}"/>
