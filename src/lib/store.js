import { writable } from 'svelte/store';

const isClient = typeof window !== 'undefined';

const storedSession = isClient ? localStorage.getItem('session') : null;
export const session = writable(storedSession ? JSON.parse(storedSession) : {});
export const error = writable(null);

if (isClient) {
    session.subscribe((value) => {
        localStorage.setItem('session', JSON.stringify(value));
    });
}
export function setError(message) {
    error.set(message);
}
export function clearError() {
    error.set(null);
}
