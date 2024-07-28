<script>
    import '../../app.css';
    import Navbar from './Navbar.svelte';
    import Sidebar from './Sidebar.svelte';
    import {session} from "$lib/store.js";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    let drawerHidden = false;

    onMount(() => {
        let email = $session.email;
        if (!email) {
            goto('/login');
        }
    })
</script>

<header class="fixed top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
    <Navbar bind:drawerHidden />
</header>
<div class="overflow-hidden lg:flex">
    <Sidebar bind:drawerHidden />
    <div class="relative h-full w-full overflow-y-auto lg:ml-64 pt-[70px]">
        <main class="p-4">
            <div class="text-lg font-semibold text-gray-900 dark:text-white">
                <slot />
            </div>
        </main>
    </div>
</div>
