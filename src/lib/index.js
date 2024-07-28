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
