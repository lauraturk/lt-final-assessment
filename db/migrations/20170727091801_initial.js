
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('inventory', (table) => {
      table.increments('id').primary();
      table.string('item_title');
      table.text('item_description');
      table.text('item_image');
      table.decimal('item_price');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('orders', (table) => {
      table.increments('id').primary();
      table.decimal('order_total');
      table.date('order_date');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('inventory'),
    knex.schema.dropTable('orders')
  ])
};
