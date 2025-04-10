<script>
    import {
        Button,
        Heading, Indicator, Modal, Table, TableBody, TableBodyCell, TableBodyRow,
        TableHead,
        TableHeadCell,
    } from "flowbite-svelte";

    // import {collectionStore, docStore, getFirebaseContext} from 'firebase';
    import {TrashBinSolid} from "flowbite-svelte-icons";
    import {copyToClipboard} from "$lib";
    // import { deleteDoc } from "firebase/firestore";
    const {href} = $props()

    // const {firestore} = getFirebaseContext();
    const phones = [] /*collectionStore(firestore, 'phones');*/
    let defaultModal = $state(false);
    const handleDelete = async () => {
        // await deleteDoc(docStore(firestore, "phones/" + current_phone.id).ref);
        setAlert(current_phone.brand + " deleted.")
    };
    let current_phone = $state('');
</script>


<main class="relative h-full w-full overflow-y-auto bg-white dark:bg-gray-800">
    <div class="p-4">
        <Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Phones {JSON.stringify(href)}
        </Heading>
    </div>
    <Table>
        <TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
            {#each ['Name', 'Last online', 'Last message', 'Actions'] as title}
                <TableHeadCell class="text-center p-4 font-medium">{title}</TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each phones as phone}
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
                    <TableBodyCell class="text-center p-4 max-w-40 truncate" >
                        <button onclick={() => copyToClipboard(phone['last-message'])}
                                title="{phone['last-message'] || ''}">{phone['last-message'] || ''}
                        </button>
                    </TableBodyCell>
                    <TableBodyCell>
                        <div class="flex justify-center">
                            <Button
                                    color="red"
                                    size="sm"
                                    class="gap-2 px-3"
                                    onclick={() => ((current_phone = phone), (defaultModal = true))}
                            >
                                <TrashBinSolid size="sm" /> Delete
                            </Button>
                        </div>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</main>

<Modal title="" bind:open={defaultModal} autoclose size="sm" class="w-full">
    <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
    <p class="mb-4 text-gray-500 dark:text-gray-300 text-center">Are you sure you want to delete {current_phone.brand} phone?</p>
    <div class="flex justify-center items-center space-x-4">
        <Button color="light">No, cancel</Button>
        <Button color="red" onclick={handleDelete}>Yes, I'm sure</Button>
    </div>
</Modal>
