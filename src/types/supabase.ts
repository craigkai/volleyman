export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			events: {
				Row: {
					courts: number | null;
					created_at: string;
					date: string | null;
					id: number;
					name: string;
					owner: string;
					pools: number | null;
					refs: string | null;
					scoring: string | null;
				};
				Insert: {
					courts?: number | null;
					created_at?: string;
					date?: string | null;
					id?: number;
					name: string;
					owner: string;
					pools?: number | null;
					refs?: string | null;
					scoring?: string | null;
				};
				Update: {
					courts?: number | null;
					created_at?: string;
					date?: string | null;
					id?: number;
					name?: string;
					owner?: string;
					pools?: number | null;
					refs?: string | null;
					scoring?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'events_owner_fkey';
						columns: ['owner'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			matches: {
				Row: {
					child_id: number | null;
					court: number;
					created_at: string;
					event_id: number;
					id: number;
					ref: number | null;
					round: number;
					state: Database['public']['Enums']['MatchState'];
					team1: number | null;
					team1_score: number | null;
					team2: number | null;
					team2_score: number | null;
					type: string;
				};
				Insert: {
					child_id?: number | null;
					court?: number;
					created_at?: string;
					event_id: number;
					id?: number;
					ref?: number | null;
					round?: number;
					state?: Database['public']['Enums']['MatchState'];
					team1?: number | null;
					team1_score?: number | null;
					team2?: number | null;
					team2_score?: number | null;
					type?: string;
				};
				Update: {
					child_id?: number | null;
					court?: number;
					created_at?: string;
					event_id?: number;
					id?: number;
					ref?: number | null;
					round?: number;
					state?: Database['public']['Enums']['MatchState'];
					team1?: number | null;
					team1_score?: number | null;
					team2?: number | null;
					team2_score?: number | null;
					type?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'matches_child_id_fkey';
						columns: ['child_id'];
						isOneToOne: false;
						referencedRelation: 'matches';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'matches_event_id_fkey';
						columns: ['event_id'];
						isOneToOne: false;
						referencedRelation: 'events';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'matches_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'matches';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'matches_ref_fkey';
						columns: ['ref'];
						isOneToOne: false;
						referencedRelation: 'teams';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'matches_team1_fkey';
						columns: ['team1'];
						isOneToOne: false;
						referencedRelation: 'teams';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'matches_team2_fkey';
						columns: ['team2'];
						isOneToOne: false;
						referencedRelation: 'teams';
						referencedColumns: ['id'];
					}
				];
			};
			teams: {
				Row: {
					created_at: string | null;
					event_id: number | null;
					id: number;
					name: string;
					state: string | null;
				};
				Insert: {
					created_at?: string | null;
					event_id?: number | null;
					id?: number;
					name: string;
					state?: string | null;
				};
				Update: {
					created_at?: string | null;
					event_id?: number | null;
					id?: number;
					name?: string;
					state?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'teams_event_id_fkey';
						columns: ['event_id'];
						isOneToOne: false;
						referencedRelation: 'events';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			MatchState: 'COMPLETE' | 'INCOMPLETE';
			StageType: 'ROUND_ROBIN' | 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
				Database['public']['Views'])
		? (Database['public']['Tables'] &
				Database['public']['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
		? Database['public']['Enums'][PublicEnumNameOrOptions]
		: never;
