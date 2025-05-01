import express, { Application } from 'express';
import dotenv from 'dotenv';
import { TaskRoutes } from './routes/task.routes';
import { ErrorHandler } from './middleware/error.middleware';
import { AuthRoutes } from './routes/auth.routes';
import { Database } from './config/db';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { CacheMiddleware } from './middleware/cache.middleare';
import redisService from './config/redis';
dotenv.config();

export class Server {
  private app: Application;
  private port: string | number;
  private authRoutes: AuthRoutes;
  private taskRoutes: TaskRoutes;
  private connectDB: Database;
  private errorHandler: ErrorHandler;
  private logger: LoggerMiddleware;
  private connectRedis;
  private cacheHandler: CacheMiddleware;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.authRoutes = new AuthRoutes();
    this.taskRoutes = new TaskRoutes();
    this.connectDB = new Database();
    this.errorHandler = new ErrorHandler();
    this.logger = new LoggerMiddleware();
    this.cacheHandler = new CacheMiddleware();
    this.connectRedis = redisService;

    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(this.logger.log);
  }

  private routes(): void {
    this.app.use('/tasks', this.taskRoutes.router);
    this.app.use('/auth', this.authRoutes.router);
  }

  private errorHandling(): void {
    this.app.use(this.errorHandler.handleError);
  }

  private cacheHandling(): void {
  }

  public async start(): Promise<void> {
    try {
      await this.connectDB.connect();
      console.log('Connected to MongoDB');

      await this.connectRedis.connect();
      console.log('Connected to Redis');

      this.app.listen(this.port, () => {
        console.log(`Server running on port ${this.port}`);
      });
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

const server = new Server();
server.start();