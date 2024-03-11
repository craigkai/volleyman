<script lang="ts">
	import type { PageData } from '$types';
	import { Hamburger } from 'svelte-hamburgers';
	import { Button } from '$components/ui/button';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';

	export let data: PageData;
	export let authChange: boolean;
	let { supabase } = data;

	let open: boolean = false;

	let currentUser: { data: { user: { aud: string } } };
	async function getCurrentUser() {
		return await supabase.auth.getUser().then((res: { data: { user: { aud: string } } }) => {
			currentUser = res;
		});
	}
	$: authChange, getCurrentUser();
</script>

<div class="absolute end-0">
	<Hamburger bind:open --color="white" />
</div>

<header class="w-full">
	<!-- Navigation bar -->
	<div class="bg-blue-500 dark:bg-nord-1 p-4">
		<a href="/" class="flex">
			<img class="h-20 w-20 p-2" src="/vball.svg" alt="volleyman" />
			<h1 class="flex dark:text-nord-12 justify-center items-center text-5l front-extrabold">
				Volleyman(ager)<span
					class="bg-blue-100 text-blue-800 text-2xl front-semibold px-2.5 py-0.5
				rounded ml-2">Beta</span
				>
			</h1>
		</a>

		<nav
			class:hidden={!open}
			class="relative flex w-full items-center justify-between py-2 bg-white rounded text-neutral-600 shadow-lg hover:text-neutral-700 focus:text-neutral-700 dark:bg-nord-9 dark:text-nord-2 md:flex-wrap md:justify-start"
		>
			<div class="flex w-full flex-wrap items-center justify-between px-3">
				<div class="flex-row">
					<!-- Navigation links -->
					<div class="grow basis-[100%] items-center lg:!flex lg:basis-auto">
						<ul class="mr-auto flex flex-col lg:flex-row" data-te-navbar-nav-ref>
							<li class="mb-4 lg:mb-0 lg:pr-2" data-te-nav-item-ref>
								<a
									class="block transition duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:hover:text-white dark:focus:text-white lg:p-2 [&.active]:text-black/90"
									href="/"
									data-te-nav-link-ref
									data-te-ripple-init
									data-te-ripple-color="light">Home</a
								>
							</li>

							{#if currentUser?.data?.user?.aud === 'authenticated'}
								<li class="mb-4 lg:mb-0 lg:pr-2" data-te-nav-item-ref>
									<a
										class="block transition duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:hover:text-white dark:focus:text-white lg:p-2 [&.active]:text-black/90"
										href="/protected-routes/dashboard"
										data-te-nav-link-ref
										data-te-ripple-init
										data-te-ripple-color="light"
										>My Dashboard
									</a>
								</li>
							{:else}
								<li class="mb-4 lg:mb-0 lg:pr-2" data-te-nav-item-ref>
									<a
										class="block transition duration-150 ease-in-out hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:hover:text-white dark:focus:text-white lg:p-2 [&.active]:text-black/90"
										href="/auth"
										data-te-nav-link-ref
										data-te-ripple-init
										data-te-ripple-color="light"
										>Login
									</a>
								</li>
							{/if}
							<li data-te-nav-item-ref>
								<Button on:click={toggleMode} variant="outline" size="icon">
									<Sun
										class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
									/>
									<Moon
										class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
									/>
									<span class="sr-only">Toggle theme</span>
								</Button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</nav>
	</div>
</header>
