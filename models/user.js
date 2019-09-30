const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, require: true, unique: true},
  password: {type: String, require: true},
  createAt: {type: Date, default: Date.now},
})

userSchema.methods.name = () => {
  return this.username;
}

const User = mongoose.model('User', userSchema);
module.exports = User;