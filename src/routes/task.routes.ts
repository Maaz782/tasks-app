import { Request, Response, Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { TaskValidator } from '../validators/task.validator';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { CacheMiddleware } from '../middleware/cache.middleare';

export class TaskRoutes {
  public router: Router;
  private taskController: TaskController;
  private taskValidator: TaskValidator;
  private authMiddleware: AuthMiddleware;
  private cacheHandler: CacheMiddleware;

  constructor() {
    this.router = Router();
    this.taskController = new TaskController();
    this.taskValidator = new TaskValidator();
    this.authMiddleware = new AuthMiddleware();
    this.cacheHandler = new CacheMiddleware();
    this.routes();
  }

  private routes(): void {
    const { createTask, getTaskById, getAllTasks, updateTask, deleteTask } = this.taskController;

    this.router.post('/', this.authMiddleware.protect, this.authMiddleware.adminOnly, this.taskValidator.validateTask, async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
      try {
        const task = await createTask(req, res);
        if (task) {
          await this.cacheHandler.invalidateTasksCache();
          res.status(201).json(task);
        }
      } catch (error) {
        throw error;
      }
    });

    this.router.get('/:id', this.authMiddleware.protect, async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
      try {
        const result = await getTaskById(req, res);
        if (result) {
          res.status(201).json(result);
        }
      } catch (error) {
        throw error;
      }
    });

    this.router.get('/', this.authMiddleware.protect, this.cacheHandler.cacheTasks as any, async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
      try {
        console.log('Inside router', req.body);
        if (req.body.cachedTasks) {
          res.status(200).json(req.body.cachedTasks.tasks);
        }
        else {
          const result = await getAllTasks(req, res);
          if (result) {
            res.status(201).json(result);
          }
        }
      } catch (error) {
        throw error;
      }
    });

    this.router.put('/:id', this.authMiddleware.protect, this.authMiddleware.adminOnly, this.taskValidator.validateTask, async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
      try {
        const result = await updateTask(req, res);
        if (result) {
          await this.cacheHandler.invalidateTasksCache();
          res.status(201).json(result);
        }
      } catch (error) {
        throw error;
      }
    });

    this.router.delete('/:id', this.authMiddleware.protect, this.authMiddleware.adminOnly, async (req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>) => {
      try {
        const result = await deleteTask(req, res);
        if (result) {
          await this.cacheHandler.invalidateTasksCache();
          res.status(201).json(result);
        }
      } catch (error) {
        throw error;
      }
    });
  }
}
