<script >
    import {Checkbox, A, Button, Card } from 'flowbite-svelte';
    import {writable} from "svelte/store";
    import { setError, session } from '$lib/store';
    import {goto} from "$app/navigation";
    export let title = 'Sign in to Configurator';
    export let rememberMe = false;
    export let lostPassword = false;
    export let createAccount = false;
    export let lostPasswordLink = '';
    export let loginTitle = 'Login to your account';
    export let registerLink = '';
    export let createAccountTitle = 'Create account';
    export let mainDivClass =
        'flex flex-col items-center justify-center mx-auto md:h-screen pt:mt-0 dark:bg-gray-900';
    export let cardH1Class = 'text-2xl font-bold text-gray-900 dark:text-white';

    let error = writable('');

    const handlePasswordLogin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const body = new URLSearchParams();
        for (const pair of formData.entries()) {
            body.append(pair[0], pair[1]);
        }
        try {
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
        } catch (e) {
            error.set(e.message);
        }
    }
</script>

<div class={mainDivClass}>
    <!-- Card -->
    <Card class="w-full" size="md" border={false}>
        <h1 class={cardH1Class}>
            {title}
        </h1>
        <form class="mt-8 space-y-6" on:submit|preventDefault={handlePasswordLogin}>
            <slot />
            {#if rememberMe || lostPassword}
                <div class="flex items-start">
                    {#if rememberMe}
                        <Checkbox class="accent-primary-600" name="remember">Remember me</Checkbox>
                    {/if}
                    {#if lostPassword}
                        <A href={lostPasswordLink} aClass="ml-auto text-sm">Lost Password?</A>
                    {/if}
                </div>
            {/if}
            <Button type="submit" class="accent-primary-600" size="lg">{loginTitle}</Button>
            {#if createAccount}
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Not registered? <A href={registerLink}>{createAccountTitle}</A>
                </div>
            {/if}
        </form>
    </Card>
</div>

