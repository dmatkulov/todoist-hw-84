import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import { randomUUID } from 'node:crypto';
import Task from './models/Task';

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};
const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  const collections = ['users', 'tasks'];

  for (const collectionName of collections) {
    await dropCollection(db, collectionName);
  }

  const [user1, user2] = await User.create(
    {
      username: 'user',
      password: 'JrDZn3hgrC4V',
      token: randomUUID(),
    },
    {
      username: 'admin',
      password: 'JrDZn3hgrC4V234',
      token: randomUUID(),
    },
  );

  await Task.create(
    {
      user: user1._id,
      title: 'Task 1',
      description: 'Description for Task 1',
      status: 'new',
    },
    {
      user: user2._id,
      title: 'Task 2',
      description: 'Description for Task 2',
      status: 'in_progress',
    },
    {
      user: user2._id,
      title: 'Task 3',
      description: 'Description for Task 3',
      status: 'complete',
    },
  );

  await db.close();
};

void run();
