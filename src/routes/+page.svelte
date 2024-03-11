<script lang="ts">
	import { EventSupabaseDatabaseService } from '$lib/database/event';
	import { Spinner } from 'flowbite-svelte';
	import EventsCards from '$components/eventsCards.svelte';

	export let data: PageData;

	const eventsDatabaseService = new EventSupabaseDatabaseService(data?.supabase);
	const eventsPromise = eventsDatabaseService.getEvents();
</script>

{#await eventsPromise}
	<div class="h-screen flex flex-col items-center place-content-center">
		<Spinner />
	</div>
{:then events}
	<div class="flex flex-col items-center">
		<div>Upcoming events:</div>
		<EventsCards {events} readOnly={true} />
	</div>
{/await}
