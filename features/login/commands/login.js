const debug = require('debug')('express:login');
const passport = require('passport');
const logger = require('../../../logger');


const { USERNAME_PASSWORD_COMBINATION_ERROR, INTERNAL_SERVER_ERROR } = require('../constants');

function login(req, res, next) {
  logger.info("INIT LOGIN");
  logger.info(req);
  return passport.authenticate('local', (error, user) => {
    if (error || !user) {
      return res.status(401).send({
        success: false,
        messages: {
          errors: { invalidEmailOrPassword: USERNAME_PASSWORD_COMBINATION_ERROR },
        },
      });
    }

    return req.logIn(user, loginError => {
      if (loginError) {
        return res.status(500).send({
          success: false,
          messages: {
            errors: { internalServerError: INTERNAL_SERVER_ERROR },
          },
        });
      }

      return next();
    });
  })(req, res, next);
}

module.exports = login;
