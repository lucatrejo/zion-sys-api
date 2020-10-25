const { deleteById } = require('../repository');
const logger = require('../../../logger');

async function deleteProvider(req, res) {
  logger.info('DELETE_PROVIDER');
  let provider = {};
  const id = req.params.id;

  try {
    await deleteById(id);
    return res.status(200).send();
  } catch (error) {
    logger.error(error);
    const databaseError = 'No se pudo eliminar el proveedor.';
    return res.status(500).send({ success: false, messages: databaseError });
  }
}

module.exports = deleteProvider;
