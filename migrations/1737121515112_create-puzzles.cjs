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
	pgm.createTable('puzzles', {
		id: {
			type: 'integer',
			primaryKey: true,
			sequenceGenerated: {
				precedence: 'BY DEFAULT',
			},
		},
		puzzle_chain_id: {
			type: 'integer',
			notNull: true,
			references: '"puzzle_chains"(id)',
			onDelete: 'CASCADE',
		},
		question: {
			type: 'varchar(4095)',
			notNull: true,
		},
		answer: {
			type: 'varchar(4095)',
			notNull: true,
		},
		index: {
			type: 'integer',
			notNull: true,
		},
		generated_ts: {
			type: 'timestamptz',
			notNull: true,
			default: pgm.func('now()'), // Default to current timestamp
		},
	});

	pgm.addConstraint('puzzles', 'puzzles_puzzle_chain_id_index_unique', {
		unique: ['puzzle_chain_id', 'index'],
	});;

	pgm.sql(`
		CREATE OR REPLACE FUNCTION set_puzzle_index()
		RETURNS TRIGGER
		LANGUAGE PLPGSQL
		AS
		$$
		DECLARE
			next_index INT;
			new_puzzle_chain_id INT;
		BEGIN
			SELECT COALESCE(MAX(index), 0) + 1 FROM puzzles
			WHERE puzzle_chain_id = NEW.puzzle_chain_id
			INTO next_index;

			NEW.index := next_index;
			RETURN NEW;
		END;
		$$;
	`);

	pgm.sql(`
		CREATE OR REPLACE TRIGGER puzzles_before_insert
		BEFORE INSERT
		ON puzzles
		FOR EACH ROW
		EXECUTE FUNCTION set_puzzle_index();
	`);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	// Drop the trigger
	pgm.sql(`DROP TRIGGER IF EXISTS puzzles_before_insert ON puzzles;`);

	// Drop the trigger function
	pgm.sql(`DROP FUNCTION IF EXISTS set_puzzle_index;`);

	// Drop the table
	pgm.dropTable('puzzles');
};
