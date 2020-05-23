
exports.up = function (knex) {
    return knex.schema.createTable('contacts', function (t) {
        t.integer('user_id')
        t.integer('contact_id')

        t.unique(['user_id', 'contact_id'])
        
        t.foreign('user_id').references('user_id').inTable('accounts')
        t.foreign('contact_id').references('user_id').inTable('accounts')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('contacts')
};
