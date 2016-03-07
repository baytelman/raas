exports.up = function(pgm) {
    pgm.alterColumn( 'ratings', 'user_id', { type: 'varchar(255)' });
    pgm.alterColumn( 'ratings', 'key1', { type: 'varchar(255)' });
    pgm.alterColumn( 'ratings', 'key2', { type: 'varchar(255)' });
    pgm.alterColumn( 'ratings', 'key3', { type: 'varchar(255)' });
};

exports.down = function(pgm) {
};
