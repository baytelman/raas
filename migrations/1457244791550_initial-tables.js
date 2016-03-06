exports.up = function(pgm) {
    pgm.createTable('ratings', {
        id: { type: 'bigserial', primaryKey: true },
        token: { type: 'varchar (255)', notNull: true },
        rating: { type: 'real', notNull: true },
        key1: { type: 'bigint' },
        key2: { type: 'bigint' },
        key3: { type: 'bigint' },
        timestamp: { type: 'Timestamp Without Time Zone', default: 'now' }
    });
    pgm.createIndex('ratings', ['token']);
    pgm.createIndex('ratings', ['rating']);
    pgm.createIndex('ratings', ['key1']);
    pgm.createIndex('ratings', ['key2']);
    pgm.createIndex('ratings', ['key3']);
    pgm.createIndex('ratings', ['timestamp']);
};

exports.down = function(pgm) {
    pgm.dropTable('ratings');
};
