<script>
    import {
        Button,
        Checkbox,
        Heading,
        Indicator
    } from 'flowbite-svelte';
    import { Input, Table, TableBody, TableBodyCell, TableBodyRow, TableHead } from 'flowbite-svelte';
    import { TableHeadCell, Toolbar, ToolbarButton } from 'flowbite-svelte';
    import { CogSolid, DotsVerticalOutline, DownloadSolid } from 'flowbite-svelte-icons';
    import {
        EditOutline,
        ExclamationCircleSolid,
        PlusOutline,
        TrashBinSolid
    } from 'flowbite-svelte-icons';
    import Delete from "./Delete.svelte";
    import Device from "./Device.svelte";

    let openDevice = false; // modal control
    let openDelete = false; // modal control

    let current_device = {};
    export let data;
</script>

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
    <div class="p-4">
        <Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Devices
        </Heading>
        <Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
            <Input placeholder="Search for devices" class="me-4 w-80 border xl:w-96" />
            <div class="border-l border-gray-100 pl-2 dark:border-gray-700">
                <ToolbarButton
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
                        on:click={() => ((current_device = {}), (openDevice = true))}
                >
                    <PlusOutline size="sm" />Add device
                </Button>
                <Button size="sm" color="alternative" class="gap-2 px-3">
                    <DownloadSolid size="md" class="-ml-1" />Export
                </Button>
            </div>
        </Toolbar>
    </div>
    <Table>
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            <TableHeadCell class="w-4 p-4"><Checkbox /></TableHeadCell>
            <TableHeadCell class="p-4 font-medium">Name</TableHeadCell>
            {#each ['Phone', 'Position', 'Status', 'Actions'] as title}
                <TableHeadCell class="text-center p-4 font-medium">{title}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each data.devices as device}
                <TableBodyRow class="text-base">
                    <TableBodyCell class="w-4 p-4"><Checkbox /></TableBodyCell>
                    <TableBodyCell class="max-w-64 mr-12 flex items-center space-x-6 whitespace-nowrap p-4">
                        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div class="text-base font-semibold text-gray-900 dark:text-white">{device.name}</div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">{device.uniqueId}</div>
                        </div>
                    </TableBodyCell>
                    <TableBodyCell
                            class="text-center max-w-sm overflow-hidden truncate p-4 text-base font-normal text-gray-500 dark:text-gray-400 xl:max-w-xs"
                    >
                        {device.phone}
                    </TableBodyCell>
                    <TableBodyCell class="p-4">{device.position}</TableBodyCell>
                    <TableBodyCell class="p-4 font-normal">
                        <div class="flex items-center gap-2">
                            <Indicator color={device.status === 'Active' ? 'green' : 'red'} />
                            {device.status}
                        </div>
                    </TableBodyCell>
                    <TableBodyCell class="space-x-2 p-4">
                        <Button
                                size="sm"
                                class="gap-2 px-3"
                                on:click={() => ((current_device = device), (openDevice = true))}
                        >
                            <EditOutline size="sm" /> Edit device
                        </Button>
                        <Button
                                color="red"
                                size="sm"
                                class="gap-2 px-3"
                                on:click={() => ((current_device = device), (openDelete = true))}
                        >
                            <TrashBinSolid size="sm" /> Delete device
                        </Button>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</main>


<Device bind:open={openDevice} data={current_device} />
<Delete bind:open={openDelete} />
