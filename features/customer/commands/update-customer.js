const { update } = require('../repository');
const logger = require('../../../logger');

async function updateCustomer(req, res) {
  let customer = {};
  const id = req.params.id;

  try {
    customer = await update({ ...req.body, id });
  } catch (error) {
    customer = error;
  }

  if (customer.id) {
    return res.send({
      success: true,
      customer: { ...customer },
      messages: { success: 'El cliente se ha actualizado con éxito.' }
    });
  }

  const { code } = customer;

  if(code === '23505') {
    const identification = 'El dni del cliente ya existe.';
    return res.status(500).send({ success: false, messages: { errors: { identification }} });
  }

  const databaseError = 'Hubo un problema en la actualización del cliente.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = updateCustomer;
