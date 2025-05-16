import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import compression from "compression";

export class AppServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  /**
   * Initializes and starts the application server by applying security,
   * standard, route, and global middleware, and then starting the server.
   */
  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalHandler(this.app);
    this.startServer(this.app);
  }

  /**
   * Add security-related middleware to the app.
   *
   * This middleware helps protect our server from various types of attacks.
   * @param app The Express app to configure.
   */
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: "session",
        keys: ["test1", "test2"],
        maxAge: 24 * 60 * 60 * 100, // 24 hours
        secure: false,
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }

  /**
   * Configure standard middleware for the app.
   *
   * This middleware handles common tasks such as request compression,
   * parsing JSON payloads, and URL-encoded data.
   * - Compression: Compresses response bodies for all requests.
   * - JSON Parsing: Parses incoming requests with JSON payloads with a limit of 50mb.
   * - URL-Encoded Parsing: Parses URL-encoded payloads with extended syntax enabled.
   *
   * @param app The Express application instance to configure.
   */
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(
      urlencoded({
        extended: true,
      })
    );
  }

  private routeMiddleware(app: Application): void {}

  private globalHandler(app: Application): void {}

  private startServer(app: Application): void {}

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {}
}
