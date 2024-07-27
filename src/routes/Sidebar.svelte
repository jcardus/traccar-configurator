<script>
    import {Sidebar, SidebarDropdownWrapper, SidebarGroup, SidebarItem, SidebarWrapper} from "flowbite-svelte";
    import { page } from '$app/stores';
    import {
        AngleDownOutline,
        AngleUpOutline,
        GridPlusOutline,
        MessagesOutline,
    } from "flowbite-svelte-icons";
    let drawerHidden = false;
    let mainSidebarUrl = $page.url.pathname;
    let activeMainSidebar;

    let iconClass =
        'flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white';
    let itemClass =
        'flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700';
    let groupClass = 'pt-2 space-y-2';


    let items = [
        { name: 'Devices', icon: GridPlusOutline, href: '/' },
        { name: 'SMS', icon: MessagesOutline, href: '/sms' }
    ];
    let dropdowns = Object.fromEntries(Object.keys(items).map((x) => [x, false]));
</script>

<Sidebar
        class={drawerHidden ? 'hidden' : ''}
        activeUrl={mainSidebarUrl}
        activeClass="bg-gray-100 dark:bg-gray-700"
        asideClass="fixed inset-0 z-30 flex-none h-full w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible lg:pt-16 lg:block"
>
    <h4 class="sr-only">Main menu</h4>
    <SidebarWrapper
            divClass="overflow-y-auto px-3 pt-20 lg:pt-5 h-full bg-white scrolling-touch max-w-2xs lg:h-[calc(100vh-4rem)] lg:block dark:bg-gray-800 lg:me-0 lg:sticky top-2"
    >
        <nav class="divide-y divide-gray-200 dark:divide-gray-700">
            <SidebarGroup ulClass={groupClass} class="mb-3">
                {#each items as { name, icon, children, href } (name)}
                    {#if children}
                        <SidebarDropdownWrapper bind:isOpen={dropdowns[name]} label={name} class="pr-3">
                            <AngleDownOutline slot="arrowdown" strokeWidth="3.3" size="sm" />
                            <AngleUpOutline slot="arrowup" strokeWidth="3.3" size="sm" />
                            <svelte:component this={icon} slot="icon" class={iconClass} />

                            {#each Object.entries(children) as [title, href]}
                                <SidebarItem
                                        label={title}
                                        {href}
                                        spanClass="ml-9"
                                        class={itemClass}
                                        active={activeMainSidebar === href}
                                />
                            {/each}
                        </SidebarDropdownWrapper>
                    {:else}
                        <SidebarItem
                                label={name}
                                {href}
                                spanClass="ml-3"
                                class={itemClass}
                                active={activeMainSidebar === href}
                        >
                            <svelte:component this={icon} slot="icon" class={iconClass} />
                        </SidebarItem>
                    {/if}
                {/each}
            </SidebarGroup>
        </nav>
    </SidebarWrapper>
</Sidebar>