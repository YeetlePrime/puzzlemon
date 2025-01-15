import { Snowflake } from 'discord.js';
import { query as executeQuery, getClient } from './index.js'
import { Client, PoolClient } from 'pg';

export async function createNewPuzzleForGuild(guild_id: Snowflake, question: string, answer: string) {
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
	} catch (err) {
		await client.query('ROLLBACK');

		throw err;
	} finally {
		client.release();
	}
}

async function createNewPuzzle(client: Client | PoolClient, puzzle_chain_id: number, question: string, answer: string) {
	const query = [""
		, "INSERT INTO puzzles(puzzle_chain_id, question, answer)"
		, "VALUES ($1, $2, $3)"
		, "RETURNING *;"
	].join(' ');

	return (await client.query(query, [puzzle_chain_id, question, answer])).rows[0];
}

export async function finishPuzzles(guildId: Snowflake) {
	const query = [""
		, "UPDATE puzzle_chains"
		, "SET closed_ts = now()"
		, "WHERE guild_id = $1"
		, "AND closed_ts IS NULL;"
	].join(' ');

	await executeQuery(query, [guildId]);
}

export async function getActivePuzzlesForUser(guildId: Snowflake, userId: Snowflake) {
	const query = `
		SELECT p.question, p.answer, p.index, a.completed_ts FROM puzzle_chains pc
		JOIN puzzles p ON pc.id = p.puzzle_chain_id
		LEFT JOIN answers a ON p.id = a.puzzle_id
			AND a.user_id = $2
		WHERE pc.guild_id = $1
		AND pc.closed_ts IS NULL
		ORDER BY p.index ASC;
	`;

	return (await executeQuery(query, [guildId, userId])).rows;
}

export async function answerPuzzle(guildId: Snowflake, userId: Snowflake, answer: string) {
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
	} catch (err) {
		await client.query('ROLLBACK');

		throw err;
	} finally {
		client.release();
	}
}

