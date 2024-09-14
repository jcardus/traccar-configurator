<script>
    import '../../app.css'
    import { Label, Input } from 'flowbite-svelte';
    import SignIn from './SignIn.svelte';
    let title = 'Sign in to Configurator';
    let site = {
        name: 'Configurator',
        img: '/logo.png',
        link: '/',
        imgAlt: 'Logo'
    };
    let rememberMe = true;
    let createAccount = true;
    let lostPasswordLink = 'forgot-password';
    let loginTitle = 'Login to your account';

    const onSubmit = (e) => {
        const formData = new FormData(e.target);

        const data = {};
        for (const field of formData.entries()) {
            const [key, value] = field;
            data[key] = value;
        }
    };

</script>

<SignIn
        {title}
        {site}
        {rememberMe}
        {createAccount}
        {lostPasswordLink}
        {loginTitle}
        on:submit={onSubmit}
>
    <div>
        <Label for="email" class="mb-2 dark:text-white">Your email</Label>
        <Input
                type="text"
                name="email"
                id="email"
                required
                class="border outline-none dark:border-gray-600 dark:bg-gray-700"
        />
    </div>
    <div>
        <Label for="password" class="mb-2 dark:text-white">Your password</Label>
        <Input
                type="password"
                name="password"
                id="password"
                required
                class="border outline-none dark:border-gray-600 dark:bg-gray-700"
        />
    </div>
</SignIn>
