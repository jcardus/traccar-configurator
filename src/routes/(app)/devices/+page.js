import {setError} from "$lib/store.js";
import {goto} from "$app/navigation";

export const ssr = false

export async function load({fetch}) {
    let devices, users, positions
    try {
        let response = await fetch('/api/devices?all=true');
        if (response.ok) {
            const _devices = await response.json()
            devices = _devices.slice(0, 500)
        } else {
            if (response.status === 401) { await goto('/login') }
            else { setError(await response.text()) }
        }
        response = await fetch('/api/positions');
        if (response.ok) {
            positions = await response.json()
            devices.forEach(d => (d.position = positions.find(p => p.deviceId === d.id)))
        } else {
            if (response.status === 401) { await goto('/login') }
            else { setError(await response.text()) }
        }
        response = await fetch('/api/users');
        if (response.ok) {
            users = await response.json()
        } else {
            if (response.status === 401) { await goto('/login') }
            else { setError(await response.text()) }
        }
    } catch (e) {
        setError(e.message)
    }
    return {devices, users, positions}
}
