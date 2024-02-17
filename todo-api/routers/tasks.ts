import { Router } from 'express';
import auth, { RequestWithUser } from '../middleware/auth';
import { TaskFields } from '../types';
import Task from '../models/Task';
import { Types } from 'mongoose';

const tasksRouter = Router();

tasksRouter.post('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const userId = req.user?._id;

    const taskData: TaskFields = {
      user: userId,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    };

    const newTask = new Task(taskData);
    await newTask.save();

    return res.send(newTask);
  } catch (e) {
    next(e);
  }
});

tasksRouter.get('/', auth, async (req: RequestWithUser, res, next) => {
  try {
    const userId = req.user?._id;

    const tasks = await Task.find({ user: userId });
    res.send(tasks);
  } catch (e) {
    next(e);
  }
});

tasksRouter.put('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id;

    try {
      new Types.ObjectId(taskId);
    } catch (e) {
      return res.status(404).send({ error: 'Wrong Task ID!' });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send({ error: 'Task not found!' });
    }

    if (task.user.toString() !== userId?.toString()) {
      return res.status(403).send({ error: 'You can only edit your own tasks' });
    }

    await Task.updateOne(
      { _id: taskId },
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
      },
    );

    const updatedTask = await Task.findById(taskId);

    res.send(updatedTask);
  } catch (e) {
    next(e);
  }
});

tasksRouter.delete('/:id', auth, async (req: RequestWithUser, res, next) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?._id;

    try {
      new Types.ObjectId(taskId);
    } catch (e) {
      return res.status(404).send({ error: 'Wrong Task ID!' });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).send({ error: 'Task not found!' });
    }

    if (task.user.toString() !== userId?.toString()) {
      return res.status(403).send({ error: 'You can only delete your own tasks' });
    }

    await Task.deleteOne({ _id: taskId });

    res.send('Task successfully deleted!');
  } catch (e) {
    next(e);
  }
});

export default tasksRouter;
