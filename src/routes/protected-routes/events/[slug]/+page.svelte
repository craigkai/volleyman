<script lang="ts">
	import type { PageData } from '$types';
	import Settings from '$components/Settings.svelte';
	import Bracket from '$components/Bracket.svelte';
	import Standings from '$components/Standings.svelte';
	import Matches from '$components/Matches.svelte';
	import Teams from '$components/Teams.svelte';
	import { loadInitialData } from '$lib/helper';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import EditMatch from '$components/EditMatch.svelte';
	import * as Tabs from '$components/ui/tabs/index.js';
	import * as Card from '$components/ui/card/index.js';
	import { page } from '$app/stores';
	import { Modal } from 'flowbite-svelte';
	import { initiateEvent } from '$lib/helper';

	export let data: PageData;
	let { supabase, event_id, form } = data;

	let { tournament, matches, teams, bracket } = initiateEvent(event_id, supabase);

	async function reloadEventInstances() {
		if ($page.state.eventCreated) {
			// Use const instead of let to declare the variables
			const {
				tournament: newTournament,
				matches: newMatches,
				teams: newTeams,
				bracket: newBracket
			} = initiateEvent($page.state.eventCreated, supabase);

			await loadInitialData(newTournament, newMatches, newTeams, newBracket);

			// Update the variables with the new values
			tournament = newTournament;
			matches = newMatches;
			teams = newTeams;
			bracket = newBracket;

			await loadInitialData(tournament, matches, teams, bracket);
		}
	}

	$: $page.state.eventCreated, reloadEventInstances();

	const loadingInitialDataPromise = loadInitialData(tournament, $matches, teams, bracket);

	const isCreate = data?.event_id === 'create';
</script>

{#if $page.state.showModal && $page.state.matchId}
	<Modal size="xs" on:close={() => history.back()} open={true} outsideclose autoclose>
		{#if $page.state.type === 'pool'}
			<EditMatch matchId={$page.state.matchId} bind:matches />
		{:else}
			<EditMatch matchId={$page.state.matchId} bind:matches={bracket} />
		{/if}
	</Modal>
{/if}

<div class="flex flex-col items-center">
	{#await loadingInitialDataPromise}
		<div class="h-screen flex flex-col items-center place-content-center">
			<Loader2 class="animate-spin" />
		</div>
	{:then}
		<div class="m-2">
			<Tabs.Root value="settings" class="w-full">
				<Tabs.List class="grid w-full grid-cols-5">
					<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
					<Tabs.Trigger disabled={isCreate} value="teams">Teams</Tabs.Trigger>
					<Tabs.Trigger disabled={isCreate} value="matches">Matches</Tabs.Trigger>
					<Tabs.Trigger disabled={isCreate} value="standings">Standings</Tabs.Trigger>
					<Tabs.Trigger disabled={isCreate} value="bracket">Bracket</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="settings">
					<Card.Root>
						<Card.Header>
							<Card.Title>Account</Card.Title>
							<Card.Description>Make changes to your event here.</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">
							<Settings {event_id} data={form} />
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="teams">
					<Card.Root>
						<Card.Header>
							<Card.Title>Teams</Card.Title>
							<Card.Description>Add/remove teams</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">
							<Teams bind:teams />
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="matches">
					<Card.Root>
						<Card.Header>
							<Card.Title>Matches</Card.Title>
							<Card.Description>Update pool play match results</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">
							<Matches bind:tournament bind:matches {teams} defaultTeam="" />
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="standings">
					<Card.Root>
						<Card.Header>
							<Card.Title>Current Standings</Card.Title>
							<Card.Description>Current standings based on pool play results</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">
							<Standings event={tournament} {matches} {teams} defaultTeam="" />
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				<Tabs.Content value="standings">
					<Card.Root>
						<Card.Header>
							<Card.Title>Bracket</Card.Title>
							<Card.Description>Single/Double elim bracket</Card.Description>
						</Card.Header>
						<Card.Content class="space-y-2">
							<Bracket {tournament} {bracket} {teams} {matches} readOnly={false} />
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	{/await}
</div>
