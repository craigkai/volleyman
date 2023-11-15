<script lang="ts">
	import type { PageData } from '../$types';
	import type { Database } from '../../types/supabase';
	import { create_schedule } from '$lib/schedule';

	export let data: PageData;
	let loadedEvent: Database.public.Tables.events;

	let schedule: any;
	let teams: string, courts: number, pools: number;
	function setSchedule() {
		schedule = create_schedule({
			teams: teams.split(','),
			courts,
			pools
		});
	}

	async function loadEvent() {
		data.supabase
			.from('events')
			.select('*')
			.or(`id.eq.${data?.event_id},name.eq.${data?.event_name}`)
			.single()
			.then(({ data: event }) => {
				loadedEvent = event;

				if ((loadedEvent?.teams, loadedEvent?.courts, loadedEvent?.pools)) {
					teams = loadedEvent?.teams.join(',');
					courts = loadedEvent?.courts;
					pools = loadedEvent?.pools;

					setSchedule();
				}
			});
	}
	let loadingEventPromise = loadEvent();
</script>

{#await loadingEventPromise}
	loading...
{:then}
	{#if loadedEvent}
		<h1>{loadedEvent?.name}</h1>

		<div class="flex flex-col place-content-center place-items-center place-self-center">
			<div class="w-1/2 m-2">
				Teams:
				<input class="bg-gray-200 p-2 rounded" type="text" bind:value={teams} />
			</div>
			<div class="w-1/2 m-2">
				Numbr of Courts:
				<input class="bg-gray-200 p-2 rounded" type="number" bind:value={courts} />
			</div>

			<div class="w-1/2 m-2">
				Number of Pool Play Games:
				<input class="bg-gray-200 p-2 rounded" type="number" bind:value={pools} />
			</div>
			<div class="w-1/2 m-2">
				<button class="rounded bg-gray-400 p-4 hover:bg-gray-600" on:click={() => setSchedule()}
					>Generate Schedule</button
				>
			</div>
			<div class="w-1/2 m-2">
				{#if schedule}
					<ul>
						{#each schedule.pool_matches as match, i}
							Round {i + 1}
							{#each match.game_matches as court}
								<li>{JSON.stringify(court)}</li>
							{/each}
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	{:else}
		Invalid event id, is your link correct?
	{/if}
{/await}