import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "rastreosat-jo",
            project: "javascript-sveltekit",
            url: "https://sentry.io/"
        }
    }), sveltekit(), SvelteKitPWA({
        manifest: {
            short_name: 'Config',
            name: 'Configurator',
            theme_color: '#A5371B',
            icons: [
                {
                    src: 'pwa-64x64.png',
                    sizes: '64x64',
                    type: 'image/png',
                },
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any maskable',
                },
            ]
        }
    })],
	server: {
		proxy: {
			'/api/socket': 'ws://' + (process.env.VITE_TRACCAR_SERVER || 'gps.frotaweb.com'),
			'/api': 'http://' + (process.env.VITE_TRACCAR_SERVER || 'gps.frotaweb.com')
		}
	}
});
