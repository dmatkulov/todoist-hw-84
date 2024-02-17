import { Router } from 'express';
import auth, { RequestWithUser } from '../middleware/auth';
import { TaskFields } from '../types';
import Task from '../models/Task';

const tasksRouter = Router();

tasksRouter.get('/', async (_req, res, next) => {
  try {
    const tasks = await Task.find();
    res.send(tasks);
  } catch (e) {
    next(e);
  }
});

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const userId = req.user?._id;
    
    if (userId) {
      const taskData: TaskFields = {
        user: userId.toString(),
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
      };
      
      const newTask = new Task(taskData);
      await newTask.save();
      
      return res.send(newTask);
    }
  } catch (e) {
    next(e);
  }
});

export default tasksRouter;