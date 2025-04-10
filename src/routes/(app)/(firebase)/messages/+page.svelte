<script>
    import {
        Heading,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell
    } from "flowbite-svelte";

    import {copyToClipboard} from "$lib";

    // const {firestore} = getFirebaseContext();
    const messages = [] // collectionStore(firestore, 'messages');

</script>


<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
    <div class="p-4">
        <Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Messages
        </Heading>
    </div>
    <Table>
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            {#each ['Date', 'Phone', 'Message', 'State', 'Sender', 'Last update'] as title}
                <TableHeadCell class="text-center p-4 font-medium">{title}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each messages.sort((a, b) => b.timestamp - a.timestamp) as message}
                <TableBodyRow class="text-base">
                    <TableBodyCell class="text-center p-4">
                        {new Date(message.timestamp).toLocaleString()}
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4" >
                        {message.phone}
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4 max-w-40 truncate" >
                        <button onclick={() => copyToClipboard(message.message)}
                                title="{message.message || ''}">{message.message || ''}
                        </button>
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4">
                        {message.state || ''}
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4">
                        {message.sender || ''}
                    </TableBodyCell>
                    <TableBodyCell class="text-center p-4">
                        {message['last-update'] && new Date(message['last-update']).toLocaleString()}
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</main>
