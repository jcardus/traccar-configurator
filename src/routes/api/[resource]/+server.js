function forwardRequest({ request, platform }) {
    const host = (platform && platform.env.TRACCAR_SERVER) || import.meta.env.VITE_TRACCAR_SERVER
    const url = new URL(request.url.replace('https://', 'http://'))
    url.host = host
    url.port = 80
    return fetch(new Request(url, request))
}

export const GET = event => forwardRequest(event);
export const POST = event => forwardRequest(event);
export const DELETE = event => forwardRequest(event);
