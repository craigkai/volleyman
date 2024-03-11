import { Event } from './event';
import { findStandings } from './standings';
import { Matches } from './matches';

export class Brackets extends Matches {
	// Overload Matches load method to only load our bracket matches.
	async load() {
		const res = await this.databaseService.load(this.event_id, {
			column: 'type',
			operator: 'eq',
			value: 'bracket'
		});

		if (res) {
			this._update((that: Brackets) => {
				that.matches = res;
				return that;
			});
		}

		return this;
	}

	async createBracketMatches(event: Event, teams: TeamRow[], matches: MatchRow[]) {
		if (teams.length < 2) {
			this.handleError(400, 'Number of teams must be at least 2 for a single-elimination bracket.');
		}

		const teamScores: TeamScores = await findStandings(matches ?? [], event, teams);

		const orderedTeamScores = Object.keys(teamScores).sort((a, b) => teamScores[b] - teamScores[a]);
		const matchups: Partial<MatchRow>[] = [];

		// Calculate the number of rounds needed
		const totalRounds = Math.ceil(Math.log2(teams.length));

		let leftOverTeams: number[] = [];
		let parentMatches: MatchRow[] = [];

		// Generate matchups for the initial round of the bracket
		for (let i = 0; i < orderedTeamScores.length; i += 2) {
			const team1 = teams.find((t) => t.name === orderedTeamScores[i])?.id as number;
			const team2 = teams.find((t) => t.name === orderedTeamScores[i + 1])?.id as number;

			const matchup: Partial<MatchRow> = {
				team1,
				team2,
				event_id: this.event_id,
				round: 0,
				type: 'bracket'
			};

			if (!team1 || !team2) {
				leftOverTeams.push(team1);
			} else {
				const res = await this.databaseService.insertMatch(matchup as UserMatch);
				matchups.push(res);
				parentMatches.push(res); // Store the parent match IDs twice
			}
		}

		const hasBye = teams.length % 2 !== 0;

		// Generate empty matchups for subsequent rounds
		for (let currentRound = 1; currentRound < totalRounds; currentRound++) {
			const numMatches = 2 ** (totalRounds - currentRound - (hasBye ? 1 : 0));

			for (let i = 0; i < numMatches; i += 2) {
				const emptyMatchup: Partial<MatchRow> = {
					event_id: this.event_id,
					round: currentRound,
					type: 'bracket',
					team1: leftOverTeams.pop()
				};

				let res = await this.databaseService.insertMatch(emptyMatchup as UserMatch);
				matchups.push(res);

				[parentMatches.pop(), parentMatches.pop()].forEach((parent) => {
					if (parent) {
						parent.child_id = res.id;
						this.put(parent).catch((e) => console.error(e));
					}
				});
			}
		}

		return this.matches;
	}

	async nextRound(_oldMatchId: { id: number }, newMatch: MatchRow) {
		const child = this.matches?.find((m) => m.id === newMatch.child_id);
		const otherParent = this.matches?.find(
			(m) => m.child_id === newMatch.child_id && m.id !== newMatch.id
		);
		const otherParentComplete = this.matches!.length > 3 ? otherParent?.state === 'COMPLETE' : true;

		try {
			if (newMatch.state === 'COMPLETE' && otherParentComplete && child) {
				const childTeams = [child.team1, child.team2];
				const winnerOfNew =
					// We ignore null as we trust status === 'COMPLETE'
					// @ts-ignore: Object is possibly 'null'.
					newMatch.team1_score > newMatch.team2_score ? newMatch.team1 : newMatch.team2;

				const winnerOfOtherParent =
					otherParent?.state === 'COMPLETE'
						? // @ts-ignore: Object is possibly 'null'.
							otherParent.team1_score > otherParent.team2_score
							? otherParent.team1
							: otherParent.team2
						: child.team1 || child.team2;

				if (childTeams.includes(winnerOfNew)) {
					console.debug('Child match already has the correct teams');
					return;
				} else {
					child.team1 = winnerOfNew;
					child.team2 = winnerOfOtherParent;
					const newBracketMatch: Partial<MatchRow> = {
						...child,
						team1_score: 0,
						team2_score: 0
					};

					await this.put(newBracketMatch as MatchRow);
				}
			} else {
				console.debug('Parent matches not complete');
			}
		} catch (error) {
			this.handleError(500, `An error occurred in nextRound ${error}`);
		}
	}
}
