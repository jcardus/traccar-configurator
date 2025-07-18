<script>
    import {
        Button,
        Checkbox,
        Heading,
        Indicator, TableBodyRow, Tooltip
    } from 'flowbite-svelte';
    import { Input, Table, TableBody, TableBodyCell, TableHead } from 'flowbite-svelte';
    import { TableHeadCell, Toolbar, ToolbarButton } from 'flowbite-svelte';
    import {
        CogSolid,
        DownloadSolid, UserSolid
    } from 'flowbite-svelte-icons';
    import {
        EditOutline,
        PlusOutline,
        TrashBinSolid
    } from 'flowbite-svelte-icons';
    import Delete from "./Delete.svelte";
    import Device from "./Device.svelte";
    import SendConfig from "./SendConfig.svelte";
    // noinspection JSFileReferences
    import config from "tailwindcss/defaultTheme.js";
    import LinkUser from "../../lib/components/LinkUser.svelte";
    import SendDriversConfig from "./SendDriversConfig.svelte";
    import {sendDriverConfigOpened} from "../../lib/dialogsOpened.js";
    import * as XLSX from "xlsx";
    import {goto} from "$app/navigation";

    let openDevice = $state(false)
    let openDelete = $state(false)
    let sendConfig = $state(false)
    let linkUser = $state(false)
    let filter = $state('')
    let selected = $state([])

    let current_device = $state({});
    let {data} = $props();
    let devices = $state(data.devices || [])
    let filtered = $derived(devices.filter(d =>
        !filter ||
        d.name.toLowerCase().includes(filter.toLowerCase()) ||
        (d.phone && d.phone.includes(filter)) ||
        (d.uniqueId && d.uniqueId.includes(filter)) ||
        (d.position && d.position.protocol.includes(filter))
    ))

    function handleUpdateDevice(event) {
        const updatedDevice = event.detail;
        const index = devices.findIndex(device => device.id === updatedDevice.id);
        if (index !== -1) {
            devices.splice(index, 1, updatedDevice);
        } else {
            devices.push(updatedDevice)
        }
    }

    function handleDeleteDevice(event) {
        const {id} = event.detail;
        const index = devices.findIndex(device => device.id === id);
        if (index !== -1) {
            devices.splice(index, 1)
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
        if (_data.positions) {
            _data.positions.forEach(p => {
                const index = devices.findIndex(device => device.id === p.deviceId);
                if (index !== -1) {
                    devices[index].position = p
                }
            })
        }
    }
    let sortColumn = $state('name')
    let sortAsc = $state(true)
    const sort = (a,b) => {
        switch (sortColumn) {
            case 'id':
                return sortAsc ? b.id - a.id : a.id - b.id
            case 'lastUpdate':
                return sortAsc ? new Date(b.lastUpdate) - new Date(a.lastUpdate) : new Date(a.lastUpdate) - new Date(b.lastUpdate)
            default:
                return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        }
    }
    function sortBy(column) {
        if (sortColumn === column) {
            sortAsc = !sortAsc;
        } else {
            sortColumn = column;
            sortAsc = true;
        }
    }

    function exportData() {
        const worksheet = XLSX.utils.json_to_sheet(filtered)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'devices')
        XLSX.writeFile(workbook, 'devices.xlsx', { compression: true })
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
                <ToolbarButton onclick={() => {
                    selected.length ?
                    sendConfig = true : alert('Please select a device')
                }}
                        color="dark"
                        class="m-0 rounded p-1 hover:bg-gray-100 focus:ring-0 dark:hover:bg-gray-700"
                >
                    <CogSolid size="lg" />
                    <Tooltip>Send config</Tooltip>
                </ToolbarButton>
                <ToolbarButton onclick={() => {
                    if (selected.length) {
                        sendDriverConfigOpened.set(true)
                    } else {
                        alert('Please select a device')
                    }
                }}
                   color="dark"
                   class="m-0 rounded p-1 hover:bg-gray-100 focus:ring-0 dark:hover:bg-gray-700"
                >
                    <UserSolid size="lg" />
                    <Tooltip>Send authorized drivers config</Tooltip>
                </ToolbarButton>
            </div>
            <div slot="end" class="flex items-center space-x-2">
                <Button disabled={!selected.length}
                        size="sm"
                        class="gap-2 whitespace-nowrap px-3"
                        onclick={() => (linkUser = true)}
                >
                    Link user
                </Button>
                <Button
                        size="sm"
                        class="gap-2 whitespace-nowrap px-3"
                        onclick={() => {
                            current_device = {attributes: {apn: ''}}
                            openDevice = true
                        }}
                >
                    <PlusOutline size="sm" />Add device
                </Button>
                <Button
                        size="sm"
                        class="gap-2 whitespace-nowrap px-3"
                        onclick={() => goto('/config/import-devices')}
                >
                    <PlusOutline size="sm"/>Import devices
                </Button>
                <Button size="sm" color="alternative" class="hidden sm:block gap-2 px-3" onclick={exportData}>
                    <DownloadSolid size="md" class="-ml-1" />Export
                </Button>
            </div>
        </Toolbar>
        <span class="text-gray-900 dark:text-white">Selected {selected.length} of {(data.devices || []).length} devices.</span>
    </div>
    <Table hoverable="true" class="table-auto sm:table-fixed">
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            <TableHeadCell class="w-4 p-4 hidden sm:table-cell">
                <Checkbox checked={devices && selected.length === devices.length} onchange={() => {
                    selected = selected.length === devices.length ? [] : devices.map(d => d.id)
                }} />
            </TableHeadCell>
            <TableHeadCell class="w-20 text-center font-medium hidden sm:table-cell" onclick={() => sortBy('id')}>Id</TableHeadCell>
            <TableHeadCell class="w-40 {sortColumn === 'name' ? 'font-bold' : ''}" onclick={() => sortBy('name')}>Name</TableHeadCell>
            <TableHeadCell class="text-center w-36 === 'phone' ? 'font-bold' : ''}font-medium hidden sm:table-cell" onclick={() => sortBy('phone')}>Phone</TableHeadCell>
            <TableHeadCell class="w-40 text-center {sortColumn === 'model' ? 'font-bold' : ''}font-medium hidden sm:table-cell" onclick={() => sortBy('model')}>Model<br>Protocol</TableHeadCell>
            <TableHeadCell class="w-32 text-center {sortColumn === 'apn' ? 'font-bold' : ''}font-medium hidden sm:table-cell">APN</TableHeadCell>
            <TableHeadCell class="text-center {sortColumn === 'lastUpdate' ? 'font-bold' : ''} font-medium" onclick={() => sortBy('lastUpdate')}>Last Update</TableHeadCell>
            <TableHeadCell class="text-center {sortColumn === 'status' ? 'font-bold' : ''} font-medium w-24">Status</TableHeadCell>
            <TableHeadCell class="text-center font-medium w-40 hidden sm:table-cell">Actions</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each filtered.sort(sort) as device}
                <TableBodyRow class="text-sm" onclick={() => deviceSelected(device)}>
                    <TableBodyCell class="w-4 p-4 hidden sm:table-cell">
                        <Checkbox checked={selected.includes(device.id)}/>
                    </TableBodyCell>
                    <TableBodyCell class="hidden sm:table-cell text-center max-w-sm overflow-hidden truncate font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                        <span>{device.id}</span>
                        <Tooltip class="lg:hidden">{device.id}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="space-x-6 p-4 w-96">
                        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div class="whitespace-normal text-base font-semibold text-gray-900 dark:text-white">{device.name}</div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">{device.uniqueId}</div>
                        </div>
                        <Tooltip class="lg:hidden" placement="top" arrow={false}>
                            {device.name} - {device.uniqueId}
                        </Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="hidden sm:table-cell text-center max-w-sm overflow-hidden truncate p-4 font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs">
                        <span>{device.phone}</span>
                        <Tooltip class="lg:hidden">{device.phone}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="text-center text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        <span class="whitespace-normal font-semibold text-gray-900 dark:text-white">{device.model || ''}</span><br>
                        <span>{device.position?.protocol || ''}</span>
                        <Tooltip class="lg:hidden">{device.model}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        <span>{device.attributes.apn || ''}</span>
                        <Tooltip class="lg:hidden">{device.attributes.apn || ''}</Tooltip>
                    </TableBodyCell>
                    <TableBodyCell class="overflow-ellipsis overflow-hidden text-center">
                        <span>{new Date(device.lastUpdate).toLocaleString()}</span>
                        <Tooltip>{new Date(device.lastUpdate).toLocaleString()}</Tooltip>
                        <br><span>{device.position && device.position.address}</span>
                        <Tooltip>{device.position && device.position.address}</Tooltip>
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
                                onclick={() => {
                                    current_device = device
                                    openDevice = true
                                }}
                        >
                            <EditOutline size="xs" /> Edit
                        </Button>
                        <Button
                                color="red"
                                size="xs"
                                onclick={() => {
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


<Device bind:open={openDevice} data={current_device} on:deleteDevice={handleDeleteDevice} on:updateDevice={handleUpdateDevice} devices={devices}/>
<Delete bind:open={openDelete} data={current_device} on:deleteDevice={handleDeleteDevice}/>
<SendConfig bind:open={sendConfig} selected={selected} bind:devices={devices}/>
<SendDriversConfig {devices} drivers={data.drivers} selected={selected}/>
<LinkUser bind:open={linkUser} selected={selected} users={data.users} devices={data.devices}/>
