import { Request, Response, NextFunction } from 'express';
import redisService from '../config/redis';

export class CacheMiddleware {
    public cacheTasks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tasksCache = await redisService.redisClient.get('tasks');
            console.log('CacheMiddleware', tasksCache);
            if (tasksCache) {
                console.log('Cache hit');
                req.body['cachedTasks'] = JSON.parse(tasksCache);
                next();
            }
            next();

        } catch (error) {
            console.error('Redis cache error', error);
            throw error;
        }
    };

    public invalidateTasksCache = async () => {
        try {
            return await redisService.redisClient.del('tasks');
        } catch (error) {
            console.error('Failed to invalidate cache', error);
        }
    };
}