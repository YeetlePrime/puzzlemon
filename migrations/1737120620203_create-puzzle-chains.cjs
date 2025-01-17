/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.createTable('puzzle_chains', {
		id: {
			type: 'serial',
			primaryKey: true,
		},
		guild_id: {
			type: 'varchar(127)',
			notNull: true,
		},
		generated_ts: {
			type: 'timestamptz',
			notNull: true,
			default: pgm.func('now()'),
		},
		closed_ts: {
			type: 'timestamptz',
			default: null,
		},
	});
	pgm.sql(`
		CREATE OR REPLACE FUNCTION get_or_create_puzzle_chain(p_guild_id TEXT)
		RETURNS puzzle_chains AS $$
		DECLARE
			result_row puzzle_chains%ROWTYPE;
		BEGIN
			SELECT * INTO result_row
			FROM puzzle_chains
			WHERE guild_id = p_guild_id
			AND closed_ts IS NULL;

			IF NOT FOUND THEN
				INSERT INTO puzzle_chains(guild_id)
				VALUES (p_guild_id)
				RETURNING * INTO result_row;
			END IF;

			RETURN result_row;
		END;
		$$ LANGUAGE plpgsql;
	`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.sql(`DROP FUNCTION IF EXISTS get_or_create_puzzle_chain(TEXT);`);
	pgm.dropTable('puzzle_chains');
};

