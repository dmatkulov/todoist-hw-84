import { Model } from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;

  generateToken(): void;
}

type UserModel = Model<UserFields, unknown, UserMethods>;

export interface TaskFields {
  user: Types.ObjectId;
  title: string;
  description: string;
  status: string;
}
