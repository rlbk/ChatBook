import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config();

class AppConfig {
  public MONGO_URI: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public PORT: number | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUDINARY_NAME: string | undefined;
  public CLOUDINARY_API_KEY: string | undefined;
  public CLOUDINARY_API_SECRET: string | undefined;

  constructor() {
    this.MONGO_URI = process.env.MONGO_URI;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.NODE_ENV = process.env.NODE_ENV;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.PORT = Number(process.env.PORT) || 8000;
    this.REDIS_HOST = process.env.REDIS_HOST;
    this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined`);
      }
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUDINARY_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET
    });
  }
}

export const appConfig: AppConfig = new AppConfig();
