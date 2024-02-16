import mongoose, { model, Types } from 'mongoose';
import User from './User';
import { TaskFields } from '../types';

const Schema = mongoose.Schema;

const TaskSchema = new Schema<TaskFields>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const user = await User.findById(value);
        return Boolean(user);
      },
      message: 'User does not exist',
    },
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['new', 'in_progress', 'complete'],
  },
});

const Task = model('Task', TaskSchema);

export default Task;
