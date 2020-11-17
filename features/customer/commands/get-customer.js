const { getById, getAll, getCustomerWithName } = require('../repository');
const logger = require('../../../logger');

async function getCustomer(req, res) {
  let customer = {};
  const id = req.params.id;
  
  try {
    customer = await getById({ id });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting customer' });
  }

  if (customer.name) {
    return res.send(customer);
  }
}

async function getCustomers(req, res) {
  let customers = [];
  
  try {
    customers = await getAll();
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting customer' });
  }

  if (customers) {
    return res.send({ customers });
  }
}

async function getCustomerByName(req, res) {
  let customers = [];
  const name = req.params.name;

  try {
    customers = await getCustomerWithName(name);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: 'error getting customer' });
  }

  if (customers) {
    return res.send({ customers });
  }
}

module.exports = {
  getCustomer,
  getCustomers,
  getCustomerByName,
};
