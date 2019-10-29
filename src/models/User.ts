import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  username: string,
  password: string,
  createAt: Date,

}
const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true},
  password: {type: String, require: true},
  createAt: {type: Date, default: Date.now},
})

userSchema.methods.name = function(): string{
  return (this as UserDocument).username;
}

export const User = mongoose.model<UserDocument>('User', userSchema);