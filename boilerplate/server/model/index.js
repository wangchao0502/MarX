import Redis       from 'redis';
import coRedis     from 'co-redis';
import bunyan      from 'bunyan';
import Sequelize   from 'sequelize';
import mysqlConfig from '../config/mysql.json';
import redisConfig from '../config/redis.json';

const ENV = process.env.NODE_ENV;
const Logger = bunyan.createLogger({ name: `SQL[${mysqlConfig[ENV].database}]` });

const sequelize = new Sequelize(
  mysqlConfig[ENV].database,
  mysqlConfig[ENV].username,
  mysqlConfig[ENV].password,
  {
    host: mysqlConfig[ENV].host,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      underscored: true,
      underscoredAll: true,
    },
    logging: (() => {
      const logger = Logger.child({ database: mysqlConfig[ENV].database });
      return logger.info.bind(logger);
    })(),
    pool: {
      max: 500,
      min: 20,
      idle: 10000,
    },
    timezone: '+08:00',
    timestamps: true,
  },
);

const rawRedis = Redis.createClient(redisConfig[ENV]);
rawRedis.on('error', err => Logger.fatal(err, { database: 'redis' }));

const redis = coRedis(rawRedis);

const Models = {};

Models.Account = require('./Account')(sequelize, Sequelize);

export { sequelize, redis, Models };
