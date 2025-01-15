import { Pool, QueryResultRow, QueryConfigValues, QueryResult } from 'pg';
import { dbConfig } from '../config.js';
import logger from '../logger.js';

const pool = new Pool(dbConfig);

export async function query<I = any[]>(
	text: string,
	params: QueryConfigValues<I>
) {
	return pool.query(text, params)
}

export async function getClient() {
	const client = await pool.connect();

	const release = client.release;

	// set a timeout of 5 seconds, after which we will log this client's last query
	const timeout = setTimeout(() => {
		logger.error('A client has been checked out for more than 5 seconds!')
	}, 5000);

	client.release = () => {
		// clear our timeout
		clearTimeout(timeout);

		client.release = release;

		return release.apply(client);
	}

	return client
}

