exports.up = function(pgm) {
    pgm.createIndex('tokens', ['product_id']);
    pgm.createIndex('ratings', ['product_id']);
    pgm.createIndex('product_descriptions', ['product_id']);
};

exports.down = function(pgm) {
    pgm.dropIndex('tokens', ['product_id']);
    pgm.dropIndex('ratings', ['product_id']);
    pgm.dropIndex('product_descriptions', ['product_id']);
};
