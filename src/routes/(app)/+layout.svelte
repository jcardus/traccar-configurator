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
<div class="flex min-h-full">
    <Sidebar bind:drawerHidden />
    <div class="min-h-full grow overflow-y-auto pt-[60px]">
        <slot />
    </div>
</div>
