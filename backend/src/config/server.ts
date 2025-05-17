import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import compression from 'compression';
import { appConfig } from './appConfig';
import { Server as SocketIOServer } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { IErrorResponse } from '@globals/interface/error';
import Logger from 'bunyan';
import { CustomError } from '@globals/helpers/error-handler';
import applicationRoutes from './routes';

const log: Logger = appConfig.createLogger('server');

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
        name: 'session',
        keys: [appConfig.SECRET_KEY_ONE!, appConfig.SECRET_KEY_TWO!],
        maxAge: 24 * 60 * 60 * 100, // 24 hours
        secure: appConfig.NODE_ENV !== 'development'
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: appConfig.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
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
    app.use(json({ limit: '50mb' }));
    app.use(
      urlencoded({
        extended: true
      })
    );
  }

  /**
   * Configure the route middleware for the app.
   *
   * This middleware configures the routes for the application, such as
   * the user, post, and comment routes.
   * @param app The Express application instance to configure.
   */
  private routeMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  /**
   * Configures a global request handler for the app to catch all routes
   * not matched by any other middleware or route handlers.
   *
   * This handler responds with an HTTP 404 Not Found status and a JSON
   * message indicating that the requested URL was not found.
   *
   * @param app The Express application instance to configure.
   */
  private globalHandler(app: Application): void {
    app.use((req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found.` });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
      log.error(error);
      if (error instanceof CustomError) res.status(error.statusCode).json(error.serializeErrors());
      else next();
    });
  }

  /**
   * Starts the server by creating an HTTP server instance and attaching
   * a Socket.IO server to it. It also handles any errors that occur
   * during the server startup process.
   *
   * @param app The Express application instance to attach to the HTTP server.
   * @returns A promise that resolves when the server is successfully started.
   */
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: SocketIOServer = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (error) {
      log.error(error);
    }
  }

  /**
   * Creates a Socket.IO server instance that is connected to the
   * given HTTP server and configured for CORS and Redis
   * pub/sub adapter.
   *
   * @param httpServer The HTTP server to attach to the Socket.IO server.
   * @returns A promise that resolves with the created Socket.IO server instance.
   */
  private async createSocketIO(httpServer: http.Server): Promise<SocketIOServer> {
    const io: SocketIOServer = new SocketIOServer(httpServer, {
      cors: {
        origin: appConfig.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: appConfig.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  /**
   * Starts the HTTP server, listening on the port specified by
   * `SERVER_PORT`.
   *
   * @param httpServer The HTTP server to start.
   */
  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(appConfig.PORT, () => {
      log.info(`Server running on port ${appConfig.PORT}`);
    });
  }

  private socketIOConnections(io: SocketIOServer): void {
    log.info('Socket connection');
  }
}
