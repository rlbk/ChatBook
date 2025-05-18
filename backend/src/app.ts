import express, { Express } from 'express';
import { AppServer } from '@config/server';
import databaseConnection from '@config/database';
import { appConfig } from '@config/appConfig';

class Application {
  /**
   * Initializes the application by creating an Express application
   * and an instance of AppServer, and then starting the server.
   */
  public initialize(): void {
    this.loadAppConfig();
    databaseConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }

  private loadAppConfig(): void {
    appConfig.validateConfig();
    appConfig.cloudinaryConfig();
  }
}

const application: Application = new Application();
application.initialize();
