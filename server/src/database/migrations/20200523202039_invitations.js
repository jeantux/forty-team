
exports.up = function (knex) {
    return knex.schema.createTable('invitations', function (t) {
        t.increments('invite_id')
        t.integer('contact_id')
        t.integer('user_id')

        t.foreign('user_id').references('user_id').inTable('accounts')
        t.foreign('contact_id').references('user_id').inTable('accounts')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('invitations')
};
