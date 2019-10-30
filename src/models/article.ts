import mongoose from 'mongoose';

export type ArticleDocument = mongoose.Document & {
  title: string,
  columns: Array<string> | string,
  author: string,
  content: string,
  createAt: string,
  updateAt: string,
};

const articleSchema = new mongoose.Schema({
  title: { type: String, require: true },
  columns: { type: Array, require: true},
  author: { type: String, require: true},
  content: { type: String, require: true },
  createAt: {type: String, default: new Date().toLocaleString('chinese', {hour12: false})},
  updateAt: { type: String},
})

articleSchema.pre('save', function save(next) {
  const article = this as ArticleDocument;
  article.updateAt = new Date().toLocaleString('chinese', {hour12: false});
  next();
})

export const Article = mongoose.model<ArticleDocument>('Article', articleSchema);