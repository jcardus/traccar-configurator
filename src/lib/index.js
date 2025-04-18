// place files you want to import through the `$lib` alias in this folder.
import {error, session, setAlert, setError} from "$lib/store.js";
import {goto} from "$app/navigation";

export async function logout() {
    try {
        const response = await fetch('/api/session', {
            method: 'DELETE'
        });
        if (response.ok) {
            session.set({});
        } else {
            setError(await response.text());
        }
    } catch (e) {
        error.set(e.message);
    }
    await goto('/login')
}

export async function sendCommand(command) {
    const response = await fetch('/api/commands/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
    });

    if (response.ok) {
//        setAlert(`${command.attributes.data} sent to device ${command.deviceId}`)
    } else {
        throw Error(await response.text());
    }
}


export async function addPermission(permission) {
    const response = await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permission),
    });

    if (response.ok) {
        setAlert(`User ${permission.userId} linked to device ${permission.deviceId}`)
    } else {
        throw Error(await response.text());
    }
}

export async function forwardRequest({ request, platform }) {
    try {
        const host = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
        const url = new URL(request.url.replace('https://', 'http://'))
        url.host = host
        url.port = 80
        const response = await fetch(new Request(url, request))
        const t = await response.text();
        return new Response(t, {
            headers: {'set-cookie': response.headers.getSetCookie() || ''},
            status: response.status
        })
    } catch (e) {
        return new Response(e, {status: 500})
    }
}

export function copyToClipboard(message) {
    navigator.clipboard.writeText(message).then(() => {
        setAlert(`${message} copied to clipboard!`);
    }).catch(err => {
        console.error(err);
    });
}

export function forward ({request, platform}, cf) {
    const url = new URL(request.url)
    url.host = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
    url.protocol = 'http:'
    url.port = 80
    return fetch(new Request(url, request), cf)
}
