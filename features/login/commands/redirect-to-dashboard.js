const debug = require('debug')('express:login');
const logger = require('../../../logger');

const { FETCH_INFO_ERROR_MESSAGE } = require('../constants');
const { getUserById } = require('../repository');

async function redirectToDashboard(req, res) {
  let userInfo;
  const { user } = req;
  logger.info("USER FROM REQUEST");
  logger.info(user);
  try {
    userInfo = await getUserById(user && user.id);
  } catch (getUserError) {
    const messages = {
      errors: {
        databaseError: FETCH_INFO_ERROR_MESSAGE,
      },
    };

    return res.status(500).send({ success: false, messages });
  }

  res.cookie('hola', 'holaa');

  logger.info("userInfo");
  logger.info(userInfo);
  logger.info("---->SUCCESS");
  logger.info("----> REDIRECT TO DASHBOARD");
  return res.send({ success: true, userInfo });
}

module.exports = redirectToDashboard;
