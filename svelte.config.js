//import adapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-auto';
import {vitePreprocess} from "@sveltejs/vite-plugin-svelte";
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: 'index.html' // may differ from host to host
		}),
		paths: {
			base: "/config"
		}
	},
	preprocess: vitePreprocess()
};

export default config;
