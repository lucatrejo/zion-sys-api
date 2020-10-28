const { getById, getAll,getProvidersWithName } = require('../repository');
const logger = require('../../../logger');

async function getProvider(req, res) {
  let provider = {};
  const id = req.params.id;

  try {
    provider = await getById({ id });
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting provider' });
  }

  if (provider.name) {
    return res.send(provider);
  }
}

async function getProviders(req, res) {
  let providers = [];

  try {
    providers = await getAll();
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting provider' });
  }

  if (providers) {
    return res.send({ providers });
  }
}
async function getProviderByName(req, res) {
  let providers = [];
  const name = req.params.name;

  try {
    providers = await getProvidersWithName(name);
  } catch (error) {
    return res.status(500).send({ success: false, message: 'error getting provider' });
  }

  if (providers) {
    return res.send({ providers });
  }
}

module.exports = {
  getProvider,
  getProviders,
  getProviderByName,
};
