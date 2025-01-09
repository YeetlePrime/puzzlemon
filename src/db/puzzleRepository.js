import logger from '../logger.js';
import { query as executeQuery, getClient } from './index.js'

export async function createNewPuzzleForGuild(guild_id, question, answer) {
	const query = [""
		, "SELECT id FROM get_or_create_puzzle_chain($1);"
	].join(' ');

	const client = await getClient();

	try {
		await client.query('BEGIN');

		const puzzle_chain_id = (await client.query(query, [guild_id])).rows[0].id;
		const result = await createNewPuzzle(client, puzzle_chain_id, question, answer);

		await client.query('COMMIT');
		return result;
	} catch (error) {
		logger.error(error, error.stackTrace);

		await client.query('ROLLBACK');

		throw error;
	} finally {
		client.release();
	}
}

async function createNewPuzzle(client, puzzle_chain_id, question, answer) {
	const query = [""
		, "INSERT INTO puzzles(puzzle_chain_id, question, answer)"
		, "VALUES ($1, $2, $3)"
		, "RETURNING *;"
	].join(' ');

	return (await client.query(query, [puzzle_chain_id, question, answer])).rows[0];
}

export async function finishPuzzles(guildId) {
	const query = [""
		, "UPDATE puzzle_chains"
		, "SET closed_ts = now()"
		, "WHERE guild_id = $1"
		, "AND closed_ts IS NULL;"
	].join(' ');

	try {
		await executeQuery(query, [guildId]);
	} catch (error) {
		logger.error(`Could not clear puzzles for ${guildId}: ${error}`);

		throw error;
	}
}

export async function getActivePuzzles(guildId) {
	//	const queryString = [""
	//		, "SELECT q.question, q.answer, q.question_number FROM puzzles p"
	//		, "JOIN questions q"
	//		, "ON p.id = q.puzzle_id"
	//		, "AND p.guild_id = $1"
	//		, "AND NOT p.finished"
	//		, "ORDER BY q.question_number;"
	//	].join(' ');
	//
	//	try {
	//		return (await query(queryString, [guildId])).rows;
	//	} catch (error) {
	//		logger.error(`Could not get puzzles ${guildId}: ${error}`);
	//
	//		throw error;
	//	}
}

export async function answerPuzzle(guildId, answer) {
	//	const queryString = [""
	//		, "SELECT q.question, q.answer, q.question_number FROM puzzles p"
	//		, "JOIN questions q"
	//		, "ON p.id = q.puzzle_id"
	//		, "WHERE p.guild_id = $1"
	//		, "AND NOT p.finished"
	//		, "AND LOWER(q.answer) = LOWER($2)"
	//		, "ORDER BY q.question_number"
	//	].join(' ');
	//
	//	try {
	//		return (await query(queryString, [guildId, answer])).rows;
	//	} catch (error) {
	//		logger.error(`Could not submit answer ${guildId}: ${error}`);
	//
	//		throw error;
	//	}
}

