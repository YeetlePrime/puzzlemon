import { P } from 'pg';
import { dbConfig } from '../config.js';
import logger from '../logger.js';

const pool = new pg.Pool(dbConfig);

export async function query(text, params, callback) {
	return pool.query(text, params, callback)
}

export async function getClient() {
	const client = await pool.connect();

	const query = client.query;
	const release = client.release;

	// set a timeout of 5 seconds, after which we will log this client's last query
	const timeout = setTimeout(() => {
		logger.error('A client has been checked out for more than 5 seconds!')
		logger.error(`The last executed query on this client was: ${client.lastQuery}`)
	}, 5000);

	// monkey patch the query method to keep track of the last query executed
	// rollback transaction if a query was not successful
	client.query = (...args) => {
		client.lastQuery = args
		return query.apply(client, args);
	}
	client.release = () => {
		// clear our timeout
		clearTimeout(timeout);

		// set the methods back to their old un-monkey-patched version
		client.query = query;
		client.release = release;

		return release.apply(client);
	}

	return client
}

