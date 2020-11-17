const knex = require('../../db');
const logger = require('../../logger');

async function insert({ name, description }) {
  const [category] = await knex('categories')
  .insert({
    name: name,
    description: description,
  })
  .returning(['id', 'name', 'description']);
  return category;
}

async function update({ name, description, id }) {
  const [category] = await knex('categories')
    .where({id})
    .update({
      name,
      description,
      updated_at: new Date(),
    })
    .returning(['id', 'name', 'description']);
  return category;
}

async function getById(id) {
  const [category] = await knex('categories')
    .select(['id', 'name', 'description', 'created_at'])
    .where(id)
    .limit(1);
  return category;
}

async function getAll() {
  const categories = await knex('categories')
    .select(['id', 'name', 'description'])
    .where('enable', '=', true);
  return categories;
}
async function getCategoriesWithName(name) {
  const items = await knex('categories')
    .select(['id', 'name', 'description'])
    .where('name' , 'ilike', `%${name}%`)
    .andWhere('enable', '=', true);
  return items;
}

async function deleteById(id) {
  const [category] = await knex('categories')
    .where({id})
    .update({
      enable: false,
      updated_at: new Date(),
    })
    .returning(['id', 'name', 'description']);
  return category;
}

module.exports = {
  insert,
  update,
  getById,
  getAll,
  deleteById,
  getCategoriesWithName
};
