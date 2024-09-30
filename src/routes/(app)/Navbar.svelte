<script>
    import "../../app.css";
    import {
        Navbar,
        NavBrand,
        NavHamburger,
        DarkMode
    } from 'flowbite-svelte';
    import UserMenu from "./UserMenu.svelte";
    import NavContainer from "flowbite-svelte/NavContainer.svelte";

    export let drawerHidden=false;
    export let fluid=true
</script>
<Navbar>
    <NavContainer>
        <NavHamburger
                onClick={() => (drawerHidden = !drawerHidden)}
                class="m-0 me-3 md:block lg:hidden"
        />
        <NavBrand href="/" class="lg:w-60">
            <img
                    src="/logo.svg"
                    class="me-2.5 h-6 sm:h-8"
                    alt="Logo"
            />
            <span
                    class="ml-px self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl"
            >
				Configurator
			</span>
            <div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
                <DarkMode />
                <UserMenu />
            </div>
        </NavBrand>
    </NavContainer>
</Navbar>
