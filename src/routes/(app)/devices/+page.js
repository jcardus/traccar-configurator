import {setError} from "$lib/store.js";
import {goto} from "$app/navigation";

export const ssr = false

export async function load({fetch}) {
    try {
        const response = await fetch('/api/devices?all=true');
        if (response.ok) {
            const devices = await response.json()
            return {devices: devices.slice(0, 500)}
        } else {
            if (response.status === 401) { await goto('/login') }
            else { setError(await response.text()) }
        }
    } catch (e) {
        setError(e.message)
    }
    return {devices: []}
}
