<script>
    import {
        Heading, Indicator, Table, TableBody, TableBodyCell, TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";

    import {collectionStore, getFirebaseContext} from 'sveltefire';
    const {firestore} = getFirebaseContext();
    const phones = collectionStore(firestore, 'phones');
</script>


<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
    <div class="p-4">
        <Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Phones
        </Heading>
    </div>
    <Table>
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            {#each ['Name', 'Last online', 'Last message'] as title}
                <TableHeadCell class="text-center p-4 font-medium">{title}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each $phones as phone}
                <TableBodyRow class="text-base">
                    <TableBodyCell class="flex items-center space-x-6 whitespace-nowrap p-4">
                        <div class="text-sm font-normal text-gray-500 dark:text-gray-400">
                            <div class="text-base font-semibold text-gray-900 dark:text-white">{phone.manufacturer} {phone.brand}</div>
                            <div class="text-sm font-normal text-gray-500 dark:text-gray-400">{phone['device-model']}</div>
                        </div>
                    </TableBodyCell>
                    <TableBodyCell class="p-4 font-normal self-center">
                        <div class="flex justify-center items-center gap-2">
                            <Indicator color={(new Date() - new Date(phone['last-online'])) < 1000 * 60 * 60 ? 'green' : 'red' }/>
                            {new Date(phone['last-online']).toLocaleString()}
                        </div>
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4">
                        {phone['last-message'] || ''}
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</main>
