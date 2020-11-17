const { getById, getAll,getCategoriesWithName} = require('../repository');
const { GET_ERROR_MESSAGE } = require('../constants');
const logger = require('../../../logger');
const debug = require('debug')('express:www');

async function getCategory(req, res) {
  debug(`get_category`);
  let category = {};
  const id = req.params.id;

  try {
    category = await getById({ id });
  } catch (error) {
    debug(error);
    return res.status(500).send({ success: false, messages: { GET_ERROR_MESSAGE } });
  }

  if (category.name) {
    return res.send(category);
  }
}

async function getCategories(req, res) {
  let categories = [];

  try {
    categories = await getAll();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: { GET_ERROR_MESSAGE } });
  }

  if (categories) {
    return res.send({ categories });
  }
}
async function getCategoriesByName(req, res) {
  let categories = [];
  const name = req.params.name;

  try {
    categories = await getCategoriesWithName(name);
  } catch (error) {
    logger.error(error);
    return res.status(500).send({ success: false, messages: { GET_ERROR_MESSAGE } });
  }

  if (categories) {
    return res.send({ categories });
  }
}

module.exports = {
  getCategory,
  getCategories,
  getCategoriesByName,
};
