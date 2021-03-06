const bcrypt = require('bcrypt');

exports.seed = async function seed(knex) {
  const hashedPass = await bcrypt.hash('secret', 5);
  await knex('employees').insert({
    name: 'Claudio',
    cuil: '20332123455',
    email: 'oconnor@gmail.com',
    role: 'Administrador',
    password: hashedPass,
    admission_date: new Date(),
    last_name: 'OConnor',
    identification: '33212345',
    birthdate: new Date(),
    address: 'Derqui 555, Córdoba.',
    created_at: new Date(),
    updated_at: new Date(),
  });

  await knex('employees').insert({
    name: 'Ricardo',
    cuil: '20339874322',
    email: 'mollo@gmail.com',
    role: 'Compras',
    password: hashedPass,
    admission_date: new Date(),
    last_name: 'Mollo',
    identification: '33987432',
    birthdate: new Date(),
    address: 'Salguero 876, Córdoba.',
    created_at: new Date(),
    updated_at: new Date(),
  });
};
