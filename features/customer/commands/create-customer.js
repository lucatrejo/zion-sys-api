const { insert } = require('../repository');
const { insertAccount } = require('../repositoryAccount');
const logger = require('../../../logger');

async function createCustomer(req, res) {
  let customer = {};
  const createSuccessMessage = "El cliente se creó con éxito.";

  try {
    customer = await insert(req.body);
  } catch (error) {
    logger.error(error);
    customer = error;
  }

  if (customer.id) {
    await insertAccount(customer.id);

    return res.send({
      success: true,
      customer: { ...customer },
      messages: { success: createSuccessMessage }
    });
  }

  const { code } = employee;

  if(code === '23505') {
    const identification = 'El dni del cliente ya existe.';
    return res.status(500).send({ success: false, messages: { errors: { identification }} });
  }

  const databaseError = 'Hubo un problema en la creación del cliente.';
  return res.status(500).send({ success: false, messages: { errors: { databaseError }} });
}

module.exports = createCustomer;
