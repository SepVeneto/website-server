import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  username: string,
  password: string,
  roles: string,
  createAt: Date,
  config: Object,
}
const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true},
  password: {type: String, require: true},
  roles: {type: String, default: 'editor'},
  createAt: {type: Date, default: Date.now},
  config: {type: Object, default: {}},
})

userSchema.methods.name = function(): string{
  return (this as UserDocument).username;
}

export const User = mongoose.model<UserDocument>('User', userSchema);