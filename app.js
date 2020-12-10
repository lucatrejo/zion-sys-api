require('dotenv').config({
  path: `./env-files/${process.env.NODE_ENV || 'development'}.env`,
});

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const cors = require("cors");

const initAuthMiddleware = require('./features/login/init-auth-middleware');
const indexRouter = require('./routes/index');
const logger = require('./logger');

const redisStoreConfig = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

if (process.env.REDIS_URL) {
  redisStoreConfig.url = process.env.REDIS_URL; // this will use the REDIS_URL required for logging into the Redis addon provided by Heroku
}

if (process.env.REDIS_PASSWORD) {
  redisStoreConfig.password = process.env.REDIS_PASSWORD; // this will use the REDIS_PASSWORD if required
}

logger.info('environment:');
logger.info(process.env.NODE_ENV);
const redisStore = new RedisStore(redisStoreConfig);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

//app.enable('trust proxy');

const { COOKIE_EXPIRATION_MS } = process.env;
app.use(
  session({
    //store: redisStore,
    secret: 'keyboard cat',
    //name: process.env.SESSION_COOKIE_NAME,
    resave: false,
    saveUninitialized: true,
    //proxy: true,
    cookie: {
      //secure: true,
      //expires: Date.now() + parseInt(COOKIE_EXPIRATION_MS, 10),
      //maxAge: parseInt(COOKIE_EXPIRATION_MS, 10),
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  next();
});

initAuthMiddleware(app);

app.use('/', indexRouter);

module.exports = app;
