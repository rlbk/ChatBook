import express, { Express } from "express";
import { AppServer } from "./config/server";

class Application {
  /**
   * Initializes the application by creating an Express application
   * and an instance of AppServer, and then starting the server.
   */
  public initialize(): void {
    const app: Express = express();
    const server: AppServer = new AppServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
