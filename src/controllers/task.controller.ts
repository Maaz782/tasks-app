import { Request, Response } from 'express';
import Task from '../models/task.model';
import mongoose from 'mongoose';
import redisService from '../config/redis';


export class TaskController {

  async createTask(req: Request, res: Response) {
    try {
      const { title, description, status, dueDate, assignedTo } = req.body;

      if (!title || !assignedTo) {
        return res.status(400).json({ message: 'Title and assignedTo are required' });
      }
      if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      if (dueDate && isNaN(Date.parse(dueDate))) {
        return res.status(400).json({ message: 'Invalid dueDate' });
      }

      const newTask = await Task.create({ title, description, status, dueDate, assignedTo });
      if (!newTask) {
        const error: Error = new Error('Error creating task');
        res.status(500).json({ message: 'Error creating task' });
        throw error;
      }
      
      return newTask;
    }
    catch (error) {
      throw error;
    }
  };

  async getTaskById(req: Request, res: Response) {
    try {
      const taskId = req.params.id;
      if (!taskId) {
        const error: Error = new Error('Task ID is required');
        res.status(400).json({ message: 'Task ID is required' });
        throw error;
      }
      const task = await Task.findById(taskId);
      if (!task) {
        const error: Error = new Error('Task not found');
        res.status(404).json({ message: 'Task not found' });
        throw error;
      }
      return task;
    } catch (error) {
      throw error;
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const { status, dueDate } = req.query;
      const filter: any = {};

      if (status) {
        if (!['pending', 'in_progress', 'completed'].includes(status as string)) {
          const error: Error = new Error('Invalid status filter');
          res.status(400).json({ message: 'Invalid status filter' });
          throw error;
        }
        filter.status = status as string;
      }

     if (dueDate) {
      if (isNaN(Date.parse(dueDate as string))) {
        const error: Error = new Error('Invalid dueDate filter');
        res.status(400).json({ message: 'Invalid dueDate filter' });
        throw error;
      }
      filter.dueDate = new Date(dueDate as string);
    }

    const tasks = await Task.find(filter);
    if (!tasks) {
      const error: Error = new Error('No tasks found');
      res.status(404).json({ message: 'No tasks found' });
      throw error;
    }
    await redisService.redisClient.setEx('tasks', 60, JSON.stringify({ tasks }));
    return tasks;
  } catch(error) {
    throw error;
  }
}

  async updateTask(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      const error: Error = new Error('Task ID is required');
      res.status(400).json({ message: 'Task ID is required' });
      throw error;
    }
    const { title, description, status, dueDate, assignedTo } = req.body;
    if (!title || !assignedTo) {
      const error: Error = new Error('Title and assignedTo are required');
      res.status(400).json({ message: 'Title and assignedTo are required' });
      throw error;
    }
    if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
      const error: Error = new Error('Invalid status');
      res.status(400).json({ message: 'Invalid status' });
      throw error;
    }
    if (dueDate && isNaN(Date.parse(dueDate))) {
      const error: Error = new Error('Invalid dueDate');
      res.status(400).json({ message: 'Invalid dueDate' });
      throw error;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description, status, dueDate, assignedTo }, { new: true });
    if (!updatedTask) {
      const error: Error = new Error('Error updating task');
      res.status(500).json({ message: 'Error updating task' });
      throw error;
    }

    return updatedTask
  } catch (error) {
    throw error;
  }
}

  async deleteTask(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    if (!taskId) {
      const error: Error = new Error('Task ID is required');
      res.status(400).json({ message: 'Task ID is required' });
      throw error;
    }
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      const error: Error = new Error('Task not found');
      res.status(404).json({ message: 'Task not found' });
      throw error;
    }
    return deletedTask;
  } catch (error) {
    throw error;
  }
};
}
