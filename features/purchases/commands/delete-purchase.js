const { deleteById } = require('../repository');
const logger = require('../../../logger');

async function deletePurchase(req, res) {
  logger.info('DELETE_CATEGORY');
  let purchase = {};
  const id = req.params.id;

  try {
    await deleteById(id);
    return res.status(200).send();
  } catch (error) {
    logger.error(error);
    const databaseError = 'No se pudo eliminar la categoría.';
    return res.status(500).send({ success: false, messages: databaseError });
  }
}

module.exports = deletePurchase;
