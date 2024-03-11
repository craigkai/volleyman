<!-- src/routes/+layout.svelte -->

<script lang="ts">
	import '../app.postcss';
	import Header from '$components/Header.svelte';
	import Footer from '$components/Footer.svelte';
	import { invalidate } from '$app/navigation';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { error } from '$lib/toast';

	inject({ mode: dev ? 'development' : 'production' });

	export let data: LayoutData;
	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let authChange = false;
	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
			authChange = !authChange;
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	const options = {};

	function handleError(err: string | SvelteToastOptions) {
		error(err);
	}
</script>

<svelte:window on:error={handleError} />
<svelte:head>
	<title>Volleyman</title>
</svelte:head>

<html lang="en">
	<ModeWatcher />
	<div class="dark:text-nord-12">
		<Header {data} {authChange} />

		<div class="min-h-screen">
			<div class="wrap">
				<SvelteToast {options} />
			</div>
			<slot {data} />
		</div>

		<Footer {data} />
	</div>
</html>
