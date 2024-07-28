export async function GET({ request, platform }) {
    const url = new URL(request.url.replace('https://', 'http://'))
    url.host = platform.env.TRACCAR_SERVER
    return fetch(new Request(url, request))
}
