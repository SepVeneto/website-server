const mongoose = require('mongoose');

const columnsSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  value: { type: String, require: true, unique: true },
})