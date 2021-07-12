import MONGOOSE from 'mongoose';

class Db {
  /**
   * @param config - An object that expects the mongo_uri path
   * @returns Returns the mongo connection
   */
  public static connect = (config: { mongo_uri: string }) => {
    return MONGOOSE.connect(config.mongo_uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => {
        console.error(`MongoDB connection error. ${err}`);
        process.exit(1);
      });
  };
}

export default Db;
