<script lang="ts">
	import dayjs from 'dayjs';
	import type { SvelteToastOptions } from '@zerodevx/svelte-toast/stores';
	import { goto } from '$app/navigation';
	import { error, success } from '$lib/toast';
	import type { HttpError } from '@sveltejs/kit';
	import { Event } from '$lib/event';

	export let tournament: Event;
	export let event_id: number | string;

	async function createNewEvent(): Promise<void> {
		tournament.courts = Number(tournament.courts);
		tournament.pools = Number(tournament.pools);

		tournament
			.create(tournament)
			.then(async () => {
				success(`Tournament created`);
				// Navigate to the page with the [slug] value set to our tournament Id
				goto(`/protected-routes/events/${tournament.id}`, {
					state: { eventCreated: tournament.id }
				});
			})
			.catch((err: HttpError) => {
				error(err.toString());
			});
	}

	async function updateTournament(): Promise<void> {
		tournament.courts = Number(tournament.courts);
		tournament.pools = Number(tournament.pools);

		tournament
			.update(tournament.id, tournament)
			.then((res: Event) => {
				tournament = res;
				success(`Tournament settings updated`);
			})
			.catch((err) => {
				console.error(err);
				error(err.body?.message ?? `Something went wrong: ${err}`);
			});
	}

	async function deleteEvent(): Promise<void> {
		tournament
			.delete()
			.then(() => {
				goto('/protected-routes/dashboard');
				success(`Deleted ${tournament.name}`);
			})
			.catch((err: { body: { message: string | SvelteToastOptions } }) =>
				error(err?.body?.message)
			);
	}

	$: tournament?.date, (tournament.date = dayjs(tournament?.date).format('YYYY-MM-DD'));
</script>

<div class="m-2 shadow-md rounded flex flex-col items-center lg:w-1/2 sm:w-full">
	<div class="m-2">
		<label class="mb-2 label" for="eventName"> <span>Event Name:</span></label>
		<input class="input" type="text" id="eventName" bind:value={tournament.name} required />
	</div>

	<div class="m-2">
		<label class="mb-2 label" for="eventCourts"><span>Number of Courts:</span></label>
		<input class="input" type="number" id="eventCourts" bind:value={tournament.courts} required />
	</div>

	<div class="m-2">
		<label class="mb-2 label" for="eventPools"><span>Number of Pool Play Games:</span></label>
		<input class="input" type="number" id="eventPools" bind:value={tournament.pools} required />
	</div>

	<div class="m-2">
		<label class="label" for="eventRefs">
			<span>Ref'ing:</span>
			<select id="eventRefs" class="mt-2 input" bind:value={tournament.refs}>
				<option value="provided">Provided</option>
				<option value="teams">Teams</option>
			</select>
		</label>
	</div>

	<div class="m-2">
		<label class="mb-2 label" for="eventDate"><span>Date:</span></label>
		<input
			id="eventDate"
			class="bg-gray-200 p-2 rounded"
			type="date"
			bind:value={tournament.date}
		/>
	</div>

	<div class="m-2">
		<label class="label" for="eventScoring">
			<span>Pool Play Scoring:</span>
			<select class="mt-2 select" bind:value={tournament.scoring}>
				<option value="points">Points</option>,
				<option value="wins">Wins</option>,
			</select>
		</label>
	</div>

	<div class="m-2">
		{#if event_id === 'create'}
			<button
				class="button variant-filled-primary p-2 rounded"
				type="button"
				on:click={() => createNewEvent()}
			>
				Create Tournament</button
			>{:else}
			<button
				class="button variant-filled-primary rounded py-2 px-4"
				type="button"
				on:click={() => updateTournament()}
			>
				Update Tournament Settings</button
			>
		{/if}
	</div>

	{#if event_id !== 'create'}
		<button
			class="button variant-filled-warning rounded py-2 px-4"
			type="button"
			on:click={deleteEvent}>Delete event</button
		>
	{/if}
</div>
