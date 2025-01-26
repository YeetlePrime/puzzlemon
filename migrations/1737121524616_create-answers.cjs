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
	pgm.createTable('answers', {
		id: {
			type: 'integer',
			primaryKey: true,
			sequenceGenerated: {
				precedence: 'BY DEFAULT',
			},
		},
		puzzle_id: {
			type: 'integer',
			notNull: true,
			references: '"puzzles"(id)',
			onDelete: 'CASCADE',
		},
		user_id: {
			type: 'varchar(127)',
			notNull: true,
		},
		completed_ts: {
			type: 'timestamptz',
			notNull: true,
			default: pgm.func('now()'), // Default to current timestamp
		},
	});

	pgm.addConstraint('answers', 'answers_puzzle_id_user_id_unique', {
		unique: ['puzzle_id', 'user_id'],
	});;
}

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropTable('answers');
};
