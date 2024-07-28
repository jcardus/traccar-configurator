// place files you want to import through the `$lib` alias in this folder.
import {error, session, setError} from "$lib/store.js";
import {goto} from "$app/navigation";

export async function logout() {
    try {
        const response = await fetch('/api/session', {
            method: 'DELETE'
        });
        if (response.ok) {
            session.set({});
            await goto('/login')
        } else {
            setError(await response.text());
        }
    } catch (e) {
        error.set(e.message);
    }
}

export async function forwardRequest({ request, platform }) {
    const host = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
    const url = new URL(request.url.replace('https://', 'http://'))
    url.host = host
    url.port = 80
    const response = await fetch(new Request(url, request))
    const t = await response.text();
    return new Response(t);
}
