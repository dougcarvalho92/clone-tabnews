/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 * @param {() => void | undefined} run
 * @returns {Promise<void> | void}
 */
const up = pgm => {};

/**
 * @param {import('node-pg-migrate').MigrationBuilder} pgm
 * @param {() => void | undefined} run
 * @returns {Promise<void> | void}
 */
const down = pgm => {};

module.exports = {
  shorthands,
  up,
  down,
};
