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
	const query = [""
		, "SELECT p.question, p.answer, p.index, p.generated_ts FROM puzzle_chains pc"
		, "JOIN puzzles p"
		, "ON p.puzzle_chain_id = pc.id"
		, "WHERE pc.guild_id = $1"
		, "AND pc.closed_ts IS NULL"
		, "ORDER BY p.index DESC;"
	].join(' ');

	try {
		return (await executeQuery(query, [guildId])).rows;
	} catch (error) {
		logger.error(`Could not get puzzles ${guildId}: ${error}`);

		throw error;
	}
}

export async function answerPuzzle(guildId, userId, answer) {
	const query = [""
		, "SELECT p.id, p.question, p.answer, p.index, p.generated_ts FROM puzzle_chains pc"
		, "JOIN puzzles p"
		, "ON p.puzzle_chain_id = pc.id"
		, "WHERE pc.guild_id = $1"
		, "AND pc.closed_ts IS NULL"
		, "AND LOWER(p.answer) = LOWER($2)"
		, "ORDER BY p.index;"
	].join(' ');
	const updateQuery = [""
		, "INSERT INTO answers(puzzle_id, user_id)"
		, "VALUES ($1, $2)"
		, "ON CONFLICT (puzzle_id, user_id) DO NOTHING;"
	].join(' ');

	const client = await getClient();
	try {
		await client.query('BEGIN');

		const result = await client.query(query, [guildId, answer]);

		for (const row of result.rows) {
			await client.query(updateQuery, [row.id, userId]);
		}

		await client.query('COMMIT');

		return result.rows;
	} catch (error) {
		logger.error(`Could not submit answer ${guildId}:`, error.stack);
		await client.query('ROLLBACK');

		throw error;
	} finally {
		client.release();
	}
}

