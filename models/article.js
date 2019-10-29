const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: { type: String, require: true },
  columns: { type: Array, require: true},
  content: { type: String, require: true },
})

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;