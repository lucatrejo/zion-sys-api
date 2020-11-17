const { getById, getAll, getEmployeesWithName } = require('../repository');
const logger = require('../../../logger');

async function getEmployee(req, res) {
  let employee = {};
  const id = req.params.id;

  try {
    employee = await getById({ id });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting employee' });
  }

  if (employee.name) {
    return res.send(employee);
  }
}

async function getEmployees(req, res) {
  let employees = [];

  try {
    employees = await getAll();
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting employee' });
  }

  if (employees) {
    return res.send({ employees });
  }
}

async function getEmployeeByName(req, res) {
  let employees = [];
  const name = req.params.name;

  try {
    employees = await getEmployeesWithName(name);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: 'error getting employee' });
  }

  if (employees) {
    return res.send({ employees });
  }
}

module.exports = {
  getEmployee,
  getEmployees,
  getEmployeeByName,
};
