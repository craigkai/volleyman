import type { EventSupabaseDatabaseService } from '$lib/database/event';
import type { Infer } from 'sveltekit-superforms';
import { Base } from './base';
import type { FormSchema } from '$schemas/settingsSchema';

/**
 * The Tournament class represents a tournament in the application.
 * It provides methods for creating and managing a tournament.
 */
export class Event extends Base {
	// The service used to interact with the database
	private databaseService: EventSupabaseDatabaseService;

	// The ID of the tournament
	id: number;
	name?: string;
	date?: string;
	pools?: number;
	courts?: number;
	owner?: string;
	created_at?: string;
	scoring?: string;
	refs?: string;

	/**
	 * The constructor for the Tournament class.
	 * @param {DatabaseService} databaseService - The service used to interact with the database.
	 */
	constructor(event_id: number, databaseService: EventSupabaseDatabaseService) {
		super();
		if (!event_id) {
			this.handleError(400, 'Invalid event ID, are you sure your link is correct?');
		}

		this.databaseService = databaseService;
		this.id = event_id;
	}

	/**
	 * Create a new event. This creates the tournament settings only.
	 * @param {EventRow} input - The data for the event to create.
	 * @returns {Promise<Tournament>} - Returns a promise that resolves to the newly created tournament.
	 * @throws {Error} - Throws an error if the event data does not have all required values.
	 */
	async create(input: Infer<FormSchema>): Promise<Event> {
		if (input.hasOwnProperty('id')) {
			delete (input as { id?: number }).id;
		}

		const currentUser = await this.databaseService.getCurrentUser();
		const ownerId = currentUser ? currentUser.id : null;
		input.owner = ownerId as string;

		const res: EventRow | null = await this.databaseService.createEvent(input);

		if (res !== null) {
			Object.keys(res as object).forEach((key) => {
				this[key as keyof Event] = res[key as keyof Event];
			});
		}

		return this;
	}

	/**
	 * Updates the tournament with the given data.
	 * @param {string} id - The id of our tournament.
	 * @param {EventRow} input - The data to update the tournament with.
	 * @returns {Promise<Tournament>} - Returns a promise that resolves to the updated tournament.
	 * @throws {Error} - Throws an error if there's an issue updating the tournament.
	 */
	async update(id: number, input: Infer<FormSchema>): Promise<Event> {
		const res: EventRow | null = await this.databaseService.updateEvent(id, input);

		if (res !== null) {
			Object.keys(res as object).forEach((key) => {
				this[key as keyof Event] = res[key as keyof Event];
			});
		}
		return this;
	}

	/*
		Attempt to load our event (tournament settings) via SupaBase
	*/
	async load(): Promise<Event> {
		const eventResponse: EventRow | null = await this.databaseService.loadEvent(this.id);

		if (eventResponse !== null) {
			Object.keys(eventResponse as object).forEach((key) => {
				this[key as keyof Event] = eventResponse[key as keyof Event];
			});
		}

		return this;
	}

	async delete(): Promise<void> {
		try {
			// Cascade event should delete teams and matches
			await this.databaseService.deleteEvent(this.id);
		} catch (err) {
			this.handleError(500, `Failed to delete event: ${(err as Error).message}`);
		}
	}
}

if (import.meta.vitest) {
	const { vi, it, expect, beforeEach } = import.meta.vitest;

	let mockDatabaseService: any;
	let event: Event;

	beforeEach(() => {
		mockDatabaseService = {
			updateEvent: vi.fn(() => console.log('mockDatabaseService.updateEvent called')),
			deleteTournament: vi.fn(() => console.log('mockDatabaseService.deleteTournament called')),
			getCurrentUser: vi.fn(() => {
				return {
					id: 1
				};
			}),
			createEvent: vi.fn((input: any) => {
				input.id = 1;
				return input;
			}),
			// Remove if not relevant to the current tests
			updateMatch: vi.fn((input: any) => {
				return input;
			})
		};
		event = new Event('1', mockDatabaseService);
	});

	it('should throw an error if not all required values are provided', async () => {
		const input: Partial<EventRow> = {
			name: 'Test Tournament'
			// date, pools, and courts are missing
		};

		await expect(event.update('1', input as EventRow)).rejects.toThrow();
	});

	it('should update the tournament if all required values are provided', async () => {
		const input: Partial<EventRow> = {
			name: 'Test Tournament',
			date: new Date().toString(),
			pools: 1,
			courts: 2,
			id: '1',
			created_at: 'test',
			owner: 'test'
		};

		const updatedTournament: Event = {
			...input,
			databaseService: mockDatabaseService
		};

		mockDatabaseService.updateEvent.mockResolvedValue(updatedTournament);

		await expect(event.update('1', input as EventRow)).resolves.toEqual(event);

		expect(event).toEqual(updatedTournament);
		expect(mockDatabaseService.updateEvent).toHaveBeenCalledWith('1', input as EventRow);
	});
}
