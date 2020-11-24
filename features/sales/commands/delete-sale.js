const { deleteById } = require('../repository');
const logger = require('../../../logger');

async function deleteSale(req, res) {
  logger.info('DELETE_SALE');
  let sale = {};
  const id = req.params.id;

  try {
    await deleteById(id);
    return res.status(200).send();
  } catch (error) {
    logger.error(error);
    const databaseError = 'No se pudo eliminar la venta.';
    return res.status(500).send({ success: false, messages: databaseError });
  }
}

module.exports = deleteSale;
