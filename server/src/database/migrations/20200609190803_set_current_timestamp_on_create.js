
exports.up = function (knex) {
    return knex.schema.alterTable('messages', function (t) {
        t.timestamp('send_date').defaultTo(knex.fn.now()).alter()
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('messages', function (t) {
        t.timestamp('send_date').alter()
    })
};
