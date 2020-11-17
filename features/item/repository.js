const knex = require('../../db');
const logger = require('../../logger');

async function insert({name, description, price, stock, critical_stock, category_id }) {
  const columnInfo = await knex('items').columnInfo();
  const columns = Object.keys(columnInfo);

  const [item] = await knex('items')
  .insert({
    name: name,
    description: description,
    price: price,
    stock: stock,
    critical_stock: critical_stock,
    category_id: category_id
  })
  .returning(columns);
  return item;
}

async function update({ id, code, name, description, price, stock, critical_stock, category_id }) {
  const columnInfo = await knex('items').columnInfo();
  const columns = Object.keys(columnInfo);

  const [item] = await knex('items')
    .where({id})
    .update({
      code: code,
      name: name,
      description: description,
      price: price,
      stock: stock,
      critical_stock: critical_stock,
      category_id: category_id,
      updated_at: new Date(),
    })
    .returning(columns);
  return item;
}

async function getById(id) {
  const [item] = await knex('items')
    .select()
    .where(id)
    .limit(1);
  return item;
}
async function getItemWithName(name) {
  const items = await knex('items')
    .join('categories', 'categories.id', 'items.category_id')
    .select(['items.id', 'items.name', 'items.description', 'items.price', 'items.stock', 'items.critical_stock', {category: 'categories.name'}, {category_id: 'categories.id'}]).where('items.name' , 'ILIKE', `%${name}%`);
  return items;
}

async function getAll() {
  const items = await knex('items')
    .join('categories', 'categories.id', 'items.category_id')
    .select(['items.id', 'items.name', 'items.description', 'items.price', 'items.stock', 'items.critical_stock', {category: 'categories.name'}, {category_id: 'categories.id'}]);
  return items;
}
async function deleteById(id) {
  await knex('items')
    .where({id})
    .del();
}

module.exports = {
  insert,
  update,
  getById,
  getAll,
  deleteById,
  getItemWithName,
};
