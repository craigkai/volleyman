<script lang="ts">
	import { Event } from '$lib/event';
	import * as Card from '$components/ui/card/index.js';
	import { parseDateTime } from '@internationalized/date';

	export let events: Event[];
	export let readOnly: boolean = true;
</script>

<div class="flex flex-col items-center">
	{#if events && events.length > 0}
		<div class="m-2">
			{#each events as event}
				<a href="{readOnly ? '' : '/protected-routes'}/events/{event.id}">
					<Card.Root class="w-[350px] m-2">
						<Card.Header>
							<Card.Title>{event.name}</Card.Title>
							<Card.Description>Description coming soon...</Card.Description>
						</Card.Header>
						<Card.Content>
							<form>
								<div class="grid w-full items-center gap-4">
									<div class="flex flex-col space-y-1.5">
										<span>{parseDateTime(event.date ?? '')}</span>
									</div>
								</div>
							</form>
						</Card.Content>
					</Card.Root>
				</a>
			{/each}
		</div>
	{/if}
</div>
