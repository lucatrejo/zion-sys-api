const {deleteById} = require('../repository');
const logger = require('../../../logger');

async function deleteEmployee(req, res) {
  logger.info('DELETE_EMPLOYEE');
  const id = req.params.id;

  try {
    await deleteById(id);
    return res.status(200).send();
  } catch (error) {
    const databaseError = 'No se pudo eliminar el empleado.';
    return res.status(500).send({success: false, messages: databaseError});
  }
}

module.exports = deleteEmployee;

