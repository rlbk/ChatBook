import express, { Express } from "express";
import { AppServer } from "./config/server";
import databaseConnection from "./config/database";
import { envConfig } from "./config/envConfig";

class Application {
  /**
   * Initializes the application by creating an Express application
   * and an instance of AppServer, and then starting the server.
   */
  public initialize(): void {
    this.loadEnvConfig();
    databaseConnection();
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }

  private loadEnvConfig(): void {
    envConfig.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
