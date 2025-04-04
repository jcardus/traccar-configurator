<script>
    import '../../app.css';
    import Sidebar from './Sidebar.svelte';
    import {session} from "$lib/store.js";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";
    let drawerHidden = false;

    onMount(async () => {
        let email = $session.email;
        if (!email) {
            const response = await fetch('/api/session', {
                method: 'POST',
                body
            });
            if (response.ok) {
                session.set(await response.json());
                await goto('/')
            } else {
                setError(await response.text());
            }
        }
    })
</script>

<div class="flex min-h-full">
    <Sidebar bind:drawerHidden />
    <div class="min-h-full grow overflow-y-auto">
        <slot />
    </div>
</div>
