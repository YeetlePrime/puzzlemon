import logger from '../logger.js';
import { query, getClient } from './index.js'

export async function createTablesIfNotExisting() {
	const puzzlesQuery = [""
		, "CREATE TABLE IF NOT EXISTS puzzles ("
		, "	id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,"
		, "	guild_id VARCHAR(127) NOT NULL,"
		, "	finished BOOLEAN NOT NULL DEFAULT FALSE"
		, ");"
	].join('');

	const questionsQuery = [""
		, "CREATE TABLE IF NOT EXISTS questions ("
		, "	id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,"
		, "	puzzle_id INT NOT NULL REFERENCES puzzles(id),"
		, "	question VARCHAR(4095) NOT NULL,"
		, "	answer VARCHAR(4095) NOT NULL,"
		, "	question_number INT NOT NULL,"
		, "	UNIQUE(question_number, puzzle_id)"
		, ");"
	].join('');

	const client = await getClient();
	try {

		await client.query('BEGIN');

		await client.query(puzzlesQuery);
		logger.info('Successfully created puzzles table.');
		await client.query(questionsQuery);
		logger.info('Successfully created questions table.');

		await client.query('COMMIT');
	} catch (error) {
		logger.error(`Could not create tables: ${error}`);
		await client.query('ROLLBACK');

		throw error;
	} finally {
		client.release();
	}
}

export async function createNewPuzzle(guild_id, question, answer) {
	const activePuzzleQuery = [""
		, "SELECT id FROM puzzles"
		, "WHERE guild_id = $1"
		, "AND NOT finished"
		, "LIMIT 1;"
	].join(' ');

	const createPuzzleQuery = [""
		, "INSERT INTO puzzles(guild_id)"
		, "VALUES ($1)"
		, "RETURNING id;"
	].join(' ');

	const createQuestion = [""
		, "INSERT INTO questions(puzzle_id, question, answer, question_number)"
		, "VALUES ($1, $2, $3,"
		, "	("
		, "	SELECT COALESCE(MAX(question_number), 0) + 1 FROM questions"
		, "	WHERE puzzle_id = $1"
		, "	)"
		, ")"
		, "RETURNING *;"

	].join(' ');

	const client = await getClient();
	try {

		await client.query('BEGIN');

		let rows = (await client.query(activePuzzleQuery, [guild_id])).rows;

		while (rows.length === 0) {
			rows = (await client.query(createPuzzleQuery, [guild_id])).rows;
		}

		const id = rows[0].id;
		const res = (await client.query(createQuestion, [id, question, answer])).rows[1];

		await client.query('COMMIT');
	} catch (error) {
		logger.error(`Could not create question for ${guildId}: ${error}`);
		await client.query('ROLLBACK');

		throw error;
	} finally {
		client.release();
	}
}

export async function finishPuzzles(guildId) {

	const finishQuery = [""
		, "UPDATE puzzles"
		, "SET finished = TRUE"
		, "WHERE guild_id = $1"
		, "AND NOT finished;"
	].join(' ');

	try {
		await query(finishQuery, [guildId]);
	} catch (error) {
		logger.error(`Could not clear puzzles for ${guildId}: ${error}`);

		throw error;
	}
}

export async function getActivePuzzles(guildId) {
	const queryString = [""
		, "SELECT q.question, q.answer, q.question_number FROM puzzles p"
		, "JOIN questions q"
		, "ON p.id = q.puzzle_id"
		, "AND p.guild_id = $1"
		, "AND NOT p.finished"
		, "ORDER BY q.question_number;"
	].join(' ');

	try {
		return (await query(queryString, [guildId])).rows;
	} catch (error) {
		logger.error(`Could not get puzzles ${guildId}: ${error}`);

		throw error;
	}
}

export async function answerPuzzle(guildId, answer) {
	const queryString = [""
		, "SELECT q.question, q.answer, q.question_number FROM puzzles p"
		, "JOIN questions q"
		, "ON p.id = q.puzzle_id"
		, "WHERE p.guild_id = $1"
		, "AND NOT p.finished"
		, "AND LOWER(q.answer) = LOWER($2)"
		, "ORDER BY q.question_number"
	].join(' ');

	try {
		return (await query(queryString, [guildId, answer])).rows;
	} catch (error) {
		logger.error(`Could not submit answer ${guildId}: ${error}`);

		throw error;
	}
}

