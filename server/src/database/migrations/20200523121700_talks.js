
exports.up = function (knex) {
    return knex.schema.createTable('talks', function (t) {
        t.integer('user_id').primary().notNullable()
        t.integer('contact_id')

        t.foreign('contact_id').references('user_id').inTable('accounts')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('talks')
};
