<script lang="ts">
	import type { PageData } from '$types';
	import Matches from '$components/Matches.svelte';
	import Bracket from '$components/Bracket.svelte';
	import { initiateEvent, loadInitialData } from '$lib/helper';
	import Standings from '$components/Standings.svelte';
	import * as Select from '$components/ui/select/index.js';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import * as Tabs from '$components/ui/tabs/index.js';
	import * as Card from '$components/ui/card/index.js';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { pushState } from '$app/navigation';
	import { onMount, tick } from 'svelte';

	export let data: PageData;
	let { supabase, event_id } = data;

	let { tournament, matches, teams, bracket } = initiateEvent(event_id, supabase);

	const loadingInitialDataPromise = loadInitialData(tournament, $matches, teams, bracket);
	let defaultTeam = data.default_team;

	let historyReady = false;
	onMount(async () => {
		await tick();
		historyReady = true;
	});

	function updateHistory() {
		if (browser && historyReady) {
			$page.url.searchParams.set('team', defaultTeam);
			const url = $page.url.href;
			pushState(url, '');
		}
	}

	$: defaultTeam, updateHistory();

	$: teamsSelect =
		teams.teams
			.map((team) => {
				return { value: team.name, name: team.name };
			})
			.concat([{ value: '', name: 'none' }]) || [];
</script>

<div class="flex flex-col items-center">
	{#await loadingInitialDataPromise}
		<div class="h-screen flex flex-col items-center place-content-center">
			<Loader2 class="animate-spin" />
		</div>
	{:then}
		{tournament?.name}

		<div class="m-2">
			<Select.Root>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Select a team" />
				</Select.Trigger>
				<Select.Content>
					{#each teamsSelect as team}
						<Select.Item value={team.value} label={team.name}>{team.name}</Select.Item>
					{/each}
				</Select.Content>
				<Select.Input name="selectedTeam" />
			</Select.Root>
		</div>

		<Tabs.Root value="matches" class="md:w-1/2">
			<Tabs.List class="grid w-full grid-cols-3">
				<Tabs.Trigger value="matches">Matches</Tabs.Trigger>
				<Tabs.Trigger value="standings">Standings</Tabs.Trigger>
				<Tabs.Trigger value="bracket">Bracket</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="matches">
				<Card.Root>
					<Card.Header>
						<Card.Title>Matches</Card.Title>
						<Card.Description>Results of pool play (live)</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-2">
						<Matches bind:tournament bind:matches {teams} {defaultTeam} readOnly={true} />
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
						<Standings event={tournament} {matches} {teams} {defaultTeam} readOnly={true} />
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
						<Bracket {tournament} {bracket} {teams} {matches} readOnly={true} />
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	{/await}
</div>
