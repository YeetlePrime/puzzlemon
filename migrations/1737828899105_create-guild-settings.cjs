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
	pgm.createTable('guild_settings', {
		id: {
			type: 'integer',
			primaryKey: true,
			sequenceGenerated: {
				precedence: 'BY DEFAULT',
			}
		},
		guild_id: {
			type: 'varchar(127)',
			notNull: true,
			unique: true,
		},
		log_channel_id: {
			type: 'varchar(127)',
			notNull: false,
		},
	});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropTable('puzzle_chains');
};
