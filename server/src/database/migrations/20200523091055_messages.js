
exports.up = function (knex) {
    return knex.schema.createTable('messages', function (t) {
        t.increments('message_id')
        t.integer('user_id').notNullable()
        t.integer('contact_id').notNullable()
        t.text('message')
        t.timestamp('send_date')
        t.timestamp('receivement_date')

        t.foreign('contact_id').references('user_id').inTable('accounts')
        t.foreign('user_id').references('user_id').inTable('accounts')
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable('messages')
};
