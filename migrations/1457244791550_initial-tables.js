exports.up = function(pgm) {

    pgm.createExtension("pgcrypto");

    pgm.sql("CREATE TABLE products (" +
        "   id UUID PRIMARY KEY DEFAULT gen_random_uuid(), " +
        "   timestamp Timestamp Without Time Zone NOT NULL DEFAULT now()" +
        ")");
    pgm.createIndex('products', ['timestamp']);

    pgm.createTable("product_descriptions", {
        product_id: { type: 'uuid', notNull: true, references: 'products' },
        name: { type: 'varchar (255)', notNull: true },
        email: { type: 'varchar (255)', notNull: true },
        key_1: { type: 'varchar (255)' },
        key_2: { type: 'varchar (255)' },
        key_3: { type: 'varchar (255)' },
        timestamp: { type: 'Timestamp Without Time Zone', notNull: true , default: 'now' },
    });
    pgm.createIndex('product_descriptions', ['timestamp']);


    pgm.sql("CREATE TABLE tokens (" +
        "   access_token UUID PRIMARY KEY DEFAULT gen_random_uuid(), " +
        "   product_id UUID NOT NULL REFERENCES products, " +
        "   source VARCHAR (255), " +
        "   expires Timestamp Without Time Zone, " +
        "   timestamp Timestamp Without Time Zone NOT NULL DEFAULT now() " +
        ")");
    pgm.createIndex('tokens', ['timestamp']);
    pgm.createIndex('tokens', ['expires']);

    pgm.createTable('ratings', {
        id: { type: 'bigserial', primaryKey: true },
        product_id: { type: 'uuid', notNull: true, references: 'products' },
        user_id: { type: 'bigint', notNull: true },
        rating: { type: 'smallint', notNull: true },
        key1: { type: 'bigint' },
        key2: { type: 'bigint' },
        key3: { type: 'bigint' },
        timestamp: { type: 'Timestamp Without Time Zone', notNull: true , default: 'now' }
    });
    pgm.createIndex('ratings', ['user_id']);
    pgm.createIndex('ratings', ['rating']);
    pgm.createIndex('ratings', ['key1']);
    pgm.createIndex('ratings', ['key2']);
    pgm.createIndex('ratings', ['key3']);
    pgm.createIndex('ratings', ['timestamp']);
};

exports.down = function(pgm) {
    pgm.dropTable("product_descriptions");
    pgm.dropTable("tokens");
    pgm.dropTable("ratings");
    pgm.dropTable("products");

    pgm.dropExtension("pgcrypto");
};




