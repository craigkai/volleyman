/** @type {import('tailwindcss').Config} */
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';

export default {
	plugins: [require('flowbite/plugin'), skeleton({
		themes: { preset: ["wintry"] }
	}), forms],
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
	}
};
