const knex = require('../../db');
const bcrypt = require('bcrypt');

const logger = require('../../logger');

const TABLE_NAME = 'employees';

async function insert({ name, cuil, email, role, pass, admission_date, last_name, identification, birthdate, address }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const hashedPass = await bcrypt.hash(pass, 5);
  const [employee] = await knex(TABLE_NAME)
  .insert({
    name: name,
    cuil: cuil,
    email: email,
    role: role,
    password: hashedPass,
    admission_date: admission_date,
    last_name: last_name,
    identification: identification,
    birthdate: birthdate,
    address: address
  })
  .returning(columns);
  return employee;
}

async function update({ id, name, cuil, email, role, pass, admission_date, last_name, identification, birthdate, address }) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  if(pass === "") {
    const [employee] = await knex(TABLE_NAME)
      .where({id})
      .update({
        name: name,
        cuil: cuil,
        email: email,
        role: role,
        admission_date: admission_date,
        last_name: last_name,
        identification: identification,
        birthdate: birthdate,
        address: address,
        updated_at: new Date(),
      })
      .returning(columns);
    return employee;
  } else {
    const hashedPass = await bcrypt.hash(pass, 5);
    const [employee] = await knex(TABLE_NAME)
      .where({id})
      .update({
        name: name,
        cuil: cuil,
        email: email,
        role: role,
        password: hashedPass,
        admission_date: admission_date,
        last_name: last_name,
        identification: identification,
        birthdate: birthdate,
        address: address,
        updated_at: new Date(),
      })
      .returning(columns);
    return employee;
  }


}

async function getById(id) {
  const [employee] = await knex(TABLE_NAME)
    .select()
    .where(id)
    .limit(1);
  return employee;
}

async function getAll() {
  const employees = await knex(TABLE_NAME)
    .select(
      knex.raw(
        "id, name, last_name, cuil, email, role, identification, to_char(birthdate,'DD/MM/YYYY') as birthdate, address, to_char(admission_date,'DD/MM/YYYY') as admission_date"
      )
    )
    .where('enable', '=', true);
  return employees;
}

async function getEmployeesWithName(name) {
  const items = await knex(TABLE_NAME)
    .select(
      knex.raw(
        "id, name, last_name, cuil, email, role, identification, to_char(birthdate,'DD/MM/YYYY') as birthdate, address, to_char(admission_date,'DD/MM/YYYY') as admission_date"
      )
    )
    .where('name', 'ilike', `%${name}%`)
    .andWhere('enable', '=', true);
  return items;
}

async function deleteById(id) {
  const columnInfo = await knex(TABLE_NAME).columnInfo();
  const columns = Object.keys(columnInfo);

  const [employee] = await knex(TABLE_NAME)
    .where({id})
    .update({
      enable: false,
      updated_at: new Date(),
    }).returning(columns);
  return employee;
}

module.exports = {
  insert,
  update,
  getById,
  getAll,
  deleteById,
  getEmployeesWithName,
};
