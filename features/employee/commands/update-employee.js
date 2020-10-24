const { update } = require('../repository');

async function updateEmployee(req, res) {
  let employee = {};
  const id = req.params.id;

  try {
    employee = await update({ ...req.body, id });
  } catch (error) {
    employee = error;
  }

  if (employee.id) {
    return res.send({
      success: true,
      employee: { ...employee },
      messages: { success: 'El empleado se ha actualizado con éxito.' }
    });
  }

  const { code } = employee;

  if(code === '23505') {
    const identification = 'El dni del empleado ya existe.';
    return res.status(500).send({ success: false, messages: { errors: { identification }} });
  }

  const databaseError = 'Hubo un problema en la actualización del empleado.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = updateEmployee;
