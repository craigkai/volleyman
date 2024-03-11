import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { execSync } from 'child_process';
import path from 'path';

process.env.VITE_COMMIT_REF = execSync('git rev-parse HEAD').toString().trim();

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [vitePreprocess({})],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$lib: path.resolve('src/lib'),
			$components: path.resolve('src/components'),
			$supabaseTypes: path.resolve('src/types/supabase'),
			$schemas: path.resolve('src/schemas')
		}
	}
};

export default config;
