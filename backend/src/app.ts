import express, { Express } from "express";
import { AppServer } from "./config/server";
import databaseConnection from "./config/database";
import { appConfig } from "./config/appConfig";

class Application {
  /**
   * Initializes the application by creating an Express application
   * and an instance of AppServer, and then starting the server.
   */
  public initialize(): void {
    this.loadappConfig();
    databaseConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }

  private loadappConfig(): void {
    appConfig.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
