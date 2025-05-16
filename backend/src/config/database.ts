import mongoose from "mongoose";
import { envConfig } from "./envConfig";

export default () => {
  const connect = () => {
    mongoose
      .connect(`${envConfig.MONGO_URI}`)
      .then((connectionInstance) => {
        console.log(
          `DB connected. DB Host: ${connectionInstance.connection.host}`
        );
      })
      .catch((error) => {
        console.log("DB connection FAILED ", error);
        process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};
