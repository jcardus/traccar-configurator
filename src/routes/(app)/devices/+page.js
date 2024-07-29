import {setError} from "$lib/store.js";

export const ssr = false

export async function load() {
    try {
        const response = await fetch('/api/devices');
        const devices = await response.json()
        if (response.ok) {
            return {devices: devices.slice(0, 500)}
        } else {
            setError(await response.text())
        }
    } catch (e) {
        setError(e.message)
    }
    return {devices: []}
}
