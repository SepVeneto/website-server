import mongoose from 'mongoose';

export type ArticleDocument = mongoose.Document & {
  title: string,
  columns: Array<string> | string,
  test: string,
  author: string,
  content: string,
  createAt: Date,
  updateAt: Date,
};

const articleSchema = new mongoose.Schema({
  title: { type: String, require: true },
  columns: { type: Array, require: true},
  author: { type: String, require: true},
  content: { type: String, require: true },
  createAt: {type: Date, default: Date.now()},
  updateAt: { type: Date },
})

articleSchema.pre('save', function save(next) {
  console.log('update time');
  const article = this as ArticleDocument;
  article.updateAt = new Date();
  next();
})

export const Article = mongoose.model<ArticleDocument>('Article', articleSchema);