import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from './DatabaseDefinitions';
import type { Database } from '../../types/supabase';
import { z } from 'zod';
import type {
	eventsRowSchema,
	matchesRowSchema,
	teamsRowSchema,
	bracketsRowSchema,
	matchStateSchema
} from '$schemas/supabase';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	type TeamRow = z.infer<typeof teamsRowSchema>;
	type EventRow = z.infer<typeof eventsRowSchema>;
	type MatchRow = z.infer<typeof matchesRowSchema> & {
		matches_team1_fkey: { name: string };
		matches_team2_fkey: { name: string };
		matches_ref_fkey: { name: string };
	};

	type MatchState = z.infer<typeof matchStateSchema>;

	type Round = {
		value: number;
		matches: MatchRow[];
	};

	interface TeamScores {
		[key: string]: number;
	}

	type UserMatch = Partial<MatchRow> & {
		court: number;
		round: number;
		event_id: number;
		team1: number;
		team2: number;
		child_id?: number;
	};

	interface Locals {
		supabase: SupabaseClient<Database>;
		getSession(): Promise<Session | null>;
	}

	interface PageData {
		eventName?: string;
		eventId?: string;
		supabase: SupabaseClient<Database>;
		session: import('@supabase/auth-helpers-sveltekit').SupabaseSession;
	}

	namespace App {
		interface Supabase {
			Database: import('./DatabaseDefinitions').Database;
			SchemaName: 'public';
		}

		// interface Error {}
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
		}
		// interface Platform {}

		interface PageState {
			matchId?: number;
			type?: string;
			showModal?: boolean;
			eventCreated?: number;
		}
	}
	type supabaseClient = SupabaseClient<Database>;
}

interface ImportMetaEnv {
	readonly VITE_SUPABASE_KEY: string;
	readonly VITE_SUPABASE_URL: string;
	readonly VITE_COMMIT_REF: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
