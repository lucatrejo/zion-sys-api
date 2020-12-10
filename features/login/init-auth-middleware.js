const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require('../../logger');

const { getUserForLoginData, getUserById } = require('./repository');

module.exports = function initAuthMiddleware(app) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await getUserForLoginData(username, password);
      logger.info("LOGIN DATA");
      logger.info(user);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
    logger.info("DESERIALIZE USER");
    logger.info(user);
    if (!user) {
      return done(`Could not deserialize user with id ${id}`);
    }
    return done(null, user);
  });

  app.use(passport.initialize());
  app.use(passport.session());
};
