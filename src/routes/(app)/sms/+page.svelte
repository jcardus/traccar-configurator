<script>
    import {
        Checkbox,
        Heading, Input, Table, TableBody,
        TableHead,
        TableHeadCell,
        Toolbar
    } from "flowbite-svelte";

    export let data;
</script>

<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
    <div class="p-4">
        <Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Sms
        </Heading>
        <Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
            <Input placeholder="Search" class="me-4 w-80 border xl:w-96" />
            <div class="border-l border-gray-100 pl-2 dark:border-gray-700">
            </div>
        </Toolbar>
    </div>
    <Table>
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            <TableHeadCell class="w-4 p-4"><Checkbox /></TableHeadCell>
            <TableHeadCell class="p-4 font-medium">Name</TableHeadCell>
            {#each ['Phone', 'Last Update', 'Status', 'Actions'] as title}
                <TableHeadCell class="text-center p-4 font-medium">{title}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
        </TableBody>
    </Table>
</main>
