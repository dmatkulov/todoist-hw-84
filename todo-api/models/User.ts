import mongoose from 'mongoose';
import { UserFields, UserMethods, UserModel } from '../types';

const Schema = mongoose.Schema;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);
export default User;
