import mongoose from 'mongoose';
import { appConfig } from './appConfig';
import Logger from 'bunyan';

const log: Logger = appConfig.createLogger('database');

export default () => {
  const connect = () => {
    mongoose
      .connect(`${appConfig.MONGO_URI}`)
      .then((connectionInstance) => {
        log.info(`DB connected. DB Host: ${connectionInstance.connection.host}`);
      })
      .catch((error) => {
        log.info('DB connection FAILED ', error);
        process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
